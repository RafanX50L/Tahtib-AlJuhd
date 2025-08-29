import z from "zod";

const titleSchema = z
  .string()
  .trim()
  .min(3, "Title must be at least 3 characters long")
  .max(100, "Title cannot exceed 100 characters")
  .refine(
    (val) => /\b\w+\b.*\b\w+\b/.test(val),
    "Title must contain at least 2 words"
  )
  .refine(
    (val) => !/(.)\1{4,}/.test(val),
    "Title cannot contain excessive repeating characters"
  )
  .transform((val) => val.replace(/\s+/g, " ")); // normalize spaces

const descriptionSchema = z
  .string()
  .trim()
  .min(10, "Description must be at least 10 characters long")
  .max(1000, "Description cannot exceed 1000 characters")
  .refine(
    (val) => val.split(/\s+/).length >= 3,
    "Description must contain at least 3 words"
  )
  .refine(
    (val) => !/(.)\1{6,}/.test(val),
    "Description cannot contain excessive repeating characters"
  )
  .refine(
    (val) => /[a-zA-Z]/.test(val),
    "Description must include letters, not just numbers or symbols"
  )
  .transform((val) => val.replace(/\s+/g, " ")); // normalize spaces

export const PlanSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    sessionsPerWeek: z
      .number()
      .int("Sessions per week must be an integer")
      .min(1, "Sessions per week must be between 1 and 14")
      .max(14, "Sessions per week must be between 1 and 14"),
    durationWeeks: z
      .number()
      .int("Duration must be an integer")
      .min(1, "Duration must be between 1 and 52 weeks")
      .max(52, "Duration must be between 1 and 52 weeks"),
    price: z
      .number()
      .nonnegative("Price cannot be negative")
      .max(1_000_000, "Price cannot exceed 1,000,000")
      .optional(),
    trainer: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Trainer ID must be a valid ObjectId")
      .optional(),
    isActive: z.boolean().default(true),
    isBooked: z.boolean().default(false),
  })
  .strict()
  .refine((data) => !(data.isBooked && !data.trainer), {
    message: "Booked plans must have an assigned trainer",
    path: ["trainer"],
  });
