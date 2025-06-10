import { GoogleGenAI } from "@google/genai";
import { IExercise } from "@/models/interface/IWorkout";

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { env } from "..//config/env.config";

// Initialize dotenv
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



// const model = genAI.getGenerativeModel({ model: "gemini-pro" });

type ChallengeType = 'beginner' | 'intermediate' | 'advanced'; // Added 'intermediate'

const generateExercisesForWeek = async (type: ChallengeType) => {
  try {
    const numDailyExercises = 5; // Assuming 5 exercises per day
    const totalExercisesNeeded = numDailyExercises * 7;

    const prompt = `Generate ${totalExercisesNeeded} unique ${type} fitness exercises suitable for a weekly challenge. Ensure there is enough variety so that each day can have a different set of 5 exercises. Each exercise should have:
    - name: string (e.g., "Jumping Jacks")
    - sets: string (e.g., "2", "3")
    - reps: string (e.g., "15 seconds", "12", "10 each leg", "20")
    - rest: string (e.g., "30 seconds", "45 seconds")
    - instructions: string (a brief, clear description of how to perform the exercise)
    - animation_link: string (a placeholder URL, e.g., "https://example.com/exercise-name")

    Format the output as a JSON array of objects.
    `;

    let generatedExercises: any[] = [];
    // --- START GEMINI INTEGRATION (Uncomment and implement when ready) ---
    // try {
    //   const result = await model.generateContent(prompt);
    //   const response = await result.response;
    //   const text = response.text();
    //   generatedExercises = JSON.parse(text);
    //   // Basic validation to ensure we got enough exercises
    //   if (generatedExercises.length < totalExercisesNeeded) {
    //     console.warn(`Gemini returned fewer exercises than requested (${generatedExercises.length}/${totalExercisesNeeded}). Falling back to dummy data.`);
    //     generatedExercises = []; // Clear to trigger dummy data fallback
    //   }
    // } catch (geminiError) {
    //   console.error('Error with Gemini API call, falling back to dummy data:', geminiError);
    //   generatedExercises = []; // Trigger dummy data fallback
    // }
    // --- END GEMINI INTEGRATION ---

    // Fallback to dummy data if Gemini integration is commented out or fails
    if (generatedExercises.length === 0) {
      console.log('Using dummy data for exercise generation.');
      const beginnerDummyPool = [
        { name: 'Jumping Jacks', sets: "2", reps: "15 seconds", rest: "30 seconds", instructions: 'Start with feet together, jump while spreading legs and arms, then return to start.', animation_link: 'https://example.com/jumping-jacks' },
        { name: 'Wall Push-Ups', sets: "2", reps: "12", rest: "30 seconds", instructions: 'Stand facing a wall, place hands shoulder-width apart and perform a push-up.', animation_link: 'https://example.com/wall-pushups' },
        { name: 'Chair Squats', sets: "2", reps: "15", rest: "30 seconds", instructions: 'Stand in front of a chair, lower until seated, then stand back up.', animation_link: 'https://example.com/chair-squats' },
        { name: 'Knee Lifts', sets: "2", reps: "30 seconds", rest: "30 seconds", instructions: 'March in place lifting your knees to waist height.', animation_link: 'https://example.com/knee-lifts' },
        { name: 'Plank (Knees)', sets: "2", reps: "20 seconds", rest: "30 seconds", instructions: 'Hold a plank from your knees and elbows.', animation_link: 'https://example.com/plank-knees' },
        { name: 'Leg Raises', sets: "2", reps: "15", rest: "30 seconds", instructions: 'Lie on your back and raise your legs towards the ceiling.', animation_link: 'https://example.com/leg-raises' },
        { name: 'Bird Dog', sets: "2", reps: "10 each side", rest: "30 seconds", instructions: 'On all fours, extend opposite arm and leg while keeping core stable.', animation_link: 'https://example.com/bird-dog' },
        { name: 'Glute Bridge', sets: "2", reps: "15", rest: "30 seconds", instructions: 'Lie on your back, knees bent, lift hips off the ground.', animation_link: 'https://example.com/glute-bridge' },
        { name: 'Calf Raises', sets: "2", reps: "20", rest: "30 seconds", instructions: 'Stand and raise up onto the balls of your feet.', animation_link: 'https://example.com/calf-raises' },
        { name: 'Arm Circles', sets: "2", reps: "20 seconds forward/backward", rest: "30 seconds", instructions: 'Stand with arms extended, make small circles.', animation_link: 'https://example.com/arm-circles' },
        { name: 'Side Plank (Knees)', sets: "2", reps: "15 seconds each side", rest: "30 seconds", instructions: 'Support yourself on one forearm and knees, keeping body straight.', animation_link: 'https://example.com/side-plank-knees' },
        { name: 'Toe Taps', sets: "2", reps: "30 seconds", rest: "30 seconds", instructions: 'Alternately tap your toes to the ground in front of you.', animation_link: 'https://example.com/toe-taps' },
        { name: 'Modified Crunches', sets: "2", reps: "15", rest: "30 seconds", instructions: 'Lie on back, knees bent, lift head and shoulders off floor.', animation_link: 'https://example.com/modified-crunches' },
        { name: 'Reverse Lunges', sets: "2", reps: "8 each leg", rest: "30 seconds", instructions: 'Step backward into a lunge, then return to start.', animation_link: 'https://example.com/reverse-lunges' },
        { name: 'Cat-Cow Stretch', sets: "2", reps: "10", rest: "30 seconds", instructions: 'Move spine from rounded to arched position on all fours.', animation_link: 'https://example.com/cat-cow' }
      ];

      // New Intermediate Pool
      const intermediateDummyPool = [
        { name: 'Standard Push-Ups', sets: "3", reps: "8-12", rest: "45 seconds", instructions: 'Perform push-ups with hands shoulder-width apart, keeping body straight.', animation_link: 'https://example.com/standard-pushups' },
        { name: 'Bodyweight Squats', sets: "3", reps: "15-20", rest: "45 seconds", instructions: 'Squat down as if sitting in a chair, keeping chest up and back straight.', animation_link: 'https://example.com/bodyweight-squats' },
        { name: 'Walking Lunges', sets: "3", reps: "10 each leg", rest: "45 seconds", instructions: 'Step forward into a lunge, then continue forward with the opposite leg.', animation_link: 'https://example.com/walking-lunges' },
        { name: 'Plank Hold (Elbows)', sets: "3", reps: "45-60 seconds", rest: "45 seconds", instructions: 'Hold body in a straight line from head to heels on your forearms.', animation_link: 'https://example.com/plank-elbows' },
        { name: 'Bicycle Crunches', sets: "3", reps: "15 each side", rest: "45 seconds", instructions: 'Lie on back, bring opposite elbow to knee, mimicking cycling.', animation_link: 'https://example.com/bicycle-crunches' },
        { name: 'Triceps Dips (Bench/Chair)', sets: "3", reps: "12-15", rest: "45 seconds", instructions: 'Use a sturdy bench or chair for dips, lowering your body by bending elbows.', animation_link: 'https://example.com/triceps-dips-bench' },
        { name: 'Step-Ups', sets: "3", reps: "10 each leg", rest: "45 seconds", instructions: 'Step onto a sturdy elevated surface, focusing on the leg pushing up.', animation_link: 'https://example.com/step-ups' },
        { name: 'Russian Twists', sets: "3", reps: "20 each side", rest: "45 seconds", instructions: 'Sit with knees bent, lean back slightly, twist torso side-to-side.', animation_link: 'https://example.com/russian-twists' },
        { name: 'Push-Up to Plank Jack', sets: "3", reps: "10", rest: "45 seconds", instructions: 'Perform a push-up, then jump feet out and in like a jumping jack in plank position.', animation_link: 'https://example.com/pushup-plank-jack' },
        { name: 'Side Plank', sets: "3", reps: "30 seconds each side", rest: "45 seconds", instructions: 'Support yourself on one forearm and foot, keeping body straight.', animation_link: 'https://example.com/side-plank' },
        { name: 'Supermans', sets: "3", reps: "15", rest: "30 seconds", instructions: 'Lie face down, lift arms and legs off the floor simultaneously.', animation_link: 'https://example.com/supermans' },
        { name: 'High Knees', sets: "3", reps: "45 seconds", rest: "30 seconds", instructions: 'Run in place, bringing knees up towards your chest.', animation_link: 'https://example.com/high-knees' },
        { name: 'Butt Kicks', sets: "3", reps: "45 seconds", rest: "30 seconds", instructions: 'Run in place, bringing heels towards your glutes.', animation_link: 'https://example.com/butt-kicks' },
        { name: 'Reverse Crunches', sets: "3", "reps": "15", "rest": "45 seconds", "instructions": "Lie on your back, lift your legs with knees bent, and curl your hips towards your chest.", "animation_link": "https://example.com/reverse-crunches" },
        { name: 'Incline Push-Ups', sets: "3", reps: "12-15", rest: "45 seconds", instructions: 'Perform push-ups with hands elevated on a bench or sturdy surface.', animation_link: 'https://example.com/incline-pushups' }
      ];


      const advancedDummyPool = [
        { name: 'Burpees', sets: "3", reps: "15", rest: "45 seconds", instructions: 'Drop into push-up position, push-up, jump feet forward, leap up.', animation_link: 'https://example.com/burpees' },
        { name: 'Push-Ups', sets: "3", reps: "12-15", rest: "45 seconds", instructions: 'Keep body straight, lower until chest nearly touches the ground, then push back up.', animation_link: 'https://example.com/pushups' },
        { name: 'Jump Squats', sets: "3", reps: "20", rest: "45 seconds", instructions: 'Perform a squat, then explode up into a jump and land softly.', animation_link: 'https://example.com/jump-squats' },
        { name: 'Walking Lunges', sets: "3", reps: "10 each leg", rest: "45 seconds", instructions: 'Step forward into a lunge, then continue forward with the opposite leg.', animation_link: 'https://example.com/walking-lunges' },
        { name: 'Plank Hold', sets: "3", reps: "45 seconds", rest: "45 seconds", instructions: 'Hold body in a straight line from head to heels.', animation_link: 'https://example.com/plank' },
        { name: 'Box Jumps', sets: "3", reps: "10", rest: "60 seconds", instructions: 'Jump onto a sturdy box or elevated surface.', animation_link: 'https://example.com/box-jumps' },
        { name: 'Pull-Ups (Assisted/Negative)', sets: "3", reps: "6-8", rest: "60 seconds", instructions: 'Use a band for assistance or focus on the lowering phase.', animation_link: 'https://example.com/pull-ups' },
        { name: 'Pistol Squats (Assisted)', sets: "3", reps: "5 each leg", rest: "60 seconds", instructions: 'Use a support for balance while performing a single-leg squat.', animation_link: 'https://example.com/pistol-squats' },
        { name: 'Mountain Climbers', sets: "3", reps: "45 seconds", rest: "45 seconds", instructions: 'Rapidly bring knees to chest in a plank position.', animation_link: 'https://example.com/mountain-climbers' },
        { name: 'Handstand Push-Ups (Wall Assisted)', sets: "3", reps: "5-8", rest: "60 seconds", instructions: 'Perform push-ups while in a handstand against a wall.', animation_link: 'https://example.com/handstand-pushups' },
        { name: 'Side Plank with Reach', sets: "3", reps: "10 each side", rest: "45 seconds", instructions: 'From a side plank, reach your top arm under and through.', animation_link: 'https://example.com/side-plank-reach' },
        { name: 'Commando Planks', sets: "3", reps: "10-12 reps", rest: "45 seconds", instructions: 'Transition between high plank and forearm plank.', animation_link: 'https://example.com/commando-planks' },
        { name: 'Russian Twists (Weighted)', sets: "3", reps: "20 each side", rest: "45 seconds", instructions: 'Twist torso side-to-side while leaning back, holding a weight.', animation_link: 'https://example.com/russian-twists' },
        { name: 'Triceps Dips (Chair)', sets: "3", reps: "15", rest: "45 seconds", instructions: 'Use a chair for dips, lowering your body by bending elbows.', animation_link: 'https://example.com/triceps-dips' },
        { name: 'Plyometric Lunges', sets: "3", reps: "10 each leg", rest: "60 seconds", instructions: 'Perform a lunge, then jump and switch legs in mid-air.', animation_link: 'https://example.com/plyo-lunges' }
      ];

      let exercisePool: any[] = [];
      if (type === 'beginner') {
        exercisePool = beginnerDummyPool;
      } else if (type === 'intermediate') { // Select intermediate pool
        exercisePool = intermediateDummyPool;
      } else {
        exercisePool = advancedDummyPool;
      }


      // Randomly select enough exercises to fill 7 days
      // Ensure we don't pick the same exercise too many times if the pool is small
      for (let i = 0; i < totalExercisesNeeded; i++) {
        const randomIndex = Math.floor(Math.random() * exercisePool.length);
        generatedExercises.push(exercisePool[randomIndex]);
      }
    }

    const weeklyTasks = [];
    for (let i = 0; i < 7; i++) {
      const dailyExercises = generatedExercises.slice(i * numDailyExercises, (i + 1) * numDailyExercises);
      weeklyTasks.push({
        title: `Day ${i + 1} - ${type === 'beginner' ? 'Foundations' : type === 'intermediate' ? 'Progress' : 'Challenge'}`, // Update title based on type
        exercises: dailyExercises,
        completed: false,
        report: null
      });
    }

    return weeklyTasks;

  } catch (error) {
    console.error('❌ Critical error in generateExercisesForWeek:', error);
    return [];
  }
};

export { generateExercisesForWeek, generateWorkoutReport, generateFitnessPlan };