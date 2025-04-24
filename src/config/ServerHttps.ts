import { readFileSync } from 'fs'
import https from 'https'

import { type IServer, TYPES } from '@framework-types/core/ServerTypes'
import IocConfig from '@framework-core/IocConfig'
import { CoreConfig } from '@framework-lib/CoreConfig'
import { resolveDependencies } from '@framework/decorators/Autowired'

const container = IocConfig.getContainer()

export function ServerHttps<T extends new (...args: any[]) => IServer>(constructor: T) {
  class ServerWithHttps extends constructor implements IServer {
    // @ts-ignore
    port = CoreConfig.getConfig().APP_PORT
    // @ts-ignore
    app
    constructor (...args: any[]) {
      super(...args)
      this.app = (container.get(TYPES.IApplication) as any).getApplication()
    }
  }

  container.bind<IServer>(TYPES.IServer).to(ServerWithHttps).inSingletonScope()

  return ServerWithHttps
}

export function Run (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const metodoOriginal = descriptor.value

  descriptor.value = async function (this: any, ..._args: any[]) {
    const opts = {
      cert: readFileSync('certs/' + CoreConfig.getConfig().APP_SSL_CERT),
      key: readFileSync('certs/' + CoreConfig.getConfig().APP_SSL_KEY)
    }

    process.on('uncaughtException', err => {
      this.logger.error('Excepción inesperada, el servidor se cerrará')
      this.logger.error(err)
      process.exit(1)
    })

    const server = https.createServer(opts, this.app)

    if (!this.port) throw new Error('No se a asignado un puerto a la aplicación')

    resolveDependencies(this)

    server.listen(this.port, async () => {
      this.logger.info(`Servidor corriendo en el puerto ${this.port}`)

      await metodoOriginal.call(this)
    })

    process.on('unhandledRejection', err => {
      this.logger.error('Ocurrio una excepción no capturada, el servidor se cerrará')
      this.logger.error(err)
      server.close(() => process.exit(1))
    })
  }
  return descriptor
}
