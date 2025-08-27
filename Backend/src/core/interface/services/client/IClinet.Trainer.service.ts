export interface IClientTrainerService{
    placeholder?:null;
    getAvailableTrainers(userId:string,page: number, limit: number, search: string, specialty: string);
    getTrainerById(id: string);
    getCurrentTrainer(userId: string);
    getCurrentTrainerContract(userId: string);
    bookSlot(clientId: string, sessionId: string);
    cancelSession(clientId: string, sessionId: string);
}