import { Router } from "express";
import { FoodController } from "../controllers/food.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { createCustomFoodSchema, searchFoodQuerySchema } from "../schemas/food.schema.js";

export const foodRouter = Router();

foodRouter.use(requireAuth);
foodRouter.get("/", validate({ query: searchFoodQuerySchema }), FoodController.searchFoods);
foodRouter.get("/:id", FoodController.getFoodById);
foodRouter.post("/custom", validate({ body: createCustomFoodSchema }), FoodController.createCustomFood);
foodRouter.delete("/custom/:id", FoodController.deleteCustomFood);
