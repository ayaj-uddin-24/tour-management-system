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
  async (req: Request, res: Response) => {
    const bookings = await BookingService.getAllBookings();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All bookings data retrieved successfully",
      data: bookings,
    });
  }
);

export const getSingleBooking = catchAsync(
  async (req: Request, res: Response) => {
    const booking = await BookingService.getSingleBooking(req.params.bookingId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking data retrieved successfully",
      data: booking,
    });
  }
);

export const getUserBookings = catchAsync(
  async (req: Request, res: Response) => {
    await BookingService.getUserBookings();
  }
);

export const updateBooking = catchAsync(async (req: Request, res: Response) => {
  await BookingService.updateBooking();
});
