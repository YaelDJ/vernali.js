import { Express } from 'express'

import Static from '@framework-decorators/Static'
import loggerFactory from '@framework-lib/getLoggerFactory'
import AppError from '@framework-common/AppError'
import globalErrorHandler from '@framework-core/ErrorController'
import type { IRoute, IRouteSecurity } from '@framework-types/core/RoutingTypes'

import { CoreConfig } from '@framework-lib/CoreConfig'
import { securityMiddleware, SecurityService, TYPES_SECURITY } from '@framework-types/core/SecurityTypes'
import IocConfig from '@framework-core/IocConfig'

@Static
export default class Router {
  private static routes: IRoute[] = []
  private static routesToAuth: IRouteSecurity[] = []

  // @ts-ignore
  private static logger = loggerFactory().getLogger('global.routing')

  public static getRoutes () {
    return this.routes
  }

  public static getRoutesToAuth () {
    return this.routesToAuth
  }

  public static updateRouteMiddlewares (filter: {method: string, path: string, controller: string}, middlewares: any) {
    this.routes = this.routes.map(route => {
      if (route.method === filter.method && route.path === filter.path && route.constructor.name === filter.controller) {
        route.middleware = [...middlewares, ...route.middleware]
      }
      return route
    })
  }

  public static updateRouteAuthMiddleware (route: IRoute, middleware: securityMiddleware) {
    let routeMiddleware: securityMiddleware[] = []
    const routeExist = this.routesToAuth
      .find(routeSaved =>
        routeSaved.method === route.method
        && routeSaved.path === route.path
        && routeSaved.constructor.name === route.constructor.name)

    if (routeExist) {
      routeMiddleware = [...routeExist.middlewares]
    }

    routeMiddleware.push(middleware)

    this.routesToAuth.push({ ...route, middlewares: routeMiddleware })
  }

  public static setNewRoute (route: any) {
    this.routes.push(route)
  }

  public static checkIfRouteExists (route: IRoute) {
    const result = this.routes.filter(routeSaved =>
      (
        routeSaved.method === route.method &&
        routeSaved.path === route.path &&
        routeSaved.constructor.name === route.constructor.name
      )
    )

    return result.length > 0
  }

  public static mapRoutes (app: Express): Express {
    this.routes.forEach(route => {

      const basePath = Reflect.getMetadata('basePath', route.constructor)
      const controllerSecurityMiddlewares: securityMiddleware[] | undefined = Reflect.getMetadata('controllerSecurityMiddleware', route.constructor)
      const securityMiddlewares = []

      if (controllerSecurityMiddlewares && controllerSecurityMiddlewares.length > 0) {
        const container = IocConfig.getContainer()
        const securityService = container.get<SecurityService>(TYPES_SECURITY.SecurityService)

        for (const controllerMiddleware of controllerSecurityMiddlewares) {
          securityMiddlewares.push(securityService[controllerMiddleware].bind(securityService))
        }
      }

      const controllerMiddleware = Reflect.getMetadata('controllerMiddleware', route.constructor)

      const fullPath = `${basePath}${route.path}`.replace('//', '/')
      const handlers = [...securityMiddlewares, ...controllerMiddleware, ...route.middleware, route.handler]

      if (route.method === 'GET') {
        app.get(fullPath, handlers)
      } else if (route.method === 'POST') {
        app.post(fullPath, handlers)
      }
    })

    app.use('*', (_req, res, next) => {
      if (CoreConfig.getConfig().REST_API) {
        next(new AppError('RUTA NO ENCONTRADA'))
      } else {
        res.send('RUTA NO ENCONTRADA')
      }
    })

    app.use(globalErrorHandler)

    return app
  }
}
