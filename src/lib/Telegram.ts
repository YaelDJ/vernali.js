import TelegramBot from 'node-telegram-bot-api'
import { CoreConfig } from '@framework-lib/CoreConfig'
import loggerFactory from '@framework-lib/getLoggerFactory'
import Register from '@framework-decorators/Register'

@Register()
export class Telegram {
  private logger = loggerFactory().getLogger('application.telegram')

  private BOT_TOKEN = CoreConfig.getConfig().TELEGRAM_BOT_TOKEN
  private BOT_GROUP_ID = CoreConfig.getConfig().TELEGRAM_BOT_GROUP_ID
  private bot: TelegramBot

  constructor () {
    if (!this.BOT_TOKEN) throw new Error('No se ha configurado un token para telegram')
    if (!this.BOT_GROUP_ID) throw new Error('No se ha configurado un grupo para telegram')

    this.bot = new TelegramBot(this.BOT_TOKEN)
  }

  async enviarMensaje (mensaje: string) {
    try {
      await this.bot.sendMessage(this.BOT_GROUP_ID!, mensaje)

      return true
    } catch (error) {
      this.logger.error(error)
      return false
    }
  }
}
