import { IClientRepository } from "../../repositories/interface/IClient.repository";
import { IClientService } from "../interface/IClient.service";
import { HttpResponse } from "../../constants/response-message.constant";
import { createHttpError } from "../../utils";
import { HttpStatus } from "../../constants/status.constant";
import generateFitnessPlan from "../../utils/gemini1.utils";
import { IClientUserData } from "@/models/interface/IPersonalization";
// import { writeFile } from "fs";

export class ClientService implements IClientService {
  constructor(private readonly _clientRepository: IClientRepository) {}

  async generateFitnessPlan(userData: any) {
    try {
      // Validate required fields
      const requiredFields: (keyof IClientUserData)[] = [
        "nick_name",
        "age",
        "gender",
        "height",
        "current_weight",
        "target_weight",
        "fitness_goal",
        "current_fitness_level",
        "activity_level",
        "workout_days_perWeek",
        "diet_meals_perDay",
      ];

      for (const field of requiredFields) {
        if (!userData[field]) {
          throw createHttpError(
            HttpStatus.BAD_REQUEST,
            `Missing Required Field: ${field}`
          );
        }
      }
      console.log(userData);

      

      const plan = await generateFitnessPlan(userData);

      // console.log("plan created",plan);

      await this._clientRepository.SaveWorkoutsDietsPersonalization(userData,plan);

      // const planString = JSON.stringify(plan, null, 2);

      return HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL;
    } catch (error) {
      console.error("API Error:", error);
      //   res.status(500).json({ error: "Failed to generate fitness plan" });
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_GENERATE_FITNESS_PLAN
      );
    }
  }
}
