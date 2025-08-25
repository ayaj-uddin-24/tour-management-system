import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createTourSchema,
  createTourTypeSchema,
  updateTourSchema,
  updateTourTypeSchema,
} from "./tour.validation";
import {
  createTour,
  createTourType,
  deleteTour,
  deleteTourType,
  getAllTour,
  getAllTourType,
  getSingleTour,
  getSingleTourType,
  updateTour,
  updateTourType,
} from "./tour.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

/* ------------------ TOUR TYPE ROUTES ------------------ */
router.post(
  "/create-tour-type",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createTourTypeSchema),
  createTourType
);
router.get("/tour-types", getAllTourType);
router.get("/tour-type/:id", getSingleTourType);
router.patch(
  "/tour-type/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(updateTourTypeSchema),
  updateTourType
);
router.delete(
  "/tour-type/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  deleteTourType
);

/* ------------------ TOUR ROUTES ------------------ */
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(createTourSchema),
  createTour
);
router.get("/", getAllTour);
router.get("/:id", getSingleTour);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourSchema),
  updateTour
);
router.delete("/:id", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), deleteTour);

export const tourRouter = router;
