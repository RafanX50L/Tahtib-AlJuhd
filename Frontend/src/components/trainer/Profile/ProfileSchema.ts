import { z } from "zod";

const sanitize = (val: string) =>
  val.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();

export const updateTrainerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .refine((val) => /^[a-zA-Z\s.'-]+$/.test(val), {
      message: "Name can only contain letters, spaces, dots, apostrophes, and hyphens",
    })
    .refine((val) => !/(.)\1{4,}/.test(val), {
      message: "Name cannot contain excessive repeating characters",
    })
    .transform(sanitize),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .refine((val) => /^[0-9]+$/.test(val), {
      message: "Phone number must contain only digits",
    }),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters long")
    .max(200, "Location cannot exceed 200 characters")
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: "Location must include letters",
    })
    .transform(sanitize),
});
