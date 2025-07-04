import { NextFunction, Request, Response } from "express";
import { BOOK_COVER_PROMPT } from "../utils/image-analysis/prompt";
import { analyzeImageWithGemini } from "../utils/image-analysis/image-analysis";
import { ResponseError } from "../error/response-error";

export async function handleImageAnalysis(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      throw new ResponseError(400, "Tidak ada file gambar yang diunggah.");
    }

    const prompt = BOOK_COVER_PROMPT;
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const analysisResult = await analyzeImageWithGemini(
      imageBuffer,
      mimeType,
      prompt
    );

    res.status(200).json({ data: analysisResult });
  } catch (e) {
    next(e);
  }
}
