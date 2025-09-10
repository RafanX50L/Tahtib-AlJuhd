"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBotDTO = void 0;
class ChatBotDTO {
    /**
     * Map an array of IChatBotSession to an array of IChatBotSessionView
     */
    static async mapToChatSessionData(raw) {
        return raw.map((session) => ({
            id: session._id.toString(),
            lastInteraction: session.lastInteraction,
            createdAt: session.createdAt.toISOString(),
            title: session.title || undefined,
            messageCount: session.messageCount,
        }));
    }
    /**
     * Map an array of IChatBotnteraction to an array of IChatBotInteractionView
     */
    static async mapToChatBotInteractionData(raw) {
        return raw.map((interaction) => ({
            id: interaction._id,
            content: interaction.content,
            createdAt: interaction.createdAt.toISOString(),
            isUser: interaction.isUser,
        }));
    }
}
exports.ChatBotDTO = ChatBotDTO;
//# sourceMappingURL=ChatBotDTO.js.map