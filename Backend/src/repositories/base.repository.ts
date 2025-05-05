import{
    Document, Model, Types
} from "mongoose";

export abstract class BaseRepository<T extends Document> {
    constructor(protected model: Model<T>) {};

    async findById(id: Types.ObjectId): Promise<T | null> {
        return this.model.findById(id);
    }

    async create(data: Partial<T>): Promise<T> {
        console.log("Creating document with data:", data);
        const document = new this.model(data);
        return document.save();
    }
}