

// import { ClientService } from "@/services/implementation/clientServices"
// import type React from "react"
// import { useState, useEffect, useRef, useCallback } from "react"
// import { useNavigate } from "react-router-dom"
// import { Slider } from "@/components/ui/slider"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// export interface WorkoutReport {
//   totalExercises: number
//   totalSets: number
//   estimatedDuration: string
//   caloriesBurned: number
//   intensity: string
//   feedback: string
// }

// interface Exercise {
//   name: string
//   duration?: string
//   reps?: string
//   sets?: string
//   rest?: string
//   instructions?: string
//   animation_link?: string
// }

// const WorkoutSession: React.FC = () => {
//   const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
//   const [currentSet, setCurrentSet] = useState(1)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [totalDuration, setTotalDuration] = useState(0)
//   const [elapsedTime, setElapsedTime] = useState(0)
//   const [restTime, setRestTime] = useState(0)
//   const [showRestScreen, setShowRestScreen] = useState(false)
//   const [showCompletionScreen, setShowCompletionScreen] = useState(false)
//   const [statusMessage, setStatusMessage] = useState("")
//   const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(null)
//   const [workout, setWorkout] = useState<Exercise[]>([])
//   const [currentWeek, setCurrentWeek] = useState("")
//   const [currentDay, setCurrentDay] = useState("")
//   const [workoutReport, setWorkoutReport] = useState<WorkoutReport | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isGeneratingReport, setIsGeneratingReport] = useState(false)
//   const [customDuration, setCustomDuration] = useState<number | null>(null)
//   const [showDurationModal, setShowDurationModal] = useState(false)
//   const [sliderValue, setSliderValue] = useState<number[]>([30])
//   const [showRepSelectionModal, setShowRepSelectionModal] = useState(false)
//   const [selectedReps, setSelectedReps] = useState<number | null>(null)
//   const [allowReselect, setAllowReselect] = useState(false) // New state for manual reselection

//   const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
//   const restTimerIntervalRef = useRef<NodeJS.Timeout | null>(null)
//   const instructionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

//   const navigate = useNavigate()

//   // Load workout data from localStorage
//   useEffect(() => {
//     const loadWorkoutData = () => {
//       try {
//         const data = localStorage.getItem("Current_Workout_Exercises")
//         console.log("data from localStorage", data)
//         if (data) {
//           const parsedData = JSON.parse(data)
//           setCurrentDay(parsedData.day || "")
//           setCurrentWeek(parsedData.week ? `${parsedData.week}` : "")
//           setWorkout(parsedData.exercises || [])
//           console.log("workouts here ", parsedData.exercises)
//         }
//         setIsLoading(false)
//       } catch (error) {
//         console.error("Error parsing workout data from localStorage:", error)
//         setWorkout([])
//         setIsLoading(false)
//       }
//     }
//     loadWorkoutData()
//   }, [])

//   // Load voices for speech synthesis
//   useEffect(() => {
//     const loadVoices = () => {
//       const voices = window.speechSynthesis.getVoices()
//       const selectedVoice =
//         voices.find((voice) =>
//           ["female", "Samantha", "Victoria", "Tessa", "Zira", "Google US English"].some((term) =>
//             voice.name.toLowerCase().includes(term.toLowerCase()),
//           ),
//         ) || voices[0]
//       setFemaleVoice(selectedVoice)
//     }

//     loadVoices()
//     window.speechSynthesis.onvoiceschanged = loadVoices
//     return () => {
//       window.speechSynthesis.onvoiceschanged = null
//     }
//   }, [])

//   // Handle empty workout case properly - including rest days
//   useEffect(() => {
//     const handleWorkoutFinished = async () => {
//       try {
//         setIsGeneratingReport(true)
//         console.log("Starting workout completion process...")

//         const response = await ClientService.updateDayCompletionAndGetWorkoutReport(workout, currentDay, currentWeek)

//         console.log("Workout completion response:", response)

//         if (response && response.data) {
//           setWorkoutReport(response.data)
//           console.log("Workout report set:", response.data)
//           setTimeout(() => {
//             setShowCompletionScreen(true)
//             setIsGeneratingReport(false)
//           }, 100)
//         } else {
//           console.error("No data in response:", response)
//           setIsGeneratingReport(false)
//           setShowCompletionScreen(true)
//         }
//       } catch (error) {
//         console.error("Error updating workout completion:", error)
//         setIsGeneratingReport(false)
//         setShowCompletionScreen(true)
//       }
//     }

//     if (!isLoading && workout.length === 0 && currentDay && currentWeek) {
//       console.log("Rest day detected - completing day...")
//       handleWorkoutFinished()
//     }
//   }, [isLoading, workout, currentDay, currentWeek])

//   // Parse exercise metrics
//   const parseExerciseMetrics = useCallback((exercise: Exercise | undefined) => {
//     if (!exercise) {
//       return { type: "reps" as const, value: 0, sets: 1, audio: "", range: null, rangeType: null }
//     }

//     if (exercise.duration) {
//       const duration = Number.parseInt(exercise.duration) || 0
//       return {
//         type: "timed" as const,
//         value: duration,
//         audio: `Hold ${exercise.name || "exercise"} for ${duration} seconds`,
//         sets: 1,
//         range: null,
//         rangeType: null,
//       }
//     }

//     let reps = 0
//     let range = null
//     let rangeType = null

//     if (exercise.reps && exercise.reps.includes("-")) {
//       const parts = exercise.reps.split("-")
//       const minValue = Number.parseInt(parts[0].trim())

//       if (exercise.reps.toLowerCase().includes("seconds")) {
//         const maxPart = parts[1].trim()
//         const maxValue = Number.parseInt(maxPart.split(" ")[0])
//         if (!isNaN(minValue) && !isNaN(maxValue)) {
//           reps = minValue
//           range = { min: minValue, max: maxValue }
//           rangeType = "time"
//         }
//       } else {
//         const maxValue = Number.parseInt(parts[1].trim())
//         if (!isNaN(minValue) && !isNaN(maxValue)) {
//           reps = minValue
//           range = { min: minValue, max: maxValue }
//           rangeType = "reps"
//         }
//       }
//     } else if (exercise.reps && exercise.reps.toLowerCase().includes("seconds")) {
//       const timeValue = Number.parseInt(exercise.reps.split(" ")[0] || "0")
//       return {
//         type: "timed" as const,
//         value: timeValue,
//         audio: `Hold ${exercise.name || "exercise"} for ${timeValue} seconds`,
//         sets: Number.parseInt(exercise.sets || "1"),
//         range: null,
//         rangeType: null,
//       }
//     } else {
//       reps = Number.parseInt(exercise.reps?.split(" ")[0] || "0")
//     }

