import { FilterQuery, Model, QueryOptions, SortOrder } from 'mongoose'

export interface PaginationParams {
  page: number
  limit: number
  skip: number
  sort: Record<string, SortOrder>
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationMeta
}

const DEFAULTS = { page: 1, limit: 20, maxLimit: 100 } as const

/**
 * Parse pagination and sort params from query string.
 *
 * Accepts:
 *   ?page=2&limit=10&sort=-createdAt
 *   ?sort=name (ascending) | ?sort=-name (descending)
 *   ?sortBy=createdAt&order=asc
 */
export function parsePaginationParams(query: Record<string, unknown>): PaginationParams {
  let page = Math.max(1, Number(query.page) || DEFAULTS.page)
  let limit = Math.min(Math.max(1, Number(query.limit) || DEFAULTS.limit), DEFAULTS.maxLimit)
  const skip = (page - 1) * limit

  let sort: Record<string, SortOrder> = { createdAt: -1 }

  if (typeof query.sort === 'string' && query.sort.trim()) {
    sort = {}
    const fields = query.sort.split(',').filter(Boolean)
    for (const field of fields) {
      const trimmed = field.trim()
      if (trimmed.startsWith('-')) {
        sort[trimmed.slice(1)] = -1
      } else if (trimmed.startsWith('+')) {
        sort[trimmed.slice(1)] = 1
      } else {
        sort[trimmed] = 1
      }
    }
  } else if (typeof query.sortBy === 'string' && query.sortBy.trim()) {
    const order = String(query.order || '').toLowerCase() === 'desc' ? -1 : 1
    sort = { [query.sortBy.trim()]: order }
  }

  return { page, limit, skip, sort }
}

/**
 * Type-safe paginated query.
 *
 * ```ts
 * const { data, pagination } = await paginate(MenuItem, filter, params, { populate: 'category' })
 * ```
 */
export async function paginate<T>(
  model: Model<T>,
  filter: FilterQuery<T> = {},
  params: PaginationParams,
  options: QueryOptions<T> = {},
): Promise<PaginatedResult<T>> {
  const [data, total] = await Promise.all([
    model
      .find(filter, null, { ...options, skip: params.skip, limit: params.limit })
      .sort(params.sort)
      .lean(),
    model.countDocuments(filter),
  ])

  const totalPages = Math.ceil(total / params.limit)

  return {
    data: data as unknown as T[],
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNextPage: params.page < totalPages,
      hasPrevPage: params.page > 1,
    },
  }
}

/**
 * Build a $regex search filter across multiple fields.
 * Escapes special regex characters to prevent injection.
 */
export function buildSearchFilter(
  search: string,
  fields: string[],
): FilterQuery<unknown> | null {
  if (!search || !fields.length) return null
  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return {
    $or: fields.map((field) => ({
      [field]: { $regex: escaped, $options: 'i' },
    })),
  } as FilterQuery<unknown>
}

/**
 * Extract a typed boolean filter from query params with "true"/"false" string handling.
 */
export function parseBooleanParam(value: unknown): boolean | undefined {
  if (value === 'true' || value === true) return true
  if (value === 'false' || value === false) return false
  return undefined
}
