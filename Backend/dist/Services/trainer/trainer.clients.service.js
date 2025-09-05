var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateSignedUrl } from "../../utils/s3Storage.utils";
export class TrainerClientService {
    constructor(_contractRepo, _chatRepo, _userfileRepo) {
        this._contractRepo = _contractRepo;
        this._chatRepo = _chatRepo;
        this._userfileRepo = _userfileRepo;
    }
    getClients(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contracts = yield this._contractRepo.findActiveContractsByTrainerId(trainerId);
            console.log(contracts);
            return Promise.all(contracts.map((contract) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const plan = contract.planId;
                const chat = contract.chatId;
                const client = contract.clientId;
                const personalization = client.personalizationId.data;
                const photo = yield this._userfileRepo.findById(personalization.userData.profilePictureId);
                const photoUrl = photo ? yield generateSignedUrl(photo.filePath) : null;
                console.log('nice');
                console.log('mesaages', (_a = chat === null || chat === void 0 ? void 0 : chat.messages[(chat === null || chat === void 0 ? void 0 : chat.messages.length) - 1]) === null || _a === void 0 ? void 0 : _a.content);
                const lastMessage = (_b = chat === null || chat === void 0 ? void 0 : chat.messages) === null || _b === void 0 ? void 0 : _b[chat.messages.length - 1];
                let lastMessageTime;
                if (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.timestamp) {
                    const messageDate = new Date(lastMessage.timestamp);
                    const now = new Date();
                    const isToday = messageDate.toDateString() === now.toDateString();
                    const yesterday = new Date();
                    yesterday.setDate(now.getDate() - 1);
                    const isYesterday = messageDate.toDateString() === yesterday.toDateString();
                    const time = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    if (isToday) {
                        lastMessageTime = `Today, ${time}`;
                    }
                    else if (isYesterday) {
                        lastMessageTime = `Yesterday, ${time}`;
                    }
                    else {
                        lastMessageTime = `${messageDate.toLocaleDateString()}, ${time}`;
                    }
                }
                return {
                    _id: contract.clientId.id.toString(),
                    name: client === null || client === void 0 ? void 0 : client.name,
                    photo: photoUrl,
                    planName: (plan === null || plan === void 0 ? void 0 : plan.title) || 'Custom Plan',
                    startDate: contract.startDate.toISOString(),
                    endDate: contract.endDate.toISOString(),
                    sessionsRemaining: contract.sessionsRemaining,
                    chatId: contract.chatId.id.toString(),
                    lastMessage: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.content,
                    lastMessageTime,
                };
            })));
        });
    }
    sendMessage(chatId, senderId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this._chatRepo.addMessage(chatId, senderId, content);
            if (!chat) {
                throw new Error('Chat not found');
            }
            const newMessage = chat.messages[chat.messages.length - 1];
            return {
                text: newMessage.content,
                type: 'sent',
                time: `Today, ${newMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                sender: newMessage.senderId.toString(),
            };
        });
    }
}
//# sourceMappingURL=trainer.clients.service.js.map