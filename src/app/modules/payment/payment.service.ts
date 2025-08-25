/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../error/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Not Found. You have not booked this tour"
    );
  }

  const booking = await Booking.findById(payment.booking);

  const userName = (booking?.user as any).name;
  const email = (booking?.user as any).email;
  const address = (booking?.user as any).address;
  const phoneNumber = (booking?.user as any).phone;

  const sslPayload: ISSLCommerz = {
    name: userName,
    email: email,
    address: address,
    phoneNumber: phoneNumber,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslCommerz = await sslService.sslPaymentInit(sslPayload);

  return {
    sslCommerz: sslCommerz.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  const updatedPayment = await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: PAYMENT_STATUS.PAID },
    { new: true, runValidators: true }
  );

  await Booking.findByIdAndUpdate(
    updatedPayment?.booking,
    { status: BOOKING_STATUS.COMPLETED },
    { new: true, runValidators: true }
  );

  return {
    success: true,
    message: "Payment successful",
  };
};

const failPayment = async (query: Record<string, string>) => {
  const updatedPayment = await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: PAYMENT_STATUS.FAILED },
    { new: true, runValidators: true }
  );

  await Booking.findByIdAndUpdate(
    updatedPayment?.booking,
    { status: BOOKING_STATUS.FAILED },
    { new: true, runValidators: true }
  );

  return {
    success: false,
    message: "Payment Failed!",
  };
};

const cancelPayment = async (query: Record<string, string>) => {
  const updatedPayment = await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: PAYMENT_STATUS.CANCELED },
    { new: true, runValidators: true }
  );

  await Booking.findByIdAndUpdate(
    updatedPayment?.booking,
    { status: BOOKING_STATUS.CANCELED },
    { new: true, runValidators: true }
  );

  return {
    success: false,
    message: "Payment Canceled!",
  };
};

export const paymentServices = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
