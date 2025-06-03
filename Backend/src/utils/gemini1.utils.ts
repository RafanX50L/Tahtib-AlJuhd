import { GoogleGenAI } from "@google/genai";
import { IExercise } from "@/models/interface/IWorkout";

import { GoogleGenerativeAI } from "@google/generative-ai";
import {  writeFile } from 'fs'; // To simulate file writing for debugging
import dotenv from 'dotenv';
import { env } from "..//config/env.config";

dotenv.config(); // Load environment variables

interface UserData {
  nick_name: string;
  age: number;
  gender: string;
  height: number;
  current_weight: number;
  target_weight: number;
  fitness_goal: string;
  current_fitness_level: string;
  activity_level: string;
  equipments: string[];
  workout_duration: string;
  workout_days_perWeek: number;
  health_issues: string[];
  medical_condition: string;
  diet_allergies: string[];
  diet_meals_perDay: string;
  diet_preferences: string[];
}

// Initialize the Google GenAI client
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY as string);

async function generateFitnessPlan(
  userData: UserData,
  weekNumber: number | null,
  planType: 'workout' | 'diet',
  previousWeekWorkoutData: Record<string, any> | null = null
) {
  try {
    // Format the prompt with user data, week number, plan type, and previous week's data
    const prompt = formatPrompt(userData, weekNumber, planType, previousWeekWorkoutData);

    // Generate content using the new API structure
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using 1.5 Flash for potentially better JSON output
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the response into structured data
    return parseResponse(text);
  } catch (error) {
    console.error("Error generating fitness plan:", error);
    throw new Error("Failed to generate fitness plan");
  }
}

function getMealCategories(mealsPerDay: string): string[] {
  switch (mealsPerDay) {
    case "3":
      return ["breakfast", "lunch", "dinner"];
    case "4":
      return ["breakfast", "lunch", "dinner", "snack1"];
    case "5":
      return ["breakfast", "lunch", "dinner", "snack1", "snack2"];
    case "6":
      return ["breakfast", "mid_morning_snack", "lunch", "afternoon_snack", "dinner", "evening_snack"];
    default:
      return ["breakfast", "lunch", "dinner"];
  }
}

