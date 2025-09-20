import { ValidationUtil } from "@/utils/validation.util";

// Input DTOs for validation
export interface GetAllClientsRequestDTO {
  page?: number;
  limit?: number;
  planStatus?: 'Active' | 'Inactive' | 'all';
  search?: string;
}

export class AdminClientDTO {
  /**
   * Validates and transforms request query parameters
   */
  static validateGetAllClientsRequest(query: Record<string, unknown>): GetAllClientsRequestDTO {

      // Validate pagination parameters
      const { page, limit } = ValidationUtil.validatePagination(query);
      
      // Validate plan status filter
      const planStatus = ValidationUtil.validateEnum(
        query.planStatus,
        'planStatus',
        ['Active', 'Inactive', 'all'] as const
      );

      // Validate and sanitize search term
      const search = ValidationUtil.validateString(query.search, 'search', 100);

      return {
        page,
        limit,
        planStatus,
        search,
      };
  }
}
