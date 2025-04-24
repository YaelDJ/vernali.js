import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
import { htmlToText } from 'html-to-text'

import loggerFactory from '@framework-lib/getLoggerFactory'
import { CoreConfig } from '@framework-lib/CoreConfig'

interface emailData {
  to_name: string,
  to: string
}

export class Email {
  private logger = loggerFactory().getLogger('application.email')
  // @ts-ignore
  protected to: string
  // @ts-ignore
  protected toUser: string
  // @ts-ignore
  protected from: string

  public nuevoSender (data: emailData) {
    this.to = `"${data.to_name}" <${data.to}>`
    this.from = `"${CoreConfig.getConfig().MAILER_FROM_NAME}" <${CoreConfig.getConfig().MAILER_FROM_ADDRESS}>`
    this.toUser = data.to

    return this
  }

  protected newTransport () {
    return nodemailer.createTransport({
      // @ts-ignore
      host: CoreConfig.getConfig().MAILER_HOST,
      port: CoreConfig.getConfig().MAILER_PORT,
      secure: CoreConfig.getConfig().MAILER_PORT==='465',
      auth: {
        user: CoreConfig.getConfig().MAILER_USER,
        pass: CoreConfig.getConfig().MAILER_PASS
      }
    })
  }

  protected async send (subject: string, template: string, data?: any) {
    const html = await ejs.renderFile(
      path.resolve(`${CoreConfig.getConfig().SOURCE_DIR}/views/email/${template}.ejs`),
      {
        ...data,
        appName: CoreConfig.getConfig().APP_NAME
      }
    )

    const mailObject = {
      from: this.from,
      to: this.to,
      subject,
      html: (html as any),
      text: htmlToText((html as any)),
      attachments: data.attachments ? data.attachments : []
    }

    try {
      await this.newTransport().sendMail(mailObject)
      return true
    } catch (e) {
      this.logger.error((e as Error))
      return false
    }
  }
}
