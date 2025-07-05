import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth-middleware";
import { BookController } from "../controller/book-controller";

export const apiRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

apiRouter.use(authMiddleware);
apiRouter.post("/books", BookController.create);
