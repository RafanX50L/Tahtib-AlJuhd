export interface IClientService{

    generateFitnessPlan(userData:any):Promise<string>;
    getBasicFitnessPlan(userId:string):Promise<any>;
    getWorkouts(userId:string,week:string):Promise<any>;
    getWeekCompletionStatus(userId:string):Promise<any>;
}