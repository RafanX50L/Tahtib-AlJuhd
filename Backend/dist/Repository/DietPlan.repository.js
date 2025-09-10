"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietPlanRepository = void 0;
const base_repository_1 = require("./base.repository");
const DietPlan_model_1 = require("../models/DietPlan.model");
class DietPlanRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(DietPlan_model_1.DietPlanModel);
    }
}
exports.DietPlanRepository = DietPlanRepository;
//# sourceMappingURL=DietPlan.repository.js.map