//     const sets = Number.parseInt(exercise.sets || "1")

//     return {
//       type: "reps" as const,
//       value: reps,
//       sets,
//       audio:
//         range && rangeType === "reps"
//           ? `Choose how many ${exercise.name || "exercise"} reps to do`
//           : `Do ${reps} reps of ${exercise.name || "exercise"}`,
//       range,
//       rangeType,
//     }
//   }, [])

//   // Load exercise
//   const loadExercise = useCallback(
//     (index: number) => {
//       if (index >= workout.length || index < 0) return
//       const exercise = workout[index]
//       const metrics = parseExerciseMetrics(exercise)

//       // Show selection modals for first set or if manually triggered
//       if (metrics.range && (currentSet === 1 || allowReselect)) {
//         if (metrics.rangeType === "time" && customDuration === null) {
//           setSliderValue([metrics.range.min])
//           setCustomDuration(metrics.range.min)
//           setShowDurationModal(true)
//           return
//         } else if (metrics.rangeType === "reps" && selectedReps === null) {
//           setSelectedReps(metrics.range.min)
//           setShowRepSelectionModal(true)
//           return
//         }
//       }

//       const timeValue =
//         selectedReps !== null && metrics.type === "reps"
//           ? selectedReps
//           : customDuration !== null && metrics.rangeType === "time"
//             ? customDuration
//             : metrics.value

//       setCurrentTime(metrics.type === "timed" || metrics.rangeType === "time" ? timeValue : 0)
//       setTotalDuration(metrics.type === "timed" || metrics.rangeType === "time" ? timeValue : 0)
//       setElapsedTime(0)
//       setRestTime(Number.parseInt(exercise?.rest?.split(" ")[0] || "0"))

//       const audioText =
//         selectedReps !== null && metrics.rangeType === "reps"
//           ? `Do ${selectedReps} reps of ${exercise.name || "exercise"}`
//           : customDuration !== null && metrics.rangeType === "time"
//             ? `Hold ${exercise.name || "exercise"} for ${customDuration} seconds`
//             : metrics.audio

//       speakExercise(audioText)
//       setAllowReselect(false) // Reset reselection flag
//     },
//     [workout, parseExerciseMetrics, customDuration, selectedReps, currentSet, allowReselect]
//   )

//   // Initialize workout
//   useEffect(() => {
//     if (workout.length > 0 && !showDurationModal && !showRepSelectionModal) {
//       loadExercise(currentExerciseIndex)
//     }
//     return () => {
//       if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
//       if (restTimerIntervalRef.current) clearInterval(restTimerIntervalRef.current)
//       if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
//     }
//   }, [currentExerciseIndex, workout, loadExercise, showDurationModal, showRepSelectionModal])

//   // Speak text
//   const speakExercise = useCallback(
//     (text: string) => {
//       if (window.speechSynthesis && text) {
//         window.speechSynthesis.cancel()
//         const utterance = new SpeechSynthesisUtterance(text)
//         utterance.rate = 0.9
//         if (femaleVoice) utterance.voice = femaleVoice
//         window.speechSynthesis.speak(utterance)
//       }
//     },
//     [femaleVoice]
//   )

//   // Show status message
//   const showStatusMessage = useCallback(
//     (text: string) => {
//       setStatusMessage(text)
//       setTimeout(() => setStatusMessage(""), 2000)
//       speakExercise(text)
//     },
//     [speakExercise]
//   )

//   // Speak instructions with delay
//   const speakInstructionsWithDelay = useCallback(
//     (instructions: string) => {
//       if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
//       instructionTimeoutRef.current = setTimeout(() => {
//         if (!showRestScreen && instructions) {
//           speakExercise(`Instructions: ${instructions}`)
//         }
//       }, 5000)
//     },
//     [showRestScreen, speakExercise]
//   )

//   // Start timer
//   const startTimer = useCallback(() => {
//     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
//     const exercise = workout[currentExerciseIndex]
//     const metrics = parseExerciseMetrics(exercise)
//     const timeValue = customDuration !== null && metrics.rangeType === "time" ? customDuration : metrics.value

//     timerIntervalRef.current = setInterval(() => {
//       setCurrentTime((prev) => {
//         const newTime = prev - 1
//         setElapsedTime((prevElapsed) => prevElapsed + 1)
//         if (newTime === Math.floor(timeValue / 2)) {
//           showStatusMessage("Halfway there! Keep going!")
//         }
//         if (newTime <= 0) {
//           clearInterval(timerIntervalRef.current!)
//           clearTimeout(instructionTimeoutRef.current!)
//           showStatusMessage("Good job! Rest before next exercise.")
//           showRestScreenHandler()
//         }
//         return newTime
//       })
//     }, 1000)
//   }, [currentExerciseIndex, workout, parseExerciseMetrics, showStatusMessage, customDuration])

//   // Start exercise
//   const startExercise = useCallback(() => {
//     if (workout.length === 0) return
//     setIsPlaying(true)
//     const exercise = workout[currentExerciseIndex]
//     speakInstructionsWithDelay(exercise?.instructions || "")
//     startTimer()
//   }, [workout, currentExerciseIndex, speakInstructionsWithDelay, startTimer])

//   // Stop exercise
//   const stopExercise = useCallback(() => {
//     setIsPlaying(false)
//     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
//     if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
//   }, [])

//   // Complete exercise
//   const completeExercise = useCallback(() => {
//     if (workout.length === 0) return
//     const exercise = workout[currentExerciseIndex]
//     const metrics = parseExerciseMetrics(exercise)
//     showStatusMessage(`Set ${currentSet} completed! Rest before next set.`)
//     showRestScreenHandler()
//   }, [workout, currentExerciseIndex, currentSet, parseExerciseMetrics, showStatusMessage])

//   // Show rest screen
//   const showRestScreenHandler = useCallback(() => {
//     if (workout.length === 0) return
//     const exercise = workout[currentExerciseIndex]
//     const metrics = parseExerciseMetrics(exercise)
//     const restSeconds = Number.parseInt(exercise?.rest?.split(" ")[0] || "0")
//     setRestTime(restSeconds)
//     setShowRestScreen(true)
//     setIsPlaying(false)
//     if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)

