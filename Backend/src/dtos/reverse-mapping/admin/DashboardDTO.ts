import { ValidationUtil } from "@/utils/validation.util";

// Input DTOs for validation
export interface GetRevenueTrendsRequestDTO {
  monthsBack?: number;
}

export interface GetTopTrainersRequestDTO {
  limit?: number;
}

export interface GetRecentPaymentsRequestDTO {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

export class AdminDashboardDTO {
  /**
   * Validates and transforms get revenue trends request parameters
   */
  static validateGetRevenueTrendsRequest(
    query: Record<string, unknown>
  ): GetRevenueTrendsRequestDTO {
    const monthsBack = query.monthsBack
      ? ValidationUtil.validateRange(query.monthsBack, "monthsBack", 1, 24)
      : 6; // default to 6 months

    return {
      monthsBack,
    };
  }

  /**
   * Validates and transforms get top trainers request parameters
   */
  static validateGetTopTrainersRequest(
    query: Record<string, unknown>
  ): GetTopTrainersRequestDTO {
    const limit = query.limit
      ? ValidationUtil.validateRange(query.limit, "limit", 1, 50)
      : 5; // default to 5 trainers

    return {
      limit,
    };
  }

  /**
   * Validates and transforms get recent payments request parameters
   */
  static validateGetRecentPaymentsRequest(
    query: Record<string, unknown>
  ): GetRecentPaymentsRequestDTO {
    const page = query.page
      ? ValidationUtil.validateRange(query.page, "page", 1, 1000)
      : 1; // default to page 1

    const pageSize = query.pageSize
      ? ValidationUtil.validateRange(query.pageSize, "pageSize", 1, 100)
      : 10; // default to 10 items per page

    const searchTerm = ValidationUtil.validateString(
      query.searchTerm,
      "searchTerm",
      100
    );

    return {
      page,
      pageSize,
      searchTerm,
    };
  }
}
