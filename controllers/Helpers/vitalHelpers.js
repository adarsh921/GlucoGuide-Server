import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});
// console.log(ai);

export const analyzeVitals = async (vitals) => {
  console.log("HELLO I AM ADARSH");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
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

export const renderHealthScore = async (vitals, meals) => {
  let score = 0;

  // ------------------------------ //
  // 1. BLOOD GLUCOSE SCORE (40)
  // ------------------------------ //

  const fasting = vitals.find((v) => v.fastingOrPostMeal === "Fasting");
  const postMeal = vitals.find((v) => v.fastingOrPostMeal === "Post-meal");

  // Fasting score (20)
  if (fasting) {
    const f = fasting.bloodSugarLevel;
    if (f >= 70 && f <= 95) score += 20;
    else if (f <= 110) score += 15;
    else if (f <= 125) score += 8;
    else score += 0;
  }

  // Post-meal score (20)
  if (postMeal) {
    const p = postMeal.bloodSugarLevel;
    if (p < 140) score += 20;
    else if (p <= 180) score += 12;
    else if (p <= 220) score += 5;
    else score += 0;
  } else {
    score += 12; // average if missing
  }

  // ------------------------------ //
  // 2. SUGAR INTAKE SCORE (25)
  // ------------------------------ //
  let totalSugar = 0;
  meals.forEach((m) => {
    totalSugar += (m.sugarContent || 0) * (m.portion_consumed || 1);
  });

  if (totalSugar <= 20) score += 25;
  else if (totalSugar <= 40) score += 20;
  else if (totalSugar <= 60) score += 15;
  else if (totalSugar <= 80) score += 8;
  else if (totalSugar <= 100) score += 3;
  else score += 0;

  // ------------------------------ //
  // 3. STEPS SCORE (15)
  // ------------------------------ //
  if (vitals[0]?.steps) {
    const s = vitals[0].steps;

    if (s > 10000) score += 15;
    else if (s >= 7000) score += 12;
    else if (s >= 5000) score += 8;
    else if (s >= 2500) score += 4;
    else score += 0;
  }

  // ------------------------------ //
  // 4. SLEEP SCORE (10)
  // ------------------------------ //
  if (vitals[0]?.sleepHours) {
    const sl = vitals[0].sleepHours;

    if (sl >= 7 && sl <= 9) score += 10;
    else if ((sl >= 6 && sl < 7) || (sl > 9 && sl <= 10)) score += 7;
    else if ((sl >= 5 && sl < 6) || (sl > 10 && sl <= 11)) score += 3;
    else score += 0;
  }

  // ------------------------------ //
  // 5. STRESS SCORE (5)
  // ------------------------------ //
  if (vitals[0]?.stressLevel) {
    const st = vitals[0].stressLevel;
    if (st === "Low") score += 5;
    else if (st === "Moderate") score += 3;
    else score += 0;
  }

  // ------------------------------ //
  // 6. BMI/WAIST SCORE (5)
  // ------------------------------ //
  if (vitals[0]?.bmi) {
    const b = vitals[0].bmi;

    if (b >= 18.5 && b <= 24.9) score += 5;
    else if (b <= 29) score += 3;
    else score += 0;
  }

  let finalscore=Math.min(100,Math.max(0,score));
  let summary=GenerateSummary(finalscore);
  return {
    finalscore,
    summary
  }
};

function GenerateSummary(score){
    if (score >= 85) {
      return {
        title: "Excellent Control",
        message:
          "Your vitals and meals today indicate strong metabolic stability. Keep maintaining your routine!",
      };
    }
    if (score >= 70) {
      return {
        title: "Good, But Can Improve",
        message:
          "Your metabolic health today looks good overall. Small adjustments in meals or activity can push it to Excellent.",
      };
    }
    if (score >= 55) {
      return {
        title: "Moderate Control",
        message:
          "Your readings show some inconsistency. Be mindful of glucose-spiking meals and aim for more balanced patterns.",
      };
    }
    return {
      title: "Needs Attention",
      message:
        "Your metabolic signals today indicate imbalances. Avoid high-sugar foods and track your readings more regularly.",
    };
}

