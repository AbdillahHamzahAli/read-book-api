import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./connection";
import { v4 as uuid } from "uuid";
import { MYENV } from "../../config/environment";

export class StorageService {
  /**
   * Mengunggah file ke S3 dan mengembalikan URL-nya.
   * @returns {Promise<{url: string, key: string}>} Obyek berisi URL dan key file.
   */
  static async upload(
    file: Express.Multer.File
  ): Promise<{ url: string; key: string }> {
    const fileKey = `covers/${uuid()}-${file.originalname
      .replace(/\s+/g, "-")
      .toLowerCase()}`;
    const bucketName = MYENV.S3_BUCKET_NAME;
    const bucketUrl = MYENV.SUPABASE_BUCKET_LINK;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);
    return {
      url: `${bucketUrl}/${bucketName}/${fileKey}`,
      key: fileKey,
    };
  }

  /**
   * Menghapus file dari S3 menggunakan key-nya.
   */
  static async delete(fileKey: string): Promise<void> {
    const bucketName = MYENV.S3_BUCKET_NAME;

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    await s3Client.send(command);
  }
}
