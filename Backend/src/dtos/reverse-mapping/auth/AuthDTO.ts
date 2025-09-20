import { ValidationUtil, ValidationError } from "@/utils/validation.util";

/**
 * Request DTOs for Auth Controller
 * Input validation and transformation for authentication endpoints
 */

// Sign Up Request DTO
export interface SignUpRequestDTO {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'trainer';
}

// Sign In Request DTO
export interface SignInRequestDTO {
  email: string;
  password: string;
}

// Verify OTP Request DTO
export interface VerifyOtpRequestDTO {
  email: string;
  otp: string;
}

// Resend OTP Request DTO
export interface ResendOtpRequestDTO {
  email: string;
}

// Forgot Password Request DTO
export interface ForgotPasswordRequestDTO {
  email: string;
}

// Reset Password Request DTO
export interface ResetPasswordRequestDTO {
  token: string;
  password: string;
}

// Google Sign Up Request DTO
export interface GoogleSignUpRequestDTO {
  email: string;
  name: string;
  role: 'client' | 'trainer';
}

/**
 * Auth DTO class for input validation
 * Handles validation and transformation of auth-related requests
 */
export class AuthDTO {
  /**
   * Validates and transforms sign up request
   */
  static validateSignUpRequest(body: Record<string, unknown>): SignUpRequestDTO {
    const name = ValidationUtil.validateString(body.name, 'name', 100);
    const email = ValidationUtil.validateEmail(body.email, 'email');
    const password = ValidationUtil.validateString(body.password, 'password', 128);
    const role = ValidationUtil.validateEnum(body.role, 'role', ['client', 'trainer'] as const);

    // Validate password strength
    if (password.length < 8) {
      throw new ValidationError([{
        field: 'password',
        message: 'Password must be at least 8 characters long',
        value: password
      }]);
    }

    // Validate password contains at least one letter and one number
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      throw new ValidationError([{
        field: 'password',
        message: 'Password must contain at least one letter and one number',
        value: password
      }]);
    }

    return {
      name,
      email,
      password,
      role,
    };
  }

  /**
   * Validates and transforms sign in request
   */
  static validateSignInRequest(body: Record<string, unknown>): SignInRequestDTO {
    const email = ValidationUtil.validateEmail(body.email, 'email');
    const password = ValidationUtil.validateString(body.password, 'password', 128);

    return {
      email,
      password,
    };
  }

  /**
   * Validates and transforms verify OTP request
   */
  static validateVerifyOtpRequest(body: Record<string, unknown>): VerifyOtpRequestDTO {
    const email = ValidationUtil.validateEmail(body.email, 'email');
    const otp = ValidationUtil.validateString(body.otp, 'otp', 10);

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      throw new ValidationError([{
        field: 'otp',
        message: 'OTP must be exactly 6 digits',
        value: otp
      }]);
    }

    return {
      email,
      otp,
    };
  }

  /**
   * Validates and transforms resend OTP request
   */
  static validateResendOtpRequest(body: Record<string, unknown>): ResendOtpRequestDTO {
    const email = ValidationUtil.validateEmail(body.email, 'email');

    return {
      email,
    };
  }

  /**
   * Validates and transforms forgot password request
   */
  static validateForgotPasswordRequest(body: Record<string, unknown>): ForgotPasswordRequestDTO {
    const email = ValidationUtil.validateEmail(body.email, 'email');

    return {
      email,
    };
  }

  /**
   * Validates and transforms reset password request
   */
  static validateResetPasswordRequest(body: Record<string, unknown>): ResetPasswordRequestDTO {
    const token = ValidationUtil.validateString(body.token, 'token', 500);
    const password = ValidationUtil.validateString(body.password, 'password', 128);

    // Validate password strength
    if (password.length < 8) {
      throw new ValidationError([{
        field: 'password',
        message: 'Password must be at least 8 characters long',
        value: password
      }]);
    }

    // Validate password contains at least one letter and one number
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      throw new ValidationError([{
        field: 'password',
        message: 'Password must contain at least one letter and one number',
        value: password
      }]);
    }

    return {
      token,
      password,
    };
  }

  /**
   * Validates and transforms Google sign up request
   */
  static validateGoogleSignUpRequest(body: Record<string, unknown>): GoogleSignUpRequestDTO {
    const email = ValidationUtil.validateEmail(body.email, 'email');
    const name = ValidationUtil.validateString(body.name, 'name', 100);
    const role = ValidationUtil.validateEnum(body.role, 'role', ['client', 'trainer'] as const);

    return {
      email,
      name,
      role,
    };
  }
}
