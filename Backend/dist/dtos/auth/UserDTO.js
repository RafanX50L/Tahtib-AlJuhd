"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
const Personalization_model_1 = require("../../models/Personalization.model");
class UserDTO {
    static async toResponse(user) {
        const userData = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            personalizationId: user.personalizationId,
            status: null,
            tokenVersion: user.tokenVersion,
        };
        if (user.role === "trainer" && user.personalizationId !== null) {
            const personalization = await Personalization_model_1.PersonalizationModel.findById(user.personalizationId);
            const personalizationData = personalization?.data;
            userData.status = personalizationData?.status || null;
        }
        return userData;
    }
}
exports.UserDTO = UserDTO;
//# sourceMappingURL=UserDTO.js.map