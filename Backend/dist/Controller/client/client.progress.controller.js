"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientProgressController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
class ClientProgressController {
    progressService;
    constructor(progressService) {
        this.progressService = progressService;
    }
    async addEntry(req, res, next) {
        try {
            const userId = req.user.id;
            const { date, weight, height } = req.body;
            await this.progressService.addEntry(userId, new Date(date), Number(weight), Number(height));
            res.status(status_constant_1.HttpStatus.CREATED).json({ message: response_message_constant_1.HttpResponse.DATA_CREATION_SUCCESSFULL });
        }
        catch (error) {
            next(error);
        }
    }
    async getCurrentStatus(req, res, next) {
        try {
            const userId = req.user.id;
            const current = await this.progressService.getCurrentStatus(userId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, current });
        }
        catch (error) {
            next(error);
        }
    }
    async getGraphData(req, res, next) {
        try {
            const userId = req.user.id;
            const { start, end } = req.query;
            const points = await this.progressService.getGraphData(userId, new Date(start), new Date(end));
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, points });
        }
        catch (error) {
            next(error);
        }
    }
    async previewEntry(req, res, next) {
        try {
            const { date, weight, height } = req.body;
            const preview = await this.progressService.previewEntry(new Date(date), Number(weight), Number(height));
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, preview, warning: 'Preview only. This will not be stored in the database.' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ClientProgressController = ClientProgressController;
//# sourceMappingURL=client.progress.controller.js.map