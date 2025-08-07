import { IBaseRepository } from "./IBase.repository";
import { IAdminPersonalization, IClientPersonalization, IPersonalization, ITrainerPersonalization } from "../model/IPersonalization.model";
import { ClientProfileData } from "../services/client/IClient.Personalization.Service";


export interface IPersonalizationRepository
  extends IBaseRepository<IPersonalization> {
  // createPersonalization(
  //   personalizationData: Partial<IClientPersonalization | ITrainerPersonalization | IAdminPersonalization>,
  //   userId: string,
  //   userRole: "client" | "trainer" | "admin",
  //   // session?: ClientSession
  // ): Promise<IPersonalization | null>;
  updatePersonalizationById(
    id: string,
    personalization: IClientPersonalization | ITrainerPersonalization | IAdminPersonalization
  ): Promise<IPersonalization | null>;

  getPersonalization(userId:string):Promise<IPersonalization>;
  getClientPersonalizationPopulatedProfilePicture(userId:string):Promise<IPersonalization>;
  updateProfilePictureId(clientId: string, signedUrl: string);
  updateClientProfileData(userId:string,formdata:ClientProfileData):Promise<IPersonalization>;
  updateClientWorkoutCompletionCounter(userId:string):Promise<IPersonalization>;
  // getAllClientFilter(page:number,limit:number,statusFilter:string,searchTerm:string):Promise<{data:IPersonalization,totalCount:number}>;
}
