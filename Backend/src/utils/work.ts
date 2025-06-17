// import { GoogleGenAI } from "@google/genai";
// import { env } from "../config/env.config";

// interface UserData {
//   nick_name: string;
//   age: number;
//   gender: string;
//   height: number;
//   current_weight: number;
//   target_weight: number;
//   fitness_goal: string;
//   current_fitness_level: string;
//   activity_level: string;
//   equipments: string[];
//   workout_duration: string;
//   workout_days_perWeek: number;
//   health_issues: string[];
//   medical_condition: string;
//   diet_allergies: string[];
//   diet_meals_perDay: string;
//   diet_preferences: string[];
// }

// // Initialize the Google Generative AI client
// const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// async function generateFitnessPlan(userData: UserData) {
//   try {
//     // Access the Gemini model
//     // const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//     const model = "gemini-2.0-flash";

//     // Format the prompt with user data
//     const prompt = formatPrompt(userData);

//     // Generate content
//     const result = await genAI.models.generateContent({
//       model: model,
//       contents: prompt,
//     });
//     const response = await result.text;
//     // const text = response.text();
//     const text = response;

//     // Parse the response into structured data
//     return parseResponse(text);
//   } catch (error) {
//     console.error("Error generating fitness plan:", error);
//     throw new Error("Failed to generate fitness plan");
//   }
// }

// function formatPrompt(userData: UserData) {
//   // Calculate workout and rest days
//   const workoutDaysPerWeek = userData.workout_days_perWeek;
//   const restDaysPerWeek = 7 - workoutDaysPerWeek;
//   // Default to spreading rest days evenly (e.g., after every 2-3 workout days for 5 workout days)
//   const restDayDescription = restDaysPerWeek > 0 
//     ? `evenly spaced rest days (approximately every ${Math.floor(7 / restDaysPerWeek)} days)`
//     : "no rest days";

//   return `
// Create a personalized 28-day workout and diet plan based on the following user information:

// PERSONAL INFORMATION:
// - Name: ${userData.nick_name}
// - Age: ${userData.age}
// - Gender: ${userData.gender}
// - Height: ${userData.height} cm
// - Current Weight: ${userData.current_weight} kg
// - Target Weight: ${userData.target_weight} kg
// - Fitness Goal: ${userData.fitness_goal}
// - Current Fitness Level: ${userData.current_fitness_level}
// - Activity Level: ${userData.activity_level}

// WORKOUT PREFERENCES:
// - Available Equipment: ${userData.equipments.join(", ") || "None"}
// - Workout Duration: ${userData.workout_duration} minutes
// - Workout Days Per Week: ${userData.workout_days_perWeek}

// HEALTH INFORMATION:
// - Health Issues/Injuries: ${userData.health_issues.join(", ") || "None"}
// - Medical Conditions: ${userData.medical_condition || "None"}

// DIET PREFERENCES:
// - Allergies: ${userData.diet_allergies.join(", ") || "None"}
// - Meals Per Day: ${userData.diet_meals_perDay}
// - Dietary Preferences: ${userData.diet_preferences.join(", ") || "None"}

