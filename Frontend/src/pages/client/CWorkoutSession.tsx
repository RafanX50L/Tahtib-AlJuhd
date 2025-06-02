"use client"

import { ClientService } from "@/services/implementation/clientServices"
import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"

export interface WorkoutReport {
  totalExercises: number
  totalSets: number
  estimatedDuration: string
  caloriesBurned: number
  intensity: string
  feedback: string
}

interface Exercise {
  name: string
  duration?: string
  reps?: string
  sets?: string
  rest?: string
  instructions?: string
  animation_link?: string
}

const WorkoutSession: React.FC = () => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [restTime, setRestTime] = useState(0)
  const [showRestScreen, setShowRestScreen] = useState(false)
  const [showCompletionScreen, setShowCompletionScreen] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [workout, setWorkout] = useState<Exercise[]>([])
  const [currentWeek, setCurrentWeek] = useState("")
  const [currentDay, setCurrentDay] = useState("")
  const [workoutReport, setWorkoutReport] = useState<WorkoutReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const restTimerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const instructionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navigate = useNavigate();

  // Load workout data from localStorage
  useEffect(() => {
    const loadWorkoutData = () => {
      try {
        const data = localStorage.getItem("Current_Workout_Exercises")
        console.log('data form localStorage',data)
        if (data) {
          const parsedData = JSON.parse(data)
          setCurrentDay(parsedData.day || "")
          setCurrentWeek(parsedData.week ? `${parsedData.week}` : "")
          setWorkout(parsedData.exercises || [])
        }
      } catch (error) {
        console.error("Error parsing workout data from localStorage:", error)
        setWorkout([])
      }
    }
    loadWorkoutData()
  }, [])

  // Load voices for speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      const selectedVoice =
        voices.find((voice) =>
          ["female", "Samantha", "Victoria", "Tessa", "Zira", "Google US English"].some((term) =>
            voice.name.toLowerCase().includes(term.toLowerCase()),
          ),
        ) || voices[0]
      setFemaleVoice(selectedVoice)
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  // Parse exercise metrics
  const parseExerciseMetrics = useCallback((exercise: Exercise | undefined) => {
    if (!exercise) {
      return { type: "reps" as const, value: 0, sets: 1, audio: "" }
    }
    if (exercise.duration) {
      const duration = Number.parseInt(exercise.duration) || 0
      return {
        type: "timed" as const,
        value: duration,
        audio: `Hold ${exercise.name || "exercise"} for ${duration} seconds`,
        sets: 1,
      }
    }
    const reps = Number.parseInt(exercise.reps?.split("-")[1] || exercise.reps?.split(" ")[0] || "0")
    const sets = Number.parseInt(exercise.sets || "1")
    return {
      type: "reps" as const,
      value: reps,
      sets,
      audio: `Do ${reps} reps of ${exercise.name || "exercise"}`,
    }
  }, [])

  // Load exercise
  const loadExercise = useCallback(
    (index: number) => {
      if (index >= workout.length || index < 0) return
      const exercise = workout[index]
      const metrics = parseExerciseMetrics(exercise)
      setCurrentTime(metrics.type === "timed" ? metrics.value : 0)
      setTotalDuration(metrics.type === "timed" ? metrics.value : 0)
      setElapsedTime(0)
      setRestTime(Number.parseInt(exercise?.rest?.split(" ")[0] || "0"))
      speakExercise(metrics.audio)
      if (metrics.type === "reps") {
        speakInstructionsWithDelay(exercise?.instructions || "")
      }
    },
    [workout, parseExerciseMetrics],
  )

  // Initialize workout
  useEffect(() => {
    if (workout.length > 0) {
      loadExercise(currentExerciseIndex)
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (restTimerIntervalRef.current) clearInterval(restTimerIntervalRef.current)
      if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
    }
  }, [currentExerciseIndex, workout, loadExercise])

  // Speak text
  const speakExercise = useCallback(
    (text: string) => {
      if (window.speechSynthesis && text) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        if (femaleVoice) utterance.voice = femaleVoice
        window.speechSynthesis.speak(utterance)
      }
    },
    [femaleVoice],
  )

  // Show status message
  const showStatusMessage = useCallback(
    (text: string) => {
      setStatusMessage(text)
      setTimeout(() => setStatusMessage(""), 2000)
      speakExercise(text)
    },
    [speakExercise],
  )

  // Speak instructions with delay
  const speakInstructionsWithDelay = useCallback(
    (instructions: string) => {
      if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
      instructionTimeoutRef.current = setTimeout(() => {
        if (!showRestScreen && instructions) {
          speakExercise(`Instructions: ${instructions}`)
        }
      }, 5000)
    },
    [showRestScreen, speakExercise],
  )

  // Start timer
  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    const exercise = workout[currentExerciseIndex]
    const metrics = parseExerciseMetrics(exercise)
    const timeLeft = currentTime

    timerIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev - 1
        setElapsedTime((prevElapsed) => prevElapsed + 1)
        if (newTime === Math.floor(metrics.value / 2)) {
          showStatusMessage("Halfway there! Keep going!")
        }
        if (newTime <= 0) {
          clearInterval(timerIntervalRef.current!)
          clearTimeout(instructionTimeoutRef.current!)
          showStatusMessage("Good job! Rest before next exercise.")
          showRestScreenHandler()
        }
        return newTime
      })
    }, 1000)
  }, [currentExerciseIndex, currentTime, workout, parseExerciseMetrics, showStatusMessage])

  // Start exercise
  const startExercise = useCallback(() => {
    if (workout.length === 0) return
    setIsPlaying(true)
    const exercise = workout[currentExerciseIndex]
    speakInstructionsWithDelay(exercise?.instructions || "")
    startTimer()
  }, [workout, currentExerciseIndex, speakInstructionsWithDelay, startTimer])

  // Stop exercise
  const stopExercise = useCallback(() => {
    setIsPlaying(false)
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
  }, [])

  // Complete exercise
  const completeExercise = useCallback(() => {
    if (workout.length === 0) return
    const exercise = workout[currentExerciseIndex]
    const metrics = parseExerciseMetrics(exercise)
    showStatusMessage(`Set ${currentSet} completed! Rest before next set.`)
    showRestScreenHandler()
  }, [workout, currentExerciseIndex, currentSet, parseExerciseMetrics, showStatusMessage])

  // Handle workout completion
  const handleWorkoutFinished = useCallback(async () => {
    try {
      setIsGeneratingReport(true)
      console.log("Starting workout completion process...")

      const response = await ClientService.updateDayCompletionAndGetWorkoutReport(workout, currentDay, currentWeek)

      console.log("Workout completion response:", response)

      if (response && response.data) {
        setWorkoutReport(response.data)
        console.log("Workout report set:", response.data)

        // Wait a bit to ensure state is updated before showing completion screen
        setTimeout(() => {
          setShowCompletionScreen(true)
          setIsGeneratingReport(false)
        }, 100)
      } else {
        console.error("No data in response:", response)
        setIsGeneratingReport(false)
        // Show completion screen even without report
        setShowCompletionScreen(true)
      }
    } catch (error) {
      console.error("Error updating workout completion:", error)
      setIsGeneratingReport(false)
      // Show completion screen even on error
      setShowCompletionScreen(true)
    }
  }, [workout, currentDay, currentWeek])

  // Show rest screen
  const showRestScreenHandler = useCallback(() => {
    if (workout.length === 0) return
    const exercise = workout[currentExerciseIndex]
    const metrics = parseExerciseMetrics(exercise)
    const restSeconds = Number.parseInt(exercise?.rest?.split(" ")[0] || "0")
    setRestTime(restSeconds)
    setShowRestScreen(true)
    setIsPlaying(false)
    if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)

    restTimerIntervalRef.current = setInterval(() => {
      setRestTime((prev) => {
        const newTime = prev - 1
        if (newTime <= 0) {
          clearInterval(restTimerIntervalRef.current!)
          if (metrics.type === "reps" && currentSet < metrics.sets) {
            setCurrentSet((prev) => prev + 1)
            loadExercise(currentExerciseIndex)
          } else {
            if (currentExerciseIndex < workout.length - 1) {
              setCurrentExerciseIndex((prev) => prev + 1)
              setCurrentSet(1)
            } else {
              // This is the last exercise - trigger workout completion
              handleWorkoutFinished()
            }
          }
          setShowRestScreen(false)
          return 0
        }
        return newTime
      })
    }, 1000)
  }, [workout, currentExerciseIndex, currentSet, parseExerciseMetrics, loadExercise, handleWorkoutFinished])

  // Skip rest
  const skipRest = useCallback(() => {
    if (restTimerIntervalRef.current) clearInterval(restTimerIntervalRef.current)
    if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
    if (workout.length === 0) return
    const exercise = workout[currentExerciseIndex]
    const metrics = parseExerciseMetrics(exercise)
    if (metrics.type === "reps" && currentSet < metrics.sets) {
      setCurrentSet((prev) => prev + 1)
      loadExercise(currentExerciseIndex)
    } else {
      if (currentExerciseIndex < workout.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1)
        setCurrentSet(1)
      } else {
        // This is the last exercise - trigger workout completion
        handleWorkoutFinished()
      }
    }
    setShowRestScreen(false)
  }, [workout, currentExerciseIndex, currentSet, parseExerciseMetrics, loadExercise, handleWorkoutFinished])

  // Previous exercise
  const prevExercise = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1)
      setCurrentSet(1)
      if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
    }
  }, [currentExerciseIndex])

  // Update progress indicator
  const updateProgressIndicator = useCallback(() => {
    return workout.length > 0 ? `${currentExerciseIndex + 1}/${workout.length}` : "0/0"
  }, [workout.length, currentExerciseIndex])

  // No workout data
  if (workout.length === 0) {
    return (
      <main className="bg-[#12151E] text-white min-h-screen font-sans flex items-center justify-center">
        <div className="max-w-3xl p-8 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">No workout data available</h2>
          <p className="text-gray-400 mb-6">Please select a workout plan to start.</p>
          <a
            href="workout-plan.html"
            className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-4 rounded-xl text-xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            Back to Workout Plan
          </a>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading Workout Data...</p>
        </div>
      </div>
    )
  }

  const exercise = workout[currentExerciseIndex]
  const metrics = parseExerciseMetrics(exercise)

  return (
    <main className="bg-[#12151E] text-white min-h-screen font-sans">
      <div className="max-w-3xl mx-auto p-8 flex flex-col animate-[fadeIn_0.6s_ease-out]">
        {/* Exercise Header */}
        <div className="text-center mb-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-lg relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400"></div>
          <div className="absolute top-2 right-2 bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-400">
            {updateProgressIndicator()}
          </div>
          <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            {exercise.name || "Unknown Exercise"}
          </h2>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              metrics.type === "timed"
                ? "bg-gradient-to-r from-blue-500 to-blue-400"
                : "bg-gradient-to-r from-green-500 to-green-400"
            }`}
          >
            {metrics.type === "timed" ? "Timed" : `Reps (Set ${currentSet}/${metrics.sets})`}
          </div>
          <p className="text-gray-400 text-sm mt-2">{exercise.instructions || "No instructions available"}</p>
        </div>

        {/* Progress Bar (for timed exercises) */}
        {metrics.type === "timed" && (
          <div className="w-full h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-100"
              style={{ width: `${(elapsedTime / totalDuration) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Exercise Display */}
        <div className="flex-1 flex flex-col items-center justify-center mb-4">
          <div className="w-80 h-80 bg-gray-800 rounded-full flex items-center justify-center border-4 border-blue-500 mb-6 overflow-hidden shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
            {exercise.animation_link !== 'No video available' ? (
              <img
                src={exercise.animation_link || "/placeholder.svg"}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No animation available</div>
            )}
          </div>

          {/* Timer/Reps Display */}
          <div className="text-center">
            {metrics.type === "timed" ? (
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                {currentTime}
              </div>
            ) : (
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent">
                {exercise.reps || "0"}
              </div>
            )}
            <div className="text-xl text-gray-400 min-h-8">
              {metrics.type === "timed" ? `Hold for ${metrics.value} seconds` : `Do ${exercise.reps || "0"} reps`}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between px-4">
          <button
            className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center shadow-lg transition-transform hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 hover:text-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={prevExercise}
            disabled={currentExerciseIndex === 0}
            aria-label="Previous Exercise"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          {metrics.type === "timed" ? (
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl text-white text-lg shadow-lg transition-transform hover:scale-105"
              onClick={isPlaying ? stopExercise : startExercise}
              aria-label={isPlaying ? "Stop Exercise" : "Start Exercise"}
            >
              {isPlaying ? "Stop" : "Start"}
            </button>
          ) : (
            <button
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-400 rounded-xl text-white text-lg shadow-lg transition-transform hover:scale-105"
              onClick={completeExercise}
              aria-label="Complete Exercise"
            >
              Completed
            </button>
          )}
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="fixed bottom-1/5 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-gray-800 to-gray-900 text-white px-8 py-4 rounded-xl text-xl shadow-lg opacity-100 transition-opacity">
            {statusMessage}
          </div>
        )}

        {/* Rest Screen */}
        {showRestScreen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50">
            <h2 className="text-3xl font-semibold text-white mb-4">Rest Time</h2>
            <div className="text-xl text-gray-400 mb-4">
              {metrics.sets && currentSet < metrics.sets
                ? `Set ${currentSet} of ${metrics.sets} completed for ${exercise.name || "exercise"}`
                : `Exercise ${currentExerciseIndex + 1} of ${workout.length} completed`}
            </div>
            <div className="text-6xl font-bold text-blue-500 mb-4">{restTime}</div>
            <button
              className="bg-gradient-to-r from-red-500 to-red-400 text-white px-6 py-3 rounded-xl text-lg shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
              onClick={skipRest}
              aria-label="Skip Rest"
            >
              <i className="fas fa-forward mr-2"></i> Skip Rest
            </button>
          </div>
        )}

        {/* Generating Report Screen */}
        {isGeneratingReport && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Generating Workout Report...</h2>
            <p className="text-gray-400">Please wait while we process your workout data</p>
          </div>
        )}

        {/* Completion Screen */}
        {showCompletionScreen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
              <div className="text-6xl text-green-500 mb-6">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 className="text-3xl font-semibold text-white mb-4">Workout Completed!</h2>

              {workoutReport ? (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-gray-400">Exercises</div>
                      <div className="text-xl font-bold text-white">{workoutReport.totalExercises}</div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-gray-400">Total Sets</div>
                      <div className="text-xl font-bold text-white">{workoutReport.totalSets}</div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-gray-400">Duration</div>
                      <div className="text-xl font-bold text-white">{workoutReport.estimatedDuration}</div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-gray-400">Calories</div>
                      <div className="text-xl font-bold text-green-400">{workoutReport.caloriesBurned}</div>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-400 mb-2">Intensity Level</div>
                    <div className="text-lg font-semibold text-blue-400">{workoutReport.intensity}</div>
                  </div>

                  {workoutReport.feedback && (
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-gray-400 mb-2">Feedback</div>
                      <div className="text-sm text-gray-300">{workoutReport.feedback}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 mb-6">Great job completing your workout!</div>
              )}

              <button
                onClick={()=>navigate('/workouts')}
                className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-4 rounded-xl text-xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl inline-block"
              >
                Back to Workout Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default WorkoutSession
