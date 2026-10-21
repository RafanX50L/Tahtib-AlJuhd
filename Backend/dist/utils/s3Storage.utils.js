"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = uploadToS3;
exports.generateSignedUrl = generateSignedUrl;
exports.deleteFromS3 = deleteFromS3;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const env_config_1 = require("../config/env.config");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const logger_utils_1 = __importDefault(require("./logger.utils"));
// Configure AWS S3
const s3Client = new client_s3_1.S3Client({
    region: env_config_1.env.AWS_REGION,
    credentials: {
        accessKeyId: env_config_1.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env_config_1.env.AWS_SECRET_ACCESS_KEY,
    },
});
async function uploadToS3(file, folder) {
    const fileExtension = file.originalname.split('.').pop();
    const fileKey = `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`;
    const params = {
        Bucket: env_config_1.env.S3_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    await s3Client.send(new client_s3_1.PutObjectCommand(params));
    return fileKey;
}
;
/**
 * Generates a new signed URL for an existing S3 URL
 */
async function generateSignedUrl(fileKey) {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: env_config_1.env.S3_BUCKET_NAME,
        Key: fileKey,
    });
    return (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 60 * 15 }); // 15 minutes
}
/**
 * Deletes a file from S3 by its key
 */
async function deleteFromS3(fileKey) {
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: env_config_1.env.S3_BUCKET_NAME,
        Key: fileKey,
    });
    await s3Client.send(command);
    logger_utils_1.default.info(`Deleted file: ${fileKey}`);
}
//# sourceMappingURL=s3Storage.utils.js.map