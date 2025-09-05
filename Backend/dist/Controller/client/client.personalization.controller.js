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
import { HttpStatus } from "../../constants/status.constant";
export class ClientPersonalizationController {
    constructor(_personalizationServices) {
        this._personalizationServices = _personalizationServices;
    }
    generatePersonalization(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const clientPersonalizationData = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                yield this._personalizationServices.generatePersonalization(userId, clientPersonalizationData);
                res.status(HttpStatus.CREATED).json({
                    message: HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getWorkoutDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const workoutDetails = yield this._personalizationServices.getWorkoutDetails(userId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, workoutDetails: workoutDetails });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProfileData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const profileData = yield this._personalizationServices.getProfileData(userId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, data: profileData });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateClientProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const formdata = req.body;
                console.log(req.body);
                yield this._personalizationServices.updateClientProfile(userId, formdata);
                res.status(HttpStatus.OK).json({ success: true, message: HttpResponse.PROFILE_DATA_UPDATION_SUCCESSFULL });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
//# sourceMappingURL=client.personalization.controller.js.map