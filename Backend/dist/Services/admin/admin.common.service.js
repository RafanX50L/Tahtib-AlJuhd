"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCommonService = void 0;
class AdminCommonService {
    _userRepository;
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    placeholder;
    async blockOrUnblock(userId) {
        await this._userRepository.blockOrUnblockUser(userId);
    }
}
exports.AdminCommonService = AdminCommonService;
//# sourceMappingURL=admin.common.service.js.map