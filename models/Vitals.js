import mongoose from "mongoose";

const vitalsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  bloodSugarLevel: { type: Number, required: true },
  fastingOrPostMeal: { type: String, enum: ["Fasting", "Post-meal"], required: true },
  bpSystolic: Number,
  bpDiastolic: Number,
  weight: Number,
  notes: String,
}, { timestamps: true });

const Vitals = mongoose.model("Vitals", vitalsSchema);
export default Vitals;
