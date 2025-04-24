export default class AppError extends Error {
  public statusCode: number
  public status: string
  public isOperational: boolean

  constructor (message: string, statusCode: number = 0) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}