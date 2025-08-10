import { IChatBotnteraction } from "../../model/IChatBotInteraction.model";
import { IChatBotSession } from "../../model/IChatBotSession.model";

export interface IChatBotService{
    getSessions(clientId: string): Promise<IChatBotSession[]>;
    createSession(clientId: string, title?: string): Promise<IChatBotSession>;
    deleteSession(sessionId: string): Promise<void>;
    getInteractions(sessionId: string): Promise<IChatBotnteraction[]>;
    sendMessage(sessionId: string, message: string): Promise<IChatBotnteraction[]>;
}