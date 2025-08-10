import { IChatBotnteraction } from "../model/IChatBotInteraction.model";
import { IBaseRepository } from "./IBase.repository";

export interface IChatBotInteractionRepository extends IBaseRepository<IChatBotnteraction>{
    findBySessionId(sessionId: string): Promise<IChatBotnteraction[]>;
}