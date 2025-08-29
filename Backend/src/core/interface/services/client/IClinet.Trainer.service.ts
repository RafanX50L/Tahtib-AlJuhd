import { TrainerData } from "@/dtos/client/TrainerDTO";

export interface IAvailableTrainersResult {
  mappedResult: TrainerData[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export interface ITrainerPlan {
  _id: string;
  name: string;
  price: number;
  sessionsPerWeek: number;
  description: string;
  duration: number;
}

export interface ITrainerByIdResult {
  id: string;
  name: string;
  email: string;
  Specialty: string[];
  photo: string;
  experience: string;
  location: string;
  price: number;
  plans: ITrainerPlan[];
}

export interface ICurrentTrainerResult {
  id: string;
  name: string;
  speciality: string[];
  photo: string;
  experience: number;
  price: number;
}

export interface ICurrentTrainerContractResult {
  id: string;
  chatId: string;
  sessionsRemaining: number;
  trainerId: string;
  planName: string;
  endDate: Date;
}


export interface IClientTrainerService{
    placeholder?:null;
    getAvailableTrainers(userId:string,page: number, limit: number, search: string, specialty: string):Promise<IAvailableTrainersResult>;
    getTrainerById(id: string): Promise<ITrainerByIdResult>;
    getCurrentTrainer(userId: string):Promise<ICurrentTrainerResult>;
    getCurrentTrainerContract(userId: string):Promise<ICurrentTrainerContractResult>;
    bookSlot(clientId: string, sessionId: string):Promise<string>;
    cancelSession(clientId: string, sessionId: string):Promise<string>;
}