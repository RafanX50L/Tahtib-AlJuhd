export interface IUserFileService {
    /** Reserved for User File specific methods */
  _placeholder?: never;
  updateProfilePicture(userId: string, file: Express.Multer.File, role:string):Promise<{signedUrl:string}>;
}