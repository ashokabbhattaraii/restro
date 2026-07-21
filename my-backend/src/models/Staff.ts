import mongoose, { Schema, Document } from 'mongoose'

export interface IStaff extends Document {
  name: string
  role: string
  department: string
  bio: string
  image: string
  visible: boolean
}

const StaffSchema = new Schema<IStaff>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, default: '' },
  bio: { type: String, default: '' },
  image: { type: String, default: '' },
  visible: { type: Boolean, default: true, index: true },
}, { timestamps: true })

export const Staff = mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema)
