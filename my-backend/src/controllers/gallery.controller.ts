import { Request, Response } from 'express'
import { GalleryImage } from '../models/GalleryImage'
import { z } from 'zod'
import { asyncHandler } from '../utils/asyncHandler'
import { parsePaginationParams, paginate } from '../utils/pagination'
import { success, created, validationError, notFound, serverError } from '../utils/response'

const gallerySchema = z.object({
  category: z.string().trim().min(2).max(80),
  title: z.string().trim().min(2).max(120),
  image: z.string().trim().url(),
  shape: z.enum(['', 'tall', 'wide']).optional(),
  order: z.number().int().min(0).optional(),
})

export const getGalleryImages = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query
  const filter: Record<string, unknown> = {}

  if (category && typeof category === 'string') filter.category = category

  const params = parsePaginationParams(req.query as Record<string, unknown>)
  const result = await paginate(GalleryImage, filter, params)
  success(res, result.data, { pagination: result.pagination })
})

export const createGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const parsed = gallerySchema.safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }
  const image = await GalleryImage.create(parsed.data)
  created(res, image)
})

export const deleteGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const image = await GalleryImage.findByIdAndDelete(req.params.id).lean()
  if (!image) { notFound(res, 'Gallery image'); return }
  success(res, { success: true })
})
