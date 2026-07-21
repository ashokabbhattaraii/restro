import { Request, Response } from 'express'
import { uploadImageFromBuffer, deleteImage } from '../utils/cloudinary'
import { asyncHandler } from '../utils/asyncHandler'
import { success, badRequest, serverError } from '../utils/response'

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) { badRequest(res, 'No file provided'); return }
  if (!req.file.mimetype.startsWith('image/')) { badRequest(res, 'File must be an image'); return }

  const folder = (req.body.folder as string) || 'restaurant'
  const tags = (req.body.tags as string) || ''

  const result = await uploadImageFromBuffer(req.file.buffer, {
    folder,
    tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      { width: 1920, height: 1080, crop: 'limit' },
    ],
  })

  success(res, {
    url: result.url,
    publicId: result.publicId,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  })
})

export const removeImage = asyncHandler(async (req: Request, res: Response) => {
  const publicId = req.query.publicId as string
  if (!publicId) { badRequest(res, 'publicId required'); return }

  await deleteImage(publicId)
  success(res, { success: true })
})
