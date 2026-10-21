"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPersonalizationDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Client Personalization DTO class for input validation
 * Handles validation and transformation of client personalization-related requests
 */
class ClientPersonalizationDTO {
    /**
     * Validates and transforms generate personalization request
     * This method validates common personalization fields that might be present
     */
    static validateGeneratePersonalizationRequest(body) {
        // Validate common personalization fields if they exist
        if (body.age !== undefined) {
            const age = validation_util_1.ValidationUtil.validatePositiveInteger(body.age, 'age');
            if (age < 13 || age > 100) {
                throw new Error('Age must be between 13 and 100 years');
            }
        }
        if (body.gender !== undefined) {
            validation_util_1.ValidationUtil.validateEnum(body.gender, 'gender', ['male', 'female', 'other']);
        }
        if (body.weight !== undefined) {
            const weight = validation_util_1.ValidationUtil.validatePositiveInteger(body.weight, 'weight');
            if (weight < 20 || weight > 500) {
                throw new Error('Weight must be between 20 and 500 kg');
            }
        }
        if (body.height !== undefined) {
            const height = validation_util_1.ValidationUtil.validatePositiveInteger(body.height, 'height');
            if (height < 50 || height > 300) {
                throw new Error('Height must be between 50 and 300 cm');
            }
        }
        if (body.fitnessLevel !== undefined) {
            validation_util_1.ValidationUtil.validateEnum(body.fitnessLevel, 'fitnessLevel', ['beginner', 'intermediate', 'advanced']);
        }
        if (body.goals !== undefined) {
            if (!Array.isArray(body.goals)) {
                throw new Error('Goals must be an array');
            }
        }
        if (body.availableTime !== undefined) {
            const time = validation_util_1.ValidationUtil.validatePositiveInteger(body.availableTime, 'availableTime');
            if (time < 15 || time > 300) {
                throw new Error('Available time must be between 15 and 300 minutes');
            }
        }
        if (body.equipment !== undefined) {
            if (!Array.isArray(body.equipment)) {
                throw new Error('Equipment must be an array');
            }
        }
        return body;
    }
    /**
     * Validates and transforms update client profile request
     * This method validates common profile fields that might be present
     */
    static validateUpdateClientProfileRequest(body) {
        // Validate common profile fields if they exist
        if (body.name !== undefined) {
            validation_util_1.ValidationUtil.validateString(body.name, 'name', 100);
        }
        if (body.email !== undefined) {
            validation_util_1.ValidationUtil.validateEmail(body.email, 'email');
        }
        if (body.phoneNumber !== undefined) {
            validation_util_1.ValidationUtil.validateString(body.phone, 'phone', 20);
        }
        if (body.address !== undefined) {
            validation_util_1.ValidationUtil.validateString(body.address, 'address', 100);
        }
        if (body.profilePicture !== undefined) {
            validation_util_1.ValidationUtil.validateString(body.profilePicture, 'profilePicture', 500);
        }
        return {
            name: body.name,
            email: body.email,
            phoneNumber: body.phoneNumber,
            address: body.address,
            profilePictureId: body.profilePicture
        };
    }
}
exports.ClientPersonalizationDTO = ClientPersonalizationDTO;
//# sourceMappingURL=ClientPersonalizationDTO.js.map