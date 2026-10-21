"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFileService = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
const utils_1 = require("../../utils");
const s3Storage_utils_1 = require("../../utils/s3Storage.utils");
const mongoose_1 = require("mongoose");
class UserFileService {
    _userFileRepository;
    _personalizationRepository;
    _trainerPersonalizationRepository;
    constructor(_userFileRepository, _personalizationRepository, _trainerPersonalizationRepository) {
        this._userFileRepository = _userFileRepository;
        this._personalizationRepository = _personalizationRepository;
        this._trainerPersonalizationRepository = _trainerPersonalizationRepository;
    }
    /** Reserved for User File specific methods */
    _placeholder;
    async updateProfilePicture(userId, file, role) {
        const signedUrl = await (0, s3Storage_utils_1.uploadToS3)(file, "profile-photos");
        const existingFile = await this._userFileRepository.findLatestProfilePicture(userId);
        if (existingFile) {
            // Delete from S3
            await (0, s3Storage_utils_1.deleteFromS3)(existingFile.filePath);
            await this._userFileRepository.deleteOne({ _id: existingFile._id });
        }
        const fileData = {
            userId: new mongoose_1.Types.ObjectId(userId),
            fileName: file.originalname,
            filePath: signedUrl,
            fileType: file.mimetype,
            purpose: "profilePhoto",
            uploadedAt: new Date(),
        };
        const fileCreat = await this._userFileRepository.updateProfilePicture(userId, fileData);
        let updated;
        if (role === "trainer") {
            updated =
                await this._trainerPersonalizationRepository.updateProfilePictureId(userId, new mongoose_1.Types.ObjectId(fileCreat.id));
        }
        else if (role === "client") {
            updated = await this._personalizationRepository.updateProfilePictureId(userId, fileCreat.id);
        }
        if (!updated) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, response_message_constant_1.HttpResponse.USER_NOT_FOUND);
        }
        const url = await (0, s3Storage_utils_1.generateSignedUrl)(signedUrl);
        return { signedUrl: url };
    }
}
exports.UserFileService = UserFileService;
//# sourceMappingURL=userFile.service.js.map