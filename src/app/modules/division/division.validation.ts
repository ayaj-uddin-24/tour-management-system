import z from "zod";

export const createDivisionSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
});

export const updateDivisionSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
});
