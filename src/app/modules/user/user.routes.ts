import { Router } from "express";
import { createUser, getAllUsers } from "./user.controller";

const router = Router();

router.post("/register", createUser);
router.get("/get-users", getAllUsers);

export const userRouter = router;
