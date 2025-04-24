import { Conexion, Entidad } from '@framework/types/core'
import { resolveDependencies } from '@framework/decorators/Autowired'

export abstract class Connection<T> implements Conexion<T> {
  public name: string
  public conexion: T
  public entidades: Entidad[]

  protected constructor (name: string, conexion: T, entidades: Entidad[]) {
    this.name = name
    this.conexion = conexion
    this.entidades = entidades || []

    resolveDependencies(this)
  }

  public abstract iniciarConexion(): void

  public abstract crearModelo(entidad: Entidad): any

  public compareConnectionName (database: string) {
    return this.name === database
  }

  public abstract cerrarConexion (): Promise<void>
}
