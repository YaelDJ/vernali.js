import EventEmitter from 'events'

import { LogEntry } from '@framework/types/common/LoggerTypes'

export class Logger {
  private logManager: EventEmitter
  private modulo: string
  private nivelMinimo: number
  private readonly niveles :Record<string, number> ={
    'trace': 1,
    'debug': 2,
    'info': 3,
    'warn': 4,
    'error': 5
  }

  constructor (
    logManager: EventEmitter,
    modulo: string,
    nivelMinimo: string
  ) {
    this.logManager = logManager
    this.modulo = modulo
    this.nivelMinimo = this.levelToInt(nivelMinimo)
  }

  private levelToInt (nivelMinimo: string): number {
    if (nivelMinimo.toLowerCase() in this.niveles) {
      return this.niveles[nivelMinimo.toLowerCase()]
    } else {
      return 0
    }
  }

  public log (nivelLog: string, mensaje: any): void {
    const level = this.levelToInt(nivelLog)

    if (level < this.nivelMinimo) {
      return
    }

    const entradaLog: LogEntry = { nivel: nivelLog,modulo: this.modulo, mensaje }
    const error = new Error('')

    if (error.stack) {
      const stack = error.stack.split('\n')
      let index = 1
      while (index < stack.length && stack[index].includes('at Logger.')) index++
      if (index < stack.length) {
        entradaLog.localizacion = stack[index].slice(stack[index].indexOf('at ') + 3, stack[index].length).replace('.<anonymous>', '')

        if (!entradaLog.localizacion.includes('(')) {
          entradaLog.localizacion = `(${entradaLog.localizacion})`
        } else {
          entradaLog.localizacion = stack[index].slice(stack[index].indexOf('('), stack[index].length)
        }
      }
    }

    this.logManager.emit('log', entradaLog)
  }

  public trace (mensaje: any): void { this.log('trace', mensaje) }
  public debug (mensaje: any): void { this.log('debug', mensaje) }
  public info (mensaje: any): void { this.log('info', mensaje) }
  public warn (mensaje: any): void { this.log('warn', mensaje) }
  public error (mensaje: any): void { this.log('error', mensaje) }
}
