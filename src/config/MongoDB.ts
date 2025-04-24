import { Autowired, Register } from '@framework/decorators'
import { IDatabase, SQLConexionConfig } from '@framework/types/core'
import { ConnectionsManager } from '@framework/core/data/ConnectionsManager'
import { Connection } from 'mongoose'
import { ConnectionMongo } from '@framework/core/data/ConnectionMongo'

@Register()
export class MongoDB implements IDatabase<Connection> {
  @Autowired
  private connectionManager!: ConnectionsManager

  agregarConexion (database: string, username: string, password: string, options: {
    host: string,
    port: number
  }, config?: SQLConexionConfig) {
    const createConfig = {
      url: `mongodb://${options.host}:${options.port}/${database}`,
      options: {
        auth: {
          username,
          password
        },
        retryWrites: false,
        maxPoolSize: 500,
        minPoolSize: 100
      }
    }

    const conexionAgregar = new ConnectionMongo(createConfig, config?.entidades ?? [], config?.conexionName ?? `a-${database}-${options?.host}-${options?.port}`)

    this.connectionManager.agregarConexion(conexionAgregar)
  }
}