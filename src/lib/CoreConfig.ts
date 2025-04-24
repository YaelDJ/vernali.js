import Static from '@framework-decorators/Static'
import defaultConfig from '@framework/defaultConfig'

@Static
export class CoreConfig {
  public static configs = defaultConfig

  public static setConfig (config: object) {
    this.configs = {
      ...this.configs,
      ...config
    }
  }

  public static getConfig () {
    return this.configs
  }
}
