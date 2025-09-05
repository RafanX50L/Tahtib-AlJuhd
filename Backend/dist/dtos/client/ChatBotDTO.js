var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ChatBotDTO {
    /**
     * Map an array of IChatBotSession to an array of IChatBotSessionView
     */
    static mapToChatSessionData(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            return raw.map((session) => ({
                id: session._id.toString(),
                lastInteraction: session.lastInteraction,
                createdAt: session.createdAt.toISOString(),
                title: session.title || undefined,
                messageCount: session.messageCount,
            }));
        });
    }
    /**
     * Map an array of IChatBotnteraction to an array of IChatBotInteractionView
     */
    static mapToChatBotInteractionData(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            return raw.map((interaction) => ({
                id: interaction._id.toString(),
                content: interaction.content,
                createdAt: interaction.createdAt.toISOString(),
                isUser: interaction.isUser,
            }));
        });
    }
}
//# sourceMappingURL=ChatBotDTO.js.map