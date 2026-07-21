import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  name: string
  phone: string
  email: string
  subject: string
  message: string
  contactType: "feedback" | "enquiry" | "other"
  rating?: number
  verified: boolean
  read: boolean
  replied: boolean
  reply?: string
  replyAt?: Date
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  contactType: { type: String, enum: ["feedback", "enquiry", "other"], required: true, default: "other" },
  rating: { type: Number },
  verified: { type: Boolean, default: false, index: true },
  read: { type: Boolean, default: false, index: true },
  replied: { type: Boolean, default: false },
  reply: { type: String },
  replyAt: { type: Date },
}, { timestamps: true })

MessageSchema.index({ read: 1, createdAt: -1 })

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)
