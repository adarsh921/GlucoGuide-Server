import Meal from "../models/Meal.js";

export const getTodayMeals = async (req, res) => {
  try {
    const now = new Date();
    const userId = req.userId;

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
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

export const getMealsByDate = async (req, res) => {
  try {
    const dateparam = req.query.date;
    const userId = req.userId;

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
      const userId = req.userId;
      const { foodName, quantity, unit, mealTime, date } = req.body;

      if (!foodName || !quantity || !unit || !mealTime) {
        return res.status(400).json({ message: "All fields are required" });
      }

      return res.status(200).json({
        message: "All good!",
        data: { userId, foodName, quantity, unit, mealTime, date },
      });
    } catch (err) {
      console.error("Error in createMeal:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

