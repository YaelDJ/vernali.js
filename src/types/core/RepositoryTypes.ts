export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string | number, entity: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<boolean>;
}
