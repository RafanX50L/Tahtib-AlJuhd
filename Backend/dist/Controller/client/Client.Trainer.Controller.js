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
export class ClientTrainerController {
    constructor(_clinetTrainerServ) {
        this._clinetTrainerServ = _clinetTrainerServ;
    }
    getAvailableTrainers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || "";
                const specialty = req.query.specialty || "";
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const result = yield this._clinetTrainerServ.getAvailableTrainers(userId, page, limit, search, specialty);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, availableTrainers: result.mappedResult, currentPage: result.currentPage, totalPages: result.totalPages, total: result.total });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTrainerById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.params.id;
                const trainerData = yield this._clinetTrainerServ.getTrainerById(trainerId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, trainerData });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCurrentTrainer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const trainerData = yield this._clinetTrainerServ.getCurrentTrainer(userId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, trainerData });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCurrentTrainerContract(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const contractData = yield this._clinetTrainerServ.getCurrentTrainerContract(userId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, contractData });
            }
            catch (error) {
                next(error);
            }
        });
    }
    bookSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { sessionId } = req.body;
                const result = yield this._clinetTrainerServ.bookSlot(userId, sessionId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    cancelSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { sessionId } = req.params;
                const result = yield this._clinetTrainerServ.cancelSession(userId, sessionId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, result });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
;
//# sourceMappingURL=Client.Trainer.Controller.js.map