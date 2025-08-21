import Vitals from "../models/Vitals.js";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const ai = new GoogleGenAI({});
// console.log(ai);

const analyzeVitals = async (vitals) => {
  console.log("HELLO I AM ADARSH");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Give an analysis on these vitals ${vitals}, only return the text in json format and format it in readable form, make different sections for different parts of analysis.`,
  });
  console.log(response);

  return response.text;
};

export const addVitals = async (req, res) => {
  try {
    const {
      userId,
      bloodSugarLevel,
      fastingOrPostMeal,
      bpSystolic,
      bpDiastolic,
      weight,
      height,
      waistCircumference,
      steps,
      sleepHours,
      stressLevel,
      notes,
    } = req.body;

    if (!userId || !bloodSugarLevel || !fastingOrPostMeal) {
      return res.status(400).json({
        message: "userId, bloodSugarLevel and fastingOrPostMeal are required",
      });
    }

    const bmi = weight && height ? weight / (height / 100) ** 2 : null; // convert cm→m

    const vitals = new Vitals({
      userId,
      bloodSugarLevel,
      fastingOrPostMeal,
      bpSystolic,
      bpDiastolic,
      weight,
      height,
      bmi,
      waistCircumference,
      steps,
      sleepHours,
      stressLevel,
      notes,
    });

    const savedVitals = await vitals.save();

    const analysis = await analyzeVitals(savedVitals);
    return res.status(200).json({
      message: "Vitals added successfully",
      savedVitals,
      analysis,
    });
  } catch (error) {
    console.error("Error in creating vitals", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const viewVitals = async (req, res) => {};
export const updateVitals = async (req, res) => {};
export const deleteVitals = async (req, res) => {};
