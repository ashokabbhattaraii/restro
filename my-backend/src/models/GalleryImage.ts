import mongoose, { Schema, Document } from 'mongoose'

export interface IGalleryImage extends Document {
  title: string
  category: string
  image: string
  shape: string
  order: number
}

const GalleryImageSchema = new Schema<IGalleryImage>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  shape: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

GalleryImageSchema.index({ category: 1, order: 1 })

export const GalleryImage = mongoose.models.GalleryImage || mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema)
