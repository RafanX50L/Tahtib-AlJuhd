import AdminLayout from "@/components/admin/AdminLayout";
import ApprovedTrainersTable from "@/components/admin/TrainerManagment/ApprovedTrainers";
import PendingApplicationsTable from "@/components/admin/TrainerManagment/PendingApplicationsTable";
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
  return (
    <AdminLayout title="Trainer Management">
      <ApprovedTrainersTable/>
      <PendingApplicationsTable />
    </AdminLayout>
  );
};

export default ATrainerManagment;
