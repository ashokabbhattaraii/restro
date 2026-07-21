import mongoose, { Schema, Document } from 'mongoose'

export interface IReservation extends Document {
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: number
  occasion: string
  requests: string
  remarks: string
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Contacted'
}

const ReservationSchema = new Schema<IReservation>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  date: { type: String, required: true, index: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 30 },
  occasion: { type: String },
  requests: { type: String },
  remarks: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Cancelled', 'Contacted'],
    default: 'Pending',
  },
}, { timestamps: true })

ReservationSchema.index({ status: 1, date: -1 })
ReservationSchema.index({ date: 1, status: 1 })

export const Reservation = mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema)
