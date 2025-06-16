import { env } from "../config/env.config";

// List of valid AWS regions
const VALID_AWS_REGIONS = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ap-south-1",
  "ap-south-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
];

export const validateEnv = () => {
  if (!env.PORT) {
    throw new Error("PORT is not defined in the environment variables");
  }
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }
  if (!env.JWT_ACCESS_SECRET) {
    throw new Error(
      "JWT_ACCESS_SECRET is not defined in the environment variables"
    );
  }
  if (!env.JWT_REFRESH_SECRET) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in the environment variables"
    );
  }
  if (!env.CLIENT_URL) {
    throw new Error("CLIENT_URL is not defined in the environment variables");
  }
  if (!env.SENDER_EMAIL) {
    throw new Error("SENDER_EMAIL is not defined in the environment variables");
  }
  if (!env.PASSKEY) {
    throw new Error("PASSKEY is not defined in the environment variables");
  }
  if (!env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined in the environment variables");
  }
  if (!env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined in the environment variables");
  }
  if (!env.RESET_PASS_URL) {
    throw new Error(
      "RESET_PASS_URL is not defined in the environment variables"
    );
  }
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API is not defined in the evironment variables");
  }
  if (!VALID_AWS_REGIONS.includes(env.AWS_REGION)) {
    throw new Error(
      `Invalid AWS_REGION: ${env.AWS_REGION}. Must be a valid AWS region (e.g., ap-south-2)`
    );
  }
  if (!env.S3_BUCKET_NAME) {
    throw new Error(
      "S3_BUCKET_NAME is not defined in the environment variables"
    );
  }
  if (!env.AWS_ACCESS_KEY_ID) {
    throw new Error(
      "AWS_ACCESS_KEY_ID is not defined in the environment variables"
    );
  }
  if (!env.AWS_SECRET_ACCESS_KEY) {
    throw new Error(
      "AWS_SECRET_ACCESS_KEY is not defined in the environment variables"
    );
  }
};
