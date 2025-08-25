import { Types } from "mongoose";

export interface IChatMessage{
    sender: Types.ObjectId;
    text: string;
    date: string;
    time: string;
}
export interface IChatService {
    getChatById(id: string): Promise<IChatMessage[] | null>
    addMessage(chatId: string, senderId: string, content: string): Promise<void>;
}