import Static from '@framework-decorators/Static'
import ActiveDirectory from 'activedirectory2'
import AppError from '@framework-common/AppError'

@Static
export class DirectorioActivo {
  public static autenticarDirectorioActivo (user: string, password: string): Promise<string> {
    const user_opd = user.replace('@imssbienestar.gob.mx','@opdib.gob.mx')
    const config = {
      url: 'ldap://172.16.19.1:389',
      baseDN: 'DC=opdib,DC=gob,DC=mx',
      // filter: '(&(objectClass=user)(objectCategory=person))',
      // bindDN: 'OPDIB\mesa.ldap',
      username: user_opd,
      password: password
    }

    const ad = new ActiveDirectory(config)

    return new Promise((resolve, reject) => {
      ad.authenticate(user_opd, password, (err: string, authenticated: boolean) => {
        if (err) throw new AppError('Error al autenticar directorio activo', 500)

        if (!authenticated) throw new AppError('Error al autenticar directorio activo', 401)

        ad.findUser(user_opd.split('@')[0], (err, user: Partial<{ mail: string }>) => {
          if (err) throw new AppError('Error al autenticar directorio activo, intente mas tarde', 500)

          resolve(user.mail!)
        })
      })
    })
  }
}
