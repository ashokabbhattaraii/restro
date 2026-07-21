import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Message } from '../models/Message'
import { AuditLog } from '../models/AuditLog'
import { AuthRequest } from '../middleware/auth'
import { z } from 'zod'
import { logger } from '../lib/logger'
import { verifyRecaptchaToken } from '../lib/recaptcha'
import { asyncHandler } from '../utils/asyncHandler'
import { parsePaginationParams, paginate, parseBooleanParam } from '../utils/pagination'
import { success, created, validationError, notFound, serverError, badRequest, unauthorized } from '../utils/response'

const CONTACT_TYPES = ['feedback', 'enquiry', 'other'] as const

const messageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(32).optional(),
  email: z.string().trim().email().optional().or(z.literal('')),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(5).max(1500),
  contactType: z.enum(CONTACT_TYPES).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  recaptchaToken: z.string().trim().min(1, 'reCAPTCHA verification is required'),
})

const messageUpdateSchema = messageSchema.partial().extend({
  verified: z.boolean().optional(),
  read: z.boolean().optional(),
  replied: z.boolean().optional(),
  reply: z.string().trim().max(2000).optional(),
  replyAt: z.coerce.date().optional(),
})

function isAdminRequest(req: Request): boolean {
  const token =
    (req as any).cookies?.adminToken ||
    req.headers.authorization?.split(' ')[1]
  if (!token) return false
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role?: string }
    return decoded.role === 'admin'
  } catch {
    return false
  }
}

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { contactType, verified, read } = req.query
  const filter: Record<string, unknown> = {}

  if (typeof contactType === 'string' && CONTACT_TYPES.includes(contactType as any)) {
    filter.contactType = contactType === 'other' ? { $ne: 'feedback' } : contactType
  }

  const v = parseBooleanParam(verified)
  if (v !== undefined) filter.verified = v
  const r = parseBooleanParam(read)
  if (r !== undefined) filter.read = r

  if (!isAdminRequest(req)) {
    filter.verified = true
    filter.contactType = 'feedback'
    const publicMessages = await Message.find(filter)
      .select('name subject message rating createdAt')
      .sort({ createdAt: -1 })
      .lean()
    success(res, publicMessages)
    return
  }

  const params = parsePaginationParams(req.query as Record<string, unknown>)
  const result = await paginate(Message, filter, params)
  success(res, result.data, { pagination: result.pagination })
})

export const getMessage = asyncHandler(async (req: Request, res: Response) => {
  if (!isAdminRequest(req)) { unauthorized(res); return }
  const msg = await Message.findById(req.params.id).lean()
  if (!msg) { notFound(res, 'Message'); return }
  success(res, msg)
})

export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const parsed = messageSchema.safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }

  const { recaptchaToken, ...messageData } = parsed.data
  const recaptchaValid = await verifyRecaptchaToken(recaptchaToken)
  if (!recaptchaValid) { badRequest(res, 'reCAPTCHA verification failed. Please try again.'); return }

  const msg = await Message.create(messageData)
  created(res, msg)
})

export const updateMessage = asyncHandler(async (req: Request, res: Response) => {
  const parsed = messageUpdateSchema.safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }
  if (Object.keys(parsed.data).length === 0) { badRequest(res, 'No updatable fields provided'); return }

  const previous = await Message.findById(req.params.id).lean()
  if (!previous) { notFound(res, 'Message'); return }

  const { recaptchaToken: _token, ...updates } = parsed.data
  const msg = await Message.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
  if (!msg) { notFound(res, 'Message'); return }

  const admin = (req as AuthRequest).admin
  if (admin) {
    const action = parsed.data.verified === true ? 'verify' :
      parsed.data.verified === false ? 'unverify' :
      parsed.data.reply ? 'reply' :
      parsed.data.read !== undefined ? 'update' : 'update'

    const actionLabel = action === 'verify' ? 'verified' :
      action === 'unverify' ? 'unverified' :
      action === 'reply' ? 'replied to' : 'updated'

    AuditLog.create({
      admin: admin.id,
      action,
      resource: 'message',
      resourceId: msg._id.toString(),
      summary: `Message ${actionLabel} by ${admin.email}`,
      details: { before: previous, after: msg },
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
    }).catch((err: unknown) => logger.error('Audit log creation failed', { error: err instanceof Error ? err.message : String(err) }))
  }

  success(res, msg)
})

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const previous = await Message.findById(req.params.id).lean()
  if (!previous) { notFound(res, 'Message'); return }

  const msg = await Message.findByIdAndDelete(req.params.id)
  if (!msg) { notFound(res, 'Message'); return }

  const admin = (req as AuthRequest).admin
  if (admin) {
    AuditLog.create({
      admin: admin.id,
      action: 'delete',
      resource: 'message',
      resourceId: msg._id.toString(),
      summary: `Message deleted by ${admin.email}`,
      details: { deleted: previous },
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
    }).catch((err: unknown) => logger.error('Audit log creation failed', { error: err instanceof Error ? err.message : String(err) }))
  }

  success(res, { success: true })
})
