import Static from '@framework-decorators/Static'
import { CoreConfig } from '@framework-lib/CoreConfig'

@Static
export class CookiesManager {
  private static settings = {
    secure: true,
    httpOnly: true
  }

  public static getConfig () {
    return { ...this.settings, expires: new Date(
      Date.now() + Number(CoreConfig.getConfig().COOKIE_EXPIRES) * 24 * 60 * 1000
    ) }
  }
}
