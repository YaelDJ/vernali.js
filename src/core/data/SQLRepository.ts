import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model,
  ModelStatic,
  UpdateOptions,
  WhereOptions
} from 'sequelize'
import { RepositoryI } from '@framework/types/core'

export abstract class SQLRepository<T> implements RepositoryI<T> {
  protected constructor (private modelo: ModelStatic<Model>) {}

  public async findAll (filter: Partial<T> = {}, options: FindOptions = {}): Promise<T[]> {
    return (await this.modelo.findAll({ where: filter as WhereOptions, raw: true, ...options })) as T[]
  }

  public async findById (id: number, options: FindOptions = {}): Promise<T | null> {
    return (await this.modelo.findByPk(id, { raw: true, ...options })) as T | null
  }

  public async findOne (filter: WhereOptions<Partial<T>>, options: FindOptions = {}): Promise<T | null> {
    return (await this.modelo.findOne({ where: filter, raw: true, ...options })) as T ?? null
  }

  public async create (data: Partial<T>, options: CreateOptions = {}): Promise<T> {
    return (await this.modelo.create((data as any), { raw: true, ...options })) as T
  }

  public async update (filter: Partial<T> = {}, data: Partial<T>, options: Partial<UpdateOptions> = {}): Promise<[number, T[]?]> {
    return this.modelo.update(data, { where: (filter as WhereOptions), validate: true, ...options })
  }

  public async delete (filter: Partial<T>, options: DestroyOptions = {}): Promise<number> {
    return this.modelo.destroy({ where: (filter as WhereOptions), ...options })
  }
}