//     restTimerIntervalRef.current = setInterval(() => {
//       setRestTime((prev) => {
//         const newTime = prev - 1
//         if (newTime <= 0) {
//           clearInterval(restTimerIntervalRef.current!)
//           if (workout.length > 0) {
//             if (currentSet < metrics.sets) {
//               setCurrentSet((prev) => prev + 1)
//               setShowRestScreen(false)
//               // Reset for reselection per set (remove if you want to persist selection)
//               if (metrics.rangeType === "reps") {
//                 setSelectedReps(null)
//               } else if (metrics.rangeType === "time") {
//                 setCustomDuration(null)
//               }
//             } else {
//               const nextExerciseIndex = currentExerciseIndex + 1
//               if (nextExerciseIndex < workout.length) {
//                 setCurrentExerciseIndex(nextExerciseIndex)
//                 setCurrentSet(1)
//                 setCustomDuration(null)
//                 setSelectedReps(null)
//               } else {
//                 const handleWorkoutFinished = async () => {
//                   try {
//                     setIsGeneratingReport(true)
//                     console.log("Starting workout completion process...")

//                     const response = await ClientService.updateDayCompletionAndGetWorkoutReport(
//                       workout,
//                       currentDay,
//                       currentWeek,
//                     )

//                     console.log("Workout completion response:", response)

//                     if (response && response.data) {
//                       setWorkoutReport(response.data)
//                       console.log("Workout report set:", response.data)
//                       setTimeout(() => {
//                         setShowCompletionScreen(true)
//                         setIsGeneratingReport(false)
//                       }, 100)
//                     } else {
//                       console.error("No data in response:", response)
//                       setIsGeneratingReport(false)
//                       setShowCompletionScreen(true)
//                     }
//                   } catch (error) {
//                     console.error("Error updating workout completion:", error)
//                     setIsGeneratingReport(false)
//                     setShowCompletionScreen(true)
//                   }
//                 }

//                 handleWorkoutFinished()
//               }
//               setShowRestScreen(false)
//             }
//           }
//           return 0
//         }
//         return newTime
//       })
//     }, 1000)
//   }, [workout, currentExerciseIndex, currentSet, parseExerciseMetrics, currentDay, currentWeek])

//   // Skip rest
//   const skipRest = useCallback(() => {
//     if (restTimerIntervalRef.current) clearInterval(restTimerIntervalRef.current)
//     if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
//     if (workout.length === 0) return
//     const exercise = workout[currentExerciseIndex]
//     const metrics = parseExerciseMetrics(exercise)

//     if (currentSet < metrics.sets) {
//       setCurrentSet((prev) => prev + 1)
//       setShowRestScreen(false)
//       // Reset for reselection per set (remove if you want to persist selection)
//       if (metrics.rangeType === "reps") {
//         setSelectedReps(null)
//       } else if (metrics.rangeType === "time") {
//         setCustomDuration(null)
//       }
//     } else {
//       const nextExerciseIndex = currentExerciseIndex + 1
//       if (nextExerciseIndex < workout.length) {
//         setCurrentExerciseIndex(nextExerciseIndex)
//         setCurrentSet(1)
//         setCustomDuration(null)
//         setSelectedReps(null)
//       } else {
//         const handleWorkoutFinished = async () => {
//           try {
//             setIsGeneratingReport(true)
//             console.log("Starting workout completion process...")

//             const response = await ClientService.updateDayCompletionAndGetWorkoutReport(
//               workout,
//               currentDay,
//               currentWeek,
//             )

//             console.log("Workout completion response:", response)

//             if (response && response.data) {
//               setWorkoutReport(response.data)
//               console.log("Workout report set:", response.data)
//               setTimeout(() => {
//                 setShowCompletionScreen(true)
//                 setIsGeneratingReport(false)
//               }, 100)
//             } else {
//               console.error("No data in response:", response)
//               setIsGeneratingReport(false)
//               setShowCompletionScreen(true)
//             }
//           } catch (error) {
//             console.error("Error updating workout completion:", error)
//             setIsGeneratingReport(false)
//             setShowCompletionScreen(true)
//           }
//         }

//         handleWorkoutFinished()
//       }
//       setShowRestScreen(false)
//     }
//   }, [workout, currentExerciseIndex, currentSet, parseExerciseMetrics, currentDay, currentWeek])

//   // Previous exercise
//   const prevExercise = useCallback(() => {
//     if (currentExerciseIndex > 0) {
//       setCurrentExerciseIndex((prev) => prev - 1)
//       setCurrentSet(1)
//       setCustomDuration(null)
//       setSelectedReps(null)
//       setAllowReselect(false)
//       if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
//     }
//   }, [currentExerciseIndex])

//   // Update progress indicator
//   const updateProgressIndicator = useCallback(() => {
//     return workout.length > 0 ? `${currentExerciseIndex + 1}/${workout.length}` : "0/0"
//   }, [workout.length, currentExerciseIndex])

//   // Handle duration selection
//   const handleDurationSelect = useCallback(
//     (duration: number) => {
//       setCustomDuration(duration)
//       setShowDurationModal(false)
//       const exercise = workout[currentExerciseIndex]
//       if (exercise) {
//         setCurrentTime(duration)
//         setTotalDuration(duration)
//         setElapsedTime(0)
//         const restSeconds = Number.parseInt(exercise?.rest?.split(" ")[0] || "0")
//         setRestTime(restSeconds)
//         speakExercise(`Do ${exercise.name || "exercise"} for ${duration} seconds`)
//         speakInstructionsWithDelay(exercise?.instructions || "")
//       }
//     },
//     [currentExerciseIndex, workout, speakExercise, speakInstructionsWithDelay]
//   )

//   // Handle slider change
//   const handleSliderChange = useCallback((value: number[]) => {
//     setSliderValue(value)
//   }, [])

//   // Handle rep selection
//   const handleRepSelect = useCallback(
//     (reps: number) => {
//       setSelectedReps(reps)
//       setShowRepSelectionModal(false)
//       const exercise = workout[currentExerciseIndex]
//       if (exercise) {
//         const restSeconds = Number.parseInt(exercise?.rest?.split(" ")[0] || "0")
//         setRestTime(restSeconds)
//         speakExercise(`Do ${reps} reps of ${exercise.name || "exercise"}`)
//         speakInstructionsWithDelay(exercise?.instructions || "")
//       }
//     },
//     [currentExerciseIndex, workout, speakExercise, speakInstructionsWithDelay]
//   )

