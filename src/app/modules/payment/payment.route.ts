import { Router } from "express";
import {
  cancelPayment,
  failPayment,
  initPayment,
  successPayment,
} from "./payment.controller";

const router = Router();

router.post("/init-payment/:bookingId", initPayment);
router.post("/success", successPayment);
router.post("/fail", failPayment);
router.post("/cancel", cancelPayment);

export const paymentRouter = router;
