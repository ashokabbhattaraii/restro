import { Request, Response } from 'express'
import { Staff } from '../models/Staff'
import { z } from 'zod'
import { asyncHandler } from '../utils/asyncHandler'
import { parsePaginationParams, paginate } from '../utils/pagination'
import { success, created, validationError, notFound, serverError } from '../utils/response'

const staffSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  department: z.string().trim().max(80).default(''),
  image: z.string().trim().max(500).default(''),
  visible: z.boolean().optional().default(true),
})

export const getStaff = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {}
  if (req.path === '/api/staff/public') filter.visible = true

  const isPublic = req.path === '/api/staff/public'

  if (isPublic) {
    const staff = await Staff.find(filter).sort({ department: 1, name: 1 }).lean()
    success(res, staff)
    return
  }

  const params = parsePaginationParams(req.query as Record<string, unknown>)
  const result = await paginate(Staff, filter, params)
  success(res, result.data, { pagination: result.pagination })
})

export const createStaff = asyncHandler(async (req: Request, res: Response) => {
  const parsed = staffSchema.safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }
  const member = await Staff.create(parsed.data)
  created(res, member)
})

export const updateStaff = asyncHandler(async (req: Request, res: Response) => {
  const parsed = staffSchema.partial().safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }
  const member = await Staff.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true }).lean()
  if (!member) { notFound(res, 'Staff member'); return }
  success(res, member)
})

export const deleteStaff = asyncHandler(async (req: Request, res: Response) => {
  const member = await Staff.findByIdAndDelete(req.params.id).lean()
  if (!member) { notFound(res, 'Staff member'); return }
  success(res, { success: true })
})
