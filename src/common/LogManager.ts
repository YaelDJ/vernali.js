import EventEmitter from 'events'

import type { LogEntry, LogOptions } from '@framework/types/common/LoggerTypes'
import { Logger } from './Logger'
import Register from '@framework-decorators/Register'
import { styleText } from 'util'

const COLORS: Record<string, string> = {
  trace: 'green',
  debug: 'blue',
  info: 'white',
  warn: 'yellow',
  error: 'red'
}

@Register()
export default class LogManager extends EventEmitter {
  private opciones: LogOptions = {
    nivelesMinimos: {
      '': 'info',
      'global': 'trace'
    }
  }

  private consoleLoggerRegistrado = false

  public configurar (options: LogOptions): LogManager {
    this.opciones = Object.assign({}, this.opciones, options)
    return this
  }

  public getLogger (module: string): Logger {
    let nivelMinimo = 'none'
    let match = ''

    for (const key in this.opciones.nivelesMinimos) {
      if (module.startsWith(key) && key.length >= match.length) {
        nivelMinimo = this.opciones.nivelesMinimos[key]
        match = key
      }
    }

    return new Logger(this, module, nivelMinimo)
  }

  public onLogEntry (listener: (logEntry: LogEntry) => void): LogManager {
    this.on('log', listener)
    return this
  }

  public registerConsoleLogger (): LogManager {
    if (this.consoleLoggerRegistrado) return this

    this.onLogEntry((logEntry) => {
      const msg = `{ ${styleText(['bold', (COLORS[logEntry.nivel.toLowerCase()] as any) ?? 'white'],logEntry.nivel.toUpperCase())} } ${styleText('grey', logEntry.localizacion!)} ${styleText('cyan', '[' + logEntry.modulo.toUpperCase() + ']')} ${styleText('bold', '->')}`

      switch (logEntry.nivel.toLowerCase()) {
      case 'trace':
        console.trace(msg, logEntry.mensaje)
        break
      case 'debug':
        console.debug(msg, logEntry.mensaje)
        break
      case 'info':
        console.info(msg, logEntry.mensaje)
        break
      case 'warn':
        console.warn(msg, logEntry.mensaje)
        break
      case 'error':
        console.error(msg, logEntry.mensaje)
        break
      default:
        console.log(msg, logEntry.mensaje)
      }
    })

    this.consoleLoggerRegistrado = true
    return this
  }
}
