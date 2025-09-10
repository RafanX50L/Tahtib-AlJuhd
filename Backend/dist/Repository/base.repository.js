"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findById(id) {
        return this.model.findById(id);
    }
    async create(data) {
        return await this.model.create(data);
    }
    async findAll(filter = {}) {
        return this.model.find(filter);
    }
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async findOne(filter) {
        return this.model.findOne(filter);
    }
    async deleteOne(filter) {
        await this.model.deleteOne(filter);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map