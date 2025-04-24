import { NextFunction, Response } from 'express'

export interface IServer {
  run: ()=>Promise<void>
}

export const TYPES = {
  IServer: Symbol.for('IServer'),
  IApplication: Symbol.for('IApplication')
}

export interface IApplication {
  configure: ()=>void
}

export interface Locals {
  produccion: boolean
  title: string
  captchaMostrar: boolean
  captchaSitekey: string
}

export type Middleware = (req: Request, res: Response, next: NextFunction) => void

export const REPOSITORIES_TYPES: Record<string, symbol> = {}

export const SERVICES_TYPES: Record<string, symbol> = {}

export const CONTROLLERS_TYPES: Record<string, symbol> = {}
