import Meal from "../models/Meal.js";
import foodData from "../data/foodData.js";
import portionSizes from "../data/portionSizes.js";

export const getTodayMeals = async (req, res) => {
  try {
    const now = new Date();
    const userId = req.user.userId;

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    console.log(meals);
    const totalSugar = meals.reduce((sum, meal) => {
      const totalGramsConsumed = (meal.sugarContent * meal.quantity) / 100;
      return sum + totalGramsConsumed;
    }, 0);

    console.log(totalSugar);

    res.status(200).json({ totalSugar, meals });
  } catch (error) {
    console.error("Error fetching today's meals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMealsByDate = async (req, res) => {
  try {
    const dateparam = req.query.date;
    const userId = req.user.userId;

    const startOfDay = new Date(dateparam);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateparam);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    res.status(200).json(meals);
  } catch (error) {
    console.error("Error fetching today's meals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createMeal = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);

    const { foodName, mealTime, date, portionSize, portion_consumed } = req.body;

    if (!foodName || !portion_consumed || !mealTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(foodName);

    const meal = new Meal({
      userId,
      foodName,
      quantity: portionSizes[portionSize] * portion_consumed,
      portion_consumed,
      mealTime,
      sugarContent: foodData[foodName]?.sugarPer100g || 0,
    });
    // console.log(quantity);

    const savedMeal = await meal.save();

    return res.status(200).json({
      message: "All good!",
      data: { userId, foodName, mealTime, date },
    });
  } catch (err) {
    console.error("Error in createMeal:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMeal = async (req, res) => {
  try {
    console.log(req.params.id);

    const id = req.params.id;

    const { foodName, mealTime, portionSize,portion_consumed } = req.body;
    const updatedMeal = await Meal.findByIdAndUpdate(
      id,
      { foodName, quantity: portionSizes[portionSize]*portion_consumed, unit, mealTime },
      { new: true, runValidators: true }
    );

    if (!updatedMeal) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(200).json(updatedMeal);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRecord = await Meal.findByIdAndDelete(id);
    if (!deletedRecord) {
      res.status(404).json({ message: "record not found" });
    }
    res.status(200).json(deletedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
