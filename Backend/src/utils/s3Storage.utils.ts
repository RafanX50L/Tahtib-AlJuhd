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


// Upload file to S3
async function uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${folder}/${uuidv4()}.${fileExtension}`;
  
  const params = {
    Bucket: env.S3_BUCKET_NAME!,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3Client.send(new PutObjectCommand(params));
  
   const getParams = {
      Bucket: env.S3_BUCKET_NAME,
      Key: fileName,
    };

    const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(getParams), {
      expiresIn:7* 24 * 60 * 60 , // 1 hour month
    });

  // return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${fileName}`;
  return signedUrl;
}

export { uploadToS3};