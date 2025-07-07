import express from "express";
const router = express.Router();
import {
    getMealsByDate,
    getTodayMeals,
    createMeal,
    // updateMeal,
    // deleteMeal,
} from '../controllers/mealController.js'

router.get("/today",getTodayMeals)
router.get("/",getMealsByDate)
router.post("/",createMeal)
// router.put("/:id",updateMeal)
// router.delete("/:id",deleteMeal)

export default router;