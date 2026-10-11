export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";
export type NutritionGoal = "maintain" | "lose" | "gain";

export interface ProfileCalculationParams {
  age?: number;
  gender?: Gender;
  heightCm?: number;
  currentWeightKg?: number;
  activityLevel?: ActivityLevel;
  goal?: NutritionGoal;
}

export interface EstimatedTargets {
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatGrams: number;
  ree: number;
  tdee: number;
  explanation: string;
}

export interface ReferenceNutrition {
  servingSize: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface ScaledNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  scaleFactor: number;
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

/**
 * Rounds a number to exactly one decimal place.
 */
export function roundTo1Decimal(val: number): number {
  return Math.round((val + Number.EPSILON) * 10) / 10;
}

/**
 * Calculates Resting Energy Expenditure (REE) using the Mifflin-St Jeor Equation.
 */
export function calculateREE(weightKg: number, heightCm: number, age: number, gender?: Gender): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
    throw new Error("Physical metrics must be positive numbers.");
  }

  // Base equation: 10 * weight + 6.25 * height - 5 * age
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  switch (gender) {
    case "male":
      return Math.round(base + 5);
    case "female":
      return Math.round(base - 161);
    case "other":
    case "prefer_not_to_say":
    default:
      // Neutral midpoint between male (+5) and female (-161)
      return Math.round(base - 78);
  }
}

/**
 * Calculates estimated Daily Calorie & Macronutrient Targets from profile data.
 */
export function calculateNutritionTargets(params: ProfileCalculationParams): EstimatedTargets {
  const {
    age = 25,
    gender = "prefer_not_to_say",
    heightCm = 170,
    currentWeightKg = 70,
    activityLevel = "sedentary",
    goal = "maintain",
  } = params;

  const ree = calculateREE(currentWeightKg, heightCm, age, gender);
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  const tdee = Math.round(ree * multiplier);

  let targetCalories: number;
  let explanation = "";

  if (goal === "lose") {
    // Moderate 500 kcal deficit with safety floor of 1200 kcal
    targetCalories = Math.max(1200, tdee - 500);
    explanation = `Calculated via Mifflin-St Jeor REE (${ree} kcal) * ${multiplier} (activity) - 500 kcal deficit.`;
  } else if (goal === "gain") {
    // Moderate 350 kcal surplus for lean mass gain
    targetCalories = tdee + 350;
    explanation = `Calculated via Mifflin-St Jeor REE (${ree} kcal) * ${multiplier} (activity) + 350 kcal surplus.`;
  } else {
    targetCalories = tdee;
    explanation = `Calculated via Mifflin-St Jeor REE (${ree} kcal) * ${multiplier} (activity) for weight maintenance.`;
  }

  // Balanced macronutrient distribution:
  // Protein: ~25% calories (4 kcal/g)
  // Carbs: ~50% calories (4 kcal/g)
  // Fat: ~25% calories (9 kcal/g)
  const targetProteinGrams = Math.round((targetCalories * 0.25) / 4);
  const targetCarbsGrams = Math.round((targetCalories * 0.5) / 4);
  const targetFatGrams = Math.round((targetCalories * 0.25) / 9);

  return {
    targetCalories,
    targetProteinGrams,
    targetCarbsGrams,
    targetFatGrams,
    ree,
    tdee,
    explanation,
  };
}

/**
 * Proportionally scales nutritional values based on logged quantity and reference serving size.
 */
export function scaleNutrition(reference: ReferenceNutrition, loggedQuantity: number): ScaledNutrition {
  if (loggedQuantity <= 0) {
    throw new Error("Logged quantity must be greater than zero.");
  }
  if (reference.servingSize <= 0) {
    throw new Error("Reference serving size must be greater than zero.");
  }

  const scaleFactor = loggedQuantity / reference.servingSize;

  return {
    calories: Math.round(reference.calories * scaleFactor),
    protein: roundTo1Decimal(reference.protein * scaleFactor),
    carbs: roundTo1Decimal(reference.carbs * scaleFactor),
    fat: roundTo1Decimal(reference.fat * scaleFactor),
    fiber: roundTo1Decimal((reference.fiber || 0) * scaleFactor),
    scaleFactor,
  };
}
