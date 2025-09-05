var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateSignedUrl } from "../../utils/s3Storage.utils";
;
export class ClientTrainerDTO {
    static mapToTrainerData(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(raw);
            const data = raw.data;
            const user = raw.user;
            return {
                id: user._id.toString(),
                name: user.name,
                speciality: data.professionalSummary.specializations,
                photo: yield generateSignedUrl(raw.profilePicture[0].filePath),
                experience: data.professionalSummary.yearsOfExperience.toString(),
                price: data.basicInfo.weeklySalary
            };
        });
    }
}
//# sourceMappingURL=TrainerDTO.js.map