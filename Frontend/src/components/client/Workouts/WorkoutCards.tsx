import { useNavigate } from "react-router-dom";

interface WorkoutCardProps {
  workouts:any,
  weekStatus:boolean | null;
  currentWeek:string;
}

const WorkoutCards: React.FC<WorkoutCardProps> = ({ workouts, weekStatus, currentWeek }) => {

  const navigate = useNavigate();

  const handleActionClick = (day:string, action:string, workout:any) => {
    if(action === 'view'){
      navigate(`/workoutReport?week=${currentWeek}&day=${day}`)
    }else{
      if (action !== "locked") {
        console.log(
          `Action for ${day}: ${action === "start" ? "Start Workout" : "View Results"}`
        );
        // Navigation logic here
        console.log(workout);
        localStorage.setItem('Current_Workout_Exercises',JSON.stringify({exercises:workout, day, week:currentWeek}));
        navigate('/workoutSession');
      }
    }
  };

  // Transform workouts into an array and determine accessibility
  const workoutDays = Object.entries(workouts)
    .filter(([key]) => key.startsWith("day"))
    .map(([key, value], index, array) => {
      let action = "locked";
      let status = "locked";

      if (weekStatus) {
        // First workout is accessible if week is active
        if (index === 0) {
          action = value.completed ? "view" : "start";
          status = value.completed ? "completed" : "pending";
        }
        // Subsequent workouts are accessible only if previous is completed
        else if (array[index - 1][1].completed) {
          action = value.completed ? "view" : "start";
          status = value.completed ? "completed" : "pending";
        }
      }

      return {
        day: key,
        status,
        exercises: value.exercises,
        action,
      };
    });

  // Find the index of the first pending workout for the "Start Next Workout" button
  const nextWorkoutIndex = workoutDays.findIndex(
    (workout) => workout.status === "pending" && workout.action === "start"
  );

  // Check if all workouts are completed
  const allWorkoutsCompleted = workoutDays.every(
    (workout) => workout.status === "completed"
  );

  const handleStartNextWorkout = () => {
    if (nextWorkoutIndex !== -1) {
      const nextWorkout = workoutDays[nextWorkoutIndex];
      console.log(`Starting next workout: ${nextWorkout.day}`);
      handleActionClick(nextWorkout.day, nextWorkout.action,nextWorkout.exercises);
    }
  };

  return (
    <div className="space-y-5">
      {weekStatus && !allWorkoutsCompleted && nextWorkoutIndex !== -1 && (
        <div className="flex justify-center">
          <button
            className="bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white py-2 px-6 rounded-lg text-sm font-medium hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            onClick={handleStartNextWorkout}
          >
            Start Next Workout
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {workoutDays.map((workout, index) => (
          <WorkoutCard
            key={index}
            day={workout.day}
            status={workout.status}
            exercises={workout.exercises}
            action={workout.action}
            onActionClick={handleActionClick}
          />
        ))}
      </div>
      
    </div>
  );
};

export default WorkoutCards;

interface SingleWorkoutCardProps{
  key: number,
  day:string,
  status: string,
  exercises: any,
  action: string,
  onActionClick : (day:string,action: string, workout: any)=> void;
}

const WorkoutCard:React.FC<SingleWorkoutCardProps> = ({ day, status, exercises, action, onActionClick }) => {
  return (
    <div
      className={`bg-gradient-to-br from-[rgba(30,34,53,0.9)] to-[rgba(18,21,30,0.8)] border border-gray-700 rounded-lg p-5 transition-all duration-300 ${
        status === "locked"
          ? "opacity-50 cursor-not-allowed"
          : "hover:-translate-y-1 hover:border-[#5D5FEF] hover:shadow-xl"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="font-semibold text-lg text-white">{day}</div>
        {status !== "locked" && (
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              status === "completed"
                ? "bg-green-500 text-gray-900"
                : "bg-orange-500 text-gray-900"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>
      <div className="mb-4">
        {exercises.map((exercise:any, index:number) => (
          <div
            key={index}
            className="flex justify-between items-start text-sm text-gray-400 mb-2 last:mb-0"
          >
            <span className="w-2/3">{exercise.name}</span>
            <span className="text-white text-right w-1/3 leading-tight">
              {exercise.sets && (
                <>
                  {exercise.reps}x{exercise.sets}
                  <br />
                </>
              )}
              {exercise.duration}
            </span>
          </div>
        ))}
      </div>
      <button
        className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          action === "start"
            ? "bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white hover:-translate-y-1 hover:shadow-lg"
            : action === "view"
              ? "bg-transparent border border-[#5D5FEF] text-[#5D5FEF] hover:bg-[#5D5FEF] hover:text-white"
              : "bg-transparent border border-gray-400 text-gray-400 cursor-not-allowed"
        }`}
        onClick={() => {console.log(exercises),onActionClick(day, action,exercises)}}
      >
        {action === "start"
          ? "Start Workout"
          : action === "view"
            ? "View Results"
            : "Locked"}
      </button>
    </div>
  );
};