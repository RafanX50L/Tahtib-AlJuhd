import { ISchedulingController } from "@/core/interface/controllers/domain/IScheduling.Controller";
import { ISchedulingService } from "@/core/interface/services/domain/IScheduling.Service";
import { NextFunction, Request, Response } from "express";
import { 
  SchedulingDTO,
  GetAvailabilityForDateRequestDTO,
  BookSlotRequestDTO,
  CancelBookingRequestDTO,
  CompleteBookingRequestDTO
} from '@/dtos/reverse-mapping/domain/SchedulingDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class SchedulingController implements ISchedulingController {
  constructor(private readonly _schedulingService: ISchedulingService) {}
  async getAvailabilityForDate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Validate and transform request parameters and query using DTO
      const validatedParams: GetAvailabilityForDateRequestDTO = SchedulingDTO.validateGetAvailabilityForDateRequest(req.params, req.query);
      
      const result = await this._schedulingService.getAvailabilityForDate(
        validatedParams.trainerId,
        validatedParams.date,
        validatedParams.tz
      );
      
      ControllerErrorHandler.handleSuccess(res, result, "Availability retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }
  async bookSlot(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request body using DTO
      const validatedBody: BookSlotRequestDTO = SchedulingDTO.validateBookSlotRequest(req.body);
      
      const booking = await this._schedulingService.bookSlot({
        trainerId: validatedBody.trainerId,
        clientId: validatedBody.clientId,
        date: validatedBody.date,
        time: validatedBody.time,
        duration: validatedBody.duration || 60,
        tz: validatedBody.tz,
        contractId: validatedBody.contractId,
      });
      
      ControllerErrorHandler.handleSuccess(res, booking, "Slot booked successfully", 201);
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }
  
  async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request parameters and body using DTO
      const validatedParams: CancelBookingRequestDTO = SchedulingDTO.validateCancelBookingRequest(req.params, req.body);
      
      const canceled = await this._schedulingService.cancelBooking(
        validatedParams.bookingId,
        validatedParams.clientId
      );
      
      ControllerErrorHandler.handleSuccess(res, canceled, "Booking canceled successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }
  
  async completeBooking(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request parameters using DTO
      const validatedParams: CompleteBookingRequestDTO = SchedulingDTO.validateCompleteBookingRequest(req.params);
      
      await this._schedulingService.completeBooking(validatedParams.bookingId);
      
      ControllerErrorHandler.handleSuccess(res, null, "Session completed successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async listBookings(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and transform request query using DTO
      const validatedQuery = SchedulingDTO.validateListBookingsRequest(req.query);
      
      const bookings = await this._schedulingService.listBookings({
        trainerId: validatedQuery.trainerId,
        clientId: validatedQuery.clientId,
        status: validatedQuery.status
      });
      
      ControllerErrorHandler.handleSuccess(res, bookings, "Bookings retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }
}
