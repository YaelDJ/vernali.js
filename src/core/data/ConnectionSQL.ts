import { Entidad } from '@framework/types/core'
import { Sequelize } from 'sequelize'
import { loggerFactory } from '@framework/lib'
import { Connection } from '@framework/core/data/Connection'
import { createSequelizeModel } from '@framework/core/data/createSequelizeModel'
import { ModelManager } from '@framework/core/data/ModelManager'

const logger = loggerFactory().getLogger('database.connection')

export class ConnectionSQL extends Connection<Sequelize> {
  constructor (conexion: Sequelize, entidades: Entidad[], name: string) {
    super(name, conexion, entidades)
  }

  public iniciarConexion () {
    this.conexion.authenticate()
      .then(() => {
        logger.info(`Conexion establecida a ${this.conexion.config.database}`)
      })
      .catch((err: Error) => {
        logger.info(`Error de conexion a ${this.conexion.config.database}`)
        logger.error(JSON.stringify(err) ?? err.message)
        process.exit(1)
      })

    ModelManager.iniciarModelos(this)
  }

  public crearModelo (entidad: Entidad) {
    return createSequelizeModel(entidad.clase, this.conexion)
  }

  public async cerrarConexion () {
    await this.conexion.close()
  }
}