import { Request, Response, NextFunction } from 'express'

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

/**
 * Wraps an async route handler so thrown errors are automatically forwarded
 * to Express error middleware — eliminates repetitive try-catch blocks.
 *
 * Usage:
 * ```ts
 * router.get('/items', asyncHandler(async (req, res) => {
 *   const items = await Item.find()
 *   res.json(items)
 * }))
 * ```
 */
export function asyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
