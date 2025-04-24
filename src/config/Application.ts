import cookieParser from 'cookie-parser'
import express, { Locals, type Response } from 'express'

import Router from '@framework-core/routing/Router'
import { type IApplication, TYPES } from '@framework-types/core/ServerTypes'
import IocConfig from '@framework-core/IocConfig'

import { CoreConfig } from '@framework-lib/CoreConfig'
import { resolveSecurityMiddlewares } from '@framework-core/security/RoutingSecurity'
import { FileIO } from '@framework-common/FileIO'
import { DBTYPES, IDatabaseManager } from '@framework/types/core/DatabaseTypes'

const container = IocConfig.getContainer()

export function Application<T extends new (...args: any[]) => IApplication>(constructor: T) {
  class ApplicationMain extends constructor implements IApplication {
    // @ts-ignore
    app

    constructor (...args: any[]) {
      super(...args)
      this.app = express()

      this.run()
    }

    run () {
      if (!CoreConfig.getConfig().REST_API) {
        this.setViewsEngine()
      }

      this.app.use(express.static(`${CoreConfig.getConfig().SOURCE_DIR}/${CoreConfig.getConfig().PUBLIC_ROUTE}`))
      this.app.use(express.urlencoded({ extended: true, limit:'200kb' }))
      this.app.use(express.json({ limit:'200kb' }))
      this.app.use(cookieParser())

      this.app.use(async ( _req, res: Response & {locals: Locals}, next ) => {
        res.set('SRC-'+'C'+'_v',CoreConfig.getConfig().VERSION)
        res.set(`SRC-Core_v${CoreConfig.getConfig().CORE_VERSION}`)
        res.locals.appName = CoreConfig.getConfig().APP_NAME
        res.locals.title = CoreConfig.getConfig().APP_TITLE
        res.locals.captchaMostrar = CoreConfig.getConfig().CAPTCHA_MOSTRAR
        res.locals.captchaSitekey = CoreConfig.getConfig().CAPTCHA_SITEKEY
        next()
      })

      if (container.isBound(DBTYPES.IDatabaseManager)) {
        const databaseManager = container.get<IDatabaseManager>(DBTYPES.IDatabaseManager)

        databaseManager.run?.()
      }

      this.configure()

      this.initializeClasses().then(() => {
        const securityRoutes = Router.getRoutesToAuth()

        if (securityRoutes.length > 0) {
          resolveSecurityMiddlewares(securityRoutes)
        }

        this.app = Router.mapRoutes(this.app)
      })
    }

    setViewsEngine () {
      this.app.set('views', `${CoreConfig.getConfig().SOURCE_DIR}/${CoreConfig.getConfig().VIEWS_ROUTE}`)
      this.app.set('view engine', CoreConfig.getConfig().VIEWS_ENGINE)
    }

    getApplication () {
      return this.app
    }

    async initializeClasses () {
      await FileIO.importAllFromFolder('/', '**/**/*.middleware')
      await FileIO.importAllFromFolder('/', '**/**/*.controller')
    }
  }

  container.bind<IApplication>(TYPES.IApplication).to(ApplicationMain).inSingletonScope()

  return ApplicationMain
}