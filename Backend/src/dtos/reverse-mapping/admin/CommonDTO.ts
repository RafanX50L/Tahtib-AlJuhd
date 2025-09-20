import { ValidationUtil } from "@/utils/validation.util";

// Input DTOs for validation
export interface BlockOrUnblockRequestDTO {
  id: string;
}

export class AdminCommonDTO {

  /**
   * Validates and transforms block/unblock request parameters
   */
  static validateBlockOrUnblockRequest(params: Record<string, unknown>): BlockOrUnblockRequestDTO {
    const id = ValidationUtil.validateObjectId(params.id, 'id');

    return {
      id,
    };
  }
}
