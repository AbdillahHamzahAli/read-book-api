import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { RoleMiddleware } from "../middleware/role-middleware";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);
// apiRouter.post("/api/posts", RoleMiddleware(["ADMIN"]), PostController.create);