function formatPrompt(userData: UserData, weekNumber: number | null, planType: 'workout' | 'diet', previousWeekWorkoutData: Record<string, any> | null = null) {
  const equipmentList = userData.equipments.length > 0 ? userData.equipments.join(', ') : 'bodyweight only';
  const healthConcerns = [...userData.health_issues, userData.medical_condition].filter(Boolean).join(', ');
  const dietRestriction = userData.diet_allergies.length > 0 ? `Additionally, the user has allergies to: ${userData.diet_allergies.join(', ')}. ` : '';

  // Dynamically generate meal plan structure based on getMealCategories
  const mealCategories = getMealCategories(userData.diet_meals_perDay);
  const mealPlanStructure: Record<string, any> = {};
  for (const category of mealCategories) {
    mealPlanStructure[category] = {
      "options": [
        {
          "name": `[${category.charAt(0).toUpperCase() + category.slice(1)} Meal Name]`,
          "ingredients": ["", ""],
          "instructions": "",
          "video_link": "No video available"
        }
        // The AI should add 2 more options here
      ]
    };
  }

  // Helper to generate a day structure for the prompt for a SINGLE week
  const generateDayStructure = (currentWeekNum: number, dayNum: number, workoutDaysPerWeek: number) => {
    let title = `Day ${dayNum} - [Appropriate Title for Week ${currentWeekNum}, Day ${dayNum}]`;
    let exercisesContent = `
              [
                {
                  "name": "[Exercise Name - ensure progression for Week ${currentWeekNum}]",
                  "sets": "[Number of sets]",
                  "reps": "[Reps or Duration]",
                  "rest": "[Rest time]",
                  "instructions": "[Instructions]",
                  "animation_link": "[YouTube Link or 'No video available']"
                }
                // ... 10-12 exercises with specific progressive data
              ]`;

    if (dayNum > workoutDaysPerWeek) {
      title = `Day ${dayNum} - Rest`;
      exercisesContent = `[]`; // Empty array for rest days
    }

    return `
          "day${dayNum}": {
            "title": "${title}",
            "exercises": ${exercisesContent}
          }`;
  };

  // Generate all 7 days for the SPECIFIED week
  const generateSingleWeekStructure = (currentWeekNum: number, workoutDaysPerWeek: number) => {
    let days = "";
    for (let i = 1; i <= 7; i++) {
      days += generateDayStructure(currentWeekNum, i, workoutDaysPerWeek);
      if (i < 7) days += ",";
    }
    return days;
  };

  let promptContent = ``;
  let jsonStructure = ``;

  if (planType === 'workout' && weekNumber !== null) {
    let progressionInstruction = "";
    let previousWeekDataSection = "";

    if (weekNumber === 1) {
      progressionInstruction = "This is Week 1, so set a baseline difficulty and intensity.";
    } else {
      progressionInstruction = `This is Week ${weekNumber}. Ensure the difficulty and intensity of the workouts are progressively increased compared to Week ${weekNumber - 1}.`;
      if (previousWeekWorkoutData) {
        previousWeekDataSection = `
      Here is the workout plan for the previous week (Week ${weekNumber - 1}) to guide progression:
      ${JSON.stringify(previousWeekWorkoutData, null, 2)}
      `;
      } else {
        previousWeekDataSection = `
      (Note: Previous week's workout data was not provided. Please infer progression based on general fitness principles and the user's current level.)
      `;
      }
    }

    promptContent = `
      Create a comprehensive workout plan ONLY for Week ${weekNumber} for a user with the following details.
      
      User Nickname: ${userData.nick_name}
      Age: ${userData.age} years old
      Gender: ${userData.gender}
      Height: ${userData.height} cm
      Current weight: ${userData.current_weight} kg
      Target weight: ${userData.target_weight} kg
      Fitness goal: ${userData.fitness_goal}
      Current fitness level: ${userData.current_fitness_level}
      Activity level: ${userData.activity_level}
      Available equipment: ${equipmentList}
      Desired workout duration: ${userData.workout_duration} minutes per session
      Workout days per week: ${userData.workout_days_perWeek} days
      Health issues: ${healthConcerns}
      ${previousWeekDataSection}
      IMPORTANT INSTRUCTIONS FOR GENERATING THE RESPONSE:
      1. The output MUST be a valid JSON object. Do NOT include any markdown formatting (like triple backticks) or additional explanatory text outside the JSON.
      2. The **workout plan** should be ONLY for Week ${weekNumber}, with daily exercise routines based on the user's specified workout days per week (${userData.workout_days_perWeek}).
      3. Each active workout day should include 10-12 **unique exercises**.
      4. All exercises must be suitable for **indoor home workouts** and only use the provided equipment: ${equipmentList}. If 'None' is specified, assume bodyweight exercises only.
      5. For each exercise, provide:
          - "name": Name of the exercise
          - "sets": Number of sets (e.g., "3")
          - "reps": Repetition range (e.g., "8-12" or "30 sec" for duration-based)
          - "rest": Rest period between sets (e.g., "60 seconds")
          - "instructions": Concise instructions on how to perform the exercise correctly.
          - "animation_link": A relevant YouTube video link for the exercise if available. If not, state "No video available".
      6. **Progression**: ${progressionInstruction}
      7. **Health Considerations**:
          - **Avoid exercises that could aggravate back and knee issues**.
          - **Consider asthma when planning cardio intensity**, providing options that can be modified or are less intense.
      8. The total duration of each workout session must be within ${userData.workout_duration} minutes.
      9. The "notes" section should summarize the workout plan's overall approach and key considerations for Week ${weekNumber}.
      10. **CRITICAL**: For Week ${weekNumber}, **fully populate** every exercise detail for each day. For active workout days, provide **specific, progressive data** (e.g., increased reps, sets, or more challenging variations). For rest days (if workout days per week is less than 7), set "title" to "Day X - Rest" and "exercises" to an empty array \`[]\`. **DO NOT** use placeholders or comments like 'Repeat Week X Day Y exercises' or truncated JSON.

      Here is the exact JSON structure you should follow. Populate all fields dynamically based on the user's data and the instructions above:
    `;

    jsonStructure = `
      {
        "week${weekNumber}": {
          ${generateSingleWeekStructure(weekNumber, userData.workout_days_perWeek)}
        },
        "notes": "[Overall notes for the workout plan for Week ${weekNumber}, considering user's goals, health, and progression.]"
      }
    `;
  } else if (planType === 'diet') {
    promptContent = `
      Create a comprehensive diet plan for a user with the following details.
      
      User Nickname: ${userData.nick_name}
      Age: ${userData.age} years old
      Gender: ${userData.gender}
      Height: ${userData.height} cm
      Current weight: ${userData.current_weight} kg
      Target weight: ${userData.target_weight} kg
      Fitness goal: ${userData.fitness_goal}
      Diet allergies: ${userData.diet_allergies.join(', ') || 'None'}
      Meals per day: ${userData.diet_meals_perDay}
      Diet preferences: ${userData.diet_preferences.join(', ')}
      
      IMPORTANT INSTRUCTIONS FOR GENERATING THE RESPONSE:
      1. The output MUST be a valid JSON object. Do NOT include any markdown formatting (like triple backticks) or additional explanatory text outside the JSON.
      2. The **diet plan** should align with the user's diet preferences (${userData.diet_preferences.join(', ')}) and allergies (${userData.diet_allergies.join(', ')}).
      3. Provide meal options for each meal category specified by ${userData.diet_meals_perDay}. For example, if ${userData.diet_meals_perDay} is "5", include breakfast, lunch, dinner, and two snack options.
      4. For each meal option, provide:
          - "name": Name of the dish
          - "ingredients": A list of ingredients.
          - "instructions": Simple cooking instructions.
          - "video_link": A relevant YouTube video link for the recipe. **Prioritize finding a real, relevant YouTube video link.** If a suitable video is absolutely not found after a thorough search, then state "No video available".
      5. **Dietary Restrictions**: Exclude nuts and gluten from all meal options.
      6. Focus on **vegetarian protein sources** for muscle building.
      7. The "notes" section should summarize the diet plan's overall approach and key considerations based on the user's data.
      8. **CRITICAL**: Fully populate all meal options with specific details. DO NOT use placeholders or truncated JSON.

      Here is the exact JSON structure you should follow. Populate all fields dynamically based on the user's data and the instructions above:
    `;

    jsonStructure = `
      {
        "dietPlan": {
          "mealPlan": ${JSON.stringify(mealPlanStructure, null, 2)},
          "notes": "[Overall notes for the diet plan, considering user's goals, allergies, preferences, and weight goals.]"
        }
      }
    `;
  } else {
    throw new Error("Invalid planType or missing weekNumber for workout plan.");
  }

  return `${promptContent}${jsonStructure}`;
}



