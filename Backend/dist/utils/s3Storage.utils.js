var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { env } from "../config/env.config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// Configure AWS S3
const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});
function uploadToS3(file, folder) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileExtension = file.originalname.split('.').pop();
        const fileKey = `${folder}/${uuidv4()}.${fileExtension}`;
        const params = {
            Bucket: env.S3_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        yield s3Client.send(new PutObjectCommand(params));
        // Public S3 URL
        // return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${fileName}`;
        return fileKey;
    });
}
;
/**
 * Generates a new signed URL for an existing S3 URL
 */
function generateSignedUrl(fileKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new GetObjectCommand({
            Bucket: env.S3_BUCKET_NAME,
            Key: fileKey,
        });
        return getSignedUrl(s3Client, command, { expiresIn: 60 * 15 }); // 15 minutes
    });
}
export { uploadToS3, generateSignedUrl };
//# sourceMappingURL=s3Storage.utils.js.map