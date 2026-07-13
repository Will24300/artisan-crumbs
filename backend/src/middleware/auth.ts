import dotenv from "dotenv";
dotenv.config();
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: "admin" | "customer";
  };
}

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is required in environment variables");
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  if (!token) {
    return res.status(401).json({ error: "Authorization required" });
  }

  try {
    const payload = jwt.verify(token, secret) as { userId: string };
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin role required" });
  }
  next();
};
