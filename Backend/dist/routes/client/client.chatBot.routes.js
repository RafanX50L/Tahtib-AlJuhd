"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatBot_controller_1 = require("../../Controller/client/ChatBot.controller");
const ChatBotInteraction_repository_1 = require("../../Repository/ChatBotInteraction.repository");
const ChatBotSession_repository_1 = require("../../Repository/ChatBotSession.repository");
const ChatBot_service_1 = require("../../Services/client/ChatBot.service");
const express_1 = require("express");
const chatBotRouter = (0, express_1.Router)();
const chatBotSessionRepo = new ChatBotSession_repository_1.ChatBotSessionRepository();
const chatBotInteractionRepo = new ChatBotInteraction_repository_1.ChatBotInteractionRepository();
const chatBotService = new ChatBot_service_1.ChatBotService(chatBotSessionRepo, chatBotInteractionRepo);
const chatBotController = new ChatBot_controller_1.ChatBotController(chatBotService);
chatBotRouter
    .route('/chatBot/sessions')
    .get(chatBotController.getSessions.bind(chatBotController))
    .post(chatBotController.createSession.bind(chatBotController));
chatBotRouter
    .route('/chatBot/sessions/:sessionId')
    .delete(chatBotController.deleteSession.bind(chatBotController));
chatBotRouter
    .route('/chatBot/sessions/:sessionId/interactions')
    .get(chatBotController.getInteractions.bind(chatBotController))
    .post(chatBotController.sendMessage.bind(chatBotController));
exports.default = chatBotRouter;
//# sourceMappingURL=client.chatBot.routes.js.map