import { Register } from '@framework/decorators'
import { Connection } from '@framework/core/data/Connection'

@Register()
export class ConnectionsManager {
  private conexiones: Connection<any>[] = []

  public agregarConexion (conexion: Connection<any>) {
    this.validarNombreConexion(conexion)
    this.validarExistenciaConexion(conexion)

    this.conexiones.push(conexion)
  }

  private validarNombreConexion (conexion: Connection<any>) {
    if (conexion.name.startsWith('a-'))
      throw new Error('Nombre de conexión no permitido, no puedes usar el prefijo "a-"')

    if (this.conexiones.length > 0 || this.conexiones.some(con => con.name.startsWith('a-')))
      throw new Error('Para pode agregar otra conexión debes nombrar tus conexiones, las conexiones anonimas solo son permitidas si tienes una sola conexión.')
  }

  private validarExistenciaConexion (conexion: Connection<any>) {
    if (this.conexiones.find(con => con.name === conexion.name))
      throw new Error(`Ya existe una conexión con el nombre ${ conexion.name }`)
  }

  public iniciarConexiones () {
    this.conexiones.forEach(conexion => {
      conexion.iniciarConexion()
    })
  }

  public obtenerConexion (name?: string) {
    if (!name && this.conexiones.length !== 1)
      throw new Error('Debes especificar el nombre de la conexión')

    if (!name) return this.conexiones[0].conexion

    const conexion = this.conexiones.filter(con => {
      return con.compareConnectionName(name)
    })[0]

    if (!conexion) {
      return null
    }

    return conexion.conexion
  }

  async cerrarConexion (name: string) {
    if (!name && this.conexiones.length !== 1)
      throw new Error('Debes especificar el nombre de la conexión a cerrar')

    if (!name) {
      await this.conexiones[0].conexion.cerrarConexion()
      return true
    }

    const conexion = this.conexiones.filter(con => {
      return con.compareConnectionName(name)
    })[0]

    if (!conexion) throw new Error(`No existe una conexión con el nombre ${name}`)

    await conexion.conexion.cerrarConexion()
    return true
  }
}
