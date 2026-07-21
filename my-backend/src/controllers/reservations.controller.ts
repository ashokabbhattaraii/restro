import { Request, Response } from 'express'
import { Reservation } from '../models/Reservation'
import { z } from 'zod'
import { logger } from '../lib/logger'
import { verifyRecaptchaToken } from '../lib/recaptcha'
import { asyncHandler } from '../utils/asyncHandler'
import { parsePaginationParams, paginate, buildSearchFilter } from '../utils/pagination'
import { success, created, validationError, notFound, badRequest, serverError } from '../utils/response'
import { sendCSV } from '../utils/csv'

const reservationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(32),
  email: z.string().trim().email().optional().or(z.literal('')),
  date: z.string().trim().min(4).max(40),
  time: z.string().trim().min(3).max(20),
  guests: z.coerce.number().int().min(1).max(30),
  occasion: z.string().trim().max(80).optional(),
  requests: z.string().trim().max(1000).optional(),
  remarks: z.string().trim().max(2000).optional(),
  status: z.enum(['Confirmed', 'Pending', 'Cancelled', 'Contacted']).optional(),
  recaptchaToken: z.string().trim().min(1, 'reCAPTCHA verification is required'),
})

export const getReservations = asyncHandler(async (req: Request, res: Response) => {
  const { status, date, dateFrom, dateTo, search } = req.query
  const filter: Record<string, unknown> = {}

  if (status && status !== 'all') filter.status = status

  if (dateFrom || dateTo) {
    const dateFilter: Record<string, string> = {}
    if (dateFrom && typeof dateFrom === 'string') dateFilter.$gte = dateFrom
    if (dateTo && typeof dateTo === 'string') dateFilter.$lte = dateTo
    filter.date = dateFilter
  } else if (date && typeof date === 'string') {
    filter.date = date
  }

  if (search && typeof search === 'string') {
    const searchFilter = buildSearchFilter(search, ['name', 'phone', 'email'])
    if (searchFilter) filter.$or = (searchFilter as any).$or
  }

  const params = parsePaginationParams(req.query as Record<string, unknown>)
  const result = await paginate(Reservation, filter, params)
  success(res, result.data, { pagination: result.pagination })
})

export const getReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await Reservation.findById(req.params.id).lean()
  if (!reservation) { notFound(res, 'Reservation'); return }
  success(res, reservation)
})

export const createReservation = asyncHandler(async (req: Request, res: Response) => {
  const parsed = reservationSchema.safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }

  const { recaptchaToken, ...reservationData } = parsed.data
  const recaptchaValid = await verifyRecaptchaToken(recaptchaToken)
  if (!recaptchaValid) { badRequest(res, 'reCAPTCHA verification failed. Please try again.'); return }

  const reservation = await Reservation.create(reservationData)
  created(res, reservation)
})

export const updateReservation = asyncHandler(async (req: Request, res: Response) => {
  const parsed = reservationSchema.partial().safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }

  const { recaptchaToken: _token, ...updates } = parsed.data
  const reservation = await Reservation.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).lean()
  if (!reservation) { notFound(res, 'Reservation'); return }
  success(res, reservation)
})

export const deleteReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id).lean()
  if (!reservation) { notFound(res, 'Reservation'); return }
  success(res, { success: true })
})

export const exportReservations = asyncHandler(async (req: Request, res: Response) => {
  const { status, dateFrom, dateTo, from, to } = req.query
  const filter: Record<string, unknown> = {}

  if (status && status !== 'all') filter.status = status

  const dateFilter: Record<string, unknown> = {}
  if (dateFrom && typeof dateFrom === 'string') dateFilter.$gte = dateFrom
  if (dateTo && typeof dateTo === 'string') dateFilter.$lte = dateTo
  if (Object.keys(dateFilter).length) filter.date = dateFilter

  if (from || to) {
    const tsFilter: Record<string, Date> = {}
    if (from && typeof from === 'string') tsFilter.$gte = new Date(from)
    if (to && typeof to === 'string') tsFilter.$lte = new Date(to)
    if (Object.keys(tsFilter).length) filter.createdAt = tsFilter
  }

  const all = await Reservation.find(filter).sort({ createdAt: -1 }).lean()

  if (all.length > 10000) {
    badRequest(res, 'Export limited to 10,000 records. Narrow your filters.')
    return
  }

  const headers = ['Name', 'Phone', 'Email', 'Date', 'Time', 'Guests', 'Occasion', 'Requests', 'Remarks', 'Status', 'Created']
  const rows = all.map((r) => ({
    Name: r.name ?? '',
    Phone: r.phone ?? '',
    Email: r.email ?? '',
    Date: r.date ?? '',
    Time: r.time ?? '',
    Guests: r.guests ?? 0,
    Occasion: r.occasion ?? '',
    Requests: r.requests ?? '',
    Remarks: r.remarks ?? '',
    Status: r.status ?? '',
    Created: (r as any).createdAt ? new Date((r as any).createdAt).toISOString() : '',
  }))

  const filename = `reservations-${new Date().toISOString().slice(0, 10)}.csv`
  sendCSV(res, filename, headers, rows)

  logger.info('Reservations exported', { count: all.length })
})
