import { Request, Response } from 'express'
import { Offer } from '../models/Offer'
import { z } from 'zod'
import { asyncHandler } from '../utils/asyncHandler'
import { parsePaginationParams, paginate, parseBooleanParam } from '../utils/pagination'
import { success, created, validationError, notFound, serverError } from '../utils/response'

const offerSchema = z.object({
  pct: z.string().trim().min(1).max(20),
  unit: z.string().trim().min(1).max(20),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(500),
  validity: z.string().trim().min(2).max(120),
  cta: z.string().trim().min(2).max(60),
  active: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export const getOffers = asyncHandler(async (req: Request, res: Response) => {
  const { active } = req.query
  const filter: Record<string, unknown> = {}

  if (req.path === '/api/offers/public') {
    filter.active = true
  } else {
    const a = parseBooleanParam(active)
    if (a !== undefined) filter.active = a
  }

  const isPublic = req.path === '/api/offers/public'

  if (isPublic) {
    const items = await Offer.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean()
    success(res, items)
    return
  }

  const params = parsePaginationParams(req.query as Record<string, unknown>)
  const result = await paginate(Offer, filter, params)
  success(res, result.data, { pagination: result.pagination })
})

export const getOffer = asyncHandler(async (req: Request, res: Response) => {
  const item = await Offer.findById(req.params.id).lean()
  if (!item) { notFound(res, 'Offer'); return }
  success(res, item)
})

export const createOffer = asyncHandler(async (req: Request, res: Response) => {
  const parsed = offerSchema.safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }
  const item = await Offer.create(parsed.data)
  created(res, item)
})

export const updateOffer = asyncHandler(async (req: Request, res: Response) => {
  const parsed = offerSchema.partial().safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }
  const item = await Offer.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true }).lean()
  if (!item) { notFound(res, 'Offer'); return }
  success(res, item)
})

export const deleteOffer = asyncHandler(async (req: Request, res: Response) => {
  const item = await Offer.findByIdAndDelete(req.params.id).lean()
  if (!item) { notFound(res, 'Offer'); return }
  success(res, { success: true })
})
