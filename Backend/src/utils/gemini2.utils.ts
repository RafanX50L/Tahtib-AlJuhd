import {
  // Fix: Import 'GoogleGenAI' instead of 'GoogleGenerativeAI'
  GoogleGenAI,
  HarmCategory,
  HarmBlockThreshold,
  // Fix: Import 'Type' for schema definitions
  Type,
  GenerateContentResponse,
} from "@google/genai"; // Changed to @google/genai
import { env } from "../config/env.config";
import axios from 'axios';
import * as cheerio from 'cheerio';

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

// Define an interface for the expected arguments of searchIconscoutForLottie
interface SearchIconscoutArgs {
  exerciseName: string;
}

// Ensure API key is defined
if (!env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

// Fix: Initialize GoogleGenAI with an object
const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY! });

async function searchIconscoutForLottie(exerciseName: string): Promise<string> {
  console.log(`Searching Iconscout for: "${exerciseName}" Lottie animation...`);
  try {
    const formattedExerciseName = exerciseName.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
    const searchUrl = `https://iconscout.com/lottie-animation-pack?q=${formattedExerciseName}`;

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 5000
    });
    const $ = cheerio.load(response.data);

    const firstAnimationLink = $('a.animation-item-link').first().attr('href');

    if (firstAnimationLink) {
      if (firstAnimationLink.startsWith('/')) {
        return `https://iconscout.com${firstAnimationLink}`;
      }
      return firstAnimationLink;
    }

    return "No video available";
  } catch (error) {
    console.error(`Error during Iconscout search for "${exerciseName}":`, error);
    return "No video available";
  }
}

