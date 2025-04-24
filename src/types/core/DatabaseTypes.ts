export const DBTYPES = {
  IDatabaseManager: Symbol.for('IDatabaseManager')
}

export interface RepositoryI<T> {
  findAll (...args: any[]): Promise<T[]>
}

export interface IDatabaseManager {
  run?(): void
}

export interface Entidad {
  clase: any,
  nombreModelo: string,
  tabla?: string
}

export interface Conexion<T> {
  name: string
  conexion: T
  entidades: Entidad[]
}

export interface SQLConexionConfig {
  entidades?: Entidad[],
  conexionName: string
}

export interface IDatabase<T> {
  agregarConexion (...args: any[]): void
}

export const MODEL_TYPES: Record<string, symbol> = {}