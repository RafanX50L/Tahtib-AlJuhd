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
export class AdminClinetController {
    constructor(_adminClinetService) {
        this._adminClinetService = _adminClinetService;
    }
    getAllClinet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, planStatus, search } = req.query;
                const data = yield this._adminClinetService.getAllClinets(planStatus.toString(), search.toString(), Number(page), Number(limit));
                res.status(HttpStatus.OK).json({ message: HttpResponse.DATA_FETCHING_SUCCESSFULL, data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
//# sourceMappingURL=admin.client.controller.js.map