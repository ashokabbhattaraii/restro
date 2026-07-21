import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '../config/db'
import { Admin } from '../models/Admin'
import { AuditLog } from '../models/AuditLog'
import { z } from 'zod'
import { AuthRequest } from '../middleware/auth'
import { logger } from '../lib/logger'
import { asyncHandler } from '../utils/asyncHandler'
import { success, badRequest, unauthorized, serverError } from '../utils/response'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) { badRequest(res, 'Invalid input'); return }

  const { email, password } = parsed.data

  if (email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    logger.warn('Failed login attempt', { email, reason: 'Email mismatch' })
    unauthorized(res, 'Invalid credentials')
    return
  }

  await connectDB()

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+passwordHash')
  if (!admin) {
    logger.warn('Failed login attempt', { email, reason: 'User not found' })
    unauthorized(res, 'Invalid credentials')
    return
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash)
  if (!isValid) {
    logger.warn('Failed login attempt', { email, reason: 'Invalid password' })
    unauthorized(res, 'Invalid credentials')
    return
  }

  const ip = req.ip || req.connection?.remoteAddress || 'unknown'
  const userAgent = req.get('User-Agent') || 'unknown'

  const token = jwt.sign(
    { id: admin._id.toString(), email: admin.email, role: 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as string & jwt.SignOptions['expiresIn'] },
  )

  res.cookie('adminToken', token, COOKIE_OPTIONS)

  AuditLog.create({
    admin: admin._id.toString(),
    action: 'login',
    resource: 'admin',
    resourceId: admin._id.toString(),
    summary: 'Successful admin login',
    details: { email },
    ip,
    userAgent,
  }).catch((err: unknown) => logger.error('Audit log creation failed', { error: err instanceof Error ? err.message : String(err) }))

  logger.info('Successful admin login', { email, ip })
  success(res, { admin: { id: admin._id, email: admin.email, name: admin.name } })
})

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('adminToken', { path: '/' })
  success(res, { message: 'Logged out' })
})

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  success(res, { admin: req.admin })
})
