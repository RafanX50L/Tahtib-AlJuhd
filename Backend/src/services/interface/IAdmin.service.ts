export interface IAdminService {
    getAllClients: () => Promise<any>;
    updateClientStatus: (id:string,status:string)=> Promise<string>;
    getAllTrainers: () => Promise<any>;
    updateTrainertatus: (id:string,status:string)=> Promise<string>;
}