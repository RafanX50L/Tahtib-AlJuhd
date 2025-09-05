var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpResponse } from "../../constants/response-message.constant";
import { generateFitnessPlan } from "../../utils/gemini1.utils";
import mongoose, { Types } from "mongoose";
import { generateSignedUrl } from "../../utils/s3Storage.utils";
import { createHttpError } from "../../utils";
import { HttpStatus } from "../../constants/status.constant";
// import { IWorkoutPlan } from "../../core/interface/model/IWorkoutPlan.model";
export class ClientPersonalizationService {
    constructor(_personalizationRepository, _userRepository, _workoutPlanRepository, _dietPlanRepository, _userFileRepository) {
        this._personalizationRepository = _personalizationRepository;
        this._userRepository = _userRepository;
        this._workoutPlanRepository = _workoutPlanRepository;
        this._dietPlanRepository = _dietPlanRepository;
        this._userFileRepository = _userFileRepository;
    }
    generatePersonalization(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userData, userId);
            const workout = yield generateFitnessPlan(userData, 1, "workout");
            const diet = yield generateFitnessPlan(userData, 1, "diet");
            // const diet = Diet;
            // const workout = {
            //   week1: Workout.week1,
            //   week2: null,
            //   week3: null,
            //   week4: null,
            //   notes: Workout.notes,
            // };
            const workoutPlan = (yield this._workoutPlanRepository.create(workout));
            const dietPlan = (yield this._dietPlanRepository.create(diet.dietPlan));
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
                workoutPlanId: new mongoose.Types.ObjectId(workoutPlan.id),
                dietPlanId: new mongoose.Types.ObjectId(dietPlan.id),
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
            const personalization = yield this._personalizationRepository.create({ userId: new Types.ObjectId(userId), role: "client", data: personalizationData });
            yield this._userRepository.updatePersonalizationsId(userId, personalization._id);
            return HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL;
        });
    }
    getWorkoutDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const personalization = yield this._personalizationRepository.findOne({
                userId,
            });
            const clientUserData = personalization.data
                .userData;
            const workouts = yield this._workoutPlanRepository.findById(personalization.data.workoutPlanId);
            return {
                basicData: {
                    workoutDuration: clientUserData.workoutDuration,
                    workoutDaysPerWeek: clientUserData.workoutDaysPerWeek,
                    workoutCompleted: clientUserData.workoutsCompletedIn28Days,
                    notes: workouts.notes,
                },
                weekStatus: {
                    week1: true,
                    week2: ((_a = workouts === null || workouts === void 0 ? void 0 : workouts.week1) === null || _a === void 0 ? void 0 : _a.completed) || false,
                    week3: ((_b = workouts === null || workouts === void 0 ? void 0 : workouts.week2) === null || _b === void 0 ? void 0 : _b.completed) || false,
                    week4: ((_c = workouts === null || workouts === void 0 ? void 0 : workouts.week3) === null || _c === void 0 ? void 0 : _c.completed) || false,
                },
            };
        });
    }
    getProfileData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(new Types.ObjectId(userId));
            if (!user)
                throw new Error("User not found");
            const personalization = yield this.getClientPersonalizationPopulatedProfilePicture(userId);
            const clientData = personalization.data
                .userData;
            const profileFile = clientData.profilePictureId;
            const profilePictureUrl = (profileFile === null || profileFile === void 0 ? void 0 : profileFile.filePath)
                ? yield generateSignedUrl(profileFile.filePath)
                : null;
            return {
                name: user.name,
                email: user.email,
                phoneNumber: clientData.phoneNumber,
                address: clientData.address,
                profilePicture: profilePictureUrl,
            };
        });
    }
    getClientPersonalizationPopulatedProfilePicture(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const personalization = yield this._personalizationRepository.findOne({
                userId,
            });
            if (!personalization)
                throw new Error("Personalization not found");
            const clientData = personalization.data;
            const pictureId = (_a = clientData.userData) === null || _a === void 0 ? void 0 : _a.profilePictureId;
            const profilePic = yield this._userFileRepository.findById(pictureId);
            if (profilePic) {
                clientData.userData.profilePictureId = profilePic;
            }
            return personalization;
        });
    }
    updateClientProfile(userId, formdata) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.update(userId, { name: formdata.name });
            const updated = yield this._personalizationRepository.updateClientProfileData(userId, formdata);
            if (!updated || !user) {
                throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.FAILED_TO_UPDATE_PROFILE);
            }
            return updated;
        });
    }
}
//# sourceMappingURL=client.personalization.service.js.map