import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose'

export abstract class BaseRepository<T extends Document> {
  constructor (private readonly model: Model<T>) {}

  public async findAll (filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec()
  }

  public async findById (id: string): Promise<T | null> {
    return this.model.findById(id).exec()
  }

  public async findOne (filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec()
  }

  public async create (data: Partial<T>): Promise<T> {
    const newDocument = new this.model(data)
    return newDocument.save()
  }

  public async update (filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<number> {
    const result = await this.model.updateMany(filter, data).exec()
    return result.modifiedCount
  }

  public async delete (filter: FilterQuery<T>): Promise<number> {
    const result = await this.model.deleteMany(filter).exec()
    return result.deletedCount || 0
  }
}