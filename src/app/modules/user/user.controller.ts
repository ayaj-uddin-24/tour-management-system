/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// Create User Controller
export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  }
);

// Get All Users Controller
export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users Data Retrieved Successfully",
      data: user.data,
      meta: { total: user.totalUsers },
    });
  }
);
