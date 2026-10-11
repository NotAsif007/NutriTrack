import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/environment.js";
import { User, IUser } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  userId: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw AppError.unauthorized("Authentication required. Please log in.");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      throw AppError.unauthorized("User account no longer exists.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
