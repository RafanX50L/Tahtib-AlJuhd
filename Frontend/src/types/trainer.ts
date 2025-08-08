export interface Trainer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'applied' | 'interview_scheduled' | 'interviewed' | 'approved' | 'rejected';
  interview: {
    adminId?: string;
    startTime?: Date;
    endTime?: Date;
    date?: Date;
    roomId?: string;
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
  professionalSummary: {
    yearsOfExperience: number;
    specializations: string[];
    coachingType: string[];
  };
}

export interface Filters {
  startDate: string;
  endDate: string;
  trainer: string;
  statuses: {
    scheduled: boolean;
    pending: boolean;
    completed: boolean;
    canceled: boolean;
  };
}

export interface Session {
  time: string;
  trainer: string;
  trainerId: string;
  pending: boolean;
}
