import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Client Dashboard Controller
 * Input validation and transformation for client dashboard endpoints
 */

// Get Client Dashboard Stats Request DTO
export interface GetClientDashboardStatsRequestDTO {
  clientId?: string;
}

/**
 * Client Dashboard DTO class for input validation
 * Handles validation and transformation of client dashboard-related requests
 */
export class ClientDashboardDTO {
  /**
   * Validates and transforms get client dashboard stats request
   */
  static validateGetClientDashboardStatsRequest(params: Record<string, unknown>): GetClientDashboardStatsRequestDTO {
    const clientId = params.clientId 
      ? ValidationUtil.validateString(params.clientId, 'clientId', 50)
      : undefined;

    return {
      clientId,
    };
  }
}
