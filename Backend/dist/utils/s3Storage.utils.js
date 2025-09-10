"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = uploadToS3;
exports.generateSignedUrl = generateSignedUrl;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const env_config_1 = require("../config/env.config");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
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
    // Public S3 URL
    // return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${fileName}`;
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
//# sourceMappingURL=s3Storage.utils.js.map