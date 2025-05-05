export interface IAdminRepository {
    findAllClientsWithPersonalization():Promise< any>;
    updateStatusWithId(id:string,status:string):Promise<any>;
    findAllTrainersWithPersonalization():Promise<any>;
}