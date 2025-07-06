import { S3Client } from "@aws-sdk/client-s3";
import { MYENV } from "../../config/environment";

export const s3Client = new S3Client({
  region: MYENV.S3_REGION,
  endpoint: MYENV.S3_ENDPOINT_URL,
  credentials: {
    accessKeyId: MYENV.S3_ACCESS_KEY,
    secretAccessKey: MYENV.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});
