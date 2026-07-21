import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  admin?: { id: string; email: string; role: string }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const token =
    req.cookies?.adminToken ||
    req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string; email: string; role: string
    }
    if (decoded.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden' })
      return
    }
    req.admin = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized — invalid token' })
  }
}
