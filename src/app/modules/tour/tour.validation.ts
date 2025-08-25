import { z } from "zod";
import { Types } from "mongoose";

// ObjectId validation (for Mongoose IDs)
const objectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

/* ------------------ TOUR TYPE SCHEMAS ------------------ */
export const createTourTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const updateTourTypeSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
});

/* ------------------ TOUR SCHEMAS ------------------ */
export const createTourSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  location: z.string().optional(),
  costFrom: z.number().min(0).optional(),
  startDate: z.coerce.date().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
  endDate: z.coerce.date().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.number().min(1).optional(),
  minAge: z.number().min(0).optional(),
  division: objectId,
  tourType: objectId,
  deleteImages: z.array(z.string()).optional(),
});

export const updateTourSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  location: z.string().optional(),
  costFrom: z.number().min(0).optional(),
  startDate: z.coerce.date().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
  endDate: z.coerce.date().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.number().min(1).optional(),
  minAge: z.number().min(0).optional(),
  division: objectId.optional(),
  tourType: objectId.optional(),
  deleteImages: z.array(z.string()).optional(),
});
