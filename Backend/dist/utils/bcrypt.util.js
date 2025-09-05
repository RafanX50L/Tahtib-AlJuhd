var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcryptjs";
export function hashPassword(value) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = 10;
        return yield bcrypt.hash(value, salt);
    });
}
export function comparePassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(password, hashedPassword);
    });
}
//# sourceMappingURL=bcrypt.util.js.map