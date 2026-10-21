"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressRepository = void 0;
const base_repository_1 = require("./base.repository");
const Progress_model_1 = require("../models/Progress.model");
const mongoose_1 = require("mongoose");
class ProgressRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Progress_model_1.ProgressModel);
    }
    async createIfNotExists(userId) {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const found = await this.model.findOne({ user: userObjectId });
        if (found)
            return found;
        const created = await this.model.create({ user: userObjectId, entries: [] });
        return created;
    }
    async addEntry(userId, entry) {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const updated = await this.model.findOneAndUpdate({ user: userObjectId }, { $push: { entries: { $each: [entry], $position: 0 } } }, { new: true, upsert: true });
        return updated;
    }
    async getLatestEntry(userId) {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const doc = await this.model
            .findOne({ user: userObjectId }, { entries: { $slice: 1 } })
            .lean();
        return doc && doc.entries.length > 0 ? doc.entries[0] : null;
    }
    async getEntriesInRange(userId, start, end) {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const result = await this.model.aggregate([
            { $match: { user: userObjectId } },
            { $unwind: '$entries' },
            { $match: { 'entries.date': { $gte: start, $lte: end } } },
            { $sort: { 'entries.date': 1 } },
            { $group: { _id: '$_id', entries: { $push: '$entries' } } },
            { $project: { _id: 0, entries: 1 } },
        ]);
        return result[0]?.entries ?? [];
    }
}
exports.ProgressRepository = ProgressRepository;
//# sourceMappingURL=Progress.repository.js.map