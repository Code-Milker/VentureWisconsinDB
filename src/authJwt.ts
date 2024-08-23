import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  req.user = user; // Attach user info to request object
  next();
};

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const generateToken = (user: { id: string; email: string }) => {
  return jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY);
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
