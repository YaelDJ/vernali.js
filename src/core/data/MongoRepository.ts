import { Document, Model, FilterQuery, QueryOptions, UpdateQuery, Types } from 'mongoose'
import { RepositoryI } from '@framework/types/core'

export abstract class MongooseRepository<T extends Document> implements RepositoryI<T> {
  protected constructor (private modelo: Model<T>) {}

  public async findAll (filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
    return this.modelo.find(filter, null, options).exec()
  }

  public async findById (id: Types.ObjectId | string, options: QueryOptions = {}): Promise<T | null> {
    return this.modelo.findById(id, null, options).exec()
  }

  public async findOne (filter: FilterQuery<T>, options: QueryOptions = {}): Promise<T | null> {
    return this.modelo.findOne(filter, null, options).exec()
  }

  public async create (data: Partial<T>, options: QueryOptions = {}): Promise<T> {
    const instance = new this.modelo(data)
    return instance.save(options)
  }

  public async update (filter: FilterQuery<T> = {}, data: UpdateQuery<T>, options: UpdateQuery<any> = {}): Promise<number> {
    const result = await this.modelo.updateMany(filter, data, options).exec()
    return result.modifiedCount || 0
  }

  public async delete (filter: FilterQuery<T>, options: any = {}): Promise<number> {
    const result = await this.modelo.deleteMany(filter, options).exec()
    return result.deletedCount || 0
  }
}