import Static from '@framework-decorators/Static'
import bcrypt from 'bcrypt'
import AppError from '@framework-common/AppError'

@Static
export class PasswordManager {
  private static longitud:number = 8
  private static mayusculas:RegExp =/[A-ZÑ]+/
  private static minusculas:RegExp =/[a-zñ]+/
  private static numero:RegExp =/\d+/
  private static caracteresEspeciales:RegExp=/[|°¬!'#$%&/()='?\\¿¡@´¨+*~{[^}\]`<>,;.:\-_]+/// 20240321

  public static async comparePassword (password: string, candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, password)
  }

  public static validatePassword (password: string) {
    if (password.length < this.longitud
      || !this.mayusculas.test(password)
      || !this.minusculas.test(password)
      || !this.numero.test(password)
      || !this.caracteresEspeciales.test(password)) throw new AppError('La contraseña no cumple con los requisitos')
  }

  public static encryptPassword (password: string) {
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(password, salt)
  }

  public static generarCodigo () {
    const caracteresPermitidos = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'// 0, 1, I, L, Ñ, O: No están dado a que pueden generar confuciones
    let cadenaAleatoria = ''

    for (let i = 0; i < 5; i++) {
      const caracterAleatorio = caracteresPermitidos.charAt(
        Math.floor(Math.random() * caracteresPermitidos.length)
      )
      cadenaAleatoria += caracterAleatorio
    }

    return cadenaAleatoria
  }
}