import IocConfig from '@framework-core/IocConfig'
import { SecurityService, TYPES_SECURITY } from '@framework-types/core/SecurityTypes'
import { resolveDependencies } from '@framework-decorators/Autowired'

const container = IocConfig.getContainer()

export function Security<T extends new (...args: any[]) => SecurityService>(constructor: T) {
  class SecurityController extends constructor implements SecurityService {
    constructor (...args: any[]) {
      super(...args)
      resolveDependencies(this)
    }
  }

  container.bind<SecurityService>(TYPES_SECURITY.SecurityService).to(SecurityController).inSingletonScope()

  return SecurityController
}
