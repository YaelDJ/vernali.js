import IocConfig from '@framework/core/IocConfig'
import { IDatabaseManager, DBTYPES } from '@framework/types/core/DatabaseTypes'
import { resolveDependencies } from '@framework/decorators/Autowired'
import { ConnectionsManager } from '@framework/core/data/ConnectionsManager'

const container = IocConfig.getContainer()

export function DataBaseManager<T extends new (...args: any[]) => IDatabaseManager>(constructor: T) {
  class DatabaseManager extends constructor implements IDatabaseManager {
    constructor (...args: any[]) {
      super(...args)
      resolveDependencies(this)
    }
  }

  container.bind<IDatabaseManager>(DBTYPES.IDatabaseManager).to(DatabaseManager).inSingletonScope()

  return DatabaseManager
}

export function Connection (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const metodoOriginal = descriptor.value

  descriptor.value = function (this: any, ...args: any[]) {
    metodoOriginal.call(this)

    const connectionManager = container.get<ConnectionsManager>(ConnectionsManager)

    connectionManager.iniciarConexiones()
  }

  return descriptor
}
