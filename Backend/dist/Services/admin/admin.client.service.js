var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class AdminClientService {
    constructor(_userRepository, _personalizationRepository) {
        this._userRepository = _userRepository;
        this._personalizationRepository = _personalizationRepository;
    }
    getAllClinets(statusFilter, searchTerm, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._userRepository.getAllClientFilter(page, limit, statusFilter, searchTerm);
            return data;
        });
    }
}
//# sourceMappingURL=admin.client.service.js.map