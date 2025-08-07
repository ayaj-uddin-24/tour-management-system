import { Router } from "express";
import { createUser, getAllUsers, updateUser } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/register",
  //  validateRequest(createUserZodSchema),
  createUser
);
router.get("/get-users", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), getAllUsers);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  updateUser
);

export const userRouter = router;
