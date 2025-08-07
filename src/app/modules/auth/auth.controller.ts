/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import { createUserTokens } from "../../utils/userTokens";
import { setAuthCookie } from "../../utils/setCookie";
import { envVariables } from "../../config/env";
import passport from "passport";

// User Login
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(400, err));
      }

      if (!user) {
        return next(new AppError(401, info.message));
      }

      const userTokens = createUserTokens(user);

      const { password, ...rest } = user.toObject();

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login Successful",
        data: {
          accessToken: userTokens.accessToken,
          refershToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

// Get new access token
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const user = await authServices.getNewAccessToken(refreshToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Login successful",
      data: user,
    });
  }
);

// User logout
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logout successful",
      data: null,
    });
  }
);

// Reset the password
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;

    await authServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfuly",
      data: null,
    });
  }
);

// Registration using google callback
const googleCallBackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    const tokenInfo = createUserTokens(user);
    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVariables.FRONTEND_URL}/${redirectTo}`);
  }
);

export const authControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallBackController,
};
