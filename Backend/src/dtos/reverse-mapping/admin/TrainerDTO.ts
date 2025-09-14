import { ITrainerInterview } from "@/core/interface/model/ITrainerInterview.model";
import { ValidationUtil, ValidationError } from "@/utils/validation.util";

// Input DTOs for validation
export interface GetTrainersRequestDTO {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ScheduleInterviewRequestDTO {
  trainerId: string;
  date: string;
  time: string;
}

export interface SubmitInterviewFeedbackRequestDTO {
  id: string;
  feedback: ITrainerInterview["result"];
}

export interface ApproveTrainerRequestDTO {
  id: string;
  salary: number;
}

export interface RejectTrainerRequestDTO {
  id: string;
}

export class AdminTrainerDTO {

  /**
   * Validates and transforms get trainers request parameters
   */
  static validateGetTrainersRequest(query: Record<string, unknown>): GetTrainersRequestDTO {
    const { page, limit } = ValidationUtil.validatePagination(query);
    const search = ValidationUtil.validateString(query.search, 'search', 100);

    return {
      page,
      limit,
      search,
    };
  }

  /**
   * Validates and transforms schedule interview request parameters
   */
  static validateScheduleInterviewRequest(params: Record<string, unknown>): ScheduleInterviewRequestDTO {
    const trainerId = ValidationUtil.validateObjectId(params.trainerId, 'trainerId');
    const date = ValidationUtil.validateString(params.date, 'date');
    const time = ValidationUtil.validateString(params.time, 'time');

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new ValidationError([{
        field: 'date',
        message: 'Date must be a valid date format',
        value: date
      }]);
    }

    // Validate time format (basic HH:MM format)
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      throw new ValidationError([{
        field: 'time',
        message: 'Time must be in HH:MM format',
        value: time
      }]);
    }

    return {
      trainerId,
      date,
      time,
    };
  }

  /**
   * Validates and transforms submit interview feedback request body
   */
  static validateSubmitInterviewFeedbackRequest(body: Record<string, unknown>): SubmitInterviewFeedbackRequestDTO {
    const id = ValidationUtil.validateObjectId(body.id, 'id');
    
    if (!body.feedback || typeof body.feedback !== 'object') {
      throw new ValidationError([{
        field: 'feedback',
        message: 'Feedback is required and must be an object',
        value: body.feedback
      }]);
    }

    const feedback = body.feedback as ITrainerInterview["result"];

    return {
      id,
      feedback,
    };
  }

  /**
   * Validates and transforms approve trainer request body
   */
  static validateApproveTrainerRequest(body: Record<string, unknown>): ApproveTrainerRequestDTO {
    const id = ValidationUtil.validateObjectId(body.id, 'id');
    const salary = ValidationUtil.validatePositiveInteger(body.salary, 'salary');

    if (salary < 0) {
      throw new ValidationError([{
        field: 'salary',
        message: 'Salary must be a positive number',
        value: body.salary
      }]);
    }

    return {
      id,
      salary,
    };
  }

  /**
   * Validates and transforms reject trainer request body
   */
  static validateRejectTrainerRequest(body: Record<string, unknown>): RejectTrainerRequestDTO {
    const id = ValidationUtil.validateObjectId(body.id, 'id');

    return {
      id,
    };
  }
}
