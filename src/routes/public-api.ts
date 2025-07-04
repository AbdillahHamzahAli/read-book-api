import express from "express";
import multer from "multer";
import { UserController } from "../controller/user-controller";
import { handleImageAnalysis } from "../controller/imageanalysis-controller";

export const publicRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

publicRouter.post("/api/user", UserController.register);
publicRouter.post("/api/user/login", UserController.login);

publicRouter.post(
  "/api/analyze-image",
  upload.single("imageFile"),
  handleImageAnalysis
);
