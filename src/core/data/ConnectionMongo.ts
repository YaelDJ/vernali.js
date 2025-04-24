import { Connection } from '@framework/core/data/Connection'
import mongoose, { Connection as Mongo } from 'mongoose'
import { Entidad } from '@framework/types/core'
import { ModelManager } from '@framework/core/data/ModelManager'
import { createMongooseModel } from '@framework/core/data/createMongooseModel'
import { loggerFactory } from '@framework/lib'

const logger = loggerFactory().getLogger('database.connection')

export class ConnectionMongo extends Connection<Mongo> {
  constructor (conexion: {
    url: string,
    options: mongoose.ConnectOptions
  }, entidades: Entidad[], name: string) {
    const conexionMongo: Mongo = mongoose.createConnection(conexion.url, conexion.options)

    super(name, conexionMongo, entidades)
  }

  public iniciarConexion () {
    this.conexion.on('connected', () => {
      logger.info(`Conectado a mongo ${this.name}`)
    })

    this.conexion.on('error', err => {
      logger.error(`Error en conexion de mongo ${this.name}`)
      logger.error(err)
    })
    this.conexion.on('disconnected', () => {
      logger.info(`Conexion de mongo ${this.name} desconectada-`)
    })
    this.conexion.on('reconnected', () => {
      logger.info(`Conexion de mongo ${this.name} restablecida`)
    })

    ModelManager.iniciarModelos(this)
  }

  public crearModelo (entidad: Entidad) {
    return createMongooseModel(entidad.clase, this.conexion)
  }

  public async cerrarConexion () {
    await this.conexion.close()
  }
}
