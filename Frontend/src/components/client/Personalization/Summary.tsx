"use client";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { current } from "@reduxjs/toolkit";
import { ClientService } from "@/services/implementation/clientServices";
import { useDispatch, useSelector } from "react-redux";
import {setUserPersonalization} from "@/store/slices/authSlice"
import { RootState } from "@/store/store";

export default function Summary() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryData, setSummaryData] = useState({
    basicInfo: {
      name: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      targetWeight: "",
    },
    fitnessGoal: { goal: "" },
    fitnessLevel: "",
    activityLevel: "",
    workoutPreferences: { equipment: [], duration: "", daysPerWeek: "" },
    healthInfo: { injuries: [], conditions: "" },
    dietPreferences: { allergies: [], dietaryPreferences: [], mealsPerDay: "" },
  });

  const { user } = useSelector((state:RootState)=>state.auth)
  const dispath = useDispatch();

  // Load data from localStorage
  useEffect(() => {
    try {
      const basicInfo = JSON.parse(
        localStorage.getItem("userBasicInfo") || "{}"
      );
      const fitnessGoal = JSON.parse(
        localStorage.getItem("fitnessGoal") || "{}"
      );
      const fitnessLevel = localStorage.getItem("fitnessLevel") || "";
      const activityLevel = localStorage.getItem("activityLevel") || "";
      const workoutPreferences = JSON.parse(
        localStorage.getItem("workoutPreferences") || "{}"
      );
      const healthInfo = JSON.parse(localStorage.getItem("healthInfo") || "{}");
      const dietPreferences = JSON.parse(
        localStorage.getItem("dietPreferences") || "{}"
      );

      setSummaryData({
        basicInfo: {
          name: basicInfo.nick_name || "Not provided",
          age: basicInfo.age || "Not provided",
          gender: basicInfo.gender || "Not Provided",
          height: basicInfo.height || "--",
          weight: basicInfo.weight || "--",
          targetWeight: basicInfo.targetWeight || "--",
        },
        fitnessGoal: { goal: fitnessGoal.goal || "Not selected" },
        fitnessLevel: fitnessLevel || "Not selected",
        activityLevel: activityLevel || "Not selected",
        workoutPreferences: {
          equipment: workoutPreferences.equipment || [],
          duration: workoutPreferences.duration || "Not selected",
          daysPerWeek: workoutPreferences.daysPerWeek || "Not selected",
        },
        healthInfo: {
          injuries: healthInfo.injuries || [],
          conditions: healthInfo.conditions || "None reported",
        },
        dietPreferences: {
          allergies: dietPreferences.allergies || [],
          dietaryPreferences: dietPreferences.dietaryPreferences || [],
          mealsPerDay: dietPreferences.mealsPerDay || "Not selected",
        },
      });
    } catch (error) {
      console.error("Error loading summary data:", error);
      toast.error("Failed to load summary data");
    }
  }, []);

  const handleBack = () => {
    navigate("/personalization?path=diet-preferences");
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const data = {
        userId: user?._id,
        nick_name: summaryData.basicInfo.name,
        age: summaryData.basicInfo.age,
        gender: summaryData.basicInfo.gender,
        height: summaryData.basicInfo.height,
        current_weight: summaryData.basicInfo.weight,
        target_weight: summaryData.basicInfo.targetWeight,
        fitness_goal: summaryData.fitnessGoal.goal,
        current_fitness_level: summaryData.fitnessLevel,
        activity_level: summaryData.activityLevel,
        equipments: summaryData.workoutPreferences.equipment,
        workout_duration: summaryData.workoutPreferences.duration,
        workout_days_perWeek: summaryData.workoutPreferences.daysPerWeek,
        health_issues: summaryData.healthInfo.injuries,
        medical_condition: summaryData.healthInfo.conditions,
        diet_allergies: summaryData.dietPreferences.allergies,
        diet_meals_perDay: summaryData.dietPreferences.mealsPerDay,
        diet_preferences: summaryData.dietPreferences.dietaryPreferences,
      };
      console.log('entered to here for generate fintess plan')
      const response = await ClientService.generateFitnessPlan(data);
      toast.success(response.data.message);
      dispath(setUserPersonalization({_id:'done'}));
      // localStorage.removeItem()
      // localStorage.setItem("workoutPlanGenerated", "true");
      // toast.success("Workout plan generated successfully!");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast.error(errorMessage);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm text-gray-400">
            <span>Step 8 of 8</span>
            <span>100%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Review Your Plan
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Everything looks good? Let's generate your personalized workout
              </p>
            </div>

            <div className="border-2 border-gray-700 rounded-xl p-6 bg-gray-800/50">
              <div className="mb-6 pb-6 border-b border-gray-700 last:mb-0 last:pb-0 last:border-b-0">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Personal Info
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">Name:</strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.basicInfo.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">Age:</strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.basicInfo.age}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Gender:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.basicInfo.gender}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Height/Weight:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.basicInfo.height}cm /{" "}
                      {summaryData.basicInfo.weight}kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Target Weight:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.basicInfo.targetWeight}kg
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-700 last:mb-0 last:pb-0 last:border-b-0">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 8H4V16H6M20 8H18V16H20M14 6H10V8H14V6ZM14 16H10V18H14V16ZM6 12H18V14H6V12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Fitness Goals
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Primary Goal:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.fitnessGoal.goal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Fitness Level:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.fitnessLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Activity Level:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.activityLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-700 last:mb-0 last:pb-0 last:border-b-0">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 12H15M12 16H15M9 8H15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Workout Preferences
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Equipment:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.workoutPreferences.equipment.length > 0
                        ? summaryData.workoutPreferences.equipment.join(", ")
                        : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Duration:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.workoutPreferences.duration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Days/Week:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.workoutPreferences.daysPerWeek}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-700 last:mb-0 last:pb-0 last:border-b-0">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 14C19 15.1046 18.1046 16 17 16H15.3431C14.404 16 13.5 16.3125 12.7574 16.8881L11.4142 18H7C5.89543 18 5 17.1046 5 16V8C5 6.89543 5.89543 6 7 6H17C18.1046 6 19 6.89543 19 8V14Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Health Info
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Injuries:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.healthInfo.injuries.length > 0
                        ? summaryData.healthInfo.injuries.join(", ")
                        : "None reported"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Conditions:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.healthInfo.conditions}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-700 last:mb-0 last:pb-0 last:border-b-0">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M6 22V12H18V22H6Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Diet Preferences
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Allergies:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.dietPreferences.allergies.length > 0
                        ? summaryData.dietPreferences.allergies.join(", ")
                        : "None reported"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Dietary Preferences:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.dietPreferences.dietaryPreferences.length > 0
                        ? summaryData.dietPreferences.dietaryPreferences.join(
                            ", "
                          )
                        : "None reported"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-gray-400 font-medium">
                      Meals Per Day:
                    </strong>
                    <span className="text-white font-semibold text-right">
                      {summaryData.dietPreferences.mealsPerDay}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-700/50 border-gray-600 hover:bg-gray-600 text-white hover:text-indigo-200 transition-all"
                onClick={handleBack}
                disabled={isGenerating}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button
                type="button"
                className={cn(
                  "flex-1 ml-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500",
                  "text-white font-medium shadow-md hover:shadow-lg transition-all duration-300",
                  "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800",
                  "flex items-center justify-center"
                )}
                onClick={handleGeneratePlan}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating your perfect workout plan...
                  </>
                ) : (
                  <>
                    Generate Plan
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {isGenerating && (
              <div className="text-center mt-4 text-gray-400">
                <div className="w-6 h-6 border-2 border-gray-700 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2"></div>
                <p>Creating your perfect workout plan...</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
