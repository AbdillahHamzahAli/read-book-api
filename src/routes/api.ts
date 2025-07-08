import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth-middleware";
import { BookController } from "../controller/book-controller";
import { ReadingSessionController } from "../controller/reading-session-controller";

export const apiRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

apiRouter.use(authMiddleware);
apiRouter.post("/books", upload.single("cover"), BookController.create);
apiRouter.get("/books", BookController.getAll);
apiRouter.get("/books/search", BookController.search);
apiRouter.put("/books/:id", upload.single("cover"), BookController.update);
apiRouter.get("/books/:id", BookController.getById);
apiRouter.delete("/books/:id", BookController.delete);

apiRouter.post("/reading-session/:idUserBook", ReadingSessionController.create);
apiRouter.get(
  "/reading-session/:idUserBook",
  ReadingSessionController.getAllByUserBook
);
apiRouter.get(
  "/reading-session/:idUserBook/detail/:idSession",
  ReadingSessionController.getDetails
);
apiRouter.put(
  "/reading-session/:idUserBook/detail/:idSession",
  ReadingSessionController.update
);
apiRouter.delete(
  "/reading-session/:idUserBook/detail/:idSession",
  ReadingSessionController.delete
);