// INSTRUCTIONS:
// 1. Create a detailed 28-day workout plan with specific exercises, sets, reps, and rest periods, tailored for a user with ${userData.medical_condition || "no medical conditions"} and ${userData.health_issues.join(", ") || "no injuries"}, using only ${userData.equipments.join(", ") || "bodyweight"} exercises.
// 2. Organize workouts by day (Day 1 through Day 28), with ${userData.workout_days_perWeek} workout days per week and ${restDayDescription}. Start the plan assuming Day 1 is the user's chosen start day, and distribute rest days evenly across each week to avoid consecutive high-effort days.
// 3. Ensure exercises are safe, low-impact, and avoid aggravating ${userData.health_issues.join(", ") || "any health conditions"} or ${userData.medical_condition || "medical conditions"}. Include breathing-focused warm-ups (e.g., diaphragmatic breathing) and avoid high-intensity intervals to support asthma management if applicable.
// 4. Create a diet plan with ${getMealCount(userData.diet_meals_perDay)} per day, adhering to ${userData.diet_preferences.join(", ") || "no specific"} dietary preferences and avoiding ${userData.diet_allergies.join(", ") || "no"} allergies.
// 5. Include specific meal recommendations with portion sizes and step-by-step cooking instructions.
// 6. For each exercise, provide detailed instructions on proper form and technique to ensure safety and effectiveness.
// 7. For each exercise, include a valid, publicly accessible YouTube URL for an animation or video demonstrating proper form. If no suitable video exists, note "No video available" and provide detailed text instructions instead.
// 8. For each meal, include a valid, publicly accessible YouTube URL for a professionally made video demonstrating the recipe preparation, if available. Otherwise, note "No video available."
// 9. Format the response as valid JSON with the following structure:
// {
//   "workoutPlan": {
//     "day1": { 
//       "title": "", 
//       "exercises": [
//         {
//           "name": "", 
//           "sets": "", 
//           "reps": "", 
//           "rest": "",
//           "instructions": "Detailed step-by-step instructions on how to perform the exercise with proper form",
//           "animation_link": "A valid YouTube URL or 'No video available'"
//         }
//       ], 
//       "notes": "" 
//     },
//     ...through day28
//   },
//   "dietPlan": {
//     "mealPlan": {
//       "breakfast": { 
//         "options": [
//           {
//             "name": "", 
//             "ingredients": [], 
//             "instructions": "Detailed step-by-step cooking instructions",
//             "video_link": "A valid YouTube URL or 'No video available'"
//           }
//         ] 
//       },
//       "lunch": { 
//         "options": [
//           {
//             "name": "", 
//             "ingredients": [], 
//             "instructions": "Detailed step-by-step cooking instructions",
//             "video_link": "A valid YouTube URL or 'No video available'"
//           }
//         ] 
//       },
//       "dinner": { 
//         "options": [
//           {
//             "name": "", 
//             "ingredients": [], 
//             "instructions": "Detailed step-by-step cooking instructions",
//             "video_link": "A valid YouTube URL or 'No video available'"
//           }
//         ] 
//       },
//       "snacks": { 
//         "options": [
//           {
//             "name": "", 
//             "ingredients": [], 
//             "instructions": "Detailed step-by-step preparation instructions",
//             "video_link": "A valid YouTube URL or 'No video available'"
//           }
//         ] 
//       }
//     },
//     "notes": ""
//   }
// }
// `;
// }

// function getMealCount(mealsPerDay: string) {
//   switch (mealsPerDay) {
//     case "3":
//       return "3 meals (breakfast, lunch, dinner)";
//     case "4":
//       return "3 meals (breakfast, lunch, dinner) + 1 snack";
//     case "5":
//       return "3 meals (breakfast, lunch, dinner) + 2 snacks";
//     case "6":
//       return "6 meals (breakfast, mid-morning snack, lunch, afternoon snack, dinner, evening snack)";
//     default:
//       return "3 meals (breakfast, lunch, dinner)";
//   }
// }

// function parseResponse(text: string) {
//   try {
//     // Extract JSON from the response
//     const jsonMatch =
//       text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*?}/);

//     if (jsonMatch) {
//       const jsonString = jsonMatch[1] || jsonMatch[0];
//       const parsed = JSON.parse(jsonString);
//       // Validate JSON structure
//       if (!parsed.workoutPlan || !parsed.dietPlan) {
//         throw new Error(
//           "Invalid JSON structure: Missing workoutPlan or dietPlan"
//         );
//       }
//       return parsed;
//     }

//     console.warn("No valid JSON found in response, returning raw text");
//     return { rawResponse: text };
//   } catch (error) {
//     console.error("Error parsing response:", error, "Raw text:", text);
//     return { rawResponse: text, error: "Failed to parse JSON response" };
//   }
// }

// function formatPrompt(userData:UserData) {
//   return `
// Create a personalized 28-day workout and diet plan based on the following user information:

