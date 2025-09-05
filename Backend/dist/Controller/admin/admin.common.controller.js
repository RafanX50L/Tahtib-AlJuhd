var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpResponse } from "../../constants/response-message.constant";
import { HttpStatus } from "../../constants/status.constant";
export class AdminCommonController {
    constructor(_adminCommonService) {
        this._adminCommonService = _adminCommonService;
    }
    blockOrUnblock(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this._adminCommonService.blockOrUnblock(id);
                res.status(HttpStatus.OK).json({ message: HttpResponse.USER_STATUS_UPDATED_SUCCESSFULL });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
//# sourceMappingURL=admin.common.controller.js.map