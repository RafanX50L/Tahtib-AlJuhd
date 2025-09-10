"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminClientService = void 0;
class AdminClientService {
    _userRepository;
    _personalizationRepository;
    constructor(_userRepository, _personalizationRepository) {
        this._userRepository = _userRepository;
        this._personalizationRepository = _personalizationRepository;
    }
    placeholder;
    async getAllClinets(statusFilter, searchTerm, page, limit) {
        const data = await this._userRepository.getAllClientFilter(page, limit, statusFilter, searchTerm);
        return data;
    }
}
exports.AdminClientService = AdminClientService;
//# sourceMappingURL=admin.client.service.js.map