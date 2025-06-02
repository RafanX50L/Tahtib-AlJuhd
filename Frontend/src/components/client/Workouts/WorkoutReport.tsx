import type { WorkoutReport } from "@/pages/client/CWorkoutSession";
import { ClientService } from "@/services/implementation/clientServices";
import { response } from "express";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const WorkoutReport = () => {
  const [workoutReport, setWorkoutReport] = useState<WorkoutReport | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const week = queryParams.get("week") ?? "";
  const day = queryParams.get("day") ?? "";

  useEffect(() => {
    console.log("data", week, day);
    const fetchReport = async () => {
      try {
        const response = await ClientService.getWorkoutReport(week, day);
        console.log(`Google Login Successfull with status ${response}`);
        setWorkoutReport(response.data);
      } catch (error: unknown) {
        console.log(error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading Report...</p>
        </div>
      </div>
    );
  }

  if (!workoutReport) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl text-blue-500 mb-6">
          <i className="fas fa-file-alt"></i>
        </div>
        <h2 className="text-3xl font-semibold text-white mb-4">
          Workout Report
        </h2>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-gray-400">Exercises</div>
              <div className="text-xl font-bold text-white">
                {workoutReport.totalExercises}
              </div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-gray-400">Total Sets</div>
              <div className="text-xl font-bold text-white">
                {workoutReport.totalSets}
              </div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-gray-400">Duration</div>
              <div className="text-xl font-bold text-white">
                {workoutReport.estimatedDuration}
              </div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-gray-400">Calories</div>
              <div className="text-xl font-bold text-green-400">
                {workoutReport.caloriesBurned}
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-400 mb-2">Intensity Level</div>
            <div className="text-lg font-semibold text-blue-400">
              {workoutReport.intensity}
            </div>
          </div>

          {workoutReport.feedback && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 mb-2">Feedback</div>
              <div className="text-sm text-gray-300">
                {workoutReport.feedback}
              </div>
            </div>
          )}
        </div>
        <button
          onClickCapture={() => navigate("/workouts")}
          className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-4 rounded-xl text-xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl inline-block"
        >
          Back to Workout Plan
        </button>
      </div>
    </div>
  );
};

export default WorkoutReport;
