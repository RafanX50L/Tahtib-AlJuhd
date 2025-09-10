    import { IClientPersonalization } from "@/core/interface/model/IPersonalization.model";
import { IPlan } from "@/core/interface/model/IPlan";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { IPlanRepository } from "@/core/interface/repositories/IPlanRepository";
import { ITrainerPersonalizationRepository } from "@/core/interface/repositories/ITrainer.personalization.repository";
import { ITrainerClientContractRepository } from "@/core/interface/repositories/ITrainerClientContract.repository";
import { IUserRepository } from "@/core/interface/repositories/IUser.repository";
import { ISessionRepository } from "@/core/interface/repositories/ISession.repository";
import {  IClientTrainerService, ITrainerByIdResult } from "@/core/interface/services/client/IClinet.Trainer.service";
import { ClientTrainerDTO } from "@/dtos/client/TrainerDTO";
import { generateSignedUrl } from "@/utils/s3Storage.utils";
import { Types } from "mongoose";
import { differenceInHours } from "date-fns";
import { HttpResponse } from "@/constants/response-message.constant";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";

export class clientTrainerService implements IClientTrainerService{
    constructor(
        private readonly _trainerRepo: ITrainerPersonalizationRepository,
        private readonly _userRepo: IUserRepository,
        private readonly _clinetRepo: IPersonalizationRepository,
        private readonly _planRepo: IPlanRepository,
        private readonly _contractRepo: ITrainerClientContractRepository,
        private readonly _sessionRepo: ISessionRepository,
    ) {}
    placeholder?: null;

    async contractExpiration() {
        const now = new Date();
        const expiredContracts = await this._contractRepo.findExpiredContracts(now);

        for (const contract of expiredContracts) {
            const personalizationDoc = await this._clinetRepo.findOne({
            userId: contract.clientId,
            });
            if (!personalizationDoc) continue;

            const data = personalizationDoc.data as IClientPersonalization;

            if (data.currentTrainerId?.toString() === contract.trainerId.toString()) {
            data.previousTrainers.push({
                trainerId: contract.trainerId,
                startDate: contract.startDate,
                endDate: contract.endDate,
            });
            data.currentTrainerId = null;
            }

            data.planStatus = "Inactive";
            await personalizationDoc.save();

            console.log(`⚡ Contract expired for client ${contract.clientId}`);
        }
        }


    async getAvailableTrainers(userId:string,page: number, limit: number, search: string, specialty: string) {
        let currentTrainerId = ((await this._clinetRepo.findOne({userId:userId})).data as IClientPersonalization).currentTrainerId?.toString() || "";
        const contract = await this.getCurrentTrainerContract(userId);
        if (!contract || contract.endDate < new Date()) {
            currentTrainerId = null;
        }
        const result = await this._trainerRepo.getAvailableTrainer(currentTrainerId,page, limit, search, specialty);
        console.log('available trainers:', result); 
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
    async getTrainerById(id: string):Promise<ITrainerByIdResult> {
        console.log(id);
        const user = (await this._userRepo.findById(new Types.ObjectId(id))) ;
        const trainer = await this._trainerRepo.getTrainerProfileData(user.personalizationId.toString());
        const plans = await this._planRepo.findByTrainerId(id);
        if (!trainer) throw new Error('Trainer not found');
        const data = trainer.data;
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
                _id: plan._id.toString(),
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
        const contract = await this.getCurrentTrainerContract(userId);
        if (!contract || contract.endDate < new Date()) {
            // throw createHttpError(HttpStatus.,'Current trainer contract has expired');
            return null;
        }
        if (!currentTrainerId) throw new Error('No current trainer found for this user');
        const trainer = (await this._userRepo.findById(currentTrainerId));
        const result = await this._trainerRepo.getTrainerProfileData(trainer.personalizationId.toString());
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
        // throw new Error('No active contract found');
        return null;
        }
        const plan = contract.planId as unknown as IPlan;
        return {
            id: contract.id.toString(),
            chatId: contract.chatId.toString(),
            sessionsRemaining: contract.sessionsRemaining,
            trainerId: contract.trainerId.toString(),
            planName: plan.title || 'Custom Plan',
            endDate: contract.endDate,
        };
    }

    async bookSlot(clientId: string, sessionId: string) {
        const session = await this._sessionRepo.findById(new Types.ObjectId(sessionId));
        if (!session || session.clientId || session.status !== 'free') {
            throw new Error('Slot not available');
        }

        const contract = await this._contractRepo.findActiveByClientAndTrainer(clientId, session.trainerId.toString());
        if (!contract || contract.sessionsRemaining <= 0) {
            throw new Error('No remaining sessions in your plan');
        }

        if (contract.endDate < new Date()) {
            throw new Error('Your plan has expired');
        }

        session.clientId = new Types.ObjectId(clientId);
        session.planId = contract.planId;
        session.status = 'booked';
        session.meetingLink = `https://zoom.us/j/${Math.random().toString(36).substring(2, 15)}`;

        await this._sessionRepo.update(session.id, session);
        await this._contractRepo.decrementSessionsRemaining(contract._id!.toString());

        return HttpResponse.SLOT_BOOKING_SUCCESSFULL;
    }

    async cancelSession(clientId: string, sessionId: string) {
        const session = await this._sessionRepo.findById(new Types.ObjectId(sessionId));
        if (!session) {
            throw new Error('Session not found');
        }

        if (session.clientId?.toString() !== clientId) {
            throw new Error('You can only cancel your own sessions');
        }

        const contract = await this._contractRepo.findById(session.planId);
        if (!contract) {
            throw new Error('Contract not found');
        }

        const hoursToStart = differenceInHours(session.startTime, new Date());
        if (hoursToStart > 24) {
            session.status = 'cancelled';
            session.clientId = undefined;
            session.planId = undefined;
            session.meetingLink = undefined;
            await this._contractRepo.incrementSessionsRemaining(contract._id!.toString());
        } else {
            session.status = 'cancelled';
        }

        await this._sessionRepo.update(session.id, session);
        return HttpResponse.SLOT_CANCELLING_SUCCESSFULL;
    }
};