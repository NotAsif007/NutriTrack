import { connectDB, disconnectDB } from "../config/db.js";
import { Food } from "../models/Food.js";

export const initialFoods = [
  // Grains
  {
    name: "Cooked White Rice",
    searchableName: "cooked white rice",
    category: "Grains" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 130,
    protein: 2.7,
    carbs: 28.2,
    fat: 0.3,
    fiber: 0.4,
    dataSource: "USDA FoodData Central / Standard Nutrition Database",
  },
  {
    name: "Cooked Brown Rice",
    searchableName: "cooked brown rice",
    category: "Grains" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 111,
    protein: 2.6,
    carbs: 23.0,
    fat: 0.9,
    fiber: 1.8,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Whole Wheat Roti (Chapati)",
    searchableName: "whole wheat roti chapati",
    category: "Grains" as const,
    servingSize: 1,
    servingUnit: "piece",
    calories: 104,
    protein: 3.1,
    carbs: 20.0,
    fat: 1.2,
    fiber: 2.3,
    dataSource: "Indian Food Composition Tables (IFCT)",
  },
  {
    name: "Rolled Oats (Dry)",
    searchableName: "rolled oats dry",
    category: "Grains" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    fiber: 10.6,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Whole Wheat Bread",
    searchableName: "whole wheat bread",
    category: "Grains" as const,
    servingSize: 1,
    servingUnit: "slice",
    calories: 69,
    protein: 3.6,
    carbs: 11.6,
    fat: 0.9,
    fiber: 1.9,
    dataSource: "USDA FoodData Central",
  },

  // Legumes
  {
    name: "Cooked Yellow Dal (Lentils)",
    searchableName: "cooked yellow dal lentils toor dal moong dal",
    category: "Legumes" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 116,
    protein: 9.0,
    carbs: 20.1,
    fat: 0.4,
    fiber: 7.9,
    dataSource: "Indian Food Composition Tables (IFCT)",
  },
  {
    name: "Boiled Chickpeas (Chana)",
    searchableName: "boiled chickpeas chana",
    category: "Legumes" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 164,
    protein: 8.9,
    carbs: 27.4,
    fat: 2.6,
    fiber: 7.6,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Cooked Kidney Beans (Rajma)",
    searchableName: "cooked kidney beans rajma",
    category: "Legumes" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 127,
    protein: 8.7,
    carbs: 22.8,
    fat: 0.5,
    fiber: 6.4,
    dataSource: "USDA FoodData Central",
  },

  // Dairy & Eggs
  {
    name: "Whole Boiled Egg",
    searchableName: "whole boiled egg",
    category: "Eggs" as const,
    servingSize: 1,
    servingUnit: "piece",
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    fiber: 0.0,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Egg White (Boiled)",
    searchableName: "egg white boiled",
    category: "Eggs" as const,
    servingSize: 1,
    servingUnit: "piece",
    calories: 17,
    protein: 3.6,
    carbs: 0.2,
    fat: 0.1,
    fiber: 0.0,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Paneer (Indian Cottage Cheese)",
    searchableName: "paneer indian cottage cheese",
    category: "Dairy" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 265,
    protein: 18.3,
    carbs: 3.4,
    fat: 20.8,
    fiber: 0.0,
    dataSource: "Indian Food Composition Tables (IFCT)",
  },
  {
    name: "Cow Milk (Toned, 3% fat)",
    searchableName: "cow milk toned",
    category: "Dairy" as const,
    servingSize: 100,
    servingUnit: "ml",
    calories: 58,
    protein: 3.2,
    carbs: 4.7,
    fat: 3.0,
    fiber: 0.0,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Plain Curd / Yoghurt",
    searchableName: "plain curd yoghurt dahi",
    category: "Dairy" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 61,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.3,
    fiber: 0.0,
    dataSource: "Indian Food Composition Tables (IFCT)",
  },

  // Meat & Poultry & Fish
  {
    name: "Grilled Chicken Breast (Skinless)",
    searchableName: "grilled chicken breast skinless cooked",
    category: "Meat & Poultry" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 165,
    protein: 31.0,
    carbs: 0.0,
    fat: 3.6,
    fiber: 0.0,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Cooked Salmon Fillet",
    searchableName: "cooked salmon fillet fish",
    category: "Fish & Seafood" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 206,
    protein: 22.1,
    carbs: 0.0,
    fat: 12.3,
    fiber: 0.0,
    dataSource: "USDA FoodData Central",
  },

  // Fruits
  {
    name: "Banana (Fresh, Medium)",
    searchableName: "banana fresh medium",
    category: "Fruits" as const,
    servingSize: 1,
    servingUnit: "piece",
    calories: 105,
    protein: 1.3,
    carbs: 27.0,
    fat: 0.3,
    fiber: 3.1,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Apple (Fresh, Medium)",
    searchableName: "apple fresh medium",
    category: "Fruits" as const,
    servingSize: 1,
    servingUnit: "piece",
    calories: 95,
    protein: 0.5,
    carbs: 25.0,
    fat: 0.3,
    fiber: 4.4,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Orange (Fresh, Medium)",
    searchableName: "orange fresh medium",
    category: "Fruits" as const,
    servingSize: 1,
    servingUnit: "piece",
    calories: 62,
    protein: 1.2,
    carbs: 15.4,
    fat: 0.2,
    fiber: 3.1,
    dataSource: "USDA FoodData Central",
  },

  // Vegetables
  {
    name: "Boiled Potato (Without skin)",
    searchableName: "boiled potato aloo",
    category: "Vegetables" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 87,
    protein: 1.9,
    carbs: 20.1,
    fat: 0.1,
    fiber: 1.8,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Steamed Broccoli",
    searchableName: "steamed broccoli",
    category: "Vegetables" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 35,
    protein: 2.4,
    carbs: 7.2,
    fat: 0.4,
    fiber: 3.3,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Raw Spinach (Palak)",
    searchableName: "raw spinach palak",
    category: "Vegetables" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Cucumber (Fresh, Sliced)",
    searchableName: "cucumber fresh sliced kheera",
    category: "Vegetables" as const,
    servingSize: 100,
    servingUnit: "g",
    calories: 15,
    protein: 0.7,
    carbs: 3.6,
    fat: 0.1,
    fiber: 0.5,
    dataSource: "USDA FoodData Central",
  },

  // Nuts & Seeds
  {
    name: "Raw Almonds (Badam)",
    searchableName: "raw almonds badam nuts",
    category: "Nuts & Seeds" as const,
    servingSize: 28,
    servingUnit: "g",
    calories: 164,
    protein: 6.0,
    carbs: 6.1,
    fat: 14.2,
    fiber: 3.5,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Peanut Butter (Smooth)",
    searchableName: "peanut butter smooth",
    category: "Nuts & Seeds" as const,
    servingSize: 32,
    servingUnit: "g",
    calories: 188,
    protein: 8.0,
    carbs: 6.0,
    fat: 16.0,
    fiber: 1.9,
    dataSource: "USDA FoodData Central",
  },

  // Beverages
  {
    name: "Black Coffee (Unsweetened)",
    searchableName: "black coffee unsweetened",
    category: "Beverages" as const,
    servingSize: 240,
    servingUnit: "ml",
    calories: 2,
    protein: 0.3,
    carbs: 0.0,
    fat: 0.0,
    fiber: 0.0,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Green Tea (Unsweetened)",
    searchableName: "green tea unsweetened",
    category: "Beverages" as const,
    servingSize: 240,
    servingUnit: "ml",
    calories: 2,
    protein: 0.0,
    carbs: 0.0,
    fat: 0.0,
    fiber: 0.0,
    dataSource: "USDA FoodData Central",
  },
  {
    name: "Chai (Milk Tea with 1 tsp sugar)",
    searchableName: "chai milk tea indian",
    category: "Beverages" as const,
    servingSize: 150,
    servingUnit: "ml",
    calories: 75,
    protein: 2.1,
    carbs: 10.2,
    fat: 2.8,
    fiber: 0.0,
    dataSource: "Indian Food Composition Tables (IFCT)",
  },
];

export async function seedFoods(): Promise<void> {
  console.log("🌱 Starting food database seeding...");
  let createdCount = 0;
  let updatedCount = 0;

  for (const item of initialFoods) {
    const existing = await Food.findOne({
      searchableName: item.searchableName,
      isCustom: false,
    });

    if (existing) {
      await Food.findByIdAndUpdate(existing._id, {
        ...item,
        isCustom: false,
        creatorId: null,
      });
      updatedCount++;
    } else {
      await Food.create({
        ...item,
        isCustom: false,
        creatorId: null,
      });
      createdCount++;
    }
  }

  console.log(`✅ Food seed complete: ${createdCount} created, ${updatedCount} updated.`);
}

// Standalone execution support
if (process.argv[1]?.endsWith("seedFoods.ts") || process.argv[1]?.endsWith("seedFoods.js")) {
  connectDB()
    .then(async () => {
      await seedFoods();
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    });
}
