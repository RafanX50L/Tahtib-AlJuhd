import { IChat } from "../model/IChat";
import { IBaseRepository } from "./IBase.repository";

export interface IChatRepository extends IBaseRepository<IChat> {
  // create(chat: IChat): Promise<IChat>;
  // findById(id: string): Promise<IChat | null>;
  addMessage(chatId: string, senderId: string, content: string): Promise<IChat | null> 
}