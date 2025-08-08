import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { env } from "@/config/env.config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


// Configure AWS S3
const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
    },
});


/**
 * Uploads a file to S3 and returns its public URL
 */
type FolderCategory = 'profile-photos' | 'certification-proofs' | 'resume';
async function uploadToS3(file: Express.Multer.File, folder: FolderCategory): Promise<string> {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

  const params = {
    Bucket: env.S3_BUCKET_NAME!,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read" as const,
  };

  await s3Client.send(new PutObjectCommand(params));

  // Public S3 URL
  return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${fileName}`;
};

/**
 * Generates a new signed URL for an existing S3 URL
 */
async function generateSignedUrl(oldUrl: string): Promise<string> {
  const url = new URL(oldUrl);
  const fileName = decodeURIComponent(url.pathname.replace(/^\/+/, '')); // remove leading slashes

  const getParams = {
    Bucket: env.S3_BUCKET_NAME!,
    Key: fileName,
  };

  const signedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand(getParams),
    {
      expiresIn: 15 * 60 * 60, // 15 minutes
    }
  );

  return signedUrl;
}

export { uploadToS3, generateSignedUrl };