import express from "express";
import { publicRouter } from "../routes/public-api";
import { ErrorMiddleware } from "../middleware/error-middleware";
import { apiRouter } from "../routes/api";

export const app = express();

app.use(express.json());

app.use("/api", publicRouter);
app.use("/api", apiRouter);
app.use(ErrorMiddleware);

export default app;
