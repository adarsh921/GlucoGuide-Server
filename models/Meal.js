import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodName: { type: String, required: true },
    quantity: { type: Number, required: false },
    portion_consumed: { type: Number, required: true },
    mealTime: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },
    sugarContent: { type: Number, required: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
