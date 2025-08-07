import { NextFunction, Request, Response } from "express";
import AppError from "../error/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import httpsStatus from "http-status-codes";
import { envVariables } from "../config/env";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(httpsStatus.FORBIDDEN, "Unauthorized Access!");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVariables.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(404, "You are not allowed to view this page");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
