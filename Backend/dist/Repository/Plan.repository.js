"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanRepository = void 0;
const mongoose_1 = require("mongoose");
const base_repository_1 = require("./base.repository");
const Plan_model_1 = require("../models/Plan.model");
class PlanRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Plan_model_1.PlanModel);
    }
    async create(plan) {
        return await this.model.create(plan);
    }
    async findByTrainerId(trainerId) {
        return await this.model.find({ trainerId: new mongoose_1.Types.ObjectId(trainerId), isActive: true });
    }
}
exports.PlanRepository = PlanRepository;
//# sourceMappingURL=Plan.repository.js.map