export interface IClientTrainerService{
    placeholder?:null;
    getAvailableTrainers(userId:string,page: number, limit: number, search: string, specialty: string);
}