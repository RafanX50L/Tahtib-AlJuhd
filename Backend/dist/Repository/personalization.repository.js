var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseRepository } from "./base.repository";
import { PersonalizationModel } from "../models/Personalization.model";
import { Types } from "mongoose";
import { createHttpError } from "../utils";
import { HttpStatus } from "../constants/status.constant";
import { HttpResponse } from "../constants/response-message.constant";
export class PersonalizationRepository extends BaseRepository {
    constructor() {
        super(PersonalizationModel);
    }
    updatePersonalizationById(id, personalization) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, { personalization }, { new: true });
        });
    }
    getPersonalization(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ userId });
        });
    }
    getClientPersonalizationPopulatedProfilePicture(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findById(new Types.ObjectId(userId))
                .populate("data.userData.profilePictureId");
        });
    }
    updateProfilePictureId(clientId, signedUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('fndfij');
            const data = yield this.model.findOne({ userId: clientId });
            console.log('data', data);
            const personalData = yield this.model.findOneAndUpdate({ userId: clientId }, { "data.userData.profilePictureId": signedUrl }, { upsert: true, new: true });
            if (!personalData) {
                throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.SERVER_ERROR);
            }
            return personalData;
        });
    }
    updateClientProfileData(userId, formdata) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate({ userId: userId }, { $set: { 'data.userData.phoneNumber': formdata.phoneNumber, 'data.userData.address': formdata.address } }, { new: true } // optional: returns the updated document
            );
        });
    }
    updateClientWorkoutCompletionCounter(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate({ userId }, { $inc: { "data.userData.workoutsCompletedIn28Days": 1 } }, { new: true, runValidators: true });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PersonalizationModel.findOne({ userId: new Types.ObjectId(userId) });
        });
    }
    updateTrainerData(trainerId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const personalization = yield PersonalizationModel.findOneAndUpdate({ userId: new Types.ObjectId(trainerId), role: 'trainer' }, { $set: { data: Object.assign({}, updates) } }, { new: true });
            if (!personalization)
                throw new Error('Trainer personalization not found');
            return personalization;
        });
    }
    updateClientData(clientId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const personalization = yield PersonalizationModel.findOneAndUpdate({ userId: new Types.ObjectId(clientId), role: 'client' }, { $set: { data: Object.assign({}, updates) } }, { new: true });
            if (!personalization)
                throw new Error('Client personalization not found');
            return personalization;
        });
    }
}
//# sourceMappingURL=personalization.repository.js.map