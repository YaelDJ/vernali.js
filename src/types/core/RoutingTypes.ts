import { securityMiddleware } from '@framework-types/core/SecurityTypes'

export interface IRoute {
  method: string,
  path: string,
  middleware: any[],
  handler: any,
  constructor: any
}

export interface IRouteSecurity extends IRoute {
  middlewares: securityMiddleware[]
}
