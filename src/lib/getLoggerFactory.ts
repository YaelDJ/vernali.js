import LogManager from '../common/LogManager'
import IocConfig from '../core/IocConfig'

export default function loggerFactory () {
  const container = IocConfig.getContainer()
  const logging = container.get(LogManager).configurar({
    nivelesMinimos: {
      '': 'info',
      'global': 'trace',
      'controller': 'trace',
      'application': 'trace'
    }
  }).registerConsoleLogger()

  return logging
}
