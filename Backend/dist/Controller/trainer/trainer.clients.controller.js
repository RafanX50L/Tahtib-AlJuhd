"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerClientsController = void 0;
const status_constant_1 = require("../../constants/status.constant");
class TrainerClientsController {
    _trainerClientService;
    _chatService;
    constructor(_trainerClientService, _chatService) {
        this._trainerClientService = _trainerClientService;
        this._chatService = _chatService;
    }
    async getClients(req, res, next) {
        try {
            if (!req.user?.id || req.user.role !== 'trainer') {
                res.status(status_constant_1.HttpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' });
            }
            const trainerId = req.query.trainerId;
            if (trainerId !== req.user.id) {
                res.status(status_constant_1.HttpStatus.FORBIDDEN).json({ error: 'Forbidden: Cannot access other trainers' });
            }
            const clients = await this._trainerClientService.getClients(trainerId);
            res.status(status_constant_1.HttpStatus.OK).json({ data: clients });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getChatMessages(req, res, next) {
        try {
            if (!req.user?.id || req.user.role !== 'trainer') {
                res.status(401).json({ error: 'Unauthorized' });
            }
            const { chatId } = req.params;
            const messages = await this._chatService.getChatById(chatId);
            res.status(200).json({ data: messages });
        }
        catch (error) {
            next(error);
        }
    }
    ;
}
exports.TrainerClientsController = TrainerClientsController;
//# sourceMappingURL=trainer.clients.controller.js.map