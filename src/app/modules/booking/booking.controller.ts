/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

export const createBooking = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const booking = await BookingService.createBooking(
    req.body,
    decodedToken?.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

export const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await BookingService.getAllBookings();
  }
);

export const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await BookingService.getSingleBooking();
  }
);

export const getUserBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await BookingService.getUserBookings();
  }
);

export const updateBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await BookingService.updateBooking();
  }
);
