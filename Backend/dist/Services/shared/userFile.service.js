var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpResponse } from "../../constants/response-message.constant";
import { HttpStatus } from "../../constants/status.constant";
import { createHttpError } from "../../utils";
import { uploadToS3 } from "../../utils/s3Storage.utils";
import { Types } from "mongoose";
export class UserFileService {
    constructor(_userFileRepository, _personalizationRepository, _trainerPersonalizationRepository) {
        this._userFileRepository = _userFileRepository;
        this._personalizationRepository = _personalizationRepository;
        this._trainerPersonalizationRepository = _trainerPersonalizationRepository;
    }
    updateProfilePicture(userId, file, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const signedUrl = yield uploadToS3(file, "profile-photos");
            const fileData = {
                userId: new Types.ObjectId(userId),
                fileName: file.originalname,
                filePath: signedUrl,
                fileType: file.mimetype,
                purpose: "profilePhoto",
                uploadedAt: new Date(),
            };
            const fileCreat = yield this._userFileRepository.create(fileData);
            let updated;
            console.log(role);
            if (role === "trainer") {
                updated =
                    yield this._trainerPersonalizationRepository.updateProfilePictureId(userId, new Types.ObjectId(fileCreat.id));
            }
            else if (role === "client") {
                updated = yield this._personalizationRepository.updateProfilePictureId(userId, fileCreat.id);
            }
            if (!updated) {
                throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND);
            }
            return { signedUrl };
        });
    }
}
//# sourceMappingURL=userFile.service.js.map