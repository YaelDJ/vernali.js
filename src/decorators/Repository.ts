import IocConfig from '../core/IocConfig'
import { injectable } from 'inversify'
import { REPOSITORIES_TYPES } from '../types/core/ServerTypes'

const container = IocConfig.getContainer()

export default function Repository (entity: any, conexionName?: string) {
  return function (constructor: any) {
    injectable()(constructor as any)

    const proxy = class extends constructor {
      constructor (...args: any[]) {
        super(...args)

        if (entity.findOne) {
          this.modelo = entity

          return this
        }

        let conexion: string | null = null

        const conexiones: string[] = Reflect.getMetadata('modelo:conexiones', entity)

        if (!conexiones) throw new Error(`No hay conexiones relacionadas con la entidad ${entity.name}`)

        if (conexiones.length > 1 && !conexionName) throw new Error('Debes especificar el nombre de la conexión')

        if (!conexionName) conexion = conexiones[0]

        if (conexionName && conexiones.length > 0 && !conexiones.includes(conexionName)) throw new Error(`No se encontró una conexión ${conexionName} relacionada a la entidad ${entity.name}`)

        const modelBuscado = Reflect.getMetadata(`modelo:${entity.name}_${conexion ?? conexionName}`, entity)

        if (!modelBuscado) throw new Error('No se encontró un modelo relacionada con la entidad')

        this.modelo = modelBuscado
      }
    }

    REPOSITORIES_TYPES[constructor.name.toString().toUpperCase()] = Symbol.for(constructor.name)

    container.bind(REPOSITORIES_TYPES[constructor.name.toString().toUpperCase()]).to(proxy as any).inRequestScope()
  }
}
