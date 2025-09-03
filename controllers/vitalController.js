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
    contents: `Give an analysis on these vitals ${vitals}, only return the text in json format and format it in readable form, make different sections for different parts of analysis, remove all the wildcard characters except fullstop, remove next line characters.`,
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

export const viewTodayVitals = async (req, res) => {
  try {
    const now = new Date();
    const userId = req.user.userId;
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const freshVitals = await Vitals.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    return res.status(200).json({
      message: "You are seeing today's vitals",
      freshVitals,
    });
  } catch (error) {
    console.error("Error fetching vitals", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const viewVitalsByDate = async (req, res) => {
  try {
    const dateparam = req.query.date;
    const userId = req.user.userId;
    const startOfDay = new Date(dateparam);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateparam);
    endOfDay.setHours(23, 59, 59, 999);
    const allVitals = await Vitals.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    return res.status(200).json({
      message: "All your vitals are below",
      allVitals,
    });
  } catch (error) {
    console.error("Error fetching vitals", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateVitals = async (req, res) => {
  try {
    const id = req.params.id;
    const {
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

    const updatedVital = await Vitals.findByIdAndUpdate(
      id,
      {
        bloodSugarLevel,
        fastingOrPostMeal,
        bpSystolic,
        bpDiastolic,
        weight,
        height,
        bmi: weight && height ? weight / (height / 100) ** 2 : null,
        waistCircumference,
        steps,
        sleepHours,
        stressLevel,
        notes,
      },
      { new: true, runValidators: true }
    );

    const newAnalysis = analyzeVitals(updatedVital);
    res.status(200).json({
      message: "Vitals Updated Successfully",
      updatedVital,
      newAnalysis,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const deleteVitals = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedVital = await Vitals.findByIdAndDelete(id);
    if (!deletedVital) {
      res.status(400).json({ message: "Record Not Found" });
    }
    res.status(200).json({
      message: "Record Deleted Successfully",
      deletedVital,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
