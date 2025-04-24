import { NextFunction, Request, Response } from 'express'
import AppError from '@framework-common/AppError'
import { Logger } from '@framework-common/Logger'
import loggerFactory from '@framework-lib/getLoggerFactory'
import { CoreConfig } from '@framework-lib/CoreConfig'

class ErrorController {
  // @ts-ignore
  private logger: Logger = loggerFactory().getLogger('global.errorHandler')
  private environment: string
  private errorStatusCode: number = 500
  private errorStatus: string = 'error'
  private error?: any

  constructor (produccion: string) {
    this.environment = produccion == 'true' ? 'production' : 'development'
  }

  handleError (err: any, req: Request, res: Response): void {
    this.error = Object.assign(err)

    if (this.environment === 'production') {
      if (this.error.name === 'CastError') this.handleCastErrorDB()
      if (this.error.code === 11000) this.handleDuplicateErrorDB()
      if (this.error.name === 'ValidationError') this.handleValidationErrorDB()
      if (this.error.name === 'JsonWebTokenError') this.handleJWTError()
      if (this.error.name === 'TokenExpiredError') this.handleJWTExpiredError()

      this.sendErrorProd(res)
    } else {
      this.sendErrorDev(res)
    }
  }

  private sendErrorDev (res: Response): void {
    this.logger.error(`${this.error.message}: ${this.error.stack}`)
    res.status(this.errorStatusCode).json({
      success: false,
      status: this.errorStatus,
      error: this.error,
      message: this.error.message,
      stack: this.error.stack
    })
  }

  private sendErrorProd (res: Response): void {
    if (this.error?.isOperational) {
      this.logger.error(`${this.error.message}: ${this.error.stack}`)
      res.status(this.error.statusCode).json({
        success: false,
        status: this.error.status,
        message: this.error.message
      })
    } else {
      this.logger.error(`${this.error.message}: ${this.error.stack}`)
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went wrong'
      })
    }
  }

  private handleCastErrorDB (): void {
    const message = `Invalid ${this.error.path}: ${this.error.value}`
    this.error = new AppError(message, 400)
  }

  private handleDuplicateErrorDB (): void {
    const value = this.error.message.match(/(["'])(\\?.)*?\1/)[0]
    const message = `Duplicate field value: ${value}. Please use another value.`
    this.error = new AppError(message, 400)
  }

  private handleValidationErrorDB (): void {
    const errors = Object.values(this.error.errors).map((el: any) => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    this.error = new AppError(message, 400)
  }

  private handleJWTError (): void {
    const message = 'Invalid token. Please login again!'
    this.error = new AppError(message, 401)
  }

  private handleJWTExpiredError (): void {
    const message = 'Your token has expired. Please login again!'
    this.error = new AppError(message, 401)
  }
}

const errorController = new ErrorController(CoreConfig.getConfig().PRODUCCION ? 'production' : 'development')

export default (err: any, req: Request, res: Response, next: NextFunction): void => {
  errorController.handleError(err, req, res)
}