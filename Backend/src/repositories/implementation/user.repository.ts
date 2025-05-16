import { IUserRepository } from "../interface/IUser.repository";
import { BaseRepository } from "../base.repository";
import { UserModel, IUserModel } from "../../models/implementation/user.model";
import { PersonalizationModel, IPersonalization } from "../../models/implementation/personalization.model";
import { IUser } from "../../models/interface/IUser.model";

export class UserRepository
  extends BaseRepository<IUserModel>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async createUser(user: IUser): Promise<IUserModel> {
    const createdUser = await this.model.create(user);
    try {
      // Create User document

      // Create Personalization document with default data
      let personalizationData: IPersonalization["data"];
      if (user.role === "client") {
        personalizationData = {
          trainer: "Unassigned",
          planStatus: "Inactive",
          sessionStatus: "Not Purchased",
        };
      } else if (user.role === "trainer") {
        personalizationData = {
          specialty: "General",
          experience: "0 years",
          monthlyFee: "$0",
          expertiseLevel: "beginner",
          isActive: false,
        };
      } else {
        personalizationData = { adminNotes: "" };
      }

      await PersonalizationModel.create({
        userId: createdUser._id,
        role: user.role,
        data: personalizationData,
      });

      return createdUser;
    } catch (error) {
      // If Personalization creation fails, delete the User to maintain consistency
      if (createdUser) {
        await this.model.deleteOne({ _id: createdUser._id });
      }
      console.error("Error creating user:", error);
      throw new Error("Error creating user");
    }
  }

  async getUserById (id:string):Promise<IUser | null>{
    try{
      return await this.model.findById(id);
    }catch(error){
      console.log('Error finding user by Id:',error);
      throw new Error('Error finding user by Id');
    }
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Error finding user by email");
    }
  }

  async findByIdWithPersonalization(id: string): Promise<IUserModel | null> {
    try {
      return await this.model.findById(id).populate("personalization");
    } catch (error) {
      console.error("Error finding user by ID with personalization:", error);
      throw new Error("Error finding user by ID with personalization");
    }
  }

  async updatePassword(email: string, hashedPassword: string): Promise<IUserModel | null> {
    try {
      return await this.model
        .findOneAndUpdate({ email }, { password: hashedPassword }, { new: true })
        .populate("personalization");
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error("Error updating password");
    }
  }

  async updatePersonalization(userId: string, data: IPersonalization["data"]): Promise<IPersonalization | null> {
    try {
      return await PersonalizationModel.findOneAndUpdate(
        { userId },
        { data },
        { new: true }
      );
    } catch (error) {
      console.error("Error updating personalization:", error);
      throw new Error("Error updating personalization");
    }
  }
}