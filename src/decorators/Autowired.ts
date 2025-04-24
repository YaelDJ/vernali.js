import IocConfig from '../core/IocConfig'
import 'reflect-metadata'
import { REPOSITORIES_TYPES } from '../types/core/ServerTypes'

const container = IocConfig.getContainer()

export function resolveDependencies (instance: any) {
  const properties = Object.getOwnPropertyNames(instance)

  properties.forEach((property: string) => {
    let type = Reflect.getMetadata('design:type', instance, property)

    if (type?.prototype?.constructor?.name?.toLowerCase().includes('repository')) {
      type = REPOSITORIES_TYPES[type.name.toString().toUpperCase()]
    }

    if (type && !instance[property]) {
      const resolvedDependency = container.get(type)

      instance[property] = resolvedDependency

      if (resolvedDependency && resolvedDependency?.constructor) {
        resolveDependencies(resolvedDependency)
      }
    }
  })
}

/**
 * Decorador que se encarga de inyectar una dependencia en una propiedad de una clase.
 *
 * @param {any} target - Prototype de la clase que contiene la propiedad a inyectar.
 * @param {string | symbol} propertyKey - Nombre de la propiedad a inyectar.
 * @throws {Error} - Devuelve un error si no se puede determinar el tipo de la propiedad.
 */
export default function Autowired (target: any, propertyKey: string | symbol) {
  let type = Reflect.getMetadata('design:type', target, propertyKey)

  if (type?.prototype?.constructor?.name?.toLowerCase().includes('repository')) {
    type = REPOSITORIES_TYPES[type.name.toString().toUpperCase()]
  }

  if (!type) {
    throw new Error(`No se puede determinar el tipo para ${String(propertyKey)}. Asegurate de que 'emitDecoratorMetadata' este habilitado.`)
  }

  Object.defineProperty(target, String(propertyKey), {
    get () {
      if (!this[`__${String(propertyKey)}`]) {
        const resolvedDependency = container.get(type)

        if (resolvedDependency && resolvedDependency?.constructor) {
          resolveDependencies(resolvedDependency)
        }

        this[`__${String(propertyKey)}`] = resolvedDependency
      }

      return this[`__${String(propertyKey)}`]
    },
    configurable: true,
    enumerable: true
  })
}
