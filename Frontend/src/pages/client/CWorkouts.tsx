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

interface MainData {
  title?: string;
  description?: string;
  details?: string;
  progress?: number;
  notes?: string;
}

interface FitnessDetailsResponse {
  data: MainData;
}

interface WorkoutsResponse {
  data: {
    workouts: Workout;
    notes: string;
  };
}

const WorkoutPlan = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [mainData, setMainData] = useState<MainData | null>(null);
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [weekStatuses, setWeekStatuses] = useState(null);
  const [currentWeekStatus, setCurrentWeekStatus] = useState<boolean | null>(null)


  // Fetch fitness details only on component mount
  useEffect(() => {
    const fetchFitnessDetails = async () => {
      console.log(localStorage.getItem('page'));
      
      try {
        setIsLoading(true);
        const response = await ClientService.getBasicFitnessDetails();
        const weekStatus = await ClientService.getWeekCompletionStatus();
        setWeekStatuses(weekStatus.data);
        setMainData((prev) => ({ ...prev, ...response.data }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch fitness details.");
      } finally {
        setIsLoading(false);
        console.log('main data',mainData);

      }
    };
    fetchFitnessDetails();
    return ()=>{
      
      localStorage.setItem('page','workout')
    }
  }, []); // Empty dependency array to run only on mount

  // Fetch workouts when activeTab changes
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        const response = await ClientService.getWorkouts(activeTab);
        setWorkouts(response.data.workouts);
        setMainData((prev) => prev ? { ...prev, notes: response.data.notes } : { notes: response.data.notes });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch workouts.");
      } finally {
        setIsLoading(false);
      }
      console.log(weekStatuses);
      setCurrentWeekStatus(activeTab === 1 ? true : weekStatuses[`week${activeTab}`]);
      console.log(currentWeekStatus);
    };
    fetchWorkouts();
  }, [activeTab]);

  // Retry handler
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Fetch both fitness details and workouts
    Promise.all([
      ClientService.getBasicFitnessDetails() as Promise<FitnessDetailsResponse>,
      ClientService.getWorkouts(activeTab) as Promise<WorkoutsResponse>,
    ])
      .then(([fitnessResponse, workoutsResponse]) => {
        setMainData({
          ...fitnessResponse.data,
          notes: workoutsResponse.data.notes,
        });
        setWorkouts(workoutsResponse.data.workouts);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to fetch data.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar />
      <main className={`lg:ml-[280px] p-8 min-h-screen transition-all duration-300 ${styles.container}`}>
        {isLoading ? (
          <div className={styles.loaderContainer} role="status" aria-live="polite">
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              ></div>
              <p className="mt-4 text-white">Fetching user Workout Data...</p>
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
            {workouts && <WorkoutCards workouts={workouts} weekStatus={currentWeekStatus} />}
            <ChatbotButton />
            <CFooter />
          </>
        )}
      </main>
    </div>
  );
};

export default WorkoutPlan;