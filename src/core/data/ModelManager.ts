import { Connection } from '@framework/core/data/Connection'
import { Entidad, MODEL_TYPES } from '@framework/types/core'
import Static from '@framework/decorators/Static'

@Static
export class ModelManager {
  public static iniciarModelos (conexion: Connection<any>) {
    conexion.entidades.forEach(entidad => {
      this.iniciarModelo(entidad, conexion)
    })
  }

  private static iniciarModelo (entidad: Entidad, conexion: Connection<any>) {
    const nombreConexion = conexion.name

    Reflect.defineMetadata('modelo:nombre', entidad.nombreModelo, entidad.clase)

    Reflect.defineMetadata('modelo:tabla', entidad.tabla ?? entidad.nombreModelo, entidad.clase)

    const details = Reflect.getMetadata('entity:details', entidad.clase)

    if (details.length > 1 && nombreConexion.startsWith('a-')) throw new Error('')

    const modelo = conexion.crearModelo(entidad)

    const conexionesModelo = Reflect.getMetadata('modelo:conexiones', entidad.clase) ?? []

    conexionesModelo.push(nombreConexion)

    MODEL_TYPES[`${entidad.clase.name}_${nombreConexion}`] = Symbol.for(`${entidad.clase.name}-${nombreConexion}`)

    Reflect.defineMetadata('modelo:conexiones', conexionesModelo, entidad.clase)
    Reflect.defineMetadata(`modelo:${entidad.clase.name}_${nombreConexion}`, modelo, entidad.clase)
  }
}
