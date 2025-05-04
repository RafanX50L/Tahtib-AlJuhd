import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Please enter your email" })
      .email({ message: "Invalid email address" }),
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(20, "Name must be at most 20 characters long")
      .regex(
        /^[A-Za-z]+(?: [A-Za-z]+)?$/,
        "Name must contain only alphabets and a single space between words"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      //   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      //   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    //   .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["client", "trainer"], { message: "Please select a role" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    //   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    //   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  //   .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});
// Zod schema for OTP validation
export const otpSchema = z
  .object({
    otp: z
      .string()
      .length(6, { message: "OTP must be exactly 6 digits" })
      .regex(/^\d{6}$/, { message: "OTP must contain only digits" }),
  })
  .strict();

// Define schema for email input
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
});

// Define schema for password reset
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      //   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      //   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    //   .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
