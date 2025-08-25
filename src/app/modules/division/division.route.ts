import { Router } from "express";
import {
  createDivision,
  deleteDivision,
  getAllDivisions,
  getSingleDivision,
  updatedDivision,
} from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createDivisionSchema,
  updateDivisionSchema,
} from "./division.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisionSchema),
  createDivision
);
router.get("/", getAllDivisions);
router.get("/:slug", getSingleDivision);
router.patch(
  "/update/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(updateDivisionSchema),
  updatedDivision
);
router.delete(
  "/delete/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  deleteDivision
);

export const divisionRouter = router;
