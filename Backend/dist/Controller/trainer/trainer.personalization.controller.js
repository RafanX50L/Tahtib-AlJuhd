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
import logger from "../../utils/logger.utils";
export class TrainerPersonalizationController {
    constructor(_personalizationService) {
        this._personalizationService = _personalizationService;
    }
    submitApplication(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                console.log("nice one");
                yield this._personalizationService.submitApplication(userId, req);
                console.log("nice one1");
                res
                    .status(HttpStatus.OK)
                    .json({ message: HttpResponse.APPLICATION_SUBMISSION_SUCCESSFULL });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPendingApplicationDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                logger.info('enterd to fetch details');
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const data = yield this._personalizationService.getPendingApplicationDetails(userId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProfileData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const result = yield this._personalizationService.getTrainerProfile(userId);
                console.log('result', result);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, data: result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProfileData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const userId = req.user.id;
                console.log(data);
                yield this._personalizationService.updateProfileData(userId, data);
                res.status(HttpStatus.OK).json({ message: HttpResponse.PROFILE_DATA_UPDATION_SUCCESSFULL });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSalary(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const salary = yield this._personalizationService.getSalary(userId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, salary });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
//# sourceMappingURL=trainer.personalization.controller.js.map