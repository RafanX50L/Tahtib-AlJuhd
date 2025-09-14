import { ValidationUtil, ValidationError } from "@/utils/validation.util";

/**
 * Request DTOs for Trainer Personalization Controller
 * Input validation and transformation for trainer personalization endpoints
 */

// Update Profile Data Request DTO
export interface UpdateProfileDataRequestDTO {
  // This will be validated based on the specific fields in the request body
  // The validation will be done dynamically based on the fields present
  [key: string]: unknown;
}

/**
 * Trainer Personalization DTO class for input validation
 * Handles validation and transformation of trainer personalization-related requests
 */
export class TrainerPersonalizationDTO {
  /**
   * Validates and transforms update profile data request
   * This method validates common profile fields that might be present
   */
  static validateUpdateProfileDataRequest(body: Record<string, unknown>): UpdateProfileDataRequestDTO {
    // Validate common profile fields if they exist
    if (body.name !== undefined) {
      ValidationUtil.validateString(body.name, 'name', 100);
    }
    
    if (body.email !== undefined) {
      ValidationUtil.validateEmail(body.email, 'email');
    }
    
    if (body.phone !== undefined) {
      ValidationUtil.validateString(body.phone, 'phone', 20);
    }
    
    if (body.bio !== undefined) {
      ValidationUtil.validateString(body.bio, 'bio', 500);
    }
    
    if (body.specialization !== undefined) {
      ValidationUtil.validateString(body.specialization, 'specialization', 200);
    }
    
    if (body.experience !== undefined) {
      ValidationUtil.validatePositiveInteger(body.experience, 'experience');
    }
    
    if (body.certifications !== undefined) {
      if (!Array.isArray(body.certifications)) {
        throw new ValidationError([{
          field: 'certifications',
          message: 'Certifications must be an array',
          value: body.certifications
        }]);
      }
    }
    
    if (body.languages !== undefined) {
      if (!Array.isArray(body.languages)) {
        throw new ValidationError([{
          field: 'languages',
          message: 'Languages must be an array',
          value: body.languages
        }]);
      }
    }

    return body as UpdateProfileDataRequestDTO;
  }
}
