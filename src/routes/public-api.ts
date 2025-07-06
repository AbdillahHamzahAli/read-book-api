import express from "express";
import multer from "multer";
import { UserController } from "../controller/user-controller";
import { handleImageAnalysis } from "../controller/imageanalysis-controller";

export const publicRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

publicRouter.post("/user", UserController.register);
publicRouter.post("/user/login", UserController.login);

publicRouter.post(
  "/analyze-image",
  upload.single("cover"),
  handleImageAnalysis
);
