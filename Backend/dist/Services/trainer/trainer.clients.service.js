"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerClientService = void 0;
const s3Storage_utils_1 = require("../../utils/s3Storage.utils");
class TrainerClientService {
    _contractRepo;
    _chatRepo;
    _userfileRepo;
    constructor(_contractRepo, _chatRepo, _userfileRepo) {
        this._contractRepo = _contractRepo;
        this._chatRepo = _chatRepo;
        this._userfileRepo = _userfileRepo;
    }
    async getClients(trainerId) {
        const contracts = await this._contractRepo.findActiveContractsByTrainerId(trainerId);
        console.log(contracts);
        return Promise.all(contracts.map(async (contract) => {
            const plan = contract.planId;
            const chat = contract.chatId;
            const client = contract.clientId;
            const personalization = client.personalizationId.data;
            const photo = await this._userfileRepo.findById(personalization.userData.profilePictureId);
            const photoUrl = photo ? await (0, s3Storage_utils_1.generateSignedUrl)(photo.filePath) : null;
            console.log('nice');
            console.log('mesaages', chat?.messages[chat?.messages.length - 1]?.content);
            const lastMessage = chat?.messages?.[chat.messages.length - 1];
            let lastMessageTime;
            if (lastMessage?.timestamp) {
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
                name: client?.name,
                photo: photoUrl,
                planName: plan?.title || 'Custom Plan',
                startDate: contract.startDate.toISOString(),
                endDate: contract.endDate.toISOString(),
                sessionsRemaining: contract.sessionsRemaining,
                chatId: contract.chatId.id.toString(),
                lastMessage: lastMessage?.content,
                lastMessageTime,
            };
        }));
    }
    async sendMessage(chatId, senderId, content) {
        const chat = await this._chatRepo.addMessage(chatId, senderId, content);
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
    }
}
exports.TrainerClientService = TrainerClientService;
//# sourceMappingURL=trainer.clients.service.js.map