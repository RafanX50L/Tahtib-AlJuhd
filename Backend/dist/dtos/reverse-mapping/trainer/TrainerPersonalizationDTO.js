"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerPersonalizationDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Trainer Personalization DTO class for input validation
 * Handles validation and transformation of trainer personalization-related requests
 */
class TrainerPersonalizationDTO {
    /**
     * Validates and transforms update profile data request
     * This method validates common profile fields that might be present
     */
    static validateUpdateProfileDataRequest(body) {
        // Validate common profile fields if they exist
        if (body.name !== undefined) {
            validation_util_1.ValidationUtil.validateString(body.name, 'name', 100);
        }
        if (body.email !== undefined) {
            validation_util_1.ValidationUtil.validateEmail(body.email, 'email');
        }
        if (body.phone !== undefined) {
            validation_util_1.ValidationUtil.validateString(body.phone, 'phone', 20);
        }
        if (body.bio !== undefined) {
            validation_util_1.ValidationUtil.validateString(body.bio, 'bio', 500);
        }
        if (body.specialization !== undefined) {
            validation_util_1.ValidationUtil.validateString(body.specialization, 'specialization', 200);
        }
        if (body.experience !== undefined) {
            validation_util_1.ValidationUtil.validatePositiveInteger(body.experience, 'experience');
        }
        if (body.certifications !== undefined) {
            if (!Array.isArray(body.certifications)) {
                throw new validation_util_1.ValidationError([{
                        field: 'certifications',
                        message: 'Certifications must be an array',
                        value: body.certifications
                    }]);
            }
        }
        if (body.languages !== undefined) {
            if (!Array.isArray(body.languages)) {
                throw new validation_util_1.ValidationError([{
                        field: 'languages',
                        message: 'Languages must be an array',
                        value: body.languages
                    }]);
            }
        }
        return body;
    }
}
exports.TrainerPersonalizationDTO = TrainerPersonalizationDTO;
//# sourceMappingURL=TrainerPersonalizationDTO.js.map