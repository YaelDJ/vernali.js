import Static from '@framework-decorators/Static'
import AppError from '@framework-common/AppError'

interface DateFormatOptions {
  day?: 'numeric' | '2-digit',
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow',
  year?: 'numeric' | '2-digit'
}

@Static
export class FechasUtils {
  public async calcularEdad (fechaNac:string) {
    const [day, month, year] = fechaNac.split('/').map(Number)
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new AppError('Formato de fecha no válido.')
    }

    const monthM1 = month - 1

    const birthDate = new Date(year, monthM1, day)

    if (isNaN(birthDate.getTime())) {
      throw new AppError('Error en calculo de Edad: isNaN(birthDate.getTime())==true ')
    }
    const currentDate = new Date()

    const edad = currentDate.getFullYear() - birthDate.getFullYear()
    if (
      birthDate.getMonth() > currentDate.getMonth() ||
    (birthDate.getMonth() === currentDate.getMonth() &&
      birthDate.getDate() > currentDate.getDate())
    ) {
      return edad - 1
    } else {
      return edad
    }
  }

  public formatearFecha = (fecha: string) => {
    const [dia, mes, anio] = fecha.split('/').map(Number)
    const fechaNac = new Date(anio, mes - 1, dia)

    const opciones: DateFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }

    return fechaNac.toLocaleDateString('es-ES', opciones)
  }

}
