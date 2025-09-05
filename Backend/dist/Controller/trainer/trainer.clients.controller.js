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
export class TrainerClientsController {
    constructor(_trainerClientService, _chatService) {
        this._trainerClientService = _trainerClientService;
        this._chatService = _chatService;
    }
    getClients(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.user.role !== 'trainer') {
                    res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' });
                }
                const trainerId = req.query.trainerId;
                if (trainerId !== req.user.id) {
                    res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden: Cannot access other trainers' });
                }
                const clients = yield this._trainerClientService.getClients(trainerId);
                res.status(HttpStatus.OK).json({ data: clients });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    getChatMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.user.role !== 'trainer') {
                    res.status(401).json({ error: 'Unauthorized' });
                }
                const { chatId } = req.params;
                const messages = yield this._chatService.getChatById(chatId);
                res.status(200).json({ data: messages });
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
}
//# sourceMappingURL=trainer.clients.controller.js.map