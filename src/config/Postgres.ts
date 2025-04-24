import { Options, Sequelize } from 'sequelize'

import { SQLConexionConfig, IDatabase } from '@framework/types/core/DatabaseTypes'
import { Autowired, Register } from '@framework/decorators'
import { ConnectionsManager } from '@framework/core/data/ConnectionsManager'
import { ConnectionSQL } from '@framework/core/data/ConnectionSQL'

@Register()
export class PGDB implements IDatabase<Sequelize> {
  @Autowired
  private connectionManager!: ConnectionsManager

  agregarConexion (database: string, username: string, password: string, options: Options, config?: SQLConexionConfig) {
    const nuevaConexion = new Sequelize(database, username, password, {
      ...options,
      dialect: 'postgres',
      logging: false
    })
    const conexionAgregar = new ConnectionSQL(nuevaConexion, config?.entidades ?? [], config?.conexionName ?? `a-${database}-${options?.host}-${options?.port}`)

    this.connectionManager.agregarConexion(conexionAgregar)
  }
}
