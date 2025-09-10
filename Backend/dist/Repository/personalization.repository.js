"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalizationRepository = void 0;
const base_repository_1 = require("./base.repository");
const Personalization_model_1 = require("../models/Personalization.model");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils");
const status_constant_1 = require("../constants/status.constant");
const response_message_constant_1 = require("../constants/response-message.constant");
class PersonalizationRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Personalization_model_1.PersonalizationModel);
    }
    async updatePersonalizationById(id, personalization) {
        return await this.model.findByIdAndUpdate(id, { personalization }, { new: true });
    }
    async getPersonalization(userId) {
        return this.findOne({ userId });
    }
    async getClientPersonalizationPopulatedProfilePicture(userId) {
        return await this.model
            .findById(new mongoose_1.Types.ObjectId(userId))
            .populate("data.userData.profilePictureId");
    }
    async updateProfilePictureId(clientId, signedUrl) {
        console.log('fndfij');
        const data = await this.model.findOne({ userId: clientId });
        console.log('data', data);
        const personalData = await this.model.findOneAndUpdate({ userId: clientId }, { "data.userData.profilePictureId": signedUrl }, { upsert: true, new: true });
        if (!personalData) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, response_message_constant_1.HttpResponse.SERVER_ERROR);
        }
        return personalData;
    }
    async updateClientProfileData(userId, formdata) {
        return await this.model.findOneAndUpdate({ userId: userId }, { $set: { 'data.userData.phoneNumber': formdata.phoneNumber, 'data.userData.address': formdata.address } }, { new: true } // optional: returns the updated document
        );
    }
    async updateClientWorkoutCompletionCounter(userId) {
        return await this.model.findOneAndUpdate({ userId }, { $inc: { "data.userData.workoutsCompletedIn28Days": 1 } }, { new: true, runValidators: true });
    }
    async findByUserId(userId) {
        return await Personalization_model_1.PersonalizationModel.findOne({ userId: new mongoose_1.Types.ObjectId(userId) });
    }
    async updateTrainerData(trainerId, updates) {
        const personalization = await Personalization_model_1.PersonalizationModel.findOneAndUpdate({ userId: new mongoose_1.Types.ObjectId(trainerId), role: 'trainer' }, { $set: { data: { ...updates } } }, { new: true });
        if (!personalization)
            throw new Error('Trainer personalization not found');
        return personalization;
    }
    async updateClientData(clientId, updates) {
        const personalization = await Personalization_model_1.PersonalizationModel.findOneAndUpdate({ userId: new mongoose_1.Types.ObjectId(clientId), role: 'client' }, { $set: { data: { ...updates } } }, { new: true });
        if (!personalization)
            throw new Error('Client personalization not found');
        return personalization;
    }
}
exports.PersonalizationRepository = PersonalizationRepository;
//# sourceMappingURL=personalization.repository.js.map