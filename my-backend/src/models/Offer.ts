import mongoose, { Schema, Document } from 'mongoose'

export interface IOffer extends Document {
  pct: string
  unit: string
  title: string
  description: string
  validity: string
  cta: string
  active: boolean
  sortOrder: number
}

const OfferSchema = new Schema<IOffer>({
  pct: { type: String, required: true },
  unit: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  validity: { type: String, required: true },
  cta: { type: String, required: true },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true })

OfferSchema.index({ active: 1, sortOrder: 1 })

export const Offer = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema)