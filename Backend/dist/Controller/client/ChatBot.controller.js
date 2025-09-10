"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBotController = void 0;
const status_constant_1 = require("../../constants/status.constant");
const response_message_constant_1 = require("../../constants/response-message.constant");
class ChatBotController {
    _chatBotService;
    constructor(_chatBotService) {
        this._chatBotService = _chatBotService;
    }
    async getSessions(req, res, next) {
        try {
            const clientId = req.user?.id;
            const sessions = await this._chatBotService.getSessions(clientId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, sessions });
        }
        catch (error) {
            next(error);
        }
    }
    async createSession(req, res, next) {
        try {
            const clientId = req.user?.id;
            const { title } = req.body;
            const session = await this._chatBotService.createSession(clientId, title);
            console.log('session', session);
            res.status(status_constant_1.HttpStatus.CREATED).json({ message: response_message_constant_1.HttpResponse.CREATING_CHAT_BOT_SESSION_SUCCESSFULL, session });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteSession(req, res, next) {
        try {
            const sessionId = req.params.sessionId;
            await this._chatBotService.deleteSession(sessionId);
            res.status(status_constant_1.HttpStatus.OK).send({ message: response_message_constant_1.HttpResponse.CHAT_BOT_SESSION_DELETION_SUCCESSFULL });
        }
        catch (error) {
            next(error);
        }
    }
    async getInteractions(req, res, next) {
        try {
            const sessionId = req.params.sessionId;
            const interactions = await this._chatBotService.getInteractions(sessionId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, interactions });
        }
        catch (error) {
            next(error);
        }
    }
    async sendMessage(req, res, next) {
        try {
            const sessionId = req.params.sessionId;
            const { message } = req.body;
            const interactions = await this._chatBotService.sendMessage(sessionId, message);
            res.status(status_constant_1.HttpStatus.CREATED).json(interactions);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ChatBotController = ChatBotController;
//# sourceMappingURL=ChatBot.controller.js.map