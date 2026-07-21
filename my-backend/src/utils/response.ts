import { Response } from 'express'
import { logger } from '../lib/logger'
import type { PaginationMeta } from './pagination'

interface ApiSuccess<T> {
  success: true
  data: T
  pagination?: PaginationMeta
}

interface ApiError {
  success: false
  error: string
  details?: Record<string, unknown>
}

type ApiResponse<T> = ApiSuccess<T> | ApiError

/** 200 OK */
export function success<T>(res: Response, data: T, meta?: { pagination?: PaginationMeta }): void {
  const body: ApiSuccess<T> = { success: true, data }
  if (meta?.pagination) body.pagination = meta.pagination
  res.json(body)
}

/** 201 Created */
export function created<T>(res: Response, data: T): void {
  res.status(201).json({ success: true, data } satisfies ApiSuccess<T>)
}

/** 200 OK with pagination envelope */
export function paginated<T>(res: Response, data: T[], pagination: PaginationMeta): void {
  res.json({ success: true, data, pagination } satisfies ApiSuccess<T[]>)
}

/** 400 Bad Request */
export function badRequest(res: Response, error: string, details?: Record<string, unknown>): void {
  res.status(400).json({ success: false, error, details } satisfies ApiError)
}

/** 400 Validation error from Zod */
export function validationError(res: Response, errors: Record<string, unknown>): void {
  res.status(400).json({
    success: false,
    error: 'Validation failed',
    details: errors,
  } satisfies ApiError)
}

/** 401 Unauthorized */
export function unauthorized(res: Response, error = 'Unauthorized'): void {
  res.status(401).json({ success: false, error } satisfies ApiError)
}

/** 403 Forbidden */
export function forbidden(res: Response, error = 'Forbidden'): void {
  res.status(403).json({ success: false, error } satisfies ApiError)
}

/** 404 Not Found */
export function notFound(res: Response, resource = 'Resource'): void {
  res.status(404).json({ success: false, error: `${resource} not found` } satisfies ApiError)
}

/** 409 Conflict */
export function conflict(res: Response, error: string): void {
  res.status(409).json({ success: false, error } satisfies ApiError)
}

/** 429 Too Many Requests */
export function tooMany(res: Response, error = 'Too many requests. Please try again later.'): void {
  res.status(429).json({ success: false, error } satisfies ApiError)
}

/**
 * 500 Internal Server Error — logs the error and returns a safe message.
 * Never exposes internal error details in production.
 */
export function serverError(res: Response, err: unknown, context?: string): void {
  const message = err instanceof Error ? err.message : String(err)
  logger.error(context || 'Internal server error', { error: message, stack: err instanceof Error ? err.stack : undefined })
  res.status(500).json({ success: false, error: 'Internal server error' } satisfies ApiError)
}
