var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseRepository } from './base.repository';
import { ChatBotInteractionModel } from '../models/ChatBotInteraction.model';
export class ChatBotInteractionRepository extends BaseRepository {
    constructor() {
        super(ChatBotInteractionModel);
    }
    findBySessionId(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({ sessionId })
                .sort({ createdAt: 1 })
                .exec();
        });
    }
    create(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const newInteraction = new this.model(interaction);
            return yield newInteraction.save();
        });
    }
}
//# sourceMappingURL=ChatBotInteraction.repository.js.map