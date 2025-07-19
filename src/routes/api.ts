import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserBookController } from "../controller/userbook-controller";
import { ReadingSessionController } from "../controller/reading-session-controller";

export const apiRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

apiRouter.use(authMiddleware);
apiRouter.post("/user-book", upload.single("cover"), UserBookController.create);
apiRouter.get("/user-book", UserBookController.search);
apiRouter.get("/user-book/:id", UserBookController.getById);
apiRouter.delete("/user-book/:id", UserBookController.delete);
apiRouter.put(
  "/user-book/:id",
  upload.single("cover"),
  UserBookController.update
);

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
