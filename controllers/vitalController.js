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
    contents:`
    Analyze the following patient vital signs and generate a comprehensive report.
    
    ***
    
    **Instructions for Output Format:**
    1.  The entire response must be formatted using Markdown.
    2.  Use a Heading 2 (##) for each main section.
    3.  Ensure each section contains at least one clear, separate paragraph.
    4.  The sections must be in this exact order:
        
        ## 1. Vitals Summary and Interpretation
        * Provide a brief paragraph summarizing the key readings.
        * Use a bulleted list to interpret each abnormal vital sign.
        
        ## 2. Risk Assessment
        * Provide a paragraph clearly stating the overall risk level (Low, Moderate, High).
        * Explain the primary factors contributing to this risk level in a second paragraph.
        
        ## 3. Recommended Next Steps
        * Provide a list of 3-5 specific, actionable steps based on the analysis.
        
    ***
    
    **Patient Vitals Data:**
    ${vitals}`,
  });
  console.log(response);

  return response.text;
};

export const getAnalysis = async (req,res) => {
  try {
    const allVitals = await Vitals.find({});
    console.log(allVitals);
    const analysis = await analyzeVitals(allVitals);
    console.log(analysis);
    return res.status(200).json({
      message:"here is your analysis",
      analysis
    })
  } catch (error) {
    console.error("Some error:", error);
  }
};


export const addVitals = async (req, res) => {
  try {
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

    if (!bloodSugarLevel || !fastingOrPostMeal) {
      return res.status(400).json({
        message: "bloodSugarLevel and fastingOrPostMeal are required",
      });
    }

    const bmi = weight && height ? weight / (height / 100) ** 2 : null; // convert cm→m
    const userId = req.user.userId;

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

    return res.status(200).json({
      message: "Vitals added successfully",
      savedVitals,
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
