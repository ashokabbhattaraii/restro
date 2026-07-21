import { Request, Response } from 'express'
import { Event } from '../models/Event'
import { z } from 'zod'
import { asyncHandler } from '../utils/asyncHandler'
import { parsePaginationParams, paginate, parseBooleanParam } from '../utils/pagination'
import { success, created, validationError, notFound, serverError } from '../utils/response'

const eventSchema = z.object({
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(5).max(800),
  date: z.string().trim().min(2).max(40),
  time: z.string().trim().max(30).optional(),
  image: z.string().trim().url(),
  type: z.string().trim().max(80).optional(),
  active: z.boolean().optional(),
})

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { limit } = req.query
  const filter: Record<string, unknown> = {}

  if (req.path === '/api/events/public') filter.active = true

  const isPublic = req.path === '/api/events/public'

  if (isPublic || limit) {
    let query = Event.find(filter).sort({ date: 1 })
    if (limit) query = query.limit(Number(limit))
    const events = await query.lean()
    success(res, events)
    return
  }

  const params = parsePaginationParams(req.query as Record<string, unknown>)
  const result = await paginate(Event, filter, params)
  success(res, result.data, { pagination: result.pagination })
})

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id).lean()
  if (!event) { notFound(res, 'Event'); return }
  success(res, event)
})

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const parsed = eventSchema.safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }
  const event = await Event.create(parsed.data)
  created(res, event)
})

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const parsed = eventSchema.partial().safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }
  const event = await Event.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true }).lean()
  if (!event) { notFound(res, 'Event'); return }
  success(res, event)
})

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findByIdAndDelete(req.params.id).lean()
  if (!event) { notFound(res, 'Event'); return }
  success(res, { success: true })
})
