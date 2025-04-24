import IocConfig from '../core/IocConfig'
import { injectable } from 'inversify'
import { SERVICES_TYPES } from '../types/core/ServerTypes'

const container = IocConfig.getContainer()

export default function Service () {
  return function (constructor: Function) {
    injectable()(constructor as any)

    const serviceKey = constructor.name.toString().toUpperCase()
    SERVICES_TYPES[serviceKey] = Symbol.for(constructor.name)
    container.bind(SERVICES_TYPES[serviceKey]).to(constructor as any)
  }
}
