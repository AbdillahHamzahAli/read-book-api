import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth-middleware";
import { BookController } from "../controller/book-controller";

export const apiRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

apiRouter.use(authMiddleware);
apiRouter.post("/books", upload.single("cover"), BookController.create);
apiRouter.get("/books", BookController.getAll);
apiRouter.get("/books/search", BookController.search);
apiRouter.put("/books/:id", upload.single("cover"), BookController.update);
apiRouter.get("/books/:id", BookController.getById);
apiRouter.delete("/books/:id", BookController.delete);

// apiRouter.post("/reading-session/:");
