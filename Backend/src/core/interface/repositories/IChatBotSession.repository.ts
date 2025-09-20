import { IChatBotSession } from "../model/IChatBotSession.model";
import { IBaseRepository } from "./IBase.repository";

export interface IChatBotSessionRepository extends IBaseRepository<IChatBotSession>{
    findByClientId(clientId: string): Promise<IChatBotSession[]> ;
    delete(sessionId: string): Promise<void>;
}