import { Container } from 'inversify'
import 'reflect-metadata'

export default class IocConfig {
  static instance: IocConfig
  private container: Container

  private constructor () {
    this.container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' })
  }

  static getContainer (): Container {
    if (!IocConfig.instance) IocConfig.instance = new IocConfig()

    return IocConfig.instance.container
  }
}
