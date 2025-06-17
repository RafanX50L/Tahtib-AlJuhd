
// import express, { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import multer from 'multer';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { v4 as uuidv4 } from 'uuid';
// import cors from 'cors';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Configure Multer for file handling
// const upload = multer({ storage: multer.memoryStorage() });

// // Configure AWS S3
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGODB_URI!)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // MongoDB Schemas
// const CertificationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   issuer: { type: String, required: true },
//   proofFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainerFile', required: false },
// });

// const WeeklySlotSchema = new mongoose.Schema({
//   day: {
//     type: String,
//     enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//     required: true,
//   },
//   startTime: { type: String, required: true, match: /^[0-2][0-9]:[0-5][0-9]$/ },
//   endTime: { type: String, required: true, match: /^[0-2][0-9]:[0-5][0-9]$/ },
// });

// const BasicInfoSchema = new mongoose.Schema({
//   phoneNumber: { type: String, required: true },
//   location: { type: String, required: true },
//   timeZone: { type: String, required: true },
//   dateOfBirth: { type: String, required: false },
//   gender: { type: String, enum: ['male', 'female', 'others'], required: false },
//   profilePhotoId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainerFile', required: false },
// });

// const ProfessionalSummarySchema = new mongoose.Schema({
//   yearsOfExperience: { type: String, required: true, match: /^\d+$/ },
//   certifications: { type: [CertificationSchema], required: true },
//   specializations: { type: [String], required: true },
//   coachingType: { type: [String], required: true },
//   platformsUsed: { type: [String], required: false },
// });

// const SampleMaterialsSchema = new mongoose.Schema({
//   demoVideoLink: { type: String, required: true, match: /^https?:\/\/.+/ },
//   portfolioLinks: { type: [String], required: false },
//   resumeFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainerFile', required: false },
// });

// const AvailabilitySchema = new mongoose.Schema({
//   weeklySlots: { type: [WeeklySlotSchema], required: true },
//   engagementType: { type: String, enum: ['full-time', 'part-time', 'contract', 'freelance'], required: true },
// });

// const TrainerSchema = new mongoose.Schema(
//   {
//     basicInfo: { type: BasicInfoSchema, required: true },
//     professionalSummary: { type: ProfessionalSummarySchema, required: true },
//     sampleMaterials: { type: SampleMaterialsSchema, required: true },
//     availability: { type: AvailabilitySchema, required: true },
//     status: {
//       type: String,
//       enum: ['applied', 'interview_scheduled', 'interviewed', 'approved', 'rejected'],
//       required: true,
//       default: 'applied',
//     },
//   },
//   { timestamps: true }
// );

// TrainerSchema.index({ status: 1 });
// TrainerSchema.index({ 'availability.weeklySlots.day': 1 });

// const TrainerFileSchema = new mongoose.Schema(
//   {
//     trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
//     fileName: { type: String, required: true },
//     filePath: { type: String, required: true }, // S3 URL
//     fileType: { type: String, required: true },
//     uploadedAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// TrainerFileSchema.index({ trainerId: 1 });

// const AuditLogSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
//     action: { type: String, required: true },
//     entityType: { type: String, required: true },
//     entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
//     details: { type: mongoose.Schema.Types.Mixed, required: true },
//   },
//   { timestamps: true }
// );

// AuditLogSchema.index({ entityType: 1, entityId: 1 });

// const Trainer = mongoose.model('Trainer', TrainerSchema);
// const TrainerFile = mongoose.model('TrainerFile', TrainerFileSchema);
// const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

// // Upload file to S3
// async function uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
//   const fileExtension = file.originalname.split('.').pop();
//   const fileName = `${folder}/${uuidv4()}.${fileExtension}`;
  
//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME!,
//     Key: fileName,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL: 'public-read',
//   };

//   await s3Client.send(new PutObjectCommand(params));
//   return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
// }

// // API Endpoint for Form Submission
// app.post('/api/trainer/submit', upload.any(), async (req: Request, res: Response) => {
//   try {
//     const files = req.files as Express.Multer.File[];
//     const body = req.body;

//     // Parse JSON fields
//     const certifications = JSON.parse(body.certifications);
//     const specializations = JSON.parse(body.specializations);
//     const coachingType = JSON.parse(body.coachingType);
//     const platformsUsed = body.platformsUsed ? JSON.parse(body.platformsUsed) : [];
//     const portfolioLinks = body.portfolioLinks ? JSON.parse(body.portfolioLinks).filter((link: string) => link) : [];
//     const weeklySlots = JSON.parse(body.weeklySlots);

//     // Initialize trainer data
//     const trainerData = {
//       basicInfo: {
//         phoneNumber: body.phoneNumber,
//         location: body.location,
//         timeZone: body.timeZone,
//         dateOfBirth: body.dateOfBirth || undefined,
//         gender: body.gender || undefined,
//       },
//       professionalSummary: {
//         yearsOfExperience: body.yearsOfExperience,
//         certifications: certifications.map((cert: any) => ({
//           name: cert.name,
//           issuer: cert.issuer,
//         })),
//         specializations,
//         coachingType,
//         platformsUsed,
//       },
//       sampleMaterials: {
//         demoVideoLink: body.demoVideoLink,
//         portfolioLinks,
//       },
//       availability: {
//         weeklySlots,
//         engagementType: body.engagementType,
//       },
//       status: 'applied',
//     };

//     // Create trainer document (without file IDs initially)
//     const trainer = new Trainer(trainerData);
//     await trainer.save();

//     // Handle file uploads and create TrainerFile documents
//     for (const file of files) {
//       const fieldName = file.fieldname;
//       const fileType = file.mimetype.split('/')[1];
//       const fileUrl = await uploadToS3(file, fieldName.startsWith('certificationProof') ? 'certification-proofs' : fieldName === 'profilePhoto' ? 'profile-photos' : 'resumes');

//       const trainerFile = new TrainerFile({
//         trainerId: trainer._id,
//         fileName: file.originalname,
//         filePath: fileUrl,
//         fileType,
//       });
//       await trainerFile.save();

//       // Update trainer document with file IDs
//       if (fieldName === 'profilePhoto') {
//         trainer.basicInfo.profilePhotoId = trainerFile._id;
//       } else if (fieldName === 'resume') {
//         trainer.sampleMaterials.resumeFileId = trainerFile._id;
//       } else if (fieldName.startsWith('certificationProof_')) {
//         const index = parseInt(fieldName.split('_')[1]);
//         trainer.professionalSummary.certifications[index].proofFileId = trainerFile._id;
//       }
//     }

//     // Save updated trainer document
//     await trainer.save();

//     // Create audit log
//     const auditLog = new AuditLog({
//       action: 'create_trainer',
//       entityType: 'trainer',
//       entityId: trainer._id,
//       details: { message: 'New trainer application submitted' },
//     });
//     await auditLog.save();

//     res.status(200).json({ message: 'Trainer application submitted successfully' });
//   } catch (error) {
//     console.error('Submission error:', error);
//     res.status(500).json({ message: 'Server error during submission' });
//   }
// });

// // Start Server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });