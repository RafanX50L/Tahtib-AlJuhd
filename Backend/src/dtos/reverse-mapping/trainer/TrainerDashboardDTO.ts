import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Trainer Dashboard Controller
 * Input validation and transformation for trainer dashboard endpoints
 */

// Get Payments Request DTO
export interface GetPaymentsRequestDTO {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'all';
  search?: string;
}

/**
 * Trainer Dashboard DTO class for input validation
 * Handles validation and transformation of trainer dashboard-related requests
 */
export class TrainerDashboardDTO {
  /**
   * Validates and transforms get payments request
   */
  static validateGetPaymentsRequest(query: Record<string, unknown>): GetPaymentsRequestDTO {
    const page = query.page 
      ? ValidationUtil.validateRange(query.page, 'page', 1, 1000)
      : undefined;
      
    const limit = query.limit 
      ? ValidationUtil.validateRange(query.limit, 'limit', 1, 100)
      : undefined;
      
    const status = query.status 
      ? ValidationUtil.validateEnum(query.status, 'status', ['pending', 'completed', 'failed', 'refunded', 'all'] as const)
      : 'all';
      
    const search = ValidationUtil.validateString(query.search, 'search', 100);

    return {
      page,
      limit,
      status,
      search,
    };
  }
}
