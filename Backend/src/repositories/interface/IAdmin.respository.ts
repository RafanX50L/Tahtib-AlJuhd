export interface IAdminRepository {
    findAllClientsWithPersonalization():Promise< any>;
    updateStatusWithId(id:string,status:string | boolean):Promise<any>;
    findAllTrainersWithPersonalization():Promise<any>;
    IsBlocked(id:string):Promise<boolean>;
    getPendingTrainers(start:number,limit:number):Promise<any>;
}