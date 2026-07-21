import { Request, Response } from 'express'
import { MenuItem } from '../models/MenuItem'
import { z } from 'zod'
import { asyncHandler } from '../utils/asyncHandler'
import { parsePaginationParams, paginate, parseBooleanParam } from '../utils/pagination'
import { success, created, validationError, notFound, serverError } from '../utils/response'

const menuItemSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(500),
  price: z.string().trim().min(2).max(40),
  dietary: z.array(z.string().trim().max(30)).default([]),
  image: z.string().trim().url(),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
})

const bulkMenuSchema = z.array(menuItemSchema).min(1).max(500)

export const getMenuItems = asyncHandler(async (req: Request, res: Response) => {
  const { featured, category } = req.query
  const filter: Record<string, unknown> = {}

  if (req.path === '/api/menu/public') filter.visible = true
  if (parseBooleanParam(featured)) filter.featured = true
  if (category && typeof category === 'string') filter.category = category

  const isPublic = req.path === '/api/menu/public'

  if (isPublic) {
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 }).lean()
    success(res, items)
    return
  }

  const params = parsePaginationParams(req.query as Record<string, unknown>)
  const result = await paginate(MenuItem, filter, params)
  success(res, result.data, { pagination: result.pagination })
})

export const getMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await MenuItem.findById(req.params.id).lean()
  if (!item) { notFound(res, 'Menu item'); return }
  success(res, item)
})

export const createMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const parsed = menuItemSchema.safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }
  const item = await MenuItem.create(parsed.data)
  created(res, item)
})

export const updateMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const parsed = menuItemSchema.partial().safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }
  const item = await MenuItem.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true }).lean()
  if (!item) { notFound(res, 'Menu item'); return }
  success(res, item)
})

export const bulkCreateMenuItems = asyncHandler(async (req: Request, res: Response) => {
  const parsed = bulkMenuSchema.safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }
  const items = await MenuItem.insertMany(parsed.data)
  created(res, { success: true, count: items.length })
})

export const deleteMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id).lean()
  if (!item) { notFound(res, 'Menu item'); return }
  success(res, { success: true })
})
