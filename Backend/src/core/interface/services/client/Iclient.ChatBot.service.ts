import { IChatBotSessionView, IChatBotInteractionView } from "@/dtos/client/ChatBotDTO";

export interface IChatBotService{
    getSessions(clientId: string): Promise<IChatBotSessionView[]>;
    createSession(clientId: string, title?: string): Promise<IChatBotSessionView>;
    deleteSession(sessionId: string): Promise<void>;
    getInteractions(sessionId: string): Promise<IChatBotInteractionView[]>;
    sendMessage(sessionId: string, message: string): Promise<IChatBotInteractionView[]>;
}