//   // Trigger reselection
//   const triggerReselect = useCallback(() => {
//     setAllowReselect(true)
//     const exercise = workout[currentExerciseIndex]
//     const metrics = parseExerciseMetrics(exercise)
//     if (metrics.rangeType === "reps") {
//       setSelectedReps(null)
//       setShowRepSelectionModal(true)
//     } else if (metrics.rangeType === "time") {
//       setCustomDuration(null)
//       setSliderValue([metrics.range.min])
//       setShowDurationModal(true)
//     }
//   }, [currentExerciseIndex, workout, parseExerciseMetrics])

//   // No workout data
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="mt-4 text-white">Loading Workout Data...</p>
//         </div>
//       </div>
//     )
//   }

//   if (workout.length === 0 && !currentDay && !currentWeek) {
//     return (
//       <main className="bg-[#12151E] text-white min-h-screen font-sans flex items-center justify-center">
//         <div className="max-w-3xl p-8 flex flex-col items-center text-center">
//           <h2 className="text-2xl font-semibold text-red-400 mb-4">No workout data available</h2>
//           <p className="text-gray-400 mb-6">Please select a workout plan to start.</p>
//           <button
//             onClick={() => navigate("/workouts")}
//             className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-4 rounded-xl text-xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
//           >
//             Back to Workout Plan
//           </button>
//         </div>
//       </main>
//     )
//   }

//   const exercise = workout[currentExerciseIndex]
//   const metrics = parseExerciseMetrics(exercise)

//   return (
//     <main className="bg-[#12151E] text-white min-h-screen font-sans">
//       <div className="max-w-3xl mx-auto p-8 flex flex-col animate-[fadeIn_0.6s_ease-out]">
//         {/* Exercise Header */}
//         <div className="text-center mb-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-lg relative">
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400"></div>
//           <div className="absolute top-2 right-2 bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-400">
//             {updateProgressIndicator()}
//           </div>
//           <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
//             {exercise?.name || "Unknown Exercise"}
//           </h2>
//           <div
//             className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//               metrics.type === "timed"
//                 ? "bg-gradient-to-r from-blue-500 to-blue-400"
//                 : "bg-gradient-to-r from-green-500 to-green-400"
//             }`}
//           >
//             {metrics.type === "timed" ? "Timed" : `Reps (Set ${currentSet}/${metrics.sets})`}
//           </div>
//           <p className="text-gray-400 text-sm mt-2">{exercise?.instructions || "No instructions available"}</p>
//         </div>

//         {/* Progress Bar (for timed exercises) */}
//         {(metrics.type === "timed" || customDuration !== null) && (
//           <div className="w-full h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
//             <div
//               className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-100"
//               style={{ width: `${(elapsedTime / totalDuration) * 100}%` }}
//             ></div>
//           </div>
//         )}

//         {/* Exercise Display */}
//         <div className="flex-1 flex flex-col items-center justify-center mb-4">
//           <div className="w-80 h-80 bg-gray-800 rounded-full flex items-center justify-center border-4 border-blue-500 mb-6 overflow-hidden shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
//             {exercise?.animation_link && exercise.animation_link !== "No video available" ? (
//               <img
//                 src={exercise.animation_link || "/placeholder.svg"}
//                 alt={exercise.name}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-gray-400">No animation available</div>
//             )}
//           </div>

//           {/* Timer/Reps Display */}
//           <div className="text-center">
//             {metrics.type === "timed" || (metrics.rangeType === "time" && customDuration !== null) ? (
//               <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
//                 {currentTime}
//               </div>
//             ) : (
//               <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent">
//                 {selectedReps !== null && metrics.rangeType === "reps" ? selectedReps : exercise?.reps || "0"}
//               </div>
//             )}
//             <div className="text-xl text-gray-400 min-h-8">
//               {metrics.type === "timed" || metrics.rangeType === "time"
//                 ? customDuration !== null
//                   ? `Hold for ${customDuration} seconds`
//                   : `Hold for ${metrics.value} seconds`
//                 : selectedReps !== null && metrics.rangeType === "reps"
//                   ? `Do ${selectedReps} reps`
//                   : `Do ${exercise?.reps || "0"} reps`}
//             </div>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="flex justify-between px-4">
//           <button
//             className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center shadow-lg transition-transform hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 hover:text-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
//             onClick={prevExercise}
//             disabled={currentExerciseIndex === 0}
//             aria-label="Previous Exercise"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>

//           {metrics.type === "timed" || (metrics.rangeType === "time" && customDuration !== null) ? (
//             <button
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl text-white text-lg shadow-lg transition-transform hover:scale-105"
//               onClick={isPlaying ? stopExercise : startExercise}
//               aria-label={isPlaying ? "Stop Exercise" : "Start Exercise"}
//             >
//               {isPlaying ? "Stop" : "Start"}
//             </button>
//           ) : (
//             <button
//               className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-400 rounded-xl text-white text-lg shadow-lg transition-transform hover:scale-105"
//               onClick={completeExercise}
//               aria-label="Complete Exercise"
//             >
//               Completed
//             </button>
//           )}
//         </div>

//         {/* Reselect Button */}
//         {(metrics.rangeType === "reps" || metrics.rangeType === "time") && !showRestScreen && (
//           <div className="text-center mt-4">
//             <Button
//               onClick={triggerReselect}
//               className="bg-gradient-to-r from-purple-500 to-purple-400 text-white px-6 py-2 rounded-xl shadow-lg transition-transform hover:scale-105"
//             >
//               {metrics.rangeType === "reps" ? "Change Reps" : "Change Duration"}
//             </Button>
//           </div>
//         )}

//         {/* Status Message */}
//         {statusMessage && (
//           <div className="fixed bottom-1/5 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-gray-800 to-gray-900 text-white px-8 py-4 rounded-xl text-xl shadow-lg opacity-100 transition-opacity">
//             {statusMessage}
//           </div>
//         )}

