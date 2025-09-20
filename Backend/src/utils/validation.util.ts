import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";

export interface IValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export class ValidationError extends Error {
  public errors: IValidationError[];
  public statusCode: number = HttpStatus.BAD_REQUEST;

  constructor(errors: IValidationError[]) {
    super("Validation failed");
    this.errors = errors;
    this.name = "ValidationError";
  }
}

export class ValidationUtil {
  /**
   * Validates that a value is a positive integer
   */
  static validatePositiveInteger(value: unknown, fieldName: string): number {
    if (value === undefined || value === null || value === '') {
      return 1; // default value
    }
    
    const num = parseInt(String(value), 10);
    if (isNaN(num) || num < 1) {
      throw new ValidationError([{
        field: fieldName,
        message: `${fieldName} must be a positive integer`,
        value: value
      }]);
    }
    
    return num;
  }

  /**
   * Validates that a value is within a range
   */
  static validateRange(value: unknown, fieldName: string, min: number, max: number): number {
    const num = this.validatePositiveInteger(value, fieldName);
    
    if (num < min || num > max) {
      throw new ValidationError([{
        field: fieldName,
        message: `${fieldName} must be between ${min} and ${max}`,
        value: value
      }]);
    }
    
    return num;
  }

  /**
   * Validates that a value is one of the allowed options
   */
  static validateEnum<T>(value: unknown, fieldName: string, allowedValues: T[]): T {
    if (value === undefined || value === null || value === '') {
      return allowedValues[0]; // default to first option
    }
    
    const stringValue = String(value);
    if (!allowedValues.includes(stringValue as T)) {
      throw new ValidationError([{
        field: fieldName,
        message: `${fieldName} must be one of: ${allowedValues.join(', ')}`,
        value: value
      }]);
    }
    
    return stringValue as T;
  }

  /**
   * Validates and sanitizes a string value
   */
  static validateString(value: unknown, fieldName: string, maxLength?: number): string {
    if (value === undefined || value === null) {
      return '';
    }
    
    const stringValue = String(value).trim();
    
    if (maxLength && stringValue.length > maxLength) {
      throw new ValidationError([{
        field: fieldName,
        message: `${fieldName} must not exceed ${maxLength} characters`,
        value: value
      }]);
    }
    
    return stringValue;
  }

  /**
   * Validates email format
   */
  static validateEmail(value: unknown, fieldName: string): string {
    const email = this.validateString(value, fieldName);
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError([{
        field: fieldName,
        message: `${fieldName} must be a valid email address`,
        value: value
      }]);
    }
    
    return email;
  }

  /**
   * Validates ObjectId format
   */
  static validateObjectId(value: unknown, fieldName: string): string {
    const id = this.validateString(value, fieldName);
    
    if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new ValidationError([{
        field: fieldName,
        message: `${fieldName} must be a valid ObjectId`,
        value: value
      }]);
    }
    
    return id;
  }

  /**
   * Middleware to handle validation errors
   */
  static handleValidationError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (err instanceof ValidationError) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: "Validation failed",
        details: err.errors,
        message: "Please check your input data and try again"
      });
      return;
    }
    
    next(err);
  }

  /**
   * Validates pagination parameters
   */
  static validatePagination(query: Record<string, unknown>): { page: number; limit: number } {
    const page = this.validateRange(query.page, 'page', 1, 1000);
    const limit = this.validateRange(query.limit, 'limit', 1, 100);
    
    return { page, limit };
  }
}
