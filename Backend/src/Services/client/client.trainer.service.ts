import { IClientPersonalization } from "@/core/interface/model/IPersonalization.model";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { ITrainerPersonalizationRepository } from "@/core/interface/repositories/ITrainer.personalization.repository";
import { IUserRepository } from "@/core/interface/repositories/IUser.repository";
import { IClientTrainerService } from "@/core/interface/services/client/IClinet.Trainer.service";
import { ClientTrainerDTO } from "@/dtos/client/TrainerDTO";

export class clientTrainerService implements IClientTrainerService{
    constructor(
        private readonly _trainerRepo: ITrainerPersonalizationRepository,
        private readonly _userRepo: IUserRepository,
        private readonly _clinetRepo: IPersonalizationRepository,
    ) {}
    placeholder?: null;

    async getAvailableTrainers(userId:string,page: number, limit: number, search: string, specialty: string) {
        const currentTrainerId = ((await this._clinetRepo.findOne({userId:userId})).data as IClientPersonalization).currentTrainerId?.toString() || "";
        const result = await this._trainerRepo.getAvailableTrainer(currentTrainerId,page, limit, search, specialty);
        const mappedResult = result.trainers.map((data)=>(ClientTrainerDTO.mapToTrainerData(data)));

        return {
            mappedResult,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            total: result.total
        };
    }
};