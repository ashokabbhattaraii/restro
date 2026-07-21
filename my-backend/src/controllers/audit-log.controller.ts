import { Request, Response } from 'express'
import { AuditLog } from '../models/AuditLog'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler'
import { parsePaginationParams, paginate, buildSearchFilter } from '../utils/pagination'
import { success, notFound, badRequest, serverError } from '../utils/response'
import { sendCSV } from '../utils/csv'
import { logger } from '../lib/logger'

export const getAuditLog = asyncHandler(async (req: Request, res: Response) => {
  const { action, resource, search } = req.query
  const filter: Record<string, unknown> = {}

  if (action && action !== 'all') filter.action = action
  if (resource && resource !== 'all') filter.resource = resource
  if (search && typeof search === 'string') {
    const sf = buildSearchFilter(search, ['summary', 'admin', 'resourceId'])
    if (sf) Object.assign(filter, sf)
  }

  const params = parsePaginationParams(req.query as Record<string, unknown>)
  const result = await paginate(AuditLog, filter, params)

  logger.debug('Retrieved audit logs', { count: result.data.length, total: result.pagination.total })
  success(res, { entries: result.data, total: result.pagination.total }, { pagination: result.pagination })
})

export const getAuditLogEntry = asyncHandler(async (req: Request, res: Response) => {
  const entry = await AuditLog.findById(req.params.id).lean()
  if (!entry) { notFound(res, 'Audit log entry'); return }
  success(res, entry)
})

export const exportAuditLog = asyncHandler(async (req: Request, res: Response) => {
  const { action, resource, search, from, to } = req.query
  const filter: Record<string, unknown> = {}

  if (action && action !== 'all') filter.action = action
  if (resource && resource !== 'all') filter.resource = resource
  if (search && typeof search === 'string') {
    const sf = buildSearchFilter(search, ['summary', 'admin', 'resourceId'])
    if (sf) Object.assign(filter, sf)
  }

  if (from || to) {
    const tsFilter: Record<string, Date> = {}
    if (from && typeof from === 'string') tsFilter.$gte = new Date(from)
    if (to && typeof to === 'string') tsFilter.$lte = new Date(to)
    if (Object.keys(tsFilter).length) filter.timestamp = tsFilter
  }

  const all = await AuditLog.find(filter).sort({ timestamp: -1 }).lean()

  if (all.length > 10000) {
    badRequest(res, 'Export limited to 10,000 records. Narrow your filters.')
    return
  }

  const headers = ['Admin', 'Action', 'Resource', 'Resource ID', 'Summary', 'IP', 'Timestamp']
  const rows = all.map((entry) => ({
    Admin: entry.admin ?? '',
    Action: entry.action ?? '',
    Resource: entry.resource ?? '',
    'Resource ID': entry.resourceId ?? '',
    Summary: entry.summary ?? '',
    IP: entry.ip ?? '',
    Timestamp: entry.timestamp ? new Date(entry.timestamp).toISOString() : '',
  }))

  const filename = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`
  sendCSV(res, filename, headers, rows)

  logger.info('Audit log exported', { count: all.length })
})
