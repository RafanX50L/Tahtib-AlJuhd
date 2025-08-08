import { IUserFile } from "../model/IUserFile.model";
import { IBaseRepository } from "./IBase.repository";

export interface IUserFileRepository extends IBaseRepository<IUserFile> {
    /** Reserved for User Filespecific methods */
    _placeholder?: never;
}