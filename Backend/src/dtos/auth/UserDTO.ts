import { ITrainerPersonalization } from "@/core/interface/model/IPersonalization.model";
import { PersonalizationModel } from "@/models/Personalization.model";
import IUser from "@/core/interface/model/IUser.model";

export class UserDTO {
  static async toResponse(user: IUser): Promise<Partial<IUser> & { status: string | null }> {
    const userData: Partial<IUser> & { status: string | null } = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      personalizationId: user.personalizationId,
      status: null,
    };

    if (user.role === "trainer" && user.personalizationId !== null) {
      const personalization = await PersonalizationModel.findById(user.personalizationId);
      const personalizationData = personalization?.data as ITrainerPersonalization;
      userData.status = personalizationData?.status || null;
    }

    return userData;
  }
}