import { z } from "zod";

const sanitize = (val: string) =>
  val.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();

export const clientProfileSchema = z.object({
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

  email: z.string().email("Invalid email format").transform(sanitize),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .refine((val) => /^[0-9]+$/.test(val), {
      message: "Phone number must contain only digits",
    }),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters long")
    .max(200, "Address cannot exceed 200 characters")
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: "Address must include letters",
    })
    .refine((val) => !/(.)\1{5,}/.test(val), {
      message: "Address cannot contain excessive repeating characters",
    })
    .transform(sanitize),

  profilePicture: z.string().optional(),
});