// PERSONAL INFORMATION:
// - Name: ${userData.nick_name}
// - Age: ${userData.age}
// - Gender: ${userData.gender}
// - Height: ${userData.height}
// - Current Weight: ${userData.current_weight}
// - Target Weight: ${userData.target_weight}
// - Fitness Goal: ${userData.fitness_goal}
// - Current Fitness Level: ${userData.current_fitness_level}
// - Activity Level: ${userData.activity_level}

// WORKOUT PREFERENCES:
// - Available Equipment: ${userData.equipments.join(', ')}
// - Workout Duration: ${userData.workout_duration} minutes
// - Workout Days Per Week: ${userData.workout_days_perWeek}

// HEALTH INFORMATION:
// - Health Issues/Injuries: ${userData.health_issues.join(', ') || 'None'}
// - Medical Conditions: ${userData.medical_condition.join(', ') || 'None'}

// DIET PREFERENCES:
// - Allergies: ${userData.diet_allergies.join(', ') || 'None'}
// - Meals Per Day: ${userData.diet_meals_perDay}
// - Dietary Preferences: ${userData.diet_preferences.join(', ') || 'None'}

// INSTRUCTIONS:
// 1. Create a detailed 28-day workout plan with specific exercises, sets, reps, and rest periods.
// 2. Organize workouts by day (Day 1 through Day 28).
// 3. Include ${userData.workout_days_perWeek} workout days per week with appropriate rest days.
// 4. Create a diet plan with ${getMealCount(userData.diet_meals_perDay)} per day.
// 5. Include specific meal recommendations with portion sizes.
// 6. Format the response as JSON with the following structure:
// {
//   "workoutPlan": {
//     "day1": { "title": "", "exercises": [{"name": "", "sets": "", "reps": "", "rest": ""}], "notes": "" },
//     ...through day28
//   },
//   "dietPlan": {
//     "mealPlan": {
//       "breakfast": { "options": [{"name": "", "ingredients": [], "instructions": ""}] },
//       "lunch": { "options": [{"name": "", "ingredients": [], "instructions": ""}] },
//       "dinner": { "options": [{"name": "", "ingredients": [], "instructions": ""}] },
//       "snacks": { "options": [{"name": "", "ingredients": [], "instructions": ""}] }
//     },
//     "notes": ""
//   }
// }
// `;
// }

// function formatPrompt(userData: UserData) {
//   return `
// Create a personalized 28-day workout and diet plan based on the following user information:

// PERSONAL INFORMATION:
// - Name: ${userData.nick_name}
// - Age: ${userData.age}
// - Gender: ${userData.gender}
// - Height: ${userData.height}
// - Current Weight: ${userData.current_weight}
// - Target Weight: ${userData.target_weight}
// - Fitness Goal: ${userData.fitness_goal}
// - Current Fitness Level: ${userData.current_fitness_level}
// - Activity Level: ${userData.activity_level}

// WORKOUT PREFERENCES:
// - Available Equipment: ${userData.equipments.join(", ")}
// - Workout Duration: ${userData.workout_duration} minutes
// - Workout Days Per Week: ${userData.workout_days_perWeek}

// HEALTH INFORMATION:
// - Health Issues/Injuries: ${userData.health_issues.join(", ") || "None"}
// - Medical Conditions: ${userData.medical_condition}

// DIET PREFERENCES:
// - Allergies: ${userData.diet_allergies.join(", ") || "None"}
// - Meals Per Day: ${userData.diet_meals_perDay}
// - Dietary Preferences: ${userData.diet_preferences.join(", ") || "None"}