//         {/* Rep Selection Modal */}
//         {showRepSelectionModal && metrics.range && metrics.rangeType === "reps" && (
//           <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
//             <Card className="bg-gray-800 border-gray-700 max-w-md w-full">
//               <CardHeader className="text-center">
//                 <CardTitle className="text-2xl font-semibold text-white">Choose Your Reps</CardTitle>
//                 <p className="text-gray-400 mt-2">
//                   Select how many reps you want to do for{" "}
//                   <span className="text-green-400 font-medium">{exercise?.name}</span>
//                 </p>
//                 <p className="text-sm text-gray-300 mt-1">
//                   This will apply to set {currentSet} of this exercise
//                 </p>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-green-400 mb-2">{selectedReps}</div>
//                   <div className="text-gray-400">reps per set</div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-3">
//                   {Array.from({ length: metrics.range.max - metrics.range.min + 1 }, (_, i) => {
//                     const value = metrics.range!.min + i
//                     return (
//                       <Button
//                         key={value}
//                         variant={selectedReps === value ? "default" : "outline"}
//                         onClick={() => setSelectedReps(value)}
//                         className={`text-lg font-medium ${
//                           selectedReps === value ? "bg-green-500 hover:bg-green-600" : "hover:bg-green-500/20"
//                         }`}
//                       >
//                         {value}
//                       </Button>
//                     )
//                   })}
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <Button variant="outline" onClick={() => setShowRepSelectionModal(false)} className="flex-1">
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={() => handleRepSelect(selectedReps!)}
//                     className="flex-1 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
//                   >
//                     Start Exercise
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* Duration Selection Modal */}
//         {showDurationModal && metrics.range && metrics.rangeType === "time" && (
//           <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
//             <Card className="bg-gray-800 border-gray-700 max-w-md w-full">
//               <CardHeader className="text-center">
//                 <CardTitle className="text-2xl font-semibold text-white">Set Your Duration</CardTitle>
//                 <p className="text-gray-400 mt-2">
//                   Choose how long you want to do <span className="text-blue-400 font-medium">{exercise?.name}</span>
//                 </p>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-blue-400 mb-2">{sliderValue[0]}</div>
//                   <div className="text-gray-400">seconds</div>
//                 </div>
//                 <div className="space-y-4">
//                   <Slider
//                     value={sliderValue}
//                     onValueChange={handleSliderChange}
//                     max={metrics.range.max}
//                     min={metrics.range.min}
//                     step={5}
//                     className="w-full"
//                   />
//                   <div className="flex justify-between text-sm text-gray-400">
//                     <span>{metrics.range.min}s</span>
//                     <span>{metrics.range.max}s</span>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-2">
//                   {[metrics.range.min, Math.floor((metrics.range.min + metrics.range.max) / 2), metrics.range.max].map(
//                     (value) => (
//                       <Button
//                         key={value}
//                         variant={sliderValue[0] === value ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => setSliderValue([value])}
//                         className="text-xs"
//                       >
//                         {value}s
//                       </Button>
//                     ),
//                   )}
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <Button variant="outline" onClick={() => setShowDurationModal(false)} className="flex-1">
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={() => handleDurationSelect(sliderValue[0])}
//                     className="flex-1 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500"
//                   >
//                     Start Exercise
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* Rest Screen */}
//         {showRestScreen && (
//           <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50">
//             <h2 className="text-3xl font-semibold text-white mb-4">Rest Time</h2>
//             <div className="text-xl text-gray-400 mb-4">
//               {metrics.sets && currentSet < metrics.sets
//                 ? `Set ${currentSet} of ${metrics.sets} completed for ${exercise?.name || "exercise"}`
//                 : `Exercise ${currentExerciseIndex + 1} of ${workout.length} completed`}
//             </div>
//             <div className="text-6xl font-bold text-blue-500 mb-4">{restTime}</div>
//             <button
//               className="bg-gradient-to-r from-red-500 to-red-400 text-white px-6 py-3 rounded-xl text-lg shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
//               onClick={skipRest}
//               aria-label="Skip Rest"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 inline mr-2"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               Skip Rest
//             </button>
//           </div>
//         )}

//         {/* Generating Report Screen */}
//         {isGeneratingReport && (
//           <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50">
//             <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//             <h2 className="text-2xl font-semibold text-white mb-2">Generating Workout Report...</h2>
//             <p className="text-gray-400">Please wait while we process your workout data</p>
//           </div>
//         )}

//         {/* Completion Screen */}
//         {showCompletionScreen && (
//           <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
//             <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
//               <div className="text-6xl text-green-500 mb-6">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-16 w-16 mx-auto"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <h2 className="text-3xl font-semibold text-white mb-4">Workout Completed!</h2>
//               {workoutReport ? (
//                 <div className="space-y-4 mb-6">
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div className="bg-gray-700 p-3 rounded-lg">
//                       <div className="text-gray-400">Exercises</div>
//                       <div className="text-xl font-bold text-white">{workoutReport.totalExercises}</div>
//                     </div>
//                     <div className="bg-gray-700 p-3 rounded-lg">
//                       <div className="text-gray-400">Total Sets</div>
//                       <div className="text-xl font-bold text-white">{workoutReport.totalSets}</div>
//                     </div>
//                     <div className="bg-gray-700 p-3 rounded-lg">
//                       <div className="text-gray-400">Duration</div>
//                       <div className="text-xl font-bold text-white">{workoutReport.estimatedDuration}</div>
//                     </div>
//                     <div className="bg-gray-700 p-3 rounded-lg">
//                       <div className="text-gray-400">Calories</div>
//                       <div className="text-xl font-bold text-green-400">{workoutReport.caloriesBurned}</div>
//                     </div>
//                   </div>
//                   <div className="bg-gray-700 p-4 rounded-lg">
//                     <div className="text-gray-400 mb-2">Intensity Level</div>
//                     <div className="text-lg font-semibold text-blue-400">{workoutReport.intensity}</div>
//                   </div>
//                   {workoutReport.feedback && (
//                     <div className="bg-gray-700 p-4 rounded-lg">
//                       <div className="text-gray-400 mb-2">Feedback</div>
//                       <div className="text-sm text-gray-300">{workoutReport.feedback}</div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="text-gray-400 mb-6">Great job completing your workout!</div>
//               )}
//               <button
//                 onClick={() => navigate("/workouts")}
//                 className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-4 rounded-xl text-xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl inline-block"
//               >
//                 Back to Workout Plan
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   )
// }

// export default WorkoutSession



