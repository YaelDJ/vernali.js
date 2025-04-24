import IocConfig from '@framework/core/IocConfig'
import {DBTYPES} from '@framework/types/core'
import {ConnectionsManager} from '@framework/core/data/ConnectionsManager'

const container = IocConfig.getContainer()

export const obtenerConexion = (name?: string) => {
  if (container.isBound(DBTYPES.IDatabaseManager)) {
    const connectionManager = container.get<ConnectionsManager>(ConnectionsManager)

    return connectionManager.obtenerConexion(name)
  }
}