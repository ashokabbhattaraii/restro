import { Request, Response } from 'express'
import { z } from 'zod'
import { Config } from '../models/Config'
import { logger } from '../lib/logger'
import { asyncHandler } from '../utils/asyncHandler'
import { success, validationError, serverError } from '../utils/response'

const dayHoursSchema = z
  .object({
    open: z.string().min(1).max(8),
    close: z.string().min(1).max(8),
    closed: z.boolean(),
  })
  .strict()

const glimpseImageSchema = z.object({
  src: z.string().min(1),
  label: z.string().min(1).max(80),
}).strict()

const glimpseInsideSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(500).optional(),
  images: z.array(glimpseImageSchema).optional(),
}).strict()

const configSchema = z
  .object({
    acceptingReservations: z.boolean().optional(),
    maxGuests: z.number().int().min(1).max(200).optional(),
    maxDaysAhead: z.number().int().min(0).max(365).optional(),
    slotIntervalMinutes: z.number().int().min(5).max(120).optional(),
    hours: z.record(dayHoursSchema).optional(),
    closedDates: z.array(z.string().min(1)).optional(),
    phoneOne: z.string().max(40).optional(),
    phoneTwo: z.string().max(40).optional(),
    location: z.string().max(200).optional(),
    message: z.string().max(500).optional(),
    socialInstagram: z.string().max(80).optional(),
    socialFacebook: z.string().max(80).optional(),
    showOffers: z.boolean().optional(),
    eventTypes: z.array(z.string().max(60)).optional(),
    menuCategories: z.array(z.string().max(60)).optional(),
    galleryCategories: z.array(z.string().max(60)).optional(),
    glimpseInside: glimpseInsideSchema.optional(),
  })
  .strict()

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function defaultHours(): Record<string, { open: string; close: string; closed: boolean }> {
  return DAYS.reduce<Record<string, { open: string; close: string; closed: boolean }>>((acc, day) => {
    acc[day] = { open: '09:00', close: '01:00', closed: false }
    return acc
  }, {})
}

async function getOrCreateConfig() {
  let config = await Config.findOne()
  if (!config) {
    config = await Config.create({
      acceptingReservations: true,
      maxGuests: 20,
      maxDaysAhead: 30,
      slotIntervalMinutes: 30,
      hours: defaultHours(),
      closedDates: [],
      phoneOne: '07701477472',
      phoneTwo: '07507752476',
      location: '46001 As Sulaymaniyah, Iraq',
      message: '',
      socialInstagram: '@nepali.restaurant.bar',
      socialFacebook: 'Nepali Restaurant & Bar',
      showOffers: true,
      eventTypes: ['Live Music', 'Happy Hour', 'Festival', 'Special', 'Cultural', 'Dinner'],
      menuCategories: ['All', 'Nepali', 'Indian', 'Chinese', 'Japanese', 'BBQ & Grill', 'Drinks & Bar', 'Desserts'],
      galleryCategories: ['All', 'Food', 'Dining Area', 'Bar', 'Events', 'Exterior'],
      glimpseInside: {
        title: 'A Glimpse Inside',
        subtitle: 'From mountain-inspired interiors to gold-lit plates — a visual taste of the experience.',
        images: [
          { src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=90', label: 'Dining Area' },
          { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=90', label: 'Food' },
          { src: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=1400&q=90', label: 'Bar' },
          { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=90', label: 'Interior' },
          { src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=85', label: 'Events' },
        ],
      },
    })
  } else if (!config.glimpseInside) {
    config = await Config.findByIdAndUpdate(
      config._id,
      {
        $set: {
          glimpseInside: {
            title: 'A Glimpse Inside',
            subtitle: 'From mountain-inspired interiors to gold-lit plates — a visual taste of the experience.',
            images: [
              { src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=90', label: 'Dining Area' },
              { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=90', label: 'Food' },
              { src: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=1400&q=90', label: 'Bar' },
              { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=90', label: 'Interior' },
              { src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=85', label: 'Events' },
            ],
          },
        },
      },
      { new: true }
    )
  }
  return config
}

export const getConfig = asyncHandler(async (_req: Request, res: Response) => {
  const config = await getOrCreateConfig()
  success(res, config)
})

export const updateConfig = asyncHandler(async (req: Request, res: Response) => {
  const parsed = configSchema.safeParse(req.body)
  if (!parsed.success) { validationError(res, parsed.error.flatten()); return }

  const config = await getOrCreateConfig()
  const updated = await Config.findByIdAndUpdate(config._id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean()

  logger.info('Config updated', { keys: Object.keys(parsed.data) })
  success(res, updated)
})