function parseResponse(text: string) {
  let cleanedText = text.trim();

  // Check if the response is wrapped in markdown code block and remove it
  if (cleanedText.startsWith('```json') && cleanedText.endsWith('```')) {
    cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
  }

  try {
    const parsedJson = JSON.parse(cleanedText);

    return parsedJson;
  } catch (error) {
    console.log("Error parsing AI response:", error);
    console.error("Failed to parse AI response. Raw response was:", text);
    throw new Error("Failed to parse AI response. Ensure the model returns pure JSON and is not truncated.");
  }
}

export { generateFitnessPlan };


// Initialize the Google GenAI client
const genAIS = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const generateWorkoutReport = async (exercises: IExercise[]) => {
  console.log("Generating workout report for exercises:", exercises);

  const prompt = `
You are a fitness assistant. Based on the following exercise data, generate a workout report that includes:
- Total number of exercises
- Total sets completed
- Estimated total workout time
- Estimated calories burned (assume beginner-level intensity)
- Suggested intensity level (Low, Moderate, High)
- A brief motivational note for the user

Return the response in JSON format with the keys:
{
  "totalExercises": number,
  "totalSets": number,
  "estimatedDuration": string,
  "caloriesBurned": number,
  "intensity": string,
  "feedback": string
}

Exercise data:
${JSON.stringify(exercises, null, 2)}
`;

  const response = await genAIS.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const textResponse = response?.text || "";
  console.log("Raw Gemini Response:", textResponse);

  try {
    // Remove any markdown artifacts
    const cleaned = textResponse.replace(/^```json|```$/g, "").trim();
    const report = JSON.parse(cleaned);
    console.log("Generated workout report:", report);
    return report;
  } catch (err) {
    console.error("Failed to parse Gemini workout report:", err);
    throw new Error("Invalid workout report format from Gemini.");
  }
};
export {  generateWorkoutReport };