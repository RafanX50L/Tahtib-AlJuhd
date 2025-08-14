    import { IClientPersonalization } from "@/core/interface/model/IPersonalization.model";
import { IPlan } from "@/core/interface/model/IPlan";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { IPlanRepository } from "@/core/interface/repositories/IPlanRepository";
import { ITrainerPersonalizationRepository } from "@/core/interface/repositories/ITrainer.personalization.repository";
import { ITrainerClientContractRepository } from "@/core/interface/repositories/ITrainerClientContract.repository";
import { IUserRepository } from "@/core/interface/repositories/IUser.repository";
import { IClientTrainerService } from "@/core/interface/services/client/IClinet.Trainer.service";
import { ClientTrainerDTO } from "@/dtos/client/TrainerDTO";
import { generateSignedUrl } from "@/utils/s3Storage.utils";
import { Types } from "mongoose";

export class clientTrainerService implements IClientTrainerService{
    constructor(
        private readonly _trainerRepo: ITrainerPersonalizationRepository,
        private readonly _userRepo: IUserRepository,
        private readonly _clinetRepo: IPersonalizationRepository,
        private readonly _planRepo: IPlanRepository,
        private readonly _contractRepo: ITrainerClientContractRepository,
    ) {}
    placeholder?: null;

    async getAvailableTrainers(userId:string,page: number, limit: number, search: string, specialty: string) {
        const currentTrainerId = ((await this._clinetRepo.findOne({userId:userId})).data as IClientPersonalization).currentTrainerId?.toString() || "";
        const result = await this._trainerRepo.getAvailableTrainer(currentTrainerId,page, limit, search, specialty);
        const mappedResult = await Promise.all(
        result.trainers.map((data) => ClientTrainerDTO.mapToTrainerData(data))
        );
        return {
            mappedResult,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            total: result.total
        };
    }
    async getTrainerById(id: string) {
        console.log(id);
        const user = (await this._userRepo.findById(new Types.ObjectId(id))) ;
        const trainer = await this._trainerRepo.getTrainerProfileData(user.personalizationId.toString());
        const plans = await this._planRepo.findByTrainerId(id);
        if (!trainer) throw new Error('Trainer not found');
        const data = trainer.data;
        console.log('Trainer data:', trainer);
        console.log('plans data:', plans);
        return {
            id: id,
            name: user.name,
            email: user.email,
            Specialty: data.professionalSummary.specializations,
            photo: await generateSignedUrl( data.basicInfo.profilePhoto[0].filePath),
            experience: data.professionalSummary.yearsOfExperience.toString(),
            location: data.basicInfo.location,
            price: data.basicInfo.weeklySalary,
            plans: plans.map(plan => ({
                _id: plan._id,
                name: plan.title, // e.g., "4 Sessions/Month"
                price: plan.price, // e.g., 500
                sessionsPerWeek: plan.sessionsPerWeek, // e.g., 4
                description: plan.description,
                duration: plan.durationWeeks
            }))
        };
        // return ClientTrainerDTO.mapToTrainerData(trainer);
    }

    async getCurrentTrainer(userId: string) {
        const currentTrainerId = ((await this._clinetRepo.findOne({userId:userId})).data as IClientPersonalization).currentTrainerId;
        if (!currentTrainerId) throw new Error('No current trainer found for this user');
        const trainer = (await this._userRepo.findById(currentTrainerId));
        const result = await this._trainerRepo.getTrainerProfileData(trainer.personalizationId.toString());
        console.log(result);
        const data = result.data;
        return {
            id: currentTrainerId.toString(),
            name: trainer.name,
            speciality: data.professionalSummary.specializations,
            photo: await generateSignedUrl(data.basicInfo?.profilePhoto[0]?.filePath),
            experience: data.professionalSummary.yearsOfExperience,
            price: data.basicInfo.weeklySalary,
        };
    }

    async getCurrentTrainerContract(clientId: string) {
        const contract = await this._contractRepo.findActiveContractByClientId(clientId);
        if (!contract) {
        throw new Error('No active contract found');
        }
        const plan = contract.planId as unknown as IPlan;
        return {
            chatId: contract.chatId.toString(),
            sessionsRemaining: contract.sessionsRemaining,
            trainerId: contract.trainerId.toString(),
            planName: plan.title || 'Custom Plan',
        };
    }
};