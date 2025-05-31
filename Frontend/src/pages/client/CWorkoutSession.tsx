import React, { useState, useEffect, useRef } from "react";

function WorkoutSession() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [showRestScreen, setShowRestScreen] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [femaleVoice, setFemaleVoice] = useState(null);
  const [workout, setWorkout] = useState([]); // State to store workout data
  const timerIntervalRef = useRef(null);
  const restTimerIntervalRef = useRef(null);
  const instructionTimeoutRef = useRef(null);

  // Load workout data from localStorage
  useEffect(() => {
    try {
      const workouts = localStorage.getItem("Current_Workout_Exercises"); // Fixed typo in key
      if (workouts) {
        const parsedWorkouts = JSON.parse(workouts);
        setWorkout(parsedWorkouts || []);
      } else {
        console.error("No workout data found in localStorage");
        setWorkout([]);
      }
    } catch (error) {
      console.error("Error parsing workout data from localStorage:", error);
      setWorkout([]);
    }
  }, []);

  // Load available voices and select a female voice
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice =
        voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.includes("Samantha") ||
            voice.name.includes("Victoria") ||
            voice.name.includes("Tessa") ||
            voice.name.includes("Zira") ||
            voice.name.includes("Google US English")
        ) || voices[0];
      setFemaleVoice(femaleVoice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Initialize workout
  useEffect(() => {
    if (workout.length > 0) {
      loadExercise(currentExerciseIndex);
    }
    return () => {
      clearInterval(timerIntervalRef.current);
      clearInterval(restTimerIntervalRef.current);
      clearTimeout(instructionTimeoutRef.current);
    };
  }, [currentExerciseIndex, currentSet, workout]);

  // Parse reps or duration for display and logic
  const parseExerciseMetrics = (exercise) => {
    if (!exercise) {
      return { type: "reps", value: 0, sets: 1, audio: "" };
    }
    if (exercise.duration) {
      const duration = parseInt(exercise.duration) || 0;
      return {
        type: "timed",
        value: duration,
        audio: `Hold ${exercise.name || "exercise"} for ${duration} seconds`,
        sets: 1,
      };
    } else {
      const reps = parseInt(
        exercise.reps?.split("-")[1] || exercise.reps?.split(" ")[0] || 0
      );
      const sets = parseInt(exercise.sets || 1);
      return {
        type: "reps",
        value: reps,
        sets,
        audio: `Do ${reps} reps of ${exercise.name || "exercise"}`,
      };
    }
  };

  // Load exercise data
  const loadExercise = (index) => {
    if (index >= workout.length || index < 0) return;
    const exercise = workout[index];
    const metrics = parseExerciseMetrics(exercise);
    setCurrentTime(metrics.type === "timed" ? metrics.value : 0);
    setTotalDuration(metrics.type === "timed" ? metrics.value : 0);
    setElapsedTime(0);
    setRestTime(parseInt(exercise?.rest?.split(" ")[0] || 0));
    speakExercise(metrics.audio);
    if (metrics.type === "reps") {
      speakInstructionsWithDelay(exercise?.instructions || "");
    }
  };

  // Update progress indicator
  const updateProgressIndicator = () => {
    return workout.length > 0 ? `${currentExerciseIndex + 1}/${workout.length}` : "0/0";
  };

  // Speak exercise instructions
  const speakExercise = (text) => {
    if ("speechSynthesis" in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      speechSynthesis.speak(utterance);
    }
  };

  // Show status message
  const showStatusMessage = (text) => {
    setStatusMessage(text);
    setTimeout(() => setStatusMessage(""), 2000);
    speakExercise(text);
  };

  // Speak instructions with a 5-second delay
  const speakInstructionsWithDelay = (instructions) => {
    clearTimeout(instructionTimeoutRef.current);
    instructionTimeoutRef.current = setTimeout(() => {
      if (!showRestScreen && instructions) {
        speakExercise(`Instructions: ${instructions}`);
      }
    }, 5000);
  };

  // Start exercise (for timed exercises)
  const startExercise = () => {
    if (workout.length === 0) return;
    setIsPlaying(true);
    const exercise = workout[currentExerciseIndex];
    speakInstructionsWithDelay(exercise?.instructions || "");
    startTimer();
  };

  // Stop exercise (for timed exercises)
  const stopExercise = () => {
    setIsPlaying(false);
    clearInterval(timerIntervalRef.current);
    clearTimeout(instructionTimeoutRef.current);
  };

  // Mark exercise as completed (for reps-based exercises)
  const completeExercise = () => {
    if (workout.length === 0) return;
    const exercise = workout[currentExerciseIndex];
    const metrics = parseExerciseMetrics(exercise);
    showStatusMessage(`Set ${currentSet} completed! Rest before next set.`);
    showRestScreenHandler();
  };

  // Start timer for timed exercises
  const startTimer = () => {
    clearInterval(timerIntervalRef.current);
    const exercise = workout[currentExerciseIndex];
    const metrics = parseExerciseMetrics(exercise);
    let timeLeft = currentTime;

    timerIntervalRef.current = setInterval(() => {
      timeLeft--;
      setCurrentTime(timeLeft);
      setElapsedTime((prev) => prev + 1);

      if (timeLeft === Math.floor(metrics.value / 2)) {
        showStatusMessage("Halfway there! Keep going!");
      }

      if (timeLeft <= 0) {
        clearInterval(timerIntervalRef.current);
        clearTimeout(instructionTimeoutRef.current);
        showStatusMessage("Good job! Rest before next exercise.");
        showRestScreenHandler();
      }
    }, 1000);
  };

  // Show rest screen
  const showRestScreenHandler = () => {
    if (workout.length === 0) return;
    const exercise = workout[currentExerciseIndex];
    const metrics = parseExerciseMetrics(exercise);
    const restSeconds = parseInt(exercise?.rest?.split(" ")[0] || 0);
    setRestTime(restSeconds);
    setShowRestScreen(true);
    setIsPlaying(false);
    clearTimeout(instructionTimeoutRef.current);

    restTimerIntervalRef.current = setInterval(() => {
      setRestTime((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(restTimerIntervalRef.current);
          if (metrics.type === "reps" && currentSet < metrics.sets) {
            setCurrentSet((prev) => prev + 1);
            loadExercise(currentExerciseIndex);
          } else {
            if (currentExerciseIndex < workout.length - 1) {
              setCurrentExerciseIndex((prev) => prev + 1);
              setCurrentSet(1);
            } else {
              setShowCompletionScreen(true);
            }
          }
          setShowRestScreen(false);
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  // Skip rest
  const skipRest = () => {
    clearInterval(restTimerIntervalRef.current);
    clearTimeout(instructionTimeoutRef.current);
    if (workout.length === 0) return;
    const exercise = workout[currentExerciseIndex];
    const metrics = parseExerciseMetrics(exercise);
    if (metrics.type === "reps" && currentSet < metrics.sets) {
      setCurrentSet((prev) => prev + 1);
      loadExercise(currentExerciseIndex);
    } else {
      if (currentExerciseIndex < workout.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
      } else {
        setShowCompletionScreen(true);
      }
    }
    setShowRestScreen(false);
  };

  // Go to previous exercise
  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setCurrentSet(1);
      clearTimeout(instructionTimeoutRef.current);
    }
  };

  // Handle case when no workout data is available
  if (workout.length === 0) {
    return (
      <main className="bg-[#12151E] text-white min-h-screen font-sans">
        <div className="max-w-3xl mx-auto p-8 flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold text-red-400">
            No workout data available
          </h2>
          <p className="text-gray-400 mt-2">
            Please select a workout plan to start.
          </p>
          <button
            className="mt-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-4 rounded-xl text-xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
            onClick={() => (window.location.href = "workout-plan.html")}
          >
            Back to Workout Plan
          </button>
        </div>
      </main>
    );
  }

  // Current exercise
  const exercise = workout[currentExerciseIndex];
  const metrics = parseExerciseMetrics(exercise);

  return (
    <main className="bg-[#12151E] text-white min-h-screen font-sans">
      <div className="max-w-3xl mx-auto p-8 flex-1 flex flex-col animate-[fadeIn_0.6s_ease-out]">
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
            {metrics.type === "timed"
              ? "Timed"
              : `Reps (Set ${currentSet}/${metrics.sets})`}
          </div>
          <p className="text-gray-400 text-sm mt-2">{exercise.instructions || "No instructions available"}</p>
        </div>

        {/* Progress Bar (for timed exercises only) */}
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
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {exercise.animation_link || "No animation available"}
            </div>
            <div className="absolute text-5xl text-white drop-shadow-md">
              <i
                className={`fas ${metrics.type === "timed" ? "fa-clock" : "fa-redo"}`}
              ></i>
            </div>
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
              {metrics.type === "timed"
                ? `Hold for ${metrics.value} seconds`
                : `Do ${exercise.reps || "0"} reps`}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between px-4">
          <button
            className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center shadow-lg transition-transform hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 hover:text-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={prevExercise}
            disabled={currentExerciseIndex === 0}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          {metrics.type === "timed" ? (
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl text-white text-lg shadow-lg transition-transform hover:scale-105"
              onClick={isPlaying ? stopExercise : startExercise}
            >
              {isPlaying ? "Stop" : "Start"}
            </button>
          ) : (
            <button
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-400 rounded-xl text-white text-lg shadow-lg transition-transform hover:scale-105"
              onClick={completeExercise}
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
            <h2 className="text-3xl font-semibold text-white mb-4">
              Rest Time
            </h2>
            <div className="text-xl text-gray-400 mb-4">
              {metrics.sets && currentSet < metrics.sets
                ? `Set ${currentSet} of ${metrics.sets} completed for ${exercise.name || "exercise"}`
                : `Exercise ${currentExerciseIndex + 1} of ${workout.length} completed`}
            </div>
            <div className="text-6xl font-bold text-blue-500 mb-4">
              {restTime}
            </div>
            <button
              className="bg-gradient-to-r from-red-500 to-red-400 text-white px-6 py-3 rounded-xl text-lg shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
              onClick={skipRest}
            >
              <i className="fas fa-forward mr-2"></i> Skip Rest
            </button>
          </div>
        )}

        {/* Completion Screen */}
        {showCompletionScreen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50">
            <div className="text-6xl text-green-500 mb-8">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="text-3xl font-semibold text-white mb-8 text-center">
              Workout Completed!
              <br />
              <span className="text-xl text-gray-400">
                {workout.length} exercises done
              </span>
            </div>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-4 rounded-xl text-xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
              onClick={() => (window.location.href = "workout-plan.html")}
            >
              Back to Workout Plan
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default WorkoutSession;