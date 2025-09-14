import { ClientProfileData } from "@/core/interface/services/client/IClient.Personalization.Service";
import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Client Personalization Controller
 * Input validation and transformation for client personalization endpoints
 */

// Generate Personalization Request DTO
export interface GeneratePersonalizationRequestDTO {
  [key: string]: unknown; // Dynamic validation based on fields present
}

// Update Client Profile Request DTO
export interface UpdateClientProfileRequestDTO {
  [key: string]: unknown; // Dynamic validation based on fields present

}

/**
 * Client Personalization DTO class for input validation
 * Handles validation and transformation of client personalization-related requests
 */
export class ClientPersonalizationDTO {
  /**
   * Validates and transforms generate personalization request
   * This method validates common personalization fields that might be present
   */
  static validateGeneratePersonalizationRequest(body: Record<string, unknown>): GeneratePersonalizationRequestDTO {
    // Validate common personalization fields if they exist
    if (body.age !== undefined) {
      const age = ValidationUtil.validatePositiveInteger(body.age, 'age');
      if (age < 13 || age > 100) {
        throw new Error('Age must be between 13 and 100 years');
      }
    }
    
    if (body.gender !== undefined) {
      ValidationUtil.validateEnum(body.gender, 'gender', ['male', 'female', 'other'] as const);
    }
    
    if (body.weight !== undefined) {
      const weight = ValidationUtil.validatePositiveInteger(body.weight, 'weight');
      if (weight < 20 || weight > 500) {
        throw new Error('Weight must be between 20 and 500 kg');
      }
    }
    
    if (body.height !== undefined) {
      const height = ValidationUtil.validatePositiveInteger(body.height, 'height');
      if (height < 50 || height > 300) {
        throw new Error('Height must be between 50 and 300 cm');
      }
    }
    
    if (body.fitnessLevel !== undefined) {
      ValidationUtil.validateEnum(body.fitnessLevel, 'fitnessLevel', ['beginner', 'intermediate', 'advanced'] as const);
    }
    
    if (body.goals !== undefined) {
      if (!Array.isArray(body.goals)) {
        throw new Error('Goals must be an array');
      }
    }
    
    if (body.availableTime !== undefined) {
      const time = ValidationUtil.validatePositiveInteger(body.availableTime, 'availableTime');
      if (time < 15 || time > 300) {
        throw new Error('Available time must be between 15 and 300 minutes');
      }
    }
    
    if (body.equipment !== undefined) {
      if (!Array.isArray(body.equipment)) {
        throw new Error('Equipment must be an array');
      }
    }

    return body as GeneratePersonalizationRequestDTO;
  }

  /**
   * Validates and transforms update client profile request
   * This method validates common profile fields that might be present
   */
  static validateUpdateClientProfileRequest(body: Record<string, unknown>): ClientProfileData {
    // Validate common profile fields if they exist
    if (body.name !== undefined) {
      ValidationUtil.validateString(body.name, 'name', 100);
    }
    
    if (body.email !== undefined) {
      ValidationUtil.validateEmail(body.email, 'email');
    }
    
    if (body.phoneNumber !== undefined) {
      ValidationUtil.validateString(body.phone, 'phone', 20);
    }

    if(body.address !== undefined){
      ValidationUtil.validateString(body.address, 'address', 100);
    }

    if(body.profilePicture !== undefined){
      ValidationUtil.validateString(body.profilePicture, 'profilePicture',50);
    }

    return {
      name: body.name as string,
      email: body.email as string,
      phoneNumber: body.phoneNumber as string,
      address: body.address as string,
      profilePictureId: body.profilePicture as string
    };
  }
}
