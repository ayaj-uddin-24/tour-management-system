import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createBookingZodSchema,
  updateBookingZodSchema,
} from "./booking.validation";
import {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getUserBookings,
  updateBooking,
} from "./booking.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  createBooking
);
router.get("/", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), getAllBookings);
router.get("/:bookingId", checkAuth(...Object.values(Role)), getSingleBooking);
router.get("/my-bookings", checkAuth(...Object.values(Role)), getUserBookings);
router.patch(
  "/:bookingId",
  checkAuth(...Object.values(Role)),
  validateRequest(updateBookingZodSchema),
  updateBooking
);

export const bookingRouter = router;
