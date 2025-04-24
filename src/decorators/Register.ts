import IocConfig from '../core/IocConfig'
import { injectable } from 'inversify'

const container = IocConfig.getContainer()

export default function Register (identificador?: string | symbol) {
  return function (constructor: Function) {
    injectable()(constructor as any)

    const serviceIdentificador = identificador || constructor

    container.bind(serviceIdentificador).to(constructor as any).inSingletonScope()
  }
}
