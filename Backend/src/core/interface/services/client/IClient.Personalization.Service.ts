import { IClientUserData } from "../../model/IPersonalization.model";

interface IGetWorkoutDetails {
  basicData: {
    workoutDuration: string;
    workoutDaysPerWeek: number;
    workoutCompleted: number;
  };
  weekStatus: {
    week1: boolean;
    week2: boolean;
    week3: boolean;
    week4: boolean;
  };
}

interface IProfileDataReturn {
  name: string;
  email: string
  phoneNumber: string;
  address: string;
  profilePicture: string;
}

export interface ClientProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  profilePictureId: string;
}


export interface IClientPersonalizationService {
  generatePersonalization(
    userId: string,
    userData: Partial<IClientUserData>
  ): Promise<string>;
  getWorkoutDetails(userId: string): Promise<IGetWorkoutDetails>;
  getProfileData(userId: string): Promise<IProfileDataReturn>;
  updateClientProfile(userId: string, formdata: ClientProfileData)
}