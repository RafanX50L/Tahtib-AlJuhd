import { useEffect, useState, useCallback } from "react";
import Header from "@/components/trainer/Profile/Header";
import TrainerProfile from "@/components/trainer/Profile/Profile";
import Sidebar from "@/components/trainer/Sidebar";
import { TrainerService } from "@/services/implementation/trainerServices";

export interface ITrainerWithPersonalization {
  _id: string;
  name: string;
  email: string;
  basicInfo: {
      profilePhoto?: string;
    phoneNumber: string;
    location: string;
    timeZone: string;
    dateOfBirth?: string;
    age?: number;
    gender?: string;
  };
  professionalSummary: {
    yearsOfExperience: number;
    certifications: { name: string; issuer: string; proofFile:string }[];
    specializations: string[];
    coachingType: string[];
    platformsUsed: string[];
  };
  availability: {
    engagementType: string;
    weeklySlots?: { day: string; startTime: string; endTime: string }[];
  };
  sampleMaterials: {
    demoVideoLink: string;
    portfolioLinks?: string[];
  };
  evaluation?: {
    communicationSkills?: number;
    technicalKnowledge?: number;
    coachingStyle?: number;
    confidencePresence?: number;
    brandAlignment?:number;
    equipmentQuality?:number;
    notes?: string;
  };
}

const isValidTrainerData = (data: unknown): data is ITrainerWithPersonalization => {
  const d = data as ITrainerWithPersonalization;
  return (
    !!d &&
    typeof d._id === "string" &&
    typeof d.name === "string" &&
    typeof d.email === "string" &&
    !!d.basicInfo &&
    typeof d.basicInfo.phoneNumber === "string" &&
    typeof d.basicInfo.location === "string" &&
    typeof d.basicInfo.timeZone === "string" &&
    !!d.professionalSummary &&
    typeof d.professionalSummary.yearsOfExperience === "number" &&
    Array.isArray(d.professionalSummary.certifications) &&
    Array.isArray(d.professionalSummary.specializations) &&
    Array.isArray(d.professionalSummary.coachingType) &&
    Array.isArray(d.professionalSummary.platformsUsed) &&
    !!d.availability &&
    typeof d.availability.engagementType === "string" &&
    !!d.sampleMaterials &&
    typeof d.sampleMaterials.demoVideoLink === "string"
  );
};

interface TProfileProps {
  trainerService?: typeof TrainerService;
}

const TProfile: React.FC<TProfileProps> = ({ trainerService = TrainerService }) => {
  const [trainerData, setTrainerData] = useState<ITrainerWithPersonalization | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refetchTrainerData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await trainerService.getProfileData();
      if (isValidTrainerData(response)) {
        setTrainerData(response);
        setError(null);
      } else {
        setError("Invalid profile data received.");
      }
    } catch (err) {
      setError("Failed to load profile data. Please try again.");
      console.error("Error fetching trainer data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [trainerService]);

  useEffect(() => {
    refetchTrainerData();
  }, [refetchTrainerData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading trainer profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#ffffff] font-sans flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 lg:ml-[280px]">
        <Header />
        {error ? (
          <div className="text-red-400 text-center text-lg">{error}</div>
        ) : !trainerData ? (
          <div className="text-white/80 text-center text-lg">No profile data available.</div>
        ) : (
          <TrainerProfile trainerData={trainerData} refetchTrainerData={refetchTrainerData} />
        )}
      </main>
    </div>
  );
};

export default TProfile;