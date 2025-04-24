import Router from '../routing/Router'
import { IRoute, IRouteSecurity } from '@framework-types/core/RoutingTypes'
import IocConfig from '@framework-core/IocConfig'
import AppError from '@framework-common/AppError'
import { securityMiddleware, SecurityService, TYPES_SECURITY } from '@framework-types/core/SecurityTypes'

const container = IocConfig.getContainer()

/**
 * Decorador que se encarga de agregar un middleware de autorización a todas las rutas de un controlador.
 *
 * @returns {Function} - Función que recibe el constructor de la clase decorada.
 */
export function ProtectedRoutes (): Function {
  return function (constructor: Function) {
    const controllerMiddlewares: securityMiddleware[] = Reflect.getMetadata('controllerSecurityMiddleware', constructor) ?? []
    const newMiddlewares: securityMiddleware[] = [...controllerMiddlewares, 'isAuthenticated']

    Reflect.defineMetadata('controllerSecurityMiddleware', newMiddlewares, constructor)

    Reflect.defineMetadata('protectedRoutes', true, constructor)
  }
}

/**
 * Decorador que se encarga de agregar un middleware de autorización a una ruta específica.
 *
 * @returns {Function} - Función que recibe el target, la propiedad y el descriptor de la ruta decorada.
 */
export function ProtectedRoute (): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const route: IRoute = Reflect.getMetadata(propertyKey, target)

    Router.updateRouteAuthMiddleware(route, 'isAuthenticated')
  }
}

export function ProtectedRouteAPI (): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const route: IRoute = Reflect.getMetadata(propertyKey, target)

    Router.updateRouteAuthMiddleware(route, 'isAuthenticatedAPI')
  }
}

/**
 * Decorador que se encarga de agregar un middleware de verificación de autenticidad a una ruta específica.
 *
 * @returns {Function} - Función que recibe el target, la propiedad y el descriptor de la ruta decorada.
 */
export function VerifyAutentication (urlToRedirect: string): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const route: IRoute = Reflect.getMetadata(propertyKey, target);

    (global as any).urlToRedirect = urlToRedirect

    Router.updateRouteAuthMiddleware(route, 'verifyAuthenticity')
  }
}

/**
 * Resuelve los middlewares de seguridad de las rutas.
 *
 * @param {IRouteSecurity[]} routes - Rutas a las que se les aplicarán los middlewares de seguridad.
 */
export function resolveSecurityMiddlewares (routes: IRouteSecurity[] ): void {
  if (!container.isBound(TYPES_SECURITY.SecurityService)) {
    throw new AppError('No hay implementaciones de seguridad registradas en el contenedor.')
  }

  const securityService = container.get<SecurityService>(TYPES_SECURITY.SecurityService)

  for (const route of routes) {
    const middlewares = []

    for (const routeMiddleware of route.middlewares) {
      middlewares.push(securityService[routeMiddleware].bind(securityService))
    }

    Router.updateRouteMiddlewares({ method: route.method, path: route.path, controller: route.constructor.name }, middlewares)
  }
}
