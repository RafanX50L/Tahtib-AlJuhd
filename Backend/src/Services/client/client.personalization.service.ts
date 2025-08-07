import { HttpResponse } from "@/constants/response-message.constant";
import {
  IClientPersonalization,
  IClientUserData,
  IPersonalization,
} from "@/core/interface/model/IPersonalization.model";
import { IDietPlanRepository } from "@/core/interface/repositories/IDietPlan.repository";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { IUserRepository } from "@/core/interface/repositories/IUser.repository";
import { IWorkoutPlanRepository } from "@/core/interface/repositories/IWorkoutPlan.repository";
import {  ClientProfileData, IClientPersonalizationService } from "@/core/interface/services/client/IClient.Personalization.Service";
import { generateFitnessPlan } from "@/utils/gemini1.utils";
import mongoose, { Types } from "mongoose";
import { Diet, Workout } from "@/constants/SampleData";
import { IWorkoutPlan } from "@/core/interface/model/IWorkoutPlan.model";
import { IDietPlan } from "@/core/interface/model/IDietPlan.model";
import { IUserFile } from "@/core/interface/model/IUserFile.model";
import { generateSignedUrl } from "@/utils/s3Storage.utils";
import { IUserFileRepository } from "@/core/interface/repositories/IUserFile.repository";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";
// import { IWorkoutPlan } from "@/core/interface/model/IWorkoutPlan.model";

export class ClientPersonalizationService
  implements IClientPersonalizationService
{
  constructor(
    private readonly _personalizationRepository: IPersonalizationRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _workoutPlanRepository: IWorkoutPlanRepository,
    private readonly _dietPlanRepository: IDietPlanRepository,
    private readonly _userFileRepository: IUserFileRepository
  ) {}

  async generatePersonalization(
    userId: string,
    userData: Partial<IClientUserData>
  ) {
    console.log(userData, userId);
    const workout = await generateFitnessPlan(userData, 1, "workout") as IWorkoutPlan;
    const diet = await generateFitnessPlan(userData, 1, "diet");
    // const diet = Diet;
    // const workout = {
    //   week1: Workout.week1,
    //   week2: null,
    //   week3: null,
    //   week4: null,
    //   notes: Workout.notes,
    // };

    const workoutPlan = (await this._workoutPlanRepository.create(
      workout
    )) as IWorkoutPlan;

    const dietPlan = (await this._dietPlanRepository.create(
      diet.dietPlan
    )) as IDietPlan;

    const personalizationData: IClientPersonalization = {
      planStatus: "Inactive",
      userData: {
        nickName: userData.nickName,
        age: userData.age,
        gender: userData.gender,
        height: userData.height,
        currentWeight: userData.currentWeight,
        targetWeight: userData.targetWeight,
        fitnessGoal: userData.fitnessGoal,
        currentFitnessLevel: userData.currentFitnessLevel,
        activityLevel: userData.activityLevel,
        equipment: userData.equipment || [],
        workoutDuration: userData.workoutDuration,
        workoutDaysPerWeek: userData.workoutDaysPerWeek,
        healthIssues: userData.healthIssues || null,
        medicalCondition: userData.medicalCondition || null,
        dietAllergies: userData.dietAllergies || null,
        dietMealsPerDay: userData.dietMealsPerDay,
        dietPreferences: userData.dietPreferences || null,
        workoutsCompletedIn28Days: 0,
      },
      workoutPlanId: new mongoose.Types.ObjectId(workoutPlan.id),
      dietPlanId: new mongoose.Types.ObjectId(dietPlan.id),
      progressLogId: null,
      sessionsId: null,
      chatsId: null,
    };

    // const personalization =
    //   await this._personalizationRepository.createPersonalization(
    //     personalizationData,
    //     userId,
    //     "client"
    //   );
    const personalization = await this._personalizationRepository.create({userId:new Types.ObjectId(userId),role:"client",data:personalizationData});
    await this._userRepository.updatePersonalizationsId(
      userId,
      personalization._id as string
    );
    return HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL;
  }

  async getWorkoutDetails(userId: string) {
    const personalization = await this._personalizationRepository.findOne({
      userId,
    });
    const clientUserData = (personalization.data as IClientPersonalization)
      .userData;

    const workouts = await this._workoutPlanRepository.findById(
      (personalization.data as IClientPersonalization).workoutPlanId
    );
    return {
      basicData: {
        workoutDuration: clientUserData.workoutDuration,
        workoutDaysPerWeek: clientUserData.workoutDaysPerWeek,
        workoutCompleted: clientUserData.workoutsCompletedIn28Days,
        notes: workouts.notes,
      },
      weekStatus: {
        week1: true,
        week2: workouts?.week1?.completed || false,
        week3: workouts?.week2?.completed || false,
        week4: workouts?.week3?.completed || false,
      },
    };
  }

  async getProfileData(userId: string) {
    const user = await this._userRepository.findById(
      new Types.ObjectId(userId)
    );
    if (!user) throw new Error("User not found");

    const personalization =
      await this.getClientPersonalizationPopulatedProfilePicture(userId);
    const clientData = (personalization.data as IClientPersonalization)
      .userData as IClientUserData;

    const profileFile = clientData.profilePictureId as IUserFile | undefined;
    const profilePictureUrl = profileFile?.filePath
      ? await generateSignedUrl(profileFile.filePath)
      : null;

    return {
      name: user.name,
      email: user.email,
      phoneNumber: clientData.phoneNumber,
      address: clientData.address,
      profilePicture: profilePictureUrl,
    };
  }

  async getClientPersonalizationPopulatedProfilePicture(
    userId: string
  ): Promise<IPersonalization> {
    const personalization = await this._personalizationRepository.findOne({
      userId,
    });
    if (!personalization) throw new Error("Personalization not found");

    const clientData = personalization.data as IClientPersonalization;
    const pictureId = clientData.userData?.profilePictureId;

    const profilePic = await this._userFileRepository.findById(
      pictureId as Types.ObjectId
    );

    if (profilePic) {
      (clientData.userData as IClientUserData).profilePictureId = profilePic;
    }

    return personalization;
  }

  async updateClientProfile(userId: string, formdata: ClientProfileData) {
    
  const user = await this._userRepository.update(userId,{name:formdata.name});
    const updated = await this._personalizationRepository.updateClientProfileData(userId,formdata);
    if (!updated || !user) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        HttpResponse.FAILED_TO_UPDATE_PROFILE
      );
    }

    return updated;
  }
}
