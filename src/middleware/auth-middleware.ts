import jwt, { Secret } from "jsonwebtoken";
import { MYENV } from "../config/environment";
import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../type/user-request";

export const SECRET_KEY: Secret = MYENV.JWT_SCRET;

interface JwtPayload {
  role: string;
  id: string;
}

export const authMiddleware = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("invalid token");
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ errors: (err as Error).message });
  }
};
