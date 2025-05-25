export interface IClientService{

    generateFitnessPlan(userData:any):Promise<string>;

}