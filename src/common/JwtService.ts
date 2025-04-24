import Service from '@framework-decorators/Service'
import { CoreConfig } from '@framework-lib/CoreConfig'
import jwt, { JwtPayload, VerifyCallback, VerifyErrors } from 'jsonwebtoken'
import AppError from '@framework-common/AppError'

@Service()
export class JwtService {
  generarToken (id_user: number | string): string {
    if (!CoreConfig.getConfig().SECRET) throw new AppError('No se ha configurado una clave secreta')

    return jwt.sign({ id_user: String(id_user) }, CoreConfig.getConfig().SECRET)
  }

  obtenerIdUserDeToken (token: string) {
    return this.obtenerPropiedadDeToken(token, 'id_user')
  }

  private obtenerPropiedadDeToken (token: string, propiedad: string): string {
    const payload = this.obtenerPayload(token)

    if (!payload || !payload[propiedad]) throw new AppError('No se encontro la propiedad en el token')

    return payload[propiedad]
  }

  private obtenerPayload (token: string): JwtPayload | undefined {
    if (!CoreConfig.getConfig().SECRET) throw new AppError('No se ha configurado una clave secreta')

    let payload

    const jwtCallBack: VerifyCallback = (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (typeof decoded === 'string' || error !== null) throw new AppError('Ocurrio un error al revisar el token')

      payload = decoded
    }

    jwt.verify(token, CoreConfig.getConfig().SECRET, jwtCallBack)

    return payload
  }
}