async function generateFitnessPlan(userData: UserData) {
  try {
    const tools = [
      {
        functionDeclarations: [
          {
            name: "searchIconscoutForLottie",
            description: "Searches iconscout.com for a Lottie animation link for a given exercise name.",
            parameters: {
              // Fix: Use Type.OBJECT
              type: Type.OBJECT,
              properties: {
                exerciseName: {
                  // Fix: Use Type.STRING
                  type: Type.STRING,
                  description: "The name of the exercise to search for (e.g., 'Push-ups', 'Plank')."
                },
              },
              required: ["exerciseName"],
            },
          },
        ],
      },
    ];

    const prompt = formatPrompt(userData);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", tools: tools });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    let responseContent = result.response?.candidates?.[0]?.content;
    let finalJsonOutput: any = {};

    if (responseContent?.parts && responseContent.parts.length > 0 && responseContent.parts[0].functionCall) {
      const functionCall = responseContent.parts[0].functionCall;

      if (functionCall.name === "searchIconscoutForLottie") {
        const { exerciseName } = functionCall.args as SearchIconscoutArgs;
        console.log(`Gemini requested to call searchIconscoutForLottie for: ${exerciseName}`);
        const animationLink = await searchIconscoutForLottie(exerciseName);

        const toolResponseResult = await model.generateContent({
          contents: [
            { role: 'user', parts: [{ text: prompt }] },
            { role: 'model', parts: [responseContent.parts[0]] },
            {
              role: 'tool',
              parts: [{
                functionResponse: {
                  name: "searchIconscoutForLottie",
                  response: { animation_link: animationLink }
                }
              }]
            }
          ],
        });

        finalJsonOutput = parseResponse(toolResponseResult.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "");

      } else {
        console.warn("Unexpected function call:", functionCall.name);
        finalJsonOutput = parseResponse(result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
      }
    } else {
      finalJsonOutput = parseResponse(result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
    }

    return finalJsonOutput;

  } catch (error) {
    console.error("Error generating fitness plan:", error);
    if (error instanceof Error) {
        console.error("Error message:", error.message);
    }
    throw new Error("Failed to generate fitness plan");
  }
}

function formatPrompt(userData: UserData) {
  return `
    Create a comprehensive 4-week workout plan and diet plan for a user with the following details:
    
    User Data: ${JSON.stringify(userData, null, 2)}
    
    IMPORTANT: Return ONLY a valid JSON response in this EXACT format (no markdown, no explanations):
    
    {
      "workoutPlan": {
        "week1": {
          "day1": {
            "title": "Day 1 - Upper Body Focus",
            "exercises": [
              {
                "name": "Push-ups",
                "sets": "3",
                "reps": "8-12",
                "rest": "60 seconds",
                "instructions": "Start in plank position, lower chest to ground, push back up. Keep core tight throughout movement.",
                "animation_link": "CALL:searchIconscoutForLottie(Push-ups)"
              }
            ]
          },
          "day2": {
            "title": "Day 2 - Lower Body Focus",
            "exercises": [
              {
                "name": "Bodyweight Squats",
                "sets": "3",
                "reps": "10-15",
                "rest": "45 seconds",
                "instructions": "Stand with feet shoulder-width apart, lower hips back and down, return to standing.",
                "animation_link": "CALL:searchIconscoutForLottie(Bodyweight Squats)"
              }
            ]
          },
          "day3": {
            "title": "Day 3 - Core & Cardio",
            "exercises": [
              {
                "name": "Plank Hold",
                "duration": "30 sec",
                "rest": "30 seconds",
                "instructions": "Hold plank position with straight line from head to heels.",
                "animation_link": "CALL:searchIconscoutForLottie(Plank Hold)"
              }
            ]
          },
          "day4": {
            "title": "Day 4 - Full Body",
            "exercises": [
              {
                "name": "Burpees",
                "sets": "3",
                "reps": "5-8",
                "rest": "90 seconds",
                "instructions": "Squat down, jump back to plank, do push-up, jump feet forward, jump up.",
                "animation_link": "CALL:searchIconscoutForLottie(Burpees)"
              }
            ]
          },
          "day5": {
            "title": "Day 5 - Active Recovery",
            "exercises": [
              {
                "name": "Walking",
                "duration": "20 min",
                "rest": "As needed",
                "instructions": "Light walking or stretching for recovery.",
                "animation_link": "CALL:searchIconscoutForLottie(Walking)"
              }
            ]
          }
        },
        "week2": {
          "day1": {
            "title": "Day 1 - Upper Body Progression",
            "exercises": [
              {
                "name": "Incline Push-ups",
                "sets": "3",
                "reps": "10-15",
                "rest": "60 seconds",
                "instructions": "Use elevated surface for hands, perform push-up motion.",
                "animation_link": "CALL:searchIconscoutForLottie(Incline Push-ups)"
              }
            ]
          },
          "day2": {
            "title": "Day 2 - Lower Body Progression",
            "exercises": [
              {
                "name": "Jump Squats",
                "sets": "3",
                "reps": "8-12",
                "rest": "60 seconds",
                "instructions": "Perform squat then jump explosively upward.",
                "animation_link": "CALL:searchIconscoutForLottie(Jump Squats)"
              }
            ]
          },
          "day3": {
            "title": "Day 3 - Core Strength",
            "exercises": [
              {
                "name": "Mountain Climbers",
                "duration": "45 sec",
                "rest": "45 seconds",
                "instructions": "In plank position, alternate bringing knees to chest rapidly.",
                "animation_link": "CALL:searchIconscoutForLottie(Mountain Climbers)"
              }
            ]
          },
          "day4": {
            "title": "Day 4 - Full Body Circuit",
            "exercises": [
              {
                "name": "Bodyweight Circuit",
                "sets": "3",
                "reps": "Circuit",
                "rest": "2 minutes",
                "instructions": "Combine multiple exercises in sequence.",
                "animation_link": "CALL:searchIconscoutForLottie(Bodyweight Circuit)"
              }
            ]
          },
          "day5": {
            "title": "Day 5 - Flexibility",
            "exercises": [
              {
                "name": "Yoga Flow",
                "duration": "25 min",
                "rest": "As needed",
                "instructions": "Gentle yoga poses for flexibility and recovery.",
                "animation_link": "CALL:searchIconscoutForLottie(Yoga Flow)"
              }
            ]
          }
        },
        "week3": {
          "day1": {
            "title": "Day 1 - Strength Building",
            "exercises": [
              {
                "name": "Diamond Push-ups",
                "sets": "3",
                "reps": "6-10",
                "rest": "75 seconds",
                "instructions": "Form diamond shape with hands, perform push-up.",
                "animation_link": "CALL:searchIconscoutForLottie(Diamond Push-ups)"
              }
            ]
          },
          "day2": {
            "title": "Day 2 - Power Development",
            "exercises": [
              {
                "name": "Single Leg Squats",
                "sets": "3",
                "reps": "5-8 each leg",
                "rest": "90 seconds",
                "instructions": "Squat on one leg, use assistance if needed.",
                "animation_link": "CALL:searchIconscoutForLottie(Single Leg Squats)"
              }
            ]
          },
          "day3": {
            "title": "Day 3 - Core Power",
            "exercises": [
              {
                "name": "Plank to Push-up",
                "sets": "3",
                "reps": "8-12",
                "rest": "60 seconds",
                "instructions": "Start in plank, move to push-up position and back.",
                "animation_link": "CALL:searchIconscoutForLottie(Plank to Push-up)"
              }
            ]
          },
          "day4": {
            "title": "Day 4 - Endurance",
            "exercises": [
              {
                "name": "Tabata Circuit",
                "duration": "20 min",
                "rest": "10 seconds",
                "instructions": "High intensity intervals: 20 sec work, 10 sec rest.",
                "animation_link": "CALL:searchIconscoutForLottie(Tabata Circuit)"
              }
            ]
          },
          "day5": {
            "title": "Day 5 - Recovery",
            "exercises": [
              {
                "name": "Stretching Routine",
                "duration": "30 min",
                "rest": "As needed",
                "instructions": "Full body stretching focusing on worked muscles.",
                "animation_link": "CALL:searchIconscoutForLottie(Stretching Routine)"
              }
            ]
          }
        },
        "week4": {
          "day1": {
            "title": "Day 1 - Peak Performance",
            "exercises": [
              {
                "name": "Advanced Push-up Variations",
                "sets": "4",
                "reps": "8-15",
                "rest": "60 seconds",
                "instructions": "Mix of different push-up styles for maximum challenge.",
                "animation_link": "CALL:searchIconscoutForLottie(Advanced Push-up Variations)"
              }
            ]
          },
          "day2": {
            "title": "Day 2 - Lower Body Mastery",
            "exercises": [
              {
                "name": "Pistol Squat Progression",
                "sets": "3",
                "reps": "3-6 each leg",
                "rest": "2 minutes",
                "instructions": "Advanced single leg squat, use assistance as needed.",
                "animation_link": "CALL:searchIconscoutForLottie(Pistol Squat Progression)"
              }
            ]
          },
          "day3": {
            "title": "Day 3 - Core Mastery",
            "exercises": [
              {
                "name": "Advanced Plank Variations",
                "duration": "60 sec",
                "rest": "60 seconds",
                "instructions": "Side planks, plank with leg lifts, etc.",
                "animation_link": "CALL:searchIconscoutForLottie(Advanced Plank Variations)"
              }
            ]
          },
          "day4": {
            "title": "Day 4 - Full Body Challenge",
            "exercises": [
              {
                "name": "Complex Movement Patterns",
                "sets": "4",
                "reps": "10-20",
                "rest": "90 seconds",
                "instructions": "Combine multiple movement patterns for full body workout.",
                "animation_link": "CALL:searchIconscoutForLottie(Complex Movement Patterns)"
              }
            ]
          },
          "day5": {
            "title": "Day 5 - Assessment & Recovery",
            "exercises": [
              {
                "name": "Fitness Assessment",
                "duration": "45 min",
                "rest": "As needed",
                "instructions": "Test improvements and plan next phase.",
                "animation_link": "CALL:searchIconscoutForLottie(Fitness Assessment)"
              }
            ]
          }
        }
        "notes": " This 28-day challenge is designed to help you build strength, improve endurance, and transform your body through progressive workouts. Each week focuses on different muscle groups with increasing intensity. "
      },
      "dietPlan": {
        "mealPlan": {
          "breakfast": {
            "options": [
              {
                "name": "Protein Oatmeal Bowl",
                "ingredients": ["Gluten-free oats", "Plant protein powder", "Banana", "Almond milk", "Chia seeds"],
                "instructions": "Cook oats with almond milk, add protein powder, top with sliced banana and chia seeds.",
                "video_link": "No video available" // No tool for diet videos currently
              },
              {
                "name": "Vegetarian Scramble",
                "ingredients": ["Tofu", "Spinach", "Tomatoes", "Nutritional yeast", "Olive oil"],
                "instructions": "Crumble tofu, sauté with vegetables, season with nutritional yeast.",
                "video_link": "No video available"
              },
              {
                "name": "Green Smoothie Bowl",
                "ingredients": ["Spinach", "Banana", "Protein powder", "Coconut milk", "Hemp seeds"],
                "instructions": "Blend ingredients until smooth, pour into bowl, top with hemp seeds.",
                "video_link": "No video available"
              }
            ]
          },
          "lunch": {
            "options": [
              {
                "name": "Quinoa Power Bowl",
                "ingredients": ["Quinoa", "Black beans", "Avocado", "Sweet potato", "Tahini dressing"],
                "instructions": "Cook quinoa and sweet potato, combine with beans and avocado, drizzle with tahini.",
                "video_link": "No video available"
              },
              {
                "name": "Lentil Curry",
                "ingredients": ["Red lentils", "Coconut milk", "Curry spices", "Vegetables", "Brown rice"],
                "instructions": "Cook lentils with coconut milk and spices, serve over brown rice.",
                "video_link": "No video available"
              },
              {
                "name": "Mediterranean Wrap",
                "ingredients": ["Gluten-free wrap", "Hummus", "Vegetables", "Olives", "Hemp hearts"],
                "instructions": "Spread hummus on wrap, add vegetables and olives, sprinkle hemp hearts.",
                "video_link": "No video available"
              }
            ]
          },
          "dinner": {
            "options": [
              {
                "name": "Stuffed Bell Peppers",
                "ingredients": ["Bell peppers", "Quinoa", "Black beans", "Corn", "Nutritional yeast"],
                "instructions": "Hollow peppers, stuff with quinoa mixture, bake until tender.",
                "video_link": "No video available"
              },
              {
                "name": "Vegetable Stir-fry",
                "ingredients": ["Mixed vegetables", "Tofu", "Coconut oil", "Tamari sauce", "Brown rice"],
                "instructions": "Stir-fry vegetables and tofu, season with tamari, serve over rice.",
                "video_link": "No video available"
              },
              {
                "name": "Chickpea Curry",
                "ingredients": ["Chickpeas", "Coconut milk", "Spinach", "Curry spices", "Quinoa"],
                "instructions": "Simmer chickpeas in coconut milk with spices, add spinach, serve over quinoa.",
                "video_link": "No video available"
              }
            ]
          },
          "snacks": {
            "options": [
              {
                "name": "Energy Balls",
                "ingredients": ["Dates", "Sunflower seeds", "Coconut", "Cacao powder"],
                "instructions": "Blend ingredients, roll into balls, refrigerate until firm.",
                "video_link": "No video available"
              },
              {
                "name": "Vegetable Sticks with Hummus",
                "ingredients": ["Carrots", "Celery", "Cucumber", "Homemade hummus"],
                "instructions": "Cut vegetables into sticks, serve with hummus for dipping.",
                "video_link": "No video available"
              },
              {
                "name": "Protein Smoothie",
                "ingredients": ["Plant protein powder", "Banana", "Spinach", "Almond milk"],
                "instructions": "Blend all ingredients until smooth, serve immediately.",
                "video_link": "No video available"
              }
            ]
          }
        },
        "notes": "This plan is designed for vegetarian preferences, avoiding nuts and gluten. All meals support muscle building goals while considering asthma and joint health. Increase portions gradually to support weight gain goals."
      }
    }
    
    Please customize this plan based on the user's specific details:
    - Age: ${userData.age}
    - Gender: ${userData.gender}
    - Current weight: ${userData.current_weight}kg, Target: ${userData.target_weight}kg
    - Fitness goal: ${userData.fitness_goal}
    - Fitness level: ${userData.current_fitness_level}
    - Activity level: ${userData.activity_level}
    - Available equipment: ${userData.equipments.join(', ')}
    - Workout duration: ${userData.workout_duration} minutes
    - Workout days per week: ${userData.workout_days_perWeek}
    - Health issues: ${userData.health_issues.join(', ')}
    - Medical condition: ${userData.medical_condition}
    - Diet allergies: ${userData.diet_allergies.join(', ')}
    - Meals per day: ${userData.diet_meals_perDay}
    - Diet preferences: ${userData.diet_preferences.join(', ')}
    
    Make sure to:
    1. Avoid exercises that could aggravate back and knee issues
    2. Include 10-12 unique exercises per day, suitable for indoor home workouts using only the specified equipment: ${userData.equipments.join(', ') || 'None'}.
    3. Consider asthma when planning cardio intensity
    4. Exclude nuts and gluten from all meal options
    5. Focus on vegetarian protein sources for muscle building
    6. Plan for ${userData.workout_days_perWeek} workout days per week
    7. Keep workouts within ${userData.workout_duration} minutes
    8. Progress difficulty from week 1 to week 4
    9. Provide ${getMealCount(userData.diet_meals_perDay)} meal options per day
    
    Return ONLY the JSON object, no other text. When generating the plan, if you include an exercise, for its 'animation_link' field, **always output "CALL:searchIconscoutForLottie(<Exercise Name>)"** where <Exercise Name> is the exact name of the exercise. For example, for "Push-ups", output "CALL:searchIconscoutForLottie(Push-ups)".
    `;
}

function getMealCount(mealsPerDay: string) {
  switch (mealsPerDay) {
    case "3":
      return "3 meals (breakfast, lunch, dinner)";
    case "4":
      return "3 meals (breakfast, lunch, dinner) + 1 snack";
    case "5":
      return "3 meals (breakfast, lunch, dinner) + 2 snacks";
    case "6":
      return "6 meals (breakfast, mid-morning snack, lunch, afternoon snack, dinner, evening snack)";
    default:
      return "3 meals (breakfast, lunch, dinner)";
  }
}

function parseResponse(text: string) {
  try {
    let jsonString = text.replace(/^```(json)?|```$/g, '').trim();
    if (jsonString.startsWith('json')) {
      jsonString = jsonString.substring(4).trim();
    }
    jsonString = jsonString.replace(/""/g, '"');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Failed to parse AI response");
  }
}
export default generateFitnessPlan;