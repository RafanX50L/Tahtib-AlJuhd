"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminClientService = void 0;
class AdminClientService {
    _userRepository;
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    placeholder;
    async getAllClients(statusFilter, searchTerm, page, limit) {
        const data = await this._userRepository.getAllClientFilter(page, limit, statusFilter, searchTerm);
        return data;
    }
}
exports.AdminClientService = AdminClientService;
//# sourceMappingURL=admin.client.service.js.map