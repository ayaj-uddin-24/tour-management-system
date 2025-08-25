/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../error/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslService } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import httpStatus from "http-status-codes";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// const createBooking = async (payload: Partial<IBooking>, userId: string) => {
//   const transactionId = getTransactionId();
//   const user = await User.findById(userId);

//   if (!user?.phone && !user?.address) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Please, update your profile to book a tour!"
//     );
//   }

//   const session = await Booking.startSession();
//   session.startTransaction();

//   try {
//     const tour = await Tour.findById(payload.tour).select("costFrom");

//     if (!tour?.costFrom) {
//       throw new AppError(httpStatus.BAD_REQUEST, "No cost found!");
//     }

//     const amount = Number(tour?.costFrom) * Number(payload.guestCount);

//     const booking = await Booking.create(
//       [
//         {
//           user: userId,
//           tour: payload.tour,
//           ...payload,
//         },
//       ],
//       { session }
//     );

//     const payment = await Payment.create(
//       [
//         {
//           booking: booking[0]._id,
//           amount,
//           status: PAYMENT_STATUS.UNPAID,
//           transactionId,
//         },
//       ],
//       { session }
//     );

//     const updatedBooking = await Booking.findByIdAndUpdate(
//       booking[0]._id,
//       {
//         payment: payment[0]._id,
//       },
//       session
//     );

//     await session.commitTransaction();
//     session.endSession();

//     return {
//       data: updatedBooking,
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  const tour = await Tour.findById(payload.tour).select("costFrom");

  if (!tour?.costFrom) {
    throw new AppError(httpStatus.BAD_REQUEST, "No cost found!");
  }

  const amount = Number(tour?.costFrom) * Number(payload.guestCount);

  const booking = await Booking.create({
    user: userId,
    tour: payload.tour,
    ...payload,
  });

  const payment = await Payment.create({
    booking: booking._id,
    amount,
    status: PAYMENT_STATUS.UNPAID,
    transactionId,
  });

  const updatedBookingDoc = await Booking.findByIdAndUpdate(
    booking._id,
    {
      payment: payment._id,
    },
    { new: true, runValidators: true }
  )
    .populate("user", "name email phone address")
    .populate("tour", "title images location costFrom")
    .populate("payment", "transactionId amount");

  const userName = (updatedBookingDoc?.user as any).name;
  const email = (updatedBookingDoc?.user as any).email;
  const address = (updatedBookingDoc?.user as any).address;
  const phoneNumber = (updatedBookingDoc?.user as any).phone;

  const sslPayload: ISSLCommerz = {
    name: userName,
    email: email,
    address: address,
    phoneNumber: phoneNumber,
    amount: amount,
    transactionId: transactionId,
  };

  const sslCommerz = await sslService.sslPaymentInit(sslPayload);

  return {
    data: updatedBookingDoc,
    sslCommerz: sslCommerz.GatewayPageURL,
  };
};

const getAllBookings = async () => {
  const bookings = await Booking.find();

  return {
    data: bookings,
  };
};

const getSingleBooking = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);

  return {
    data: booking,
  };
};

const getUserBookings = async () => {
  return {};
};

const updateBooking = async () => {
  return {};
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getUserBookings,
  updateBooking,
};
