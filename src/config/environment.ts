import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

export const MYENV = {
  JWT_SCRET: process.env.JWT_SECRET as string,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME as string,
  S3_ENDPOINT_URL: process.env.S3_ENDPOINT_URL as string,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY as string,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY as string,
  S3_REGION: process.env.S3_REGION as string,
  SUPABASE_BUCKET_LINK: process.env.SUPABASE_BUCKET_LINK as string,
};
