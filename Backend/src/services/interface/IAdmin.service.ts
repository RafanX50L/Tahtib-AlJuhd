
export interface IAdminService  {
    getAllClients: (userid:string) => Promise<any>;
    updateClientStatus: (id:string,status:string)=> Promise<string>;
    getAllTrainers: () => Promise<any>;
    updateTrainertatus: (id:string,status:string)=> Promise<string>;
}