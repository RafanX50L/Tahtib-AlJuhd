import { NextFunction, Response } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { ValidationError } from "./validation.util";

/**
 * Common error handler for admin controllers
 * Handles validation errors and other errors consistently
 */
export class ControllerErrorHandler {
  /**
   * Handles validation errors with consistent response format
   * @param error - The error to handle
   * @param res - Express response object
   * @returns true if error was handled, false if should continue to next middleware
   */
  static handleValidationError(
    error: unknown,
    res: Response,
  ): boolean {
    if (error instanceof ValidationError) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: "Validation failed",
        details: error.errors,
        message: "Please check your input parameters and try again"
      });
      return true;
    }
    return false;
  }

  /**
   * Handles all errors in controller methods
   * @param error - The error to handle
   * @param res - Express response object
   * @param next - Express next function
   */
  static handleError(
    error: unknown,
    res: Response,
    next: NextFunction
  ): void {
    // Try to handle as validation error first
    if (this.handleValidationError(error, res)) {
      return;
    }

    // If not a validation error, pass to next middleware
    next(error);
  }

  /**
   * Handles not found responses consistently
   * @param res - Express response object
   * @param message - Custom message (optional)
   */
  static handleNotFound(
    res: Response,
    message: string = "Resource not found"
  ): void {
    res.status(HttpStatus.NOT_FOUND).json({
      success: false,
      message,
      data: null,
    });
  }

  /**
   * Handles success responses consistently
   * @param res - Express response object
   * @param data - Response data
   * @param message - Success message
   * @param statusCode - HTTP status code (default: 200)
   */
  static handleSuccess(
    res: Response,
    data: unknown,
    message: string,
    statusCode: number = HttpStatus.OK
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
}
