/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentServices } from "./payment.service";
import { envVariables } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

export const initPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = req.params.bookingId;
    const payment = await paymentServices.initPayment(booking as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment done successful!",
      data: payment,
    });
  }
);

export const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await paymentServices.successPayment(
      query as Record<string, string>
    );

    if (result.success) {
      res.redirect(
        `${envVariables.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

export const failPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await paymentServices.failPayment(
      query as Record<string, string>
    );

    if (result.success) {
      res.redirect(
        `${envVariables.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

export const cancelPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await paymentServices.cancelPayment(
      query as Record<string, string>
    );

    if (result.success) {
      res.redirect(
        `${envVariables.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);
