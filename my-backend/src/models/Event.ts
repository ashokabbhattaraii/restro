import mongoose, { Schema, Document } from 'mongoose'

export interface IEvent extends Document {
  title: string
  description: string
  date: string
  time: string
  image: string
  type: string
  active: boolean
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String },
  image: { type: String, required: true },
  type: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true })

EventSchema.index({ active: 1, date: -1 })

export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema)
