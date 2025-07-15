import express from "express";
import authenticate from "../middleware/auth.js";
const router = express.Router();
import {
  getMealsByDate,
  getTodayMeals,
  createMeal,
  updateMeal,
  deleteMeal,
} from "../controllers/mealController.js";

router.get("/today", authenticate, getTodayMeals);
router.get("/", authenticate, getMealsByDate);
router.post("/", authenticate, createMeal);
router.put("/:id",authenticate,updateMeal)
router.delete("/:id",authenticate,deleteMeal)

export default router;
