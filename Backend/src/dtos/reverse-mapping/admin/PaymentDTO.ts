import { ValidationUtil, ValidationError } from "@/utils/validation.util";

// Input DTOs for validation
export interface GetPaymentsByClientRequestDTO {
  clientId: string;
}

export interface GetPaymentsByTrainerRequestDTO {
  trainerId: string;
}

export interface GetPaymentByIdRequestDTO {
  paymentId: string;
}

export interface GetPaymentsByDateRangeRequestDTO {
  startDate: string;
  endDate: string;
}

export interface GetTotalRevenueByTrainerRequestDTO {
  trainerId: string;
}

export interface UpdatePaymentStatusRequestDTO {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

export interface GetPaymentByStripePaymentIntentIdRequestDTO {
  paymentIntentId: string;
}

export interface GetPaymentByStripeSessionIdRequestDTO {
  sessionId: string;
}

export class AdminPaymentDTO {

  /**
   * Validates and transforms get payments by client request parameters
   */
  static validateGetPaymentsByClientRequest(params: Record<string, unknown>): GetPaymentsByClientRequestDTO {
    const clientId = ValidationUtil.validateObjectId(params.clientId, 'clientId');

    return {
      clientId,
    };
  }

  /**
   * Validates and transforms get payments by trainer request parameters
   */
  static validateGetPaymentsByTrainerRequest(params: Record<string, unknown>): GetPaymentsByTrainerRequestDTO {
    const trainerId = ValidationUtil.validateObjectId(params.trainerId, 'trainerId');

    return {
      trainerId,
    };
  }

  /**
   * Validates and transforms get payment by ID request parameters
   */
  static validateGetPaymentByIdRequest(params: Record<string, unknown>): GetPaymentByIdRequestDTO {
    const paymentId = ValidationUtil.validateObjectId(params.paymentId, 'paymentId');

    return {
      paymentId,
    };
  }

  /**
   * Validates and transforms get payments by date range request parameters
   */
  static validateGetPaymentsByDateRangeRequest(query: Record<string, unknown>): GetPaymentsByDateRangeRequestDTO {
    const startDate = ValidationUtil.validateString(query.startDate, 'startDate');
    const endDate = ValidationUtil.validateString(query.endDate, 'endDate');

    // Validate date format
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime())) {
      throw new ValidationError([{
        field: 'startDate',
        message: 'Start date must be a valid date format',
        value: startDate
      }]);
    }

    if (isNaN(endDateObj.getTime())) {
      throw new ValidationError([{
        field: 'endDate',
        message: 'End date must be a valid date format',
        value: endDate
      }]);
    }

    if (startDateObj > endDateObj) {
      throw new ValidationError([{
        field: 'dateRange',
        message: 'Start date must be before end date',
        value: { startDate, endDate }
      }]);
    }

    return {
      startDate,
      endDate,
    };
  }

  /**
   * Validates and transforms get total revenue by trainer request parameters
   */
  static validateGetTotalRevenueByTrainerRequest(params: Record<string, unknown>): GetTotalRevenueByTrainerRequestDTO {
    const trainerId = ValidationUtil.validateObjectId(params.trainerId, 'trainerId');

    return {
      trainerId,
    };
  }

  /**
   * Validates and transforms update payment status request
   */
  static validateUpdatePaymentStatusRequest(
    params: Record<string, unknown>,
    body: Record<string, unknown>
  ): UpdatePaymentStatusRequestDTO {
    const paymentId = ValidationUtil.validateObjectId(params.paymentId, 'paymentId');
    
    const status = ValidationUtil.validateEnum(
      body.status,
      'status',
      ['pending', 'completed', 'failed', 'refunded'] as const
    );

    return {
      paymentId,
      status,
    };
  }

  /**
   * Validates and transforms get payment by Stripe payment intent ID request parameters
   */
  static validateGetPaymentByStripePaymentIntentIdRequest(params: Record<string, unknown>): GetPaymentByStripePaymentIntentIdRequestDTO {
    const paymentIntentId = ValidationUtil.validateString(params.paymentIntentId, 'paymentIntentId');

    return {
      paymentIntentId,
    };
  }

  /**
   * Validates and transforms get payment by Stripe session ID request parameters
   */
  static validateGetPaymentByStripeSessionIdRequest(params: Record<string, unknown>): GetPaymentByStripeSessionIdRequestDTO {
    const sessionId = ValidationUtil.validateString(params.sessionId, 'sessionId');

    return {
      sessionId,
    };
  }
}
