"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientTrainerDTO = void 0;
const s3Storage_utils_1 = require("../../utils/s3Storage.utils");
;
class ClientTrainerDTO {
    static async mapToTrainerData(raw) {
        console.log(raw);
        const data = raw.data;
        const user = raw.user;
        return {
            id: user._id.toString(),
            name: user.name,
            speciality: data.professionalSummary.specializations,
            photo: await (0, s3Storage_utils_1.generateSignedUrl)(raw.profilePicture[0].filePath),
            experience: data.professionalSummary.yearsOfExperience.toString(),
            price: data.basicInfo.weeklySalary
        };
    }
}
exports.ClientTrainerDTO = ClientTrainerDTO;
//# sourceMappingURL=TrainerDTO.js.map