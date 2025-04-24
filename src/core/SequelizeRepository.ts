import {
  CreateOptions,
  CreationAttributes, DestroyOptions, FindOptions,
  Model,
  ModelStatic, UpdateOptions,
  WhereOptions
} from 'sequelize'
import { MakeNullishOptional } from 'sequelize/types/utils'

export abstract class SequelizeRepository<T extends Model> {
  protected constructor (private modelo: ModelStatic<T>) {}

  public async findAll (filter: WhereOptions<T> = {}, options: FindOptions<T> = {}): Promise<T[]> {
    return await this.modelo.findAll({ where: filter, raw: true, ...options })
  }

  public async findById (id: number, options: FindOptions<T> = {}): Promise<T | null> {
    return (await this.modelo.findByPk(id, { raw: true, ...options })) as T | null
  }

  public async findOne (filter: WhereOptions<T>, options: FindOptions<T> = {}): Promise<T | null> {
    return (await this.modelo.findOne({ where: filter, raw: true, ...options })) ?? null
  }

  public async create (data: MakeNullishOptional<CreationAttributes<T>>, options: CreateOptions<T> = {}): Promise<T> {
    return this.modelo.create(data, { raw: true, ...options })
  }

  public async update (filter: WhereOptions<T> = {}, data: Partial<CreationAttributes<T>>, options: Partial<UpdateOptions<T>> = {}): Promise<[number, T[]?]> {
    return this.modelo.update(data, { where: filter, validate: true, ...options })
  }

  public async delete (filter: WhereOptions<T>, options: DestroyOptions<T> = {}): Promise<number> {
    return this.modelo.destroy({ where: filter, ...options })
  }
}
