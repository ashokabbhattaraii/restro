import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { logger } from '../lib/logger'

export function mongooseErrorHandler(err: Error, _req: Request, res: Response, next: NextFunction) {
  if (err instanceof mongoose.Error.CastError) {
    logger.warn('Invalid ObjectId', { value: err.value, path: err.path })
    res.status(400).json({
      success: false,
      error: `Invalid ${err.path}: "${err.value}" is not a valid ID format.`,
    })
    return
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message)
    logger.warn('Mongoose validation error', { messages })
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: messages,
    })
    return
  }

  const mongoErr = err as any
  if (mongoErr.code === 11000 || mongoErr.code === 11001) {
    const field = Object.keys(mongoErr.keyPattern || {})[0] || 'field'
    logger.warn('Duplicate key error', { field, value: mongoErr.keyValue })
    res.status(409).json({
      success: false,
      error: `A record with this ${field} already exists.`,
    })
    return
  }

  next(err)
}
