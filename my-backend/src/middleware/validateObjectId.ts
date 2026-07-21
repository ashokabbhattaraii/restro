import mongoose from 'mongoose'
import { badRequest } from '../utils/response'
import { Request, Response, NextFunction } from 'express'

export function validateObjectId(paramName = 'id') {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName]
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      badRequest(res, `Invalid ${paramName === 'id' ? 'ID' : paramName} format`)
      return
    }
    next()
  }
}
