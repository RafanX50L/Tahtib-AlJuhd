import { useEffect, useState } from "react";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import WorkoutCards from "@/components/client/Workouts/WorkoutCards";
import LevelTabs from "@/components/client/Workouts/LevelTabs";
import Sidebar from "@/components/client/Sidebar";
import CFooter from "@/components/client/Footer";
import CWHeader from "@/components/client/Workouts/CWHeader";
import MainCard from "@/components/client/Workouts/MainCard";
import ChatbotButton from "@/components/client/ChatbotButton";
import { ClientService } from "@/services/implementation/clientServices";

// Define the response type for ClientService.getWorkouts
interface WorkoutResponse {
  data: {
    workouts: Workout[];
    notes?: string; // Notes are optional, as per previous context
  };
}

interface Exercise {
  name: string;
  duration: string;
}

interface Workout {
  day: string;
  status: "completed" | "today" | "locked";
  exercises: Exercise[];
  action: "view" | "start" | "locked";
}

export interface MainData {
  notes?: string;
  workoutDuration: string;
  workoutDaysPerWeek: number;
  workoutCompleted: number;
}

interface WeekStatuses {
  [key: string]: boolean;
}

const WorkoutPlan = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [mainData, setMainData] = useState<MainData | null>(null);
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [weekStatuses, setWeekStatuses] = useState<WeekStatuses | null>(null);
  const [currentWeekStatus, setCurrentWeekStatus] = useState<boolean | null>(
    null
  );

  // Fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch workouts when activeTab or weekStatuses changes
  useEffect(() => {
    if (weekStatuses && `week${activeTab}` in weekStatuses) {
      fetchWorkoutsForTab();
    }
  }, [activeTab, weekStatuses]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const workoutDetails = await ClientService.getBasicWorkoutDetails();

      const { basicData, weekStatus } = workoutDetails.data.workoutDetails;
      setMainData(basicData);
      setWeekStatuses(weekStatus);
      setCurrentWeekStatus(weekStatus[`week${activeTab}`]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch initial data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkoutsForTab = async () => {
    try {
      setIsLoading(true);
      const response: WorkoutResponse =
        await ClientService.getWorkouts(activeTab);
      setWorkouts(response.data.workouts);
      setMainData(
        (prev) =>
          prev
            ? { ...prev, notes: response.data.notes || prev.notes } // Update notes if prev exists
            : null // Return null if prev is null, as we can't construct a full MainData
      );
      setCurrentWeekStatus(
        weekStatuses ? weekStatuses[`week${activeTab}`] : false
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch workouts."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchInitialData();
  };

  const renderWorkoutNotAvailable = () => (
    <div
      className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] mb-10 relative animate-[fadeIn_0.6s_ease-out_0.2s_forwards]"
      style={{
        borderRadius: "0.75rem",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        fontFamily:
          "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9F43] to-[#FF4757]" />
      <div className="p-6">
        <div className="border-2 border-[#2A3042] bg-[#1E2235] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-exclamation-circle text-[#FF4757] text-xl" />
            <h3 className="text-xl font-semibold text-white">
              Workout Not Available
            </h3>
          </div>
          <p className="text-[#A0A7B8] text-sm mb-4">
            Please complete the previous week's workouts before accessing this
            one.
          </p>
          <button
            className="min-w-[100px] bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white hover:-translate-y-1 hover:shadow-xl rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300"
            onClick={() => setActiveTab((prev) => Math.max(1, prev - 1))}
          >
            Go to Previous Week
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar />
      <main
        className={`pt-[70px] lg:pt-0 px-4 py-8 lg:px-8 lg:ml-[280px] transition-all ${styles.container}`}
      >
        {isLoading ? (
          <div
            className={styles.loaderContainer}
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              ></div>
              <p className="mt-4 text-white">Fetching your workout data...</p>
            </div>
          </div>
        ) : error ? (
          <div className={styles.loaderContainer} role="alert">
            <p className={styles.errorText}>{error}</p>
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <CWHeader />
            {mainData && <MainCard data={mainData} />}
            <LevelTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {workouts && currentWeekStatus !== null ? (
              <WorkoutCards
                workouts={workouts}
                weekStatus={currentWeekStatus}
                currentWeek={`week${activeTab}`}
              />
            ) : (
              renderWorkoutNotAvailable()
            )}
            <ChatbotButton />
            <CFooter />
          </>
        )}
      </main>
    </div>
  );
};

export default WorkoutPlan;
