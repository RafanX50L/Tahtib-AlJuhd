export interface ITrainerPlan {
  _id: string;
  name: string;
  price: number;
  sessionsPerWeek: number;
  description: string;
  duration: number;
}

export interface ITrainerByIdView {
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