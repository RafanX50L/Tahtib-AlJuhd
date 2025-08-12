import { IChat } from "../../model/IChat";

export interface IChatService {
    getChatById(id: string): Promise<IChat | null>;
    addMessage(chatId: string, senderId: string, content: string): Promise<void>;
}