import Router from './Router'
import { CONTROLLERS_TYPES } from '@framework-types/core/ServerTypes'
import IocConfig from '@framework-core/IocConfig'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '@framework-lib/catchAsync'
import AppError from '@framework-common/AppError'

const container = IocConfig.getContainer()

export function RestController (basePath: string, ...controllerMiddleware: any[]) {
  return function (constructor: Function) {
    Reflect.defineMetadata('basePath', basePath, constructor)

    Reflect.defineMetadata('controllerMiddleware', controllerMiddleware ?? [], constructor)

    const key = constructor.name.toString().toUpperCase()
    CONTROLLERS_TYPES[key] = Symbol.for(constructor.name)
    container.bind(CONTROLLERS_TYPES[key]).to(constructor as any).inSingletonScope()
  }
}

function Route (method: string, path: string, ...middleware: any[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const newRoute = {
      method,
      path,
      middleware: middleware || [],
      handler: (req: Request, res: Response, next: NextFunction) => {
        const controller = container.get(CONTROLLERS_TYPES[target.constructor.name.toString().toUpperCase()])
        const newThis = { ...(controller as object), ...target }

        return catchAsync(target[propertyKey].bind(newThis))(req, res, next)
      },
      constructor: target.constructor
    }

    Reflect.defineMetadata(propertyKey, newRoute, target)

    if (Router.checkIfRouteExists(newRoute)) throw new AppError(`La ruta ${path} ya existe en el controlador ${target.constructor.name}`)

    Router.setNewRoute(newRoute)

    return descriptor
  }
}

export function Get (path: string, ...middleware: any[]) {
  return Route('GET', path, ...middleware)
}

export function Post (path: string, ...middleware: any[]) {
  return Route('POST', path, ...middleware)
}

