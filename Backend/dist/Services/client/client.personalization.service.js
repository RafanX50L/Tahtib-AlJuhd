"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPersonalizationService = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const gemini1_utils_1 = require("../../utils/gemini1.utils");
const mongoose_1 = __importStar(require("mongoose"));
const s3Storage_utils_1 = require("../../utils/s3Storage.utils");
const utils_1 = require("../../utils");
const status_constant_1 = require("../../constants/status.constant");
// import { IWorkoutPlan } from "../../core/interface/model/IWorkoutPlan.model";
class ClientPersonalizationService {
    _personalizationRepository;
    _userRepository;
    _workoutPlanRepository;
    _dietPlanRepository;
    _userFileRepository;
    constructor(_personalizationRepository, _userRepository, _workoutPlanRepository, _dietPlanRepository, _userFileRepository) {
        this._personalizationRepository = _personalizationRepository;
        this._userRepository = _userRepository;
        this._workoutPlanRepository = _workoutPlanRepository;
        this._dietPlanRepository = _dietPlanRepository;
        this._userFileRepository = _userFileRepository;
    }
    async generatePersonalization(userId, userData) {
        console.log(userData, userId);
        const workout = await (0, gemini1_utils_1.generateFitnessPlan)(userData, 1, "workout");
        const diet = await (0, gemini1_utils_1.generateFitnessPlan)(userData, 1, "diet");
        // const diet = Diet;
        // const workout = {
        //   week1: Workout.week1,
        //   week2: null,
        //   week3: null,
        //   week4: null,
        //   notes: Workout.notes,
        // };
        const workoutPlan = (await this._workoutPlanRepository.create(workout));
        const dietPlan = (await this._dietPlanRepository.create(diet.dietPlan));
        const personalizationData = {
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
            workoutPlanId: new mongoose_1.default.Types.ObjectId(workoutPlan.id),
            dietPlanId: new mongoose_1.default.Types.ObjectId(dietPlan.id),
            progressLogId: null,
            sessionsId: null,
            chatsId: null,
            previousTrainers: []
        };
        // const personalization =
        //   await this._personalizationRepository.createPersonalization(
        //     personalizationData,
        //     userId,
        //     "client"
        //   );
        const personalization = await this._personalizationRepository.create({ userId: new mongoose_1.Types.ObjectId(userId), role: "client", data: personalizationData });
        await this._userRepository.updatePersonalizationsId(userId, personalization._id);
        return response_message_constant_1.HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL;
    }
    async getWorkoutDetails(userId) {
        const personalization = await this._personalizationRepository.findOne({
            userId,
        });
        const clientUserData = personalization.data
            .userData;
        const workouts = await this._workoutPlanRepository.findById(personalization.data.workoutPlanId);
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
    async getProfileData(userId) {
        const user = await this._userRepository.findById(new mongoose_1.Types.ObjectId(userId));
        if (!user)
            throw new Error("User not found");
        const personalization = await this.getClientPersonalizationPopulatedProfilePicture(userId);
        const clientData = personalization.data
            .userData;
        const profileFile = clientData.profilePictureId;
        const profilePictureUrl = profileFile?.filePath
            ? await (0, s3Storage_utils_1.generateSignedUrl)(profileFile.filePath)
            : null;
        return {
            name: user.name,
            email: user.email,
            phoneNumber: clientData.phoneNumber,
            address: clientData.address,
            profilePicture: profilePictureUrl,
        };
    }
    async getClientPersonalizationPopulatedProfilePicture(userId) {
        const personalization = await this._personalizationRepository.findOne({
            userId,
        });
        if (!personalization)
            throw new Error("Personalization not found");
        const clientData = personalization.data;
        const pictureId = clientData.userData?.profilePictureId;
        const profilePic = await this._userFileRepository.findById(pictureId);
        if (profilePic) {
            clientData.userData.profilePictureId = profilePic;
        }
        return personalization;
    }
    async updateClientProfile(userId, formdata) {
        const user = await this._userRepository.update(userId, { name: formdata.name });
        const updated = await this._personalizationRepository.updateClientProfileData(userId, formdata);
        if (!updated || !user) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, response_message_constant_1.HttpResponse.FAILED_TO_UPDATE_PROFILE);
        }
        return updated;
    }
}
exports.ClientPersonalizationService = ClientPersonalizationService;
//# sourceMappingURL=client.personalization.service.js.map