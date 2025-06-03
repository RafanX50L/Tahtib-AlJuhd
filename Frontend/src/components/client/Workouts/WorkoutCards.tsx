

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Lock, Play, Eye, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Exercise {
  name: string
  sets?: number
  reps?: number
  duration?: string
}

interface WorkoutData {
  title: string
  completed: boolean
  exercises: Exercise[]
}

interface WorkoutCardProps {
  workouts: Record<string, WorkoutData> | null
  weekStatus: boolean | null
  currentWeek: string
}

export default function WorkoutCards({ workouts, weekStatus, currentWeek }: WorkoutCardProps) {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleActionClick = (day: string, action: string, workout: Exercise[]) => {
    if (action === "view") {
      navigate(`/workout-report?week=${currentWeek}&day=${day}`)
    } else if (action !== "locked") {
      if (isClient) {
        localStorage.setItem(
          "Current_Workout_Exercises",
          JSON.stringify({ exercises: workout, day, week: currentWeek }),
        )
        navigate("/workoutSession")
      }
    }
  }

  // Return early if workouts is null
  if (!workouts) {
    return (
      <div className="flex justify-center items-center p-8 rounded-lg bg-gradient-to-br from-[rgba(30,34,53,0.9)] to-[rgba(18,21,30,0.8)] border border-gray-700 text-white">
        <p className="text-lg font-medium">Please complete the previous week first</p>
      </div>
    )
  }

  // Transform workouts into an array and determine accessibility
  const workoutDays = Object.entries(workouts)
    .filter(([key]) => key.startsWith("day"))
    .map(([key, value], index, array) => {
      let action: "start" | "view" | "locked" = "locked"
      let status: "locked" | "completed" | "pending" = "locked"

      if (weekStatus) {
        // First workout is accessible if week is active
        if (index === 0) {
          action = value.completed ? "view" : "start"
          status = value.completed ? "completed" : "pending"
        }
        // Subsequent workouts are accessible only if previous is completed
        else if (array[index - 1][1].completed) {
          action = value.completed ? "view" : "start"
          status = value.completed ? "completed" : "pending"
        }
      }

      return {
        day: key,
        title: value.title,
        status,
        exercises: value.exercises,
        action,
      }
    })

  // Find the index of the first pending workout for the "Start Next Workout" button
  const nextWorkoutIndex = workoutDays.findIndex(
    (workout) => workout.status === "pending" && workout.action === "start",
  )

  // Check if all workouts are completed
  const allWorkoutsCompleted = workoutDays.every((workout) => workout.status === "completed")

  const handleStartNextWorkout = () => {
    if (nextWorkoutIndex !== -1) {
      const nextWorkout = workoutDays[nextWorkoutIndex]
      handleActionClick(nextWorkout.day, nextWorkout.action, nextWorkout.exercises)
    }
  }

  return (
    <div className="space-y-8">
      {weekStatus && !allWorkoutsCompleted && nextWorkoutIndex !== -1 && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white py-3 px-8 rounded-lg text-base font-medium hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
            onClick={handleStartNextWorkout}
          >
            <Play className="w-4 h-4" />
            Start Next Workout
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {workoutDays.map((workout, index) => (
          <WorkoutCard
            key={index}
            day={workout.day}
            title={workout.title}
            status={workout.status}
            exercises={workout.exercises}
            action={workout.action}
            onActionClick={handleActionClick}
          />
        ))}
      </div>
    </div>
  )
}

interface SingleWorkoutCardProps {
  day: string
  title: string
  status: "locked" | "completed" | "pending"
  exercises: Exercise[]
  action: "start" | "view" | "locked"
  onActionClick: (day: string, action: string, exercises: Exercise[]) => void
}

function WorkoutCard({ day, title, status, exercises, action, onActionClick }: SingleWorkoutCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative bg-gradient-to-br from-[rgba(30,34,53,0.9)] to-[rgba(18,21,30,0.8)] border ${
        status === "locked"
          ? "border-gray-700 opacity-60"
          : status === "completed"
            ? "border-green-500/30"
            : "border-[#5D5FEF]/30"
      } rounded-xl p-5 transition-all duration-300 ${
        status === "locked"
          ? "cursor-not-allowed"
          : "hover:-translate-y-1 hover:border-[#5D5FEF] hover:shadow-[0_8px_30px_rgb(93,95,239,0.2)]"
      }`}
    >
      {/* Status Indicator */}
      {status !== "locked" && (
        <div
          className={`absolute top-0 left-0 w-1.5 h-full ${
            status === "completed"
              ? "bg-gradient-to-b from-green-500 to-green-500/30"
              : "bg-gradient-to-b from-[#5D5FEF] to-[#5D5FEF]/30"
          } rounded-l-xl`}
        />
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-lg text-white">{title}</h2>
        </div>

        {status !== "locked" && (
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 ${
              status === "completed"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
            }`}
          >
            {status === "completed" ? <CheckCircle className="w-3 h-3" /> : null}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>

      {/* Exercise or Rest Day Section */}
      <div className="max-h-48 overflow-y-auto mb-4 pr-1 custom-scrollbar">
        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(93, 95, 239, 0.5);
              border-radius: 10px;
            }
          `}
        </style>

        {exercises.length === 0 ? (
          <div className="flex justify-center items-center h-24 text-gray-400 text-sm font-medium">Rest Day</div>
        ) : (
          <div className="flex flex-col space-y-2">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-800/30 p-3 rounded-md border border-gray-600/50 hover:border-indigo-400/50 transition-all duration-200"
              >
                <span className="text-sm font-medium text-gray-200 w-2/3 truncate">{exercise.name}</span>
                <div className="text-sm text-gray-400 w-1/3 text-right">
                  {exercise.sets && exercise.reps && (
                    <div className="flex justify-end items-center space-x-2">
                      <span className="text-indigo-400 font-semibold">
                        {exercise.reps}×{exercise.sets}
                      </span>
                      <span className="text-gray-500">Sets</span>
                    </div>
                  )}
                  {exercise.duration && (
                    <div className="flex justify-end items-center space-x-2 mt-1">
                      <span className="text-indigo-400 font-semibold">{exercise.duration}</span>
                      <span className="text-gray-500">Duration</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="sticky bottom-0 bg-gradient-to-br from-[rgba(30,34,53,0.9)] to-[rgba(18,21,30,0.8)] pt-2">
        <button
          disabled={action === "locked"}
          className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            action === "start"
              ? "bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white hover:-translate-y-1 hover:shadow-lg"
              : action === "view"
                ? "bg-transparent border border-[#5D5FEF] text-[#5D5FEF] hover:bg-[#5D5FEF]/10"
                : "bg-transparent border border-gray-600 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => onActionClick(day, action, exercises)}
          aria-label={action === "start" ? "Start Workout" : action === "view" ? "View Results" : "Locked"}
        >
          {action === "start" ? (
            <>
              <Play className="w-4 h-4" />
              Start Workout
            </>
          ) : action === "view" ? (
            <>
              <Eye className="w-4 h-4" />
              View Results
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Locked
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
