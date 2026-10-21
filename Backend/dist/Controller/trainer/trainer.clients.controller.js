"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerClientsController = void 0;
const status_constant_1 = require("../../constants/status.constant");
const TrainerClientsDTO_1 = require("../../dtos/reverse-mapping/trainer/TrainerClientsDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
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
                return;
            }
            // Validate and transform request parameters using DTO
            const validatedParams = TrainerClientsDTO_1.TrainerClientsDTO.validateGetClientsRequest(req.query);
            if (validatedParams.trainerId !== req.user.id) {
                res.status(status_constant_1.HttpStatus.FORBIDDEN).json({ error: 'Forbidden: Cannot access other trainers' });
                return;
            }
            const clients = await this._trainerClientService.getClients(validatedParams.trainerId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, clients, "Clients retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    ;
    async getChatMessages(req, res, next) {
        try {
            if (!req.user?.id || req.user.role !== 'trainer') {
                res.status(status_constant_1.HttpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' });
                return;
            }
            // Validate and transform request parameters using DTO
            const validatedParams = TrainerClientsDTO_1.TrainerClientsDTO.validateGetChatMessagesRequest(req.params);
            const messages = await this._chatService.getChatById(validatedParams.chatId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, messages, "Chat messages retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    ;
}
exports.TrainerClientsController = TrainerClientsController;
//# sourceMappingURL=trainer.clients.controller.js.map