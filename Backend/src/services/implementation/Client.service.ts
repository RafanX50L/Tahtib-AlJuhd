import { IClientRepository } from "../../repositories/interface/IClient.repository";
import { IClientService } from "../interface/IClient.service";
import { HttpResponse } from "../../constants/response-message.constant";
import { createHttpError } from "../../utils";
import { HttpStatus } from "../../constants/status.constant";
import { generateFitnessPlan, generateWorkoutReport } from "../../utils/gemini1.utils";
import { IClientUserData } from "@/models/interface/IPersonalization";
import { IExercise, IWorkoutReport } from "@/models/interface/IWorkout";
// import { writeFile } from "fs";

export class ClientService implements IClientService {
  constructor(private readonly _clientRepository: IClientRepository) {}

  async generateFitnessPlan(userData: any) {
    try {
      // Validate required fields
      const requiredFields: (keyof IClientUserData)[] = [
        "nick_name",
        "age",
        "gender",
        "height",
        "current_weight",
        "target_weight",
        "fitness_goal",
        "current_fitness_level",
        "activity_level",
        "workout_days_perWeek",
        "diet_meals_perDay",
      ];

      for (const field of requiredFields) {
        if (!userData[field]) {
          throw createHttpError(
            HttpStatus.BAD_REQUEST,
            `Missing Required Field: ${field}`
          );
        }
      }
      console.log(userData);

      const workout = await generateFitnessPlan(userData, 1, "workout");
      const diet = await generateFitnessPlan(userData, 1, "diet");
      // console.log("Workout Plan:", JSON.stringify(workout));
      // console.log("Diet Plan:", diet);

      // const workout = {
      //   week1: {
      //     day1: {
      //       title: "Day 1 - Upper Body Strength",
      //       exercises: [
      //         {
      //           name: "Push-ups",
      //           sets: "3",
      //           reps: "8-12",
      //           rest: "60 seconds",
      //           instructions:
      //             "Maintain a straight line from head to heels, lower your chest towards the floor, and push back up.",
      //           animation_link: "https://www.youtube.com/watch?v=IODxDxX7oi0",
      //         },
      //         {
      //           name: "Incline Push-ups (hands on elevated surface)",
      //           sets: "3",
      //           reps: "8-12",
      //           rest: "60 seconds",
      //           instructions:
      //             "Similar to push-ups but with hands elevated on a stable surface, making it easier.",
      //           animation_link: "https://www.youtube.com/watch?v=t-B7hG9i-v8",
      //         },
      //         {
      //           name: "Diamond Push-ups",
      //           sets: "3",
      //           reps: "As many as possible (AMRAP)",
      //           rest: "60 seconds",
      //           instructions:
      //             "Hands formed into a diamond shape under your chest.  Focus on tricep engagement.",
      //           animation_link: "https://www.youtube.com/watch?v=a75dK0-2o_k",
      //         },
      //         {
      //           name: "Pike Push-ups",
      //           sets: "3",
      //           reps: "8-12",
      //           rest: "60 seconds",
      //           instructions:
      //             "Form an inverted V-shape with your body, hands shoulder-width apart, and lower your head towards the floor.",
      //           animation_link: "https://www.youtube.com/watch?v=A1Zf9-x-U6Q",
      //         },
      //         {
      //           name: "Wall Slides",
      //           sets: "3",
      //           reps: "10-15",
      //           rest: "60 seconds",
      //           instructions:
      //             "Stand with your back against a wall, slowly slide down until your knees are bent at 90 degrees, then slide back up.",
      //           animation_link: "https://www.youtube.com/watch?v=1l0-8g4gG8E",
      //         },
      //         {
      //           name: "Plank",
      //           sets: "3",
      //           reps: "30-60 seconds",
      //           rest: "60 seconds",
      //           instructions:
      //             "Maintain a straight line from head to heels, engaging your core.",
      //           animation_link: "https://www.youtube.com/watch?v=ASdvD-a-Y_4",
      //         },
      //         {
      //           name: "Side Plank (each side)",
      //           sets: "3",
      //           reps: "30-60 seconds per side",
      //           rest: "60 seconds",
      //           instructions:
      //             "Lie on your side, prop yourself up on your forearm, and maintain a straight line from head to feet.",
      //           animation_link: "https://www.youtube.com/watch?v=0_j01b2472A",
      //         },
      //         {
      //           name: "Superman",
      //           sets: "3",
      //           reps: "10-15",
      //           rest: "60 seconds",
      //           instructions:
      //             "Lie on your stomach, lift your arms and legs off the ground simultaneously, engaging your back muscles.",
      //           animation_link: "https://www.youtube.com/watch?v=1x_F8-W9t50",
      //         },
      //         {
      //           name: "Glute Bridges",
      //           sets: "3",
      //           reps: "15-20",
      //           rest: "60 seconds",
      //           instructions:
      //             "Lie on your back with knees bent, lift your hips off the ground, squeezing your glutes at the top.",
      //           animation_link: "https://www.youtube.com/watch?v=9-79R_rDq0I",
      //         },
      //         {
      //           name: "Bird-Dog",
      //           sets: "3",
      //           reps: "10-12 per side",
      //           rest: "60 seconds",
      //           instructions:
      //             "Start on your hands and knees, extend one arm and the opposite leg, maintaining balance.",
      //           animation_link: "https://www.youtube.com/watch?v=O5tL6s_r0q8",
      //         },
      //         {
      //           name: "Inchworm",
      //           sets: "3",
      //           reps: "10-15",
      //           rest: "60 seconds",
      //           instructions:
      //             "Start standing, bend down to touch your toes, walk your hands forward to a plank position, then walk your feet up to your hands.",
      //           animation_link: "https://www.youtube.com/watch?v=oL8v6p_eL6I",
      //         },
      //       ],
      //     },
      //     day2: {
      //       title: "Day 2 - Lower Body Strength and Core",
      //       exercises: [
      //         {
      //           name: "Squats",
      //           sets: "3",
      //           reps: "10-15",
      //           rest: "60 seconds",
      //           instructions:
      //             "Stand with feet shoulder-width apart, lower your hips as if sitting in a chair, keeping your back straight.",
      //           animation_link: "https://www.youtube.com/watch?v=aclKFyZ7Z7g",
      //         },
      //         {
      //           name: "Lunges (alternating legs)",
      //           sets: "3",
      //           reps: "10-12 per leg",
      //           rest: "60 seconds",
      //           instructions:
      //             "Step forward with one leg, bending both knees to 90 degrees, ensuring your front knee doesn't go past your toes.",
      //           animation_link: "https://www.youtube.com/watch?v=UXi6W7-C-w0",
      //         },
      //         {
      //           name: "Calf Raises",
      //           sets: "3",
      //           reps: "15-20",
      //           rest: "60 seconds",
      //           instructions:
      //             "Raise up onto your toes, engaging your calf muscles.",
      //           animation_link: "https://www.youtube.com/watch?v=Jq-gY7X0e8c",
      //         },
      //         {
      //           name: "Glute Bridges",
      //           sets: "3",
      //           reps: "15-20",
      //           rest: "60 seconds",
      //           instructions:
      //             "Lie on your back with knees bent, lift your hips off the ground, squeezing your glutes at the top.",
      //           animation_link: "https://www.youtube.com/watch?v=9-79R_rDq0I",
      //         },
      //         {
      //           name: "Hip Thrusts",
      //           sets: "3",
      //           reps: "12-15",
      //           rest: "60 seconds",
      //           instructions:
      //             "Sit on the floor with your back against a wall or bench, lift your hips off the ground, squeezing your glutes at the top.",
      //           animation_link: "https://www.youtube.com/watch?v=uCJ717_w-zQ",
      //         },
      //         {
      //           name: "Crunches",
      //           sets: "3",
      //           reps: "15-20",
      //           rest: "60 seconds",
      //           instructions:
      //             "Lie on your back with knees bent, lift your upper body off the ground, engaging your abdominal muscles.",
      //           animation_link: "https://www.youtube.com/watch?v=Xyd_fa5zoZU",
      //         },
      //         {
      //           name: "Bicycle Crunches",
      //           sets: "3",
      //           reps: "15-20 per side",
      //           rest: "60 seconds",
      //           instructions:
      //             "Lie on your back with knees bent, bring your opposite elbow and knee towards each other, alternating sides.",
      //           animation_link: "https://www.youtube.com/watch?v=Xyd_fa5zoZU",
      //         },
      //         {
      //           name: "Russian Twists",
      //           sets: "3",
      //           reps: "15-20 per side",
      //           rest: "60 seconds",
      //           instructions:
      //             "Sit with knees bent and feet lifted off the ground, twist your torso from side to side.",
      //           animation_link: "https://www.youtube.com/watch?v=s3o3_O-t55U",
      //         },
      //         {
      //           name: "Plank",
      //           sets: "3",
      //           reps: "30-60 seconds",
      //           rest: "60 seconds",
      //           instructions:
      //             "Maintain a straight line from head to heels, engaging your core.",
      //           animation_link: "https://www.youtube.com/watch?v=ASdvD-a-Y_4",
      //         },
      //         {
      //           name: "Leg Raises",
      //           sets: "3",
      //           reps: "15-20",
      //           rest: "60 seconds",
      //           instructions:
      //             "Lie on your back, lift your legs straight up towards the ceiling, lower them slowly without touching the ground.",
      //           animation_link: "https://www.youtube.com/watch?v=dAx7oJ6oK8I",
      //         },
      //       ],
      //     },
      //     day3: {
      //       title: "Day 3 - Rest",
      //       exercises: [],
      //     },
      //     day4: {
      //       title: "Day 4 - Full Body Circuit",
      //       exercises: [
      //         {
      //           name: "Burpees",
      //           sets: "3",
      //           reps: "10-12",
      //           rest: "60 seconds",
      //           instructions:
      //             "Squat down, kick your feet back into a plank position, do a push-up, return to plank, and jump up.",
      //           animation_link: "https://www.youtube.com/watch?v=dQJhz1e_A2I",
      //         },
      //         {
      //           name: "Mountain Climbers",
      //           sets: "3",
      //           reps: "30 seconds",
      //           rest: "60 seconds",
      //           instructions:
      //             "Start in a plank position, bring your knees towards your chest, alternating legs.",
      //           animation_link: "https://www.youtube.com/watch?v=dK38V2C9_9w",
      //         },
      //         {
      //           name: "Jumping Jacks",
      //           sets: "3",
      //           reps: "30 seconds",
      //           rest: "60 seconds",
      //           instructions:
      //             "Jump with legs spread wide and arms overhead, then bring legs and arms back together.",
      //           animation_link: "https://www.youtube.com/watch?v=c6P0-w-r5e0",
      //         },
      //         {
      //           name: "High Knees",
      //           sets: "3",
      //           reps: "30 seconds",
      //           rest: "60 seconds",
      //           instructions:
      //             "Run in place, bringing your knees up towards your chest.",
      //           animation_link: "https://www.youtube.com/watch?v=f0tO4gQ29rU",
      //         },
      //         {
      //           name: "Butt Kicks",
      //           sets: "3",
      //           reps: "30 seconds",
      //           rest: "60 seconds",
      //           instructions:
      //             "Run in place, kicking your heels up towards your glutes.",
      //           animation_link: "https://www.youtube.com/watch?v=aU6W7k1j_0I",
      //         },
      //         {
      //           name: "Push-ups",
      //           sets: "3",
      //           reps: "As many as possible (AMRAP)",
      //           rest: "60 seconds",
      //           instructions:
      //             "Maintain a straight line from head to heels, lower your chest towards the floor, and push back up.",
      //           animation_link: "https://www.youtube.com/watch?v=IODxDxX7oi0",
      //         },
      //         {
      //           name: "Squats",
      //           sets: "3",
      //           reps: "15-20",
      //           rest: "60 seconds",
      //           instructions:
      //             "Stand with feet shoulder-width apart, lower your hips as if sitting in a chair, keeping your back straight.",
      //           animation_link: "https://www.youtube.com/watch?v=aclKFyZ7Z7g",
      //         },
      //         {
      //           name: "Plank",
      //           sets: "3",
      //           reps: "45-60 seconds",
      //           rest: "60 seconds",
      //           instructions:
      //             "Maintain a straight line from head to heels, engaging your core.",
      //           animation_link: "https://www.youtube.com/watch?v=ASdvD-a-Y_4",
      //         },
      //         {
      //           name: "Superman",
      //           sets: "3",
      //           reps: "15-20",
      //           rest: "60 seconds",
      //           instructions:
      //             "Lie on your stomach, lift your arms and legs off the ground simultaneously, engaging your back muscles.",
      //           animation_link: "https://www.youtube.com/watch?v=1x_F8-W9t50",
      //         },
      //         {
      //           name: "Walking Lunges",
      //           sets: "3",
      //           reps: "10-12 per leg",
      //           rest: "60 seconds",
      //           instructions:
      //             "Step forward with one leg, bending both knees to 90 degrees, ensuring your front knee doesn't go past your toes.  Alternate legs with each step.",
      //           animation_link: "https://www.youtube.com/watch?v=UXi6W7-C-w0",
      //         },
      //       ],
      //     },
      //     day5: {
      //       title: "Day 5 - Rest",
      //       exercises: [],
      //     },
      //     day6: {
      //       title: "Day 6 - Rest",
      //       exercises: [],
      //     },
      //     day7: {
      //       title: "Day 7 - Rest",
      //       exercises: [],
      //     },
      //   },
      //   notes:
      //     "This week 1 plan focuses on building a foundation of strength and endurance using only bodyweight exercises.  The workouts are designed to be challenging but manageable for an intermediate fitness level.  Rest days are crucial for muscle recovery and growth.  Focus on proper form to prevent injuries.  Listen to your body and modify exercises as needed.  Remember to stay hydrated and fuel your body properly to support your muscle-building goals. This plan prioritizes compound movements to maximize calorie burn and muscle engagement, while also incorporating core work for stability and overall fitness.",
      // };

      // const diet = {
      //   dietPlan: {
      //     mealPlan: {
      //       breakfast: {
      //         options: [
      //           {
      //             name: "High-Protein Oatmeal with Berries",
      //             ingredients: [
      //               "1/2 cup rolled oats",
      //               "1 scoop vegan protein powder (soy or pea based)",
      //               "1 cup unsweetened almond milk",
      //               "1/2 cup mixed berries",
      //               "1 tbsp chia seeds",
      //             ],
      //             instructions:
      //               "Combine oats, protein powder, and almond milk in a pot. Cook over medium heat, stirring frequently, until oats are cooked through. Top with berries and chia seeds.",
      //             video_link:
      //               "https://www.youtube.com/results?search_query=high+protein+oatmeal+recipe",
      //           },
      //         ],
      //       },
      //       mid_morning_snack: {
      //         options: [
      //           {
      //             name: "Greek Yogurt with Fruit",
      //             ingredients: [
      //               "1 cup non-fat Greek yogurt (dairy or plant-based)",
      //               "1/4 cup sliced banana",
      //               "1/4 cup chopped kiwi",
      //             ],
      //             instructions:
      //               "Combine Greek yogurt and fruit in a bowl. Enjoy!",
      //             video_link: "No video available",
      //           },
      //         ],
      //       },
      //       lunch: {
      //         options: [
      //           {
      //             name: "Quinoa Salad with Black Beans and Corn",
      //             ingredients: [
      //               "1 cup cooked quinoa",
      //               "1/2 cup black beans (canned, rinsed)",
      //               "1/2 cup corn (canned or frozen)",
      //               "1/2 cup chopped bell pepper",
      //               "1/4 cup chopped red onion",
      //               "2 tbsp olive oil",
      //               "1 tbsp lime juice",
      //               "Salt and pepper to taste",
      //             ],
      //             instructions:
      //               "Combine all ingredients in a bowl and mix well.  Refrigerate for at least 30 minutes to allow flavors to blend.",
      //             video_link:
      //               "https://www.youtube.com/results?search_query=quinoa+salad+recipe+vegetarian",
      //           },
      //         ],
      //       },
      //       afternoon_snack: {
      //         options: [
      //           {
      //             name: "Edamame",
      //             ingredients: ["1 cup shelled edamame (steamed or boiled)"],
      //             instructions:
      //               "Steam or boil edamame until tender. Season with salt if desired.",
      //             video_link:
      //               "https://www.youtube.com/results?search_query=how+to+cook+edamame",
      //           },
      //         ],
      //       },
      //       dinner: {
      //         options: [
      //           {
      //             name: "Lentil Soup",
      //             ingredients: [
      //               "1 cup brown or green lentils",
      //               "4 cups vegetable broth",
      //               "1 cup chopped carrots",
      //               "1 cup chopped celery",
      //               "1/2 cup chopped onion",
      //               "2 cloves garlic (minced)",
      //               "1 tsp dried oregano",
      //               "Salt and pepper to taste",
      //             ],
      //             instructions:
      //               "Sauté onion, carrots, and celery in a pot until softened. Add garlic and oregano and cook for 1 minute.  Add lentils and vegetable broth. Bring to a boil, then reduce heat and simmer for 30-40 minutes, or until lentils are tender.",
      //             video_link:
      //               "https://www.youtube.com/results?search_query=vegetarian+lentil+soup+recipe",
      //           },
      //         ],
      //       },
      //       evening_snack: {
      //         options: [
      //           {
      //             name: "Cottage Cheese with Pineapple",
      //             ingredients: [
      //               "1 cup low-fat cottage cheese",
      //               "1/2 cup chopped pineapple",
      //             ],
      //             instructions:
      //               "Combine cottage cheese and pineapple in a bowl. Enjoy!",
      //             video_link: "No video available",
      //           },
      //         ],
      //       },
      //     },
      //     notes:
      //       "This diet plan focuses on vegetarian protein sources to support muscle growth, avoiding nuts and gluten as requested.  The plan includes 6 meals to maintain energy levels throughout the day and support a calorie surplus for weight gain.  Remember to adjust portion sizes based on your individual caloric needs and activity levels. Regular exercise is crucial for muscle building.  Consult a healthcare professional or registered dietitian for personalized advice.",
      //   },
      // };

      await this._clientRepository.SaveWorkoutsDietsPersonalization(
        userData,
        workout,
        diet.dietPlan
      );

      return HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL;
    } catch (error) {
      console.error("API Error:", error);
      //   res.status(500).json({ error: "Failed to generate fitness plan" });
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_GENERATE_FITNESS_PLAN
      );
    }
  }

  // workouts services

  getBasicFitnessPlan = async (userId: string) => {
    try {
      const basicPlan =
        await this._clientRepository.getBasicFitnessPlan(userId);
      return basicPlan;
    } catch (error) {
      console.error("Error fetching basic fitness plan:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_BASIC_FITNESS_PLAN
      );
    }
  };

  getWorkouts = async (userId: string, week: string) => {
    try {
      const workouts = await this._clientRepository.getWorkouts(userId, week);
      return workouts;
    } catch (error) {
      console.error("Error fetching workouts:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WORKOUTS
      );
    }
  };

  getWeekCompletionStatus = async (userId: string) => {
    try {
      const weekCompletionStatus =
        await this._clientRepository.getWeekCompletionStatus(userId);
      return weekCompletionStatus;
    } catch (error) {
      console.error("Error fetching week completion status:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WORKOUTS
      );
    }
  };

  updateDayCompletionStatus = async (
    userId: string,
    week: string,
    day: string,
    workout: IExercise[]
  ) => {
    try {
      let workoutReport;
      if (workout.length === 0) {
        workoutReport = {
          caloriesBurned: 0,
          duration: 0,
          feedback: "Well done prioritizing recovery! Rest days help your muscles rebuild and prepare for stronger workouts ahead.",
          intensity: "low",
          estimatedDuration: "0 minutes",
          totalExercises: 0,
          totalSets: 0
        } as IWorkoutReport;
      } else {
        // const workoutReport = await generateWorkoutReport(workout);
        workoutReport = {
          caloriesBurned: 500, // Example value
          duration: 60, // Example value in minutes
          feedback: "Great job! Keep it up!", // Example feedback
          intensity: "low",
          estimatedDuration: "60 minutes",
          totalExercises: 5,
          totalSets: 15,
        } as IWorkoutReport;
      }
      const updateDay = await this._clientRepository.updateDayCompletion(
        userId,
        workoutReport,
        week,
        day
      );
      if (!updateDay) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.WORKOUT_NOT_FOUND
        );
      }
      return workoutReport;
    } catch (error) {
      console.error("Error updating day completion status:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WORKOUTS
      );
    }
  };

  getWorkoutReport = async (userId: string, week: string, day: string) => {
    try {
      const workoutReport = await this._clientRepository.getWorkoutReport(
        userId,
        week,
        day
      );
      return workoutReport;
    } catch (error) {
      console.error("Error fetching workout report:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WORKOUT_REPORT
      );
    }
  };

  async getWeeklyChallenges(){
    try {
      const challenges = await this._clientRepository.getWeeklyChallenges();
      return challenges;
    } catch (error) {
      console.error("Error fetching weekly challenges:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WEEKLY_CHALLENGES
      );
    }
  }

  async getChallengeById(userId: string, challengeId: string) {
    try {
      const challenge = await this._clientRepository.getChallengeById(challengeId);
      if (!challenge) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.WORKOUT_NOT_FOUND
        );
      }
      console.log('challenge', challenge);

      const userWeeklyChallenge = await this._clientRepository.getUserWeeklyChallenge(userId, challengeId);

      console.log('userWeeklyChallenge', userWeeklyChallenge);
      return { challenge, userWeeklyChallenge };
    } catch (error) {
      console.error("Error fetching challenge by ID:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WEEKLY_CHALLENGES
      );
    }
  }

  async joinWeeklyChallenge(id: string, userId: string) {
    try {
      const challenge = await this._clientRepository.joinWeeklyChallenge(id, userId);
      if (!challenge) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.WORKOUT_NOT_FOUND
        );
      }
      return challenge;
    } catch (error) {
      console.error("Error joining weekly challenge:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WEEKLY_CHALLENGES
      );
    }
  }

  async updateDayCompletionOfWeeklyChallengeStatus(
    userId: string,
    challengeId: string,
    dayIndex: number,
  ) {
    console.log('userId:', userId);
    console.log('challengeId:', challengeId); 
    console.log('dayIndex:', dayIndex);
    try {
      const workoutReport = {caloriesBurned: 500, // Example value
          duration: 60, // Example value in minutes
          feedback: "Great job! Keep it up!", // Example feedback
          intensity: "low",
          estimatedDuration: "60 minutes",
          totalExercises: 5,
          totalSets: 15,
        } as IWorkoutReport;
      const updatedChallenge = await this._clientRepository.updateDayCompletionOfWeeklyChallengeStatus(
        userId,
        dayIndex,
        challengeId,
        workoutReport
      );
      if (!updatedChallenge) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.WORKOUT_NOT_FOUND
        );
      }
      return updatedChallenge;
    } catch (error) {
      console.error("Error updating day completion of weekly challenge status:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WEEKLY_CHALLENGES
      );
    }
  }
}
