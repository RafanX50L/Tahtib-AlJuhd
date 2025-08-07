export interface IAdminCommonService{
    placeholder?:never;
    blockOrUnblock(userId:string):Promise<void>;
}