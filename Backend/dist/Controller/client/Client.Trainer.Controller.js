"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientTrainerController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
class ClientTrainerController {
    _clinetTrainerServ;
    constructor(_clinetTrainerServ) {
        this._clinetTrainerServ = _clinetTrainerServ;
    }
    placeholder;
    async getAvailableTrainers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const specialty = req.query.specialty || "";
            const userId = req.user?.id;
            const result = await this._clinetTrainerServ.getAvailableTrainers(userId, page, limit, search, specialty);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, availableTrainers: result.mappedResult, currentPage: result.currentPage, totalPages: result.totalPages, total: result.total });
        }
        catch (error) {
            next(error);
        }
    }
    async getTrainerById(req, res, next) {
        try {
            const trainerId = req.params.id;
            const trainerData = await this._clinetTrainerServ.getTrainerById(trainerId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, trainerData });
        }
        catch (error) {
            next(error);
        }
    }
    async getCurrentTrainer(req, res, next) {
        try {
            const userId = req.user?.id;
            const trainerData = await this._clinetTrainerServ.getCurrentTrainer(userId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, trainerData });
        }
        catch (error) {
            next(error);
        }
    }
    async getCurrentTrainerContract(req, res, next) {
        try {
            const userId = req.user?.id;
            const contractData = await this._clinetTrainerServ.getCurrentTrainerContract(userId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, contractData });
        }
        catch (error) {
            next(error);
        }
    }
    async bookSlot(req, res, next) {
        try {
            const userId = req.user?.id;
            const { sessionId } = req.body;
            const result = await this._clinetTrainerServ.bookSlot(userId, sessionId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, result });
        }
        catch (error) {
            next(error);
        }
    }
    async cancelSession(req, res, next) {
        try {
            const userId = req.user?.id;
            const { sessionId } = req.params;
            const result = await this._clinetTrainerServ.cancelSession(userId, sessionId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ClientTrainerController = ClientTrainerController;
;
//# sourceMappingURL=Client.Trainer.Controller.js.map