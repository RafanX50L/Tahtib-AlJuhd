var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseRepository } from "./base.repository";
import { ChatBotSessionModel } from "../models/chatBotSession.model";
export class ChatBotSessionRepository extends BaseRepository {
    constructor() {
        super(ChatBotSessionModel);
    }
    findByClientId(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({ clientId })
                .sort({ createdAt: -1 })
                .exec();
        });
    }
    // async create(session: ChatSession): Promise<ChatSession> {
    //   const newSession = new this.model(session);
    //   return await newSession.save();
    // }
    delete(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.deleteOne({ _id: sessionId }).exec();
        });
    }
}
//# sourceMappingURL=ChatBotSession.repository.js.map