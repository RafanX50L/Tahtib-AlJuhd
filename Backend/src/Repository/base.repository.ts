  import { Document, FilterQuery, Model, Types, UpdateQuery } from "mongoose";
  import { IBaseRepository } from "../core/interface/repositories/IBase.repository";

  export abstract class BaseRepository<T extends Document>
    implements IBaseRepository<T>
  {
    constructor(protected model: Model<T>) {}

    async findById(id: Types.ObjectId): Promise<T | null> {
      return this.model.findById(id);
    }

    async create(data: Partial<T>): Promise<T> {
      return await this.model.create(data);
    }

    async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
      return this.model.find(filter);
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
      return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
      return this.model.findOne(filter);
    }

    async deleteOne(filter: FilterQuery<T>): Promise<void> {
      await this.model.deleteOne(filter);
    }
  }