// INSTRUCTIONS:
// 1. Create a detailed 28-day workout plan with specific exercises, sets, reps, and rest periods.
// 2. Organize workouts by day (Day 1 through Day 28).
// 3. Include ${userData.workout_days_perWeek} workout days per week with appropriate rest days.
// 4. Create a diet plan with ${getMealCount(userData.diet_meals_perDay)} per day.
// 5. Include specific meal recommendations with portion sizes.
// 6. For each exercise, provide detailed instructions on proper form and technique.
// 7. For each meal, provide step-by-step cooking instructions.
// 8. Format the response as JSON with the following structure:
// {
//   "workoutPlan": {
//     "day1": {
//       "title": "",
//       "exercises": [
//         {
//           "name": "",
//           "sets": "",
//           "reps": "",
//           "rest": "",
//           "instructions": "Detailed step-by-step instructions on how to perform the exercise with proper form"
//           "animation_link": "A URL pointing to an animation or video demonstrating how to correctly perform the exercise. This visual guide helps users understand proper form and technique."
//         }
//       ],
//       "notes": ""
//     },
//     ...through day28
//   },
//   "dietPlan": {
//     "mealPlan": {
//       "breakfast": {
//         "options": [
//           {
//             "name": "",
//             "ingredients": [],
//             "instructions": "Detailed step-by-step cooking instructions"
//             "video_link": "A URL to a professionally made YouTube video demonstrating how to prepare this food recipe, if available."
//           }
//         ]
//       },
//       "lunch": {
//         "options": [
//           {
//             "name": "",
//             "ingredients": [],
//             "instructions": "Detailed step-by-step cooking instructions"
//             "video_link": "A URL to a professionally made YouTube video demonstrating how to prepare this food recipe, if available."
//           }
//         ]
//       },
//       "dinner": {
//         "options": [
//           {
//             "name": "",
//             "ingredients": [],
//             "instructions": "Detailed step-by-step cooking instructions"
//             "video_link": "A URL to a professionally made YouTube video demonstrating how to prepare this food recipe, if available."
//           }
//         ]
//       },
//       "snacks": {
//         "options": [
//           {
//             "name": "",
//             "ingredients": [],
//             "instructions": "Detailed step-by-step preparation instructions"
//             "video_link": "A URL to a professionally made YouTube video demonstrating how to prepare this food recipe, if available."
//           }
//         ]
//       }
//     },
//     "notes": ""
//   }
// }
// `;
// }

// function getMealCount(mealsPerDay: string) {
//   switch (mealsPerDay) {
//     case "3":
//       return "3 meals (breakfast, lunch, dinner)";
//     case "4":
//       return "3 meals (breakfast, lunch, dinner) + 1 snack";
//     case "5":
//       return "3 meals (breakfast, lunch, dinner) + 2 snacks";
//     case "6":
//       return "6 meals (breakfast, mid-morning snack, lunch, afternoon snack, dinner, evening snack)";
//     default:
//       return "3 meals (breakfast, lunch, dinner)";
//   }
// }

// function parseResponse(text: any) {
//   try {
//     // Extract JSON from the response
//     const jsonMatch =
//       text.match(/```json\n([\s\S]*?)\n```/) ||
//       text.match(/{[\s\S]*}/) ||
//       text.match(/\{[\s\S]*\}/);

//     if (jsonMatch) {
//       const jsonString = jsonMatch[1] || jsonMatch[0];
//       return JSON.parse(jsonString);
//     }

//     // If no JSON format is found, return the raw text
//     return { rawResponse: text };
//   } catch (error) {
//     console.error("Error parsing response:", error);
//     return { rawResponse: text };
//   }
// }

// // Example usage

// const userData = {
//   nick_name: "thaha",
//   age: 34,
//   gender: "Male",
//   height: 165,
//   current_weight: 50,
//   target_weight: 60,
//   fitness_goal: "strength",
//   current_fitness_level: "intermediate",
//   activity_level: "lightly",
//   equipments: ["bodyweight"],
//   workout_duration: "15-30",
//   workout_days_perWeek: 5,
//   health_issues: ["shoulder", "knee"],
//   medical_condition: "Am an asthma Patient",
//   diet_allergies: ["nuts", "dairy"],
//   diet_meals_perDay: "4",
//   diet_preferences: ["vegan", "vegetarian"],
// };
// // Call the function and log the result
// generateFitnessPlan(userData)
//   .then(plan => console.log(JSON.stringify(plan, null, 2)))
//   .catch(error => console.error(error));