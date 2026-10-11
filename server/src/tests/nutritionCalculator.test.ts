import { describe, it, expect } from "vitest";
import {
  calculateREE,
  calculateNutritionTargets,
  scaleNutrition,
  roundTo1Decimal,
} from "../utils/nutritionCalculator.js";

describe("Nutrition Calculation Engine", () => {
  describe("roundTo1Decimal", () => {
    it("rounds numbers accurately to 1 decimal place", () => {
      expect(roundTo1Decimal(12.34)).toBe(12.3);
      expect(roundTo1Decimal(12.36)).toBe(12.4);
      expect(roundTo1Decimal(12.05)).toBe(12.1);
      expect(roundTo1Decimal(0)).toBe(0);
    });
  });

  describe("calculateREE (Mifflin-St Jeor)", () => {
    it("calculates REE for a 70kg, 175cm, 25-year-old male", () => {
      // 10*70 + 6.25*175 - 5*25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75 -> round = 1674
      const ree = calculateREE(70, 175, 25, "male");
      expect(ree).toBe(1674);
    });

    it("calculates REE for a 60kg, 165cm, 25-year-old female", () => {
      // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 -> round = 1345
      const ree = calculateREE(60, 165, 25, "female");
      expect(ree).toBe(1345);
    });

    it("calculates neutral REE when sex is not specified", () => {
      // 10*70 + 6.25*170 - 5*30 - 78 = 700 + 1062.5 - 150 - 78 = 1534.5 -> round = 1535
      const ree = calculateREE(70, 170, 30, "prefer_not_to_say");
      expect(ree).toBe(1535);
    });

    it("throws an error for nonsensical negative values", () => {
      expect(() => calculateREE(-70, 175, 25, "male")).toThrow();
      expect(() => calculateREE(70, -175, 25, "male")).toThrow();
      expect(() => calculateREE(70, 175, -25, "male")).toThrow();
    });
  });

  describe("calculateNutritionTargets (TDEE & Goals)", () => {
    it("estimates maintenance targets for sedentary male", () => {
      const targets = calculateNutritionTargets({
        currentWeightKg: 70,
        heightCm: 175,
        age: 25,
        gender: "male",
        activityLevel: "sedentary",
        goal: "maintain",
      });

      // ree = 1674, tdee = round(1674 * 1.2) = 2009
      expect(targets.ree).toBe(1674);
      expect(targets.tdee).toBe(2009);
      expect(targets.targetCalories).toBe(2009);
      expect(targets.targetProteinGrams).toBeGreaterThan(0);
      expect(targets.targetCarbsGrams).toBeGreaterThan(0);
      expect(targets.targetFatGrams).toBeGreaterThan(0);
    });

    it("applies moderate 500 kcal deficit for weight loss goal", () => {
      const targets = calculateNutritionTargets({
        currentWeightKg: 80,
        heightCm: 180,
        age: 30,
        gender: "male",
        activityLevel: "moderately_active", // multiplier = 1.55
        goal: "lose",
      });

      // target = tdee - 500
      expect(targets.targetCalories).toBe(targets.tdee - 500);
    });

    it("enforces safety minimum floor of 1200 kcal for deficit", () => {
      const targets = calculateNutritionTargets({
        currentWeightKg: 40,
        heightCm: 140,
        age: 60,
        gender: "female",
        activityLevel: "sedentary",
        goal: "lose",
      });

      expect(targets.targetCalories).toBeGreaterThanOrEqual(1200);
    });

    it("applies 350 kcal surplus for weight gain goal", () => {
      const targets = calculateNutritionTargets({
        currentWeightKg: 65,
        heightCm: 170,
        age: 22,
        gender: "male",
        activityLevel: "lightly_active", // 1.375
        goal: "gain",
      });

      expect(targets.targetCalories).toBe(targets.tdee + 350);
    });
  });

  describe("scaleNutrition (Serving scaling calculations)", () => {
    const referenceRice = {
      servingSize: 100, // 100g
      calories: 130,
      protein: 2.7,
      carbs: 28.2,
      fat: 0.3,
      fiber: 0.4,
    };

    it("scales correctly for 100g (1x)", () => {
      const scaled = scaleNutrition(referenceRice, 100);
      expect(scaled.calories).toBe(130);
      expect(scaled.protein).toBe(2.7);
      expect(scaled.carbs).toBe(28.2);
      expect(scaled.fat).toBe(0.3);
      expect(scaled.fiber).toBe(0.4);
    });

    it("scales correctly for 50g (0.5x)", () => {
      const scaled = scaleNutrition(referenceRice, 50);
      expect(scaled.calories).toBe(65);
      expect(scaled.protein).toBe(1.4); // 2.7 * 0.5 = 1.35 -> round to 1dp = 1.4
      expect(scaled.carbs).toBe(14.1);
      expect(scaled.fat).toBe(0.2);
    });

    it("scales correctly for 150g (1.5x)", () => {
      // 130 * 150 / 100 = 195 kcal
      const scaled = scaleNutrition(referenceRice, 150);
      expect(scaled.calories).toBe(195);
      expect(scaled.protein).toBe(4.1); // 2.7 * 1.5 = 4.05 -> round = 4.1
      expect(scaled.carbs).toBe(42.3);
      expect(scaled.fat).toBe(0.5);
    });

    it("scales correctly for 200g (2x)", () => {
      const scaled = scaleNutrition(referenceRice, 200);
      expect(scaled.calories).toBe(260);
      expect(scaled.protein).toBe(5.4);
      expect(scaled.carbs).toBe(56.4);
      expect(scaled.fat).toBe(0.6);
    });

    it("throws error for zero or negative quantity", () => {
      expect(() => scaleNutrition(referenceRice, 0)).toThrow();
      expect(() => scaleNutrition(referenceRice, -50)).toThrow();
    });
  });
});
