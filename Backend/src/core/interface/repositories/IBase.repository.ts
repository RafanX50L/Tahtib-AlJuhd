import { FilterQuery, Types, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
  findById(id: Types.ObjectId): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;

  findAll(filter: FilterQuery<T>): Promise<T[]>;

  update(id: string, data: UpdateQuery<T>): Promise<T | null>;

  findOne(filter: FilterQuery<T>): Promise<T | null>;

  deleteOne(filter: FilterQuery<T>): Promise<void>;

  countDocuments(filter: FilterQuery<T>): Promise<number>;
}
