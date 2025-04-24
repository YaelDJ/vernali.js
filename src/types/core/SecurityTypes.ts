import { NextFunction, Request, Response } from 'express'

export interface SecurityService {
  isAuthenticated: (req: Request, res: Response, next: NextFunction) => Promise<void>
  verifyAuthenticity: (req: Request, res: Response, next: NextFunction) => Promise<void>
  isAuthenticatedAPI: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export const TYPES_SECURITY = {
  SecurityService: Symbol.for('SecurityService')
}

export type securityMiddleware = keyof SecurityService