import { ClientService } from "@/services/implementation/clientServices"
import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [customDuration, setCustomDuration] = useState<number | null>(null)
  const [showDurationModal, setShowDurationModal] = useState(false)
  const [sliderValue, setSliderValue] = useState<number[]>([30])
  const [showRepSelectionModal, setShowRepSelectionModal] = useState(false)
  const [selectedReps, setSelectedReps] = useState<number | null>(null)
  const [allowReselect, setAllowReselect] = useState(false)

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const restTimerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const instructionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navigate = useNavigate()

  // Load workout data from localStorage
  useEffect(() => {
    const loadWorkoutData = () => {
      try {
        const data = localStorage.getItem("Current_Workout_Exercises")
        console.log("data from localStorage", data)
        if (data) {
          const parsedData = JSON.parse(data)
          setCurrentDay(parsedData.day || "")
          setCurrentWeek(parsedData.week ? `${parsedData.week}` : "")
          setWorkout(parsedData.exercises || [])
          console.log("workouts here ", parsedData.exercises)
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error parsing workout data from localStorage:", error)
        setWorkout([])
        setIsLoading(false)
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

  // Handle empty workout case properly - including rest days
  useEffect(() => {
    const handleWorkoutFinished = async () => {
      try {
        setIsGeneratingReport(true)
        console.log("Starting workout completion process...")

        const response = await ClientService.updateDayCompletionAndGetWorkoutReport(workout, currentDay, currentWeek)

        console.log("Workout completion response:", response)

        if (response && response.data) {
          setWorkoutReport(response.data)
          console.log("Workout report set:", response.data)
          setTimeout(() => {
            setShowCompletionScreen(true)
            setIsGeneratingReport(false)
          }, 100)
        } else {
          console.error("No data in response:", response)
          setIsGeneratingReport(false)
          setShowCompletionScreen(true)
        }
      } catch (error) {
        console.error("Error updating workout completion:", error)
        setIsGeneratingReport(false)
        setShowCompletionScreen(true)
      }
    }

    if (!isLoading && workout.length === 0 && currentDay && currentWeek) {
      console.log("Rest day detected - completing day...")
      handleWorkoutFinished()
    }
  }, [isLoading, workout, currentDay, currentWeek])

  // Parse exercise metrics
  const parseExerciseMetrics = useCallback((exercise: Exercise | undefined) => {
    if (!exercise) {
      return { type: "reps" as const, value: 0, sets: 1, audio: "", range: null, rangeType: null }
    }

    if (exercise.duration) {
      const duration = Number.parseInt(exercise.duration) || 0
      return {
        type: "timed" as const,
        value: duration,
        audio: `Hold ${exercise.name || "exercise"} for ${duration} seconds`,
        sets: 1,
        range: null,
        rangeType: null,
      }
    }

    let reps = 0
    let range = null
    let rangeType = null

    if (exercise.reps && exercise.reps.includes("-")) {
      const parts = exercise.reps.split("-")
      const minValue = Number.parseInt(parts[0].trim())

      if (exercise.reps.toLowerCase().includes("seconds")) {
        const maxPart = parts[1].trim()
        const maxValue = Number.parseInt(maxPart.split(" ")[0])
        if (!isNaN(minValue) && !isNaN(maxValue)) {
          reps = minValue
          range = { min: minValue, max: maxValue }
          rangeType = "time"
        }
      } else {
        const maxValue = Number.parseInt(parts[1].trim())
        if (!isNaN(minValue) && !isNaN(maxValue)) {
          reps = minValue
          range = { min: minValue, max: maxValue }
          rangeType = "reps"
        }
      }
    } else if (exercise.reps && exercise.reps.toLowerCase().includes("seconds")) {
      const timeValue = Number.parseInt(exercise.reps.split(" ")[0] || "0")
      return {
        type: "timed" as const,
        value: timeValue,
        audio: `Hold ${exercise.name || "exercise"} for ${timeValue} seconds`,
        sets: Number.parseInt(exercise.sets || "1"),
        range: null,
        rangeType: null,
      }
    } else {
      reps = Number.parseInt(exercise.reps?.split(" ")[0] || "0")
    }

    const sets = Number.parseInt(exercise.sets || "1")

    return {
      type: "reps" as const,
      value: reps,
      sets,
      audio:
        range && rangeType === "reps"
          ? `Choose how many ${exercise.name || "exercise"} reps to do`
          : `Do ${reps} reps of ${exercise.name || "exercise"}`,
      range,
      rangeType,
    }
  }, [])

  // Load exercise
  const loadExercise = useCallback(
    (index: number) => {
      if (index >= workout.length || index < 0) return
      const exercise = workout[index]
      const metrics = parseExerciseMetrics(exercise)

      // Show selection modals only for first set or if manually triggered
      if (metrics.range && (currentSet === 1 || allowReselect)) {
        if (metrics.rangeType === "time" && customDuration === null) {
          setSliderValue([metrics.range.min])
          setShowDurationModal(true)
          return
        } else if (metrics.rangeType === "reps" && selectedReps === null) {
          setSelectedReps(metrics.range.min)
          setShowRepSelectionModal(true)
          return
        }
      }

      const timeValue =
        selectedReps !== null && metrics.type === "reps"
          ? selectedReps
          : customDuration !== null && metrics.rangeType === "time"
            ? customDuration
            : metrics.value

      setCurrentTime(metrics.type === "timed" || metrics.rangeType === "time" ? timeValue : 0)
      setTotalDuration(metrics.type === "timed" || metrics.rangeType === "time" ? timeValue : 0)
      setElapsedTime(0)
      setRestTime(Number.parseInt(exercise?.rest?.split(" ")[0] || "0"))

      const audioText =
        selectedReps !== null && metrics.rangeType === "reps"
          ? `Do ${selectedReps} reps of ${exercise.name || "exercise"}`
          : customDuration !== null && metrics.rangeType === "time"
            ? `Hold ${exercise.name || "exercise"} for ${customDuration} seconds`
            : metrics.audio

      speakExercise(audioText)
      setAllowReselect(false)
    },
    [workout, parseExerciseMetrics, customDuration, selectedReps, currentSet, allowReselect]
  )

  // Initialize workout
  useEffect(() => {
    if (workout.length > 0 && !showDurationModal && !showRepSelectionModal) {
      loadExercise(currentExerciseIndex)
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (restTimerIntervalRef.current) clearInterval(restTimerIntervalRef.current)
      if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
    }
  }, [currentExerciseIndex, workout, loadExercise, showDurationModal, showRepSelectionModal])

  // Speak text
  const speakExercise = useCallback(
    (text: string) => {
      if (window.speechSynthesis && text) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        if (femaleVoice) utterance.voice = femaleVoice
        window.speechSynthesis.speak(utterance)
      }
    },
    [femaleVoice]
  )

  // Show status message
  const showStatusMessage = useCallback(
    (text: string) => {
      setStatusMessage(text)
      setTimeout(() => setStatusMessage(""), 2000)
      speakExercise(text)
    },
    [speakExercise]
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
    [showRestScreen, speakExercise]
  )

  // Start timer
  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    const exercise = workout[currentExerciseIndex]
    const metrics = parseExerciseMetrics(exercise)
    const timeValue = customDuration !== null && metrics.rangeType === "time" ? customDuration : metrics.value

    timerIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev - 1
        setElapsedTime((prevElapsed) => prevElapsed + 1)
        if (newTime === Math.floor(timeValue / 2)) {
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
  }, [currentExerciseIndex, workout, parseExerciseMetrics, showStatusMessage, customDuration])

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
          if (workout.length > 0) {
            if (currentSet < metrics.sets) {
              setCurrentSet((prev) => prev + 1)
              setShowRestScreen(false)
            } else {
              const nextExerciseIndex = currentExerciseIndex + 1
              if (nextExerciseIndex < workout.length) {
                setCurrentExerciseIndex(nextExerciseIndex)
                setCurrentSet(1)
                setCustomDuration(null) // Reset only when moving to next exercise
                setSelectedReps(null) // Reset only when moving to next exercise
              } else {
                const handleWorkoutFinished = async () => {
                  try {
                    setIsGeneratingReport(true)
                    console.log("Starting workout completion process...")

                    const response = await ClientService.updateDayCompletionAndGetWorkoutReport(
                      workout,
                      currentDay,
                      currentWeek,
                    )

                    console.log("Workout completion response:", response)

                    if (response && response.data) {
                      setWorkoutReport(response.data)
                      console.log("Workout report set:", response.data)
                      setTimeout(() => {
                        setShowCompletionScreen(true)
                        setIsGeneratingReport(false)
                      }, 100)
                    } else {
                      console.error("No data in response:", response)
                      setIsGeneratingReport(false)
                      setShowCompletionScreen(true)
                    }
                  } catch (error) {
                    console.error("Error updating workout completion:", error)
                    setIsGeneratingReport(false)
                    setShowCompletionScreen(true)
                  }
                }

                handleWorkoutFinished()
              }
              setShowRestScreen(false)
            }
          }
          return 0
        }
        return newTime
      })
    }, 1000)
  }, [workout, currentExerciseIndex, currentSet, parseExerciseMetrics, currentDay, currentWeek])

  // Skip rest
  const skipRest = useCallback(() => {
    if (restTimerIntervalRef.current) clearInterval(restTimerIntervalRef.current)
    if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
    if (workout.length === 0) return
    const exercise = workout[currentExerciseIndex]
    const metrics = parseExerciseMetrics(exercise)

    if (currentSet < metrics.sets) {
      setCurrentSet((prev) => prev + 1)
      setShowRestScreen(false)
    } else {
      const nextExerciseIndex = currentExerciseIndex + 1
      if (nextExerciseIndex < workout.length) {
        setCurrentExerciseIndex(nextExerciseIndex)
        setCurrentSet(1)
        setCustomDuration(null) // Reset only when moving to next exercise
        setSelectedReps(null) // Reset only when moving to next exercise
      } else {
        const handleWorkoutFinished = async () => {
          try {
            setIsGeneratingReport(true)
            console.log("Starting workout completion process...")

            const response = await ClientService.updateDayCompletionAndGetWorkoutReport(
              workout,
              currentDay,
              currentWeek,
            )

            console.log("Workout completion response:", response)

            if (response && response.data) {
              setWorkoutReport(response.data)
              console.log("Workout report set:", response.data)
              setTimeout(() => {
                setShowCompletionScreen(true)
                setIsGeneratingReport(false)
              }, 100)
            } else {
              console.error("No data in response:", response)
              setIsGeneratingReport(false)
              setShowCompletionScreen(true)
            }
          } catch (error) {
            console.error("Error updating workout completion:", error)
            setIsGeneratingReport(false)
            setShowCompletionScreen(true)
          }
        }

        handleWorkoutFinished()
      }
      setShowRestScreen(false)
    }
  }, [workout, currentExerciseIndex, currentSet, parseExerciseMetrics, currentDay, currentWeek])

  // Previous exercise
  const prevExercise = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1)
      setCurrentSet(1)
      setCustomDuration(null) // Reset when moving to previous exercise
      setSelectedReps(null) // Reset when moving to previous exercise
      setAllowReselect(false)
      if (instructionTimeoutRef.current) clearTimeout(instructionTimeoutRef.current)
    }
  }, [currentExerciseIndex])

  // Update progress indicator
  const updateProgressIndicator = useCallback(() => {
    return workout.length > 0 ? `${currentExerciseIndex + 1}/${workout.length}` : "0/0"
  }, [workout.length, currentExerciseIndex])

  // Handle duration selection
  const handleDurationSelect = useCallback(
    (duration: number) => {
      setCustomDuration(duration)
      setShowDurationModal(false)
      const exercise = workout[currentExerciseIndex]
      if (exercise) {
        setCurrentTime(duration)
        setTotalDuration(duration)
        setElapsedTime(0)
        const restSeconds = Number.parseInt(exercise?.rest?.split(" ")[0] || "0")
        setRestTime(restSeconds)
        speakExercise(`Do ${exercise.name || "exercise"} for ${duration} seconds`)
        speakInstructionsWithDelay(exercise?.instructions || "")
      }
    },
    [currentExerciseIndex, workout, speakExercise, speakInstructionsWithDelay]
  )

  // Handle slider change
  const handleSliderChange = useCallback((value: number[]) => {
    setSliderValue(value)
  }, [])

  // Handle rep selection
  const handleRepSelect = useCallback(
    (reps: number) => {
      setSelectedReps(reps)
      setShowRepSelectionModal(false)
      const exercise = workout[currentExerciseIndex]
      if (exercise) {
        const restSeconds = Number.parseInt(exercise?.rest?.split(" ")[0] || "0")
        setRestTime(restSeconds)
        speakExercise(`Do ${reps} reps of ${exercise.name || "exercise"}`)
        speakInstructionsWithDelay(exercise?.instructions || "")
      }
    },
    [currentExerciseIndex, workout, speakExercise, speakInstructionsWithDelay]
  )

  // Trigger reselection
  const triggerReselect = useCallback(() => {
    setAllowReselect(true)
    const exercise = workout[currentExerciseIndex]
    const metrics = parseExerciseMetrics(exercise)
    if (metrics.rangeType === "reps") {
      setSelectedReps(null)
      setShowRepSelectionModal(true)
    } else if (metrics.rangeType === "time") {
      setCustomDuration(null)
      setSliderValue([metrics.range.min])
      setShowDurationModal(true)
    }
  }, [currentExerciseIndex, workout, parseExerciseMetrics])

  // No workout data
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

  if (workout.length === 0 && !currentDay && !currentWeek) {
    return (
      <main className="bg-[#12151E] text-white min-h-screen font-sans flex items-center justify-center">
        <div className="max-w-3xl p-8 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">No workout data available</h2>
          <p className="text-gray-400 mb-6">Please select a workout plan to start.</p>
          <button
            onClick={() => navigate("/workouts")}
            className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-4 rounded-xl text-xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            Back to Workout Plan
          </button>
        </div>
      </main>
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
            {exercise?.name || "Unknown Exercise"}
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
          <p className="text-gray-400 text-sm mt-2">{exercise?.instructions || "No instructions available"}</p>
        </div>

        {/* Progress Bar (for timed exercises) */}
        {(metrics.type === "timed" || customDuration !== null) && (
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
            {exercise?.animation_link && exercise.animation_link !== "No video available" ? (
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
            {metrics.type === "timed" || (metrics.rangeType === "time" && customDuration !== null) ? (
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                {currentTime}
              </div>
            ) : (
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent">
                {selectedReps !== null && metrics.rangeType === "reps" ? selectedReps : exercise?.reps || "0"}
              </div>
            )}
            <div className="text-xl text-gray-400 min-h-8">
              {metrics.type === "timed" || metrics.rangeType === "time"
                ? customDuration !== null
                  ? `Hold for ${customDuration} seconds`
                  : `Hold for ${metrics.value} seconds`
                : selectedReps !== null && metrics.rangeType === "reps"
                  ? `Do ${selectedReps} reps`
                  : `Do ${exercise?.reps || "0"} reps`}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {metrics.type === "timed" || (metrics.rangeType === "time" && customDuration !== null) ? (
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

        {/* Reselect Button */}
        {(metrics.rangeType === "reps" || metrics.rangeType === "time") && !showRestScreen && (
          <div className="text-center mt-4">
            <Button
              onClick={triggerReselect}
              className="bg-gradient-to-r from-purple-500 to-purple-400 text-white px-6 py-2 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              {metrics.rangeType === "reps" ? "Change Reps" : "Change Duration"}
            </Button>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div className="fixed bottom-1/5 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-gray-800 to-gray-900 text-white px-8 py-4 rounded-xl text-xl shadow-lg opacity-100 transition-opacity">
            {statusMessage}
          </div>
        )}

        {/* Rep Selection Modal */}
        {showRepSelectionModal && metrics.range && metrics.rangeType === "reps" && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
            <Card className="bg-gray-800 border-gray-700 max-w-md w-full">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold text-white">Choose Your Reps</CardTitle>
                <p className="text-gray-400 mt-2">
                  Select how many reps you want to do for{" "}
                  <span className="text-green-400 font-medium">{exercise?.name}</span>
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  This will apply to all sets of this exercise
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">{selectedReps}</div>
                  <div className="text-gray-400">reps per set</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: metrics.range.max - metrics.range.min + 1 }, (_, i) => {
                    const value = metrics.range!.min + i
                    return (
                      <Button
                        key={value}
                        variant={selectedReps === value ? "default" : "outline"}
                        onClick={() => setSelectedReps(value)}
                        className={`text-lg font-medium ${
                          selectedReps === value ? "bg-green-500 hover:bg-green-600" : "hover:bg-green-500/20"
                        }`}
                      >
                        {value}
                      </Button>
                    )
                  })}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowRepSelectionModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleRepSelect(selectedReps!)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
                  >
                    Start Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Duration Selection Modal */}
        {showDurationModal && metrics.range && metrics.rangeType === "time" && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
            <Card className="bg-gray-800 border-gray-700 max-w-md w-full">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold text-white">Set Your Duration</CardTitle>
                <p className="text-gray-400 mt-2">
                  Choose how long you want to do <span className="text-blue-400 font-medium">{exercise?.name}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{sliderValue[0]}</div>
                  <div className="text-gray-400">seconds</div>
                </div>
                <div className="space-y-4">
                  <Slider
                    value={sliderValue}
                    onValueChange={handleSliderChange}
                    max={metrics.range.max}
                    min={metrics.range.min}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{metrics.range.min}s</span>
                    <span>{metrics.range.max}s</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[metrics.range.min, Math.floor((metrics.range.min + metrics.range.max) / 2), metrics.range.max].map(
                    (value) => (
                      <Button
                        key={value}
                        variant={sliderValue[0] === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSliderValue([value])}
                        className="text-xs"
                      >
                        {value}s
                      </Button>
                    ),
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowDurationModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDurationSelect(sliderValue[0])}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500"
                  >
                    Start Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rest Screen */}
        {showRestScreen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50">
            <h2 className="text-3xl font-semibold text-white mb-4">Rest Time</h2>
            <div className="text-xl text-gray-400 mb-4">
              {metrics.sets && currentSet < metrics.sets
                ? `Set ${currentSet} of ${metrics.sets} completed for ${exercise?.name || "exercise"}`
                : `Exercise ${currentExerciseIndex + 1} of ${workout.length} completed`}
            </div>
            <div className="text-6xl font-bold text-blue-500 mb-4">{restTime}</div>
            <button
              className="bg-gradient-to-r from-red-500 to-red-400 text-white px-6 py-3 rounded-xl text-lg shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
              onClick={skipRest}
              aria-label="Skip Rest"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Skip Rest
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
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
                onClick={() => navigate("/workouts")}
                className="bg-gradient-to-r from-blue- Stimme: 500 to-blue-400 text-white px-8 py-4 rounded-xl text-xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl inline-block"
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