"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBotController = void 0;
const status_constant_1 = require("../../constants/status.constant");
const response_message_constant_1 = require("../../constants/response-message.constant");
const ClientChatBotDTO_1 = require("../../dtos/reverse-mapping/client/ClientChatBotDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class ChatBotController {
    _chatBotService;
    constructor(_chatBotService) {
        this._chatBotService = _chatBotService;
    }
    async getSessions(req, res, next) {
        try {
            const clientId = req.user?.id;
            const sessions = await this._chatBotService.getSessions(clientId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { sessions }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async createSession(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = ClientChatBotDTO_1.ClientChatBotDTO.validateCreateSessionRequest(req.body);
            const clientId = req.user?.id;
            const session = await this._chatBotService.createSession(clientId, validatedBody.title);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { session }, response_message_constant_1.HttpResponse.CREATING_CHAT_BOT_SESSION_SUCCESSFULL, status_constant_1.HttpStatus.CREATED);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async deleteSession(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = ClientChatBotDTO_1.ClientChatBotDTO.validateDeleteSessionRequest(req.params);
            await this._chatBotService.deleteSession(validatedParams.sessionId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, response_message_constant_1.HttpResponse.CHAT_BOT_SESSION_DELETION_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getInteractions(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = ClientChatBotDTO_1.ClientChatBotDTO.validateGetInteractionsRequest(req.params);
            const interactions = await this._chatBotService.getInteractions(validatedParams.sessionId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { interactions }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async sendMessage(req, res, next) {
        try {
            // Validate and transform request parameters and body using DTOs
            const sessionId = req.params.sessionId;
            const validatedBody = ClientChatBotDTO_1.ClientChatBotDTO.validateSendMessageRequest(req.body);
            const interactions = await this._chatBotService.sendMessage(sessionId, validatedBody.message);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, interactions, "Message sent successfully", status_constant_1.HttpStatus.CREATED);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.ChatBotController = ChatBotController;
//# sourceMappingURL=client.hatBot.controller.js.map