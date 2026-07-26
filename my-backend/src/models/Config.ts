import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IDayHours {
  open: string
  close: string
  closed: boolean
}

export interface IGlimpseImage {
  src: string
  label: string
}

export interface IGlimpseInside {
  title: string
  subtitle: string
  images: IGlimpseImage[]
}

export interface IConfig extends Document {
  acceptingReservations: boolean
  maxGuests: number
  maxDaysAhead: number
  slotIntervalMinutes: number
  hours: Record<string, IDayHours>
  closedDates: string[]
  phoneOne: string
  phoneTwo: string
  location: string
  message: string
  socialInstagram: string
  socialFacebook: string
  showOffers: boolean
  eventTypes: string[]
  menuCategories: string[]
  galleryCategories: string[]
  glimpseInside: IGlimpseInside
}

const DayHoursSchema = new Schema<IDayHours>(
  {
    open: { type: String, default: '11:00' },
    close: { type: String, default: '23:00' },
    closed: { type: Boolean, default: false },
  },
  { _id: false }
)

const GlimpseImageSchema = new Schema<IGlimpseImage>(
  { src: { type: String, required: true }, label: { type: String, required: true } },
  { _id: false }
)

const GlimpseInsideSchema = new Schema<IGlimpseInside>(
  {
    title: { type: String, default: 'A Glimpse Inside' },
    subtitle: { type: String, default: '' },
    images: { type: [GlimpseImageSchema], default: [] },
  },
  { _id: false }
)

const ConfigSchema = new Schema<IConfig>(
  {
    acceptingReservations: { type: Boolean, default: true },
    maxGuests: { type: Number, default: 20 },
    maxDaysAhead: { type: Number, default: 30 },
    slotIntervalMinutes: { type: Number, default: 30 },
    hours: { type: Map, of: DayHoursSchema, default: {} },
    closedDates: { type: [String], default: [] },
    phoneOne: { type: String, default: '' },
    phoneTwo: { type: String, default: '' },
    location: { type: String, default: '' },
    message: { type: String, default: '' },
    socialInstagram: { type: String, default: '' },
    socialFacebook: { type: String, default: '' },
    showOffers: { type: Boolean, default: true },
    eventTypes: { type: [String], default: [] },
    menuCategories: { type: [String], default: [] },
    galleryCategories: { type: [String], default: [] },
    glimpseInside: { type: GlimpseInsideSchema, default: () => ({ title: 'A Glimpse Inside', subtitle: '', images: [] }) },
  },
  { timestamps: true }
)

export const Config = mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema)
