import mongoose, { Schema, Document } from 'mongoose'

export interface IMenuItem extends Document {
  name: string
  category: string
  description: string
  price: string
  dietary: string[]
  image: string
  featured: boolean
  visible: boolean
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: { type: String, required: true },
  category: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  dietary: [{ type: String }],
  image: { type: String, required: true },
  featured: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
}, { timestamps: true })

MenuItemSchema.index({ category: 1, visible: 1 })
MenuItemSchema.index({ featured: 1, visible: 1 })

export const MenuItem = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema)
