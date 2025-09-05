var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpStatus } from '../../constants/status.constant';
import { HttpResponse } from '../../constants/response-message.constant';
export class ChatBotController {
    constructor(_chatBotService) {
        this._chatBotService = _chatBotService;
    }
    getSessions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const sessions = yield this._chatBotService.getSessions(clientId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, sessions });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { title } = req.body;
                const session = yield this._chatBotService.createSession(clientId, title);
                console.log('session', session);
                res.status(HttpStatus.CREATED).json({ message: HttpResponse.CREATING_CHAT_BOT_SESSION_SUCCESSFULL, session });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionId = req.params.sessionId;
                yield this._chatBotService.deleteSession(sessionId);
                res.status(HttpStatus.OK).send({ message: HttpResponse.CHAT_BOT_SESSION_DELETION_SUCCESSFULL });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getInteractions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionId = req.params.sessionId;
                const interactions = yield this._chatBotService.getInteractions(sessionId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, interactions });
            }
            catch (error) {
                next(error);
            }
        });
    }
    sendMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionId = req.params.sessionId;
                const { message } = req.body;
                const interactions = yield this._chatBotService.sendMessage(sessionId, message);
                res.status(HttpStatus.CREATED).json(interactions);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
//# sourceMappingURL=ChatBot.controller.js.map