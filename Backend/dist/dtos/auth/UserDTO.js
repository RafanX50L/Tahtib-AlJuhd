var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PersonalizationModel } from "../../models/Personalization.model";
export class UserDTO {
    static toResponse(user) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const personalization = yield PersonalizationModel.findById(user.personalizationId);
                const personalizationData = personalization === null || personalization === void 0 ? void 0 : personalization.data;
                userData.status = (personalizationData === null || personalizationData === void 0 ? void 0 : personalizationData.status) || null;
            }
            return userData;
        });
    }
}
//# sourceMappingURL=UserDTO.js.map