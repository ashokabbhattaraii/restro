import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { logger } from '../lib/logger'

export interface RequestWithId extends Request {
  requestId?: string
}

/**
 * Logs every API request once the response finishes, with method, path, status
 * and duration. This lives here — in the API server — rather than in the Next.js
 * frontend middleware, which could only ever observe page navigations.
 */
export function requestLogger(req: RequestWithId, res: Response, next: NextFunction): void {
  const start = Date.now()
  const requestId = crypto.randomUUID().slice(0, 8)

  req.requestId = requestId
  res.setHeader('x-request-id', requestId)

  res.on('finish', () => {
    const duration = Date.now() - start
    const path = req.originalUrl

    if (res.statusCode >= 500) {
      logger.api.error(req.method, path, res.statusCode, duration, requestId)
    } else if (res.statusCode >= 400) {
      logger.warn('API client error', {
        method: req.method,
        path,
        status: res.statusCode,
        duration,
        requestId,
      })
    } else {
      logger.api.success(req.method, path, res.statusCode, duration, requestId)
    }
  })

  next()
}
