import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { ITrainerInterview } from "@/core/interface/model/ITrainerInterview.model";
import { ITrainerInterviewRepository } from "@/core/interface/repositories/ITraienrInterview.repository";
import { ITrainerPersonalizationRepository } from "@/core/interface/repositories/ITrainer.personalization.repository";
import { IUserRepository } from "@/core/interface/repositories/IUser.repository";
import { IAdminTrainerSerice } from "@/core/interface/services/admin/IAdmin.Trainer.Service";
import { AdminTrainerDTO, TrainerCardDTO } from "@/dtos/admin/TrainerDTO";
import { createHttpError } from "@/utils";
import { sendInterviewScheduleEmail, sendTrainerApprovalEmail, sendTrainerRejectionEmail } from "@/utils/send-email.util";
import  { Types } from "mongoose";

export class AdminTrainerSerice implements IAdminTrainerSerice {
  constructor(
    private readonly _personalizationRepository: ITrainerPersonalizationRepository,
    private readonly _trainerInterviewRepository: ITrainerInterviewRepository,
    private readonly _userRepository: IUserRepository
  ) {}
  async getApprovedTrainers(
    page: number,
    limit: number,
    search: string
  ): Promise<{ data: TrainerCardDTO[]; totalCount: number }> {
    const { data, totalCount } =
      await this._personalizationRepository.getApprovedTrainers(
        page,
        limit,
        search
      );

      console.log(data,totalCount);
    const mapped: TrainerCardDTO[] = await Promise.all(
      data.map((trainer) =>
        AdminTrainerDTO.mapApprovedTrainerToDTO(trainer)
      )
    );

    console.log(mapped);

    return { data: mapped, totalCount };
  }

  async getPendingTrainers(page: number, limit: number, search: string) {
    const raw = await this._personalizationRepository.getPendingTrainers(
      page,
      limit,
      search
    );
    console.log(raw.data);
    if(!raw){
      createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.FAILED_TO_FETCH_PENDING_TRAINERS);
    }
    const transformed = await AdminTrainerDTO.toTrainerListDTO({
      data: raw.data,
      totalCount: raw.totalCount,
    });

    return transformed;
  }
  // trainerInterview.service.ts
  async scheduleInterview(
    trainerId: string,
    adminId: string,
    date: Date | string,
    time: string
  ): Promise<{ success: boolean; message: string }> {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw createHttpError(400, "Invalid date format received");
    }

    const dateString = parsedDate.toISOString().split("T")[0];
    const startTime = new Date(`${dateString}T${time}`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1hr duration

    const hasConflict = await this._trainerInterviewRepository.checkConflict(
      adminId,
      startTime
    );

    if (hasConflict) {
      throw createHttpError(
        HttpStatus.CONFLICT,
        "This time overlaps with another scheduled interview."
      );
    }

    const interviewData = {
        adminId: adminId,
        trainerId: trainerId,
        startTime,
        endTime,
        date: new Date(dateString),
        roomId: "room_" + Math.random().toString(36).substring(2, 10),
        result: null
    };
    console.log('upto here');
    const interview = await this._trainerInterviewRepository.create(interviewData);
    
    console.log('upto here3');
    await this._personalizationRepository.updateInterviewDetails(
        trainerId,
        interview.id
    );
    console.log(trainerId);
    
    const user = await this._userRepository.findById(new Types.ObjectId(trainerId));
    console.log(user);

    await sendInterviewScheduleEmail(
      user.email,
      user.name,
      interview.date,
      interview.startTime
    );

    return { success: true, message: "Interview scheduled successfully." };
  }

  async submitInterviewFeedback(trainerId:string,adminId:string,feedback:ITrainerInterview["result"]){
    const data = await this._trainerInterviewRepository.updateInterviewResult(trainerId,adminId,feedback);
    if(data === null){
      throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.FAILED_TO_UPDATE_INTERVIEW_FEEDBACK) ;
    }
    const updated = await this._personalizationRepository.updateTrainerStatus(trainerId,"interviewed");

    if(updated==null){
      throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.FAILED_TO_UPDATE_INTERVIEW_FEEDBACK) ;
    }

    return { success:true};
  }
  async approveTrainer(trainerId:string,salary:number){
    const response = await this._personalizationRepository.approveTrainer(trainerId,salary);
    const user = await this._userRepository.findById(new Types.ObjectId( trainerId));
    await sendTrainerApprovalEmail(user.email,user.name);
    if(!response || !user){
      throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.FAILED_TO_UPDATE_TRAINER_STATUS);
    }
    return;
  }
  async rejectTrainer(trainerId:string){
    const response = await this._personalizationRepository.updateTrainerStatus(trainerId,'rejected');
    const user = await this._userRepository.findById(new Types.ObjectId( trainerId));
    await sendTrainerRejectionEmail(user.email,user.name);
    if(!response || !user){
      throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.FAILED_TO_UPDATE_TRAINER_STATUS);
    }
    return;
  }
}