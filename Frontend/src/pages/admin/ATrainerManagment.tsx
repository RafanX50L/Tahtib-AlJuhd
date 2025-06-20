import Header from "../../components/admin/TrainerManagment/Header";
import Sidebar from "../../components/admin/Sidebar";
import { HelpCircle, Info } from "lucide-react";
import TrainerStatsCard from "@/components/admin/TrainerManagment/TrainerStatsCard";
import ApprovedTrainersTable from "@/components/admin/TrainerManagment/ApprovedTrainers";
import PendingApplicationsTable from "@/components/admin/TrainerManagment/PendingApplicationsTable";
import { useEffect, useState } from "react";
import { AdminService } from "@/services/implementation/adminServices";
import { toast } from "sonner";
import { response } from "express";
import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  status: "active" | "inactive";
  isActive: boolean;
  role: "client" | "trainer" | "admin";
  personalization?: IPersonalization;
}

export interface IPersonalization extends Document {
  userId: Types.ObjectId;
  role: "client" | "trainer" | "admin";
  data:
    | IClientPersonalization
    | ITrainerPersonalization
    | IAdminPersonalization;
}

export interface IClientPersonalization {
  trainer: string;
  planStatus: "Active" | "Inactive";
  sessionStatus: "Purchased" | "Not Purchased";
}

export interface ITrainerPersonalization {
  specialty: string;
  experience: string;
  monthlyFee: string;
  expertiseLevel: "beginner" | "intermediate" | "advanced";
  isActive: boolean;
}

export interface IAdminPersonalization {
  adminNotes?: string;
}

export interface ITrainerWithPersonalization {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  role: string;
  status:
    | "applied"
    | "interview_scheduled"
    | "interviewed"
    | "approved"
    | "rejected";
  createdAt: string;
  updatedAt: string;
  interviewDetails: {
    roomId: string;
    interviewDate: Date;
    startTime: string;
    endTime: string;
    completed: boolean;
    result: {
      communicationSkills: number;
      technicalKnowledge: number;
      coachingStyle: number;
      confidencePresence: number;
      brandAlignment: number;
      equipmentQuality: number;
      notes: string;
    };
  };
  basicInfo: {
    phoneNumber: string;
    location: string;
    timeZone: string;
    dateOfBirth: string; // or Date if parsed
    age: number | null;
    gender: "male" | "female" | string;
    profilePhoto: string; // filePath URL
    weeklySalary:number
  };

  professionalSummary: {
    yearsOfExperience: number;
    specializations: string[];
    coachingType: string[];
    platformsUsed: string[];
    certifications: [
      {
        name: string;
        issuer: string;
        proofFile?: string;
      },
    ];
  };

  sampleMaterials: {
    demoVideoLink: string;
    portfolioLinks: string[];
    resumeFile: string; // filePath URL
  };

  availability: {
    weeklySlots: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
    engagementType: string;
  };
}

const ATrainerManagment = () => {
  const [trainerData, setTrainerData] = useState<ITrainerWithPersonalization[]>(
    []
  );
  const [approvedTrainers, setApprovedTrainers] = useState<
    ITrainerWithPersonalization[]
  >([]);
  const [pendingTrainers, setPendingTrainers] = useState<
    ITrainerWithPersonalization[]
  >([]);
  const [refetch, setRefetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await AdminService.getAllTrainers();
        console.log("Trainer data fetched:", response.data);
        const trainers = response.data as ITrainerWithPersonalization[];
        setTrainerData(trainers);

        // Separate approved and pending trainers
        const approved = trainers.filter(
          (trainer) => trainer.status === "approved"
        );
        const pending = trainers.filter(
          (trainer) => trainer.status === "applied"
        );

        setApprovedTrainers(approved);
        setPendingTrainers(pending);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error("Error fetching trainer data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        toast.error(errorMessage);
        setIsLoading(false);
      }
    };
    fetchTrainerData();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading Trainer Managment page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <main className="px-6 py-8">
          <TrainerStatsCard />
          <ApprovedTrainersTable/>
          <PendingApplicationsTable />
        </main>
        <footer className="px-6 py-4 bg-gray-900 mt-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 FitConnect Admin Portal. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <HelpCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Info className="w-5 h-5" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ATrainerManagment;
