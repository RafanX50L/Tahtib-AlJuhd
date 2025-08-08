// Summary.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUserPersonalization } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { ClientService, IClientUserData } from "@/services/implementation/clientServices";

export default function Summary() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryData, setSummaryData] = useState({
    basicInfo: {
      nickName: "",
      age: "",
      gender: "",
      address: "",
      phoneNumber: "",
      height: "",
      currentWeight: "",
      targetWeight: "",
    },
    fitnessGoal: { goal: "" },
    currentFitnessLevel: "",
    activityLevel: "",
    workoutPreferences: { equipment: [], workoutDuration: "", workoutDaysPerWeek: "" },
    healthInfo: { healthIssues: [], medicalCondition: "" },
    dietPreferences: { dietAllergies: [], dietPreferences: "", dietMealsPerDay: "" },
  });

  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const basicInfo = JSON.parse(localStorage.getItem("userBasicInfo") || "{}");
      const fitnessGoal = JSON.parse(localStorage.getItem("fitnessGoal") || "{}");
      const currentFitnessLevel = localStorage.getItem("currentFitnessLevel") || "";
      const activityLevel = localStorage.getItem("activityLevel") || "";
      const workoutPreferences = JSON.parse(localStorage.getItem("workoutPreferences") || "{}");
      const healthInfo = JSON.parse(localStorage.getItem("healthInfo") || "{}");
      const dietPreferences = JSON.parse(localStorage.getItem("dietPreferences") || "{}");

      setSummaryData({
        basicInfo: {
          nickName: basicInfo.nickName || "Not provided",
          age: basicInfo.age || "Not provided",
          gender: basicInfo.gender || "Not provided",
          address: basicInfo.address || "Not provided",
          phoneNumber: basicInfo.phoneNumber || "Not provided",
          height: basicInfo.height || "--",
          currentWeight: basicInfo.currentWeight || "--",
          targetWeight: basicInfo.targetWeight || "--",
        },
        fitnessGoal: { goal: fitnessGoal.goal || "Not selected" },
        currentFitnessLevel: currentFitnessLevel || "Not selected",
        activityLevel: activityLevel || "Not selected",
        workoutPreferences: {
          equipment: workoutPreferences.equipment || [],
          workoutDuration: workoutPreferences.workoutDuration || "Not selected",
          workoutDaysPerWeek: workoutPreferences.workoutDaysPerWeek || "Not selected",
        },
        healthInfo: {
          healthIssues: healthInfo.healthIssues || [],
          medicalCondition: healthInfo.medicalCondition || "None reported",
        },
        dietPreferences: {
          dietAllergies: dietPreferences.dietAllergies || [],
          dietPreferences: dietPreferences.dietPreferences || "None reported",
          dietMealsPerDay: dietPreferences.dietMealsPerDay || "Not selected",
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

  // const handleGeneratePlan = async () => {
  //   setIsGenerating(true);
  //   try {
  //     const data :IClientUserData = {
  //       nickName: summaryData.basicInfo.nickName,
  //       age: Number(summaryData.basicInfo.age) ,
  //       gender: summaryData.basicInfo.gender ,
  //       address: summaryData.basicInfo.address || undefined,
  //       phoneNumber: summaryData.basicInfo.phoneNumber || undefined,
  //       height: Number(summaryData.basicInfo.height) ,
  //       currentWeight: Number(summaryData.basicInfo.currentWeight) ,
  //       targetWeight: Number(summaryData.basicInfo.targetWeight),
  //       fitnessGoal: summaryData.fitnessGoal.goal || undefined,
  //       currentFitnessLevel: summaryData.currentFitnessLevel || undefined,
  //       activityLevel: summaryData.activityLevel || undefined,
  //       equipment: summaryData.workoutPreferences.equipment || [],
  //       workoutDuration: summaryData.workoutPreferences.workoutDuration ,
  //       workoutDaysPerWeek: Number(summaryData.workoutPreferences.workoutDaysPerWeek),
  //       healthIssues: summaryData.healthInfo.healthIssues || [],
  //       medicalCondition: summaryData.healthInfo.medicalCondition || undefined,
  //       dietAllergies: summaryData.dietPreferences.dietAllergies || [],
  //       dietPreferences: summaryData.dietPreferences.dietPreferences || undefined,
  //       dietMealsPerDay: summaryData.dietPreferences.dietMealsPerDay || undefined,
  //     };

  //     if (!user?._id) {
  //       throw new Error("User ID not found");
  //     }

  //     const response = await ClientService.generatePersonalization(data);
  //     dispatch(setUserPersonalization({_id:'done'}));
      
  //     localStorage.removeItem("userBasicInfo");
  //     localStorage.removeItem("fitnessGoal");
  //     localStorage.removeItem("currentFitnessLevel");
  //     localStorage.removeItem("activityLevel");
  //     localStorage.removeItem("workoutPreferences");
  //     localStorage.removeItem("healthInfo");
  //     localStorage.removeItem("dietPreferences");

  //     toast.success("Personalized plan generated successfully!");
  //     setTimeout(() => {
  //       navigate("/dashboard");
  //     }, 500);
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : "Failed to generate plan";
  //     toast.error(errorMessage);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  // Summary.tsx (updated handleGeneratePlan function)

const handleGeneratePlan = async () => {
  setIsGenerating(true);
  try {
    // Define valid enum values for type checking
    const validFitnessGoals = [
      "build muscle",
      "lose weight",
      "get stronger",
      "improve endurance",
      "tone body",
      "increase flexibility",
    ] as const;
    const validFitnessLevels = ["beginner", "intermediate", "advanced", "athlete"] as const;
    const validActivityLevels = ["sedentary", "lightly active", "moderately active", "very active"] as const;
    const validMealsPerDay = ["3 meals", "3 meals + 1 snack", "3 meals + 2 snacks", "6 meals"] as const;

    // Validate and cast values
    const fitnessGoal = validFitnessGoals.includes(summaryData.fitnessGoal.goal as any)
      ? summaryData.fitnessGoal.goal as IClientUserData['fitnessGoal']
      : validFitnessGoals[0]; // Default to first valid value if invalid
    const currentFitnessLevel = validFitnessLevels.includes(summaryData.currentFitnessLevel as any)
      ? summaryData.currentFitnessLevel as IClientUserData['currentFitnessLevel']
      : validFitnessLevels[0]; // Default to first valid value if invalid
    const activityLevel = validActivityLevels.includes(summaryData.activityLevel as any)
      ? summaryData.activityLevel as IClientUserData['activityLevel']
      : validActivityLevels[0]; // Default to first valid value if invalid
    const dietMealsPerDay = validMealsPerDay.includes(summaryData.dietPreferences.dietMealsPerDay as any)
      ? [summaryData.dietPreferences.dietMealsPerDay] as IClientUserData['dietMealsPerDay']
      : []; // Default to empty array if invalid

    const data: Partial<IClientUserData> = {
      nickName: summaryData.basicInfo.nickName || "Unknown",
      age: Number(summaryData.basicInfo.age) ,
      gender: summaryData.basicInfo.gender ,
      address: summaryData.basicInfo.address || undefined,
      phoneNumber: summaryData.basicInfo.phoneNumber || undefined,
      height: Number(summaryData.basicInfo.height) ,
      currentWeight: Number(summaryData.basicInfo.currentWeight) ,
      targetWeight: Number(summaryData.basicInfo.targetWeight) ,
      fitnessGoal,
      currentFitnessLevel,
      activityLevel,
      equipment: summaryData.workoutPreferences.equipment || [],
      workoutDuration: summaryData.workoutPreferences.workoutDuration ,
      workoutDaysPerWeek: Number(summaryData.workoutPreferences.workoutDaysPerWeek) ,
      healthIssues: summaryData.healthInfo.healthIssues || [],
      medicalCondition: summaryData.healthInfo.medicalCondition || undefined,
      dietAllergies: summaryData.dietPreferences.dietAllergies || [],
      dietPreferences: summaryData.dietPreferences.dietPreferences || undefined,
      dietMealsPerDay,
    };

    if (!user?._id) {
      throw new Error("User ID not found");
    }

    const response = await ClientService.generatePersonalization(data);
    dispatch(setUserPersonalization({_id:'done'}));

    // Clear localStorage
    localStorage.removeItem("userBasicInfo");
    localStorage.removeItem("fitnessGoal");
    localStorage.removeItem("currentFitnessLevel");
    localStorage.removeItem("activityLevel");
    localStorage.removeItem("workoutPreferences");
    localStorage.removeItem("healthInfo");
    localStorage.removeItem("dietPreferences");

    toast.success("Personalized plan generated successfully!");
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate plan";
    toast.error(errorMessage);
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-gray-700">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Your Personalized Plan Summary
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Review your details below before generating your plan
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-700/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-indigo-400 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <p><span className="font-medium">Name:</span> {summaryData.basicInfo.nickName}</p>
                  <p><span className="font-medium">Age:</span> {summaryData.basicInfo.age}</p>
                  <p><span className="font-medium">Gender:</span> {summaryData.basicInfo.gender}</p>
                  <p><span className="font-medium">Address:</span> {summaryData.basicInfo.address}</p>
                  <p><span className="font-medium">Phone:</span> {summaryData.basicInfo.phoneNumber}</p>
                  <p><span className="font-medium">Height:</span> {summaryData.basicInfo.height} cm</p>
                  <p><span className="font-medium">Current Weight:</span> {summaryData.basicInfo.currentWeight} kg</p>
                  <p><span className="font-medium">Target Weight:</span> {summaryData.basicInfo.targetWeight} kg</p>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-indigo-400 mb-4">Fitness Goals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <p><span className="font-medium">Goal:</span> {summaryData.fitnessGoal.goal}</p>
                  <p><span className="font-medium">Fitness Level:</span> {summaryData.currentFitnessLevel}</p>
                  <p><span className="font-medium">Activity Level:</span> {summaryData.activityLevel}</p>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-indigo-400 mb-4">Workout Preferences</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <p>
                    <span className="font-medium">Equipment:</span>{" "}
                    {summaryData.workoutPreferences.equipment.length > 0
                      ? summaryData.workoutPreferences.equipment.join(", ")
                      : "None selected"}
                  </p>
                  <p><span className="font-medium">Duration:</span> {summaryData.workoutPreferences.workoutDuration}</p>
                  <p>
                    <span className="font-medium">Days/Week:</span>{" "}
                    {summaryData.workoutPreferences.workoutDaysPerWeek}
                  </p>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-indigo-400 mb-4">Health Considerations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <p>
                    <span className="font-medium">Health Issues:</span>{" "}
                    {summaryData.healthInfo.healthIssues.length > 0
                      ? summaryData.healthInfo.healthIssues.join(", ")
                      : "None"}
                  </p>
                  <p>
                    <span className="font-medium">Medical Conditions:</span>{" "}
                    {summaryData.healthInfo.medicalCondition}
                  </p>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-indigo-400 mb-4">Diet Preferences</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <p>
                    <span className="font-medium">Allergies:</span>{" "}
                    {summaryData.dietPreferences.dietAllergies.length > 0
                      ? summaryData.dietPreferences.dietAllergies.join(", ")
                      : "None"}
                  </p>
                  <p>
                    <span className="font-medium">Preferences:</span>{" "}
                    {summaryData.dietPreferences.dietPreferences}
                  </p>
                  <p>
                    <span className="font-medium">Meals/Day:</span>{" "}
                    {summaryData.dietPreferences.dietMealsPerDay}
                  </p>
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
                    Generating Plan...
                  </>
                ) : (
                  <>
                    Generate My Plan
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}