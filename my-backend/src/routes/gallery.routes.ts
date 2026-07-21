import { Router } from 'express'
import { getGalleryImages, createGalleryImage, deleteGalleryImage } from '../controllers/gallery.controller'
import { requireAdmin } from '../middleware/auth'
import { validateObjectId } from '../middleware/validateObjectId'

const router = Router()

router.get('/', getGalleryImages)
router.post('/', requireAdmin, createGalleryImage)
router.delete('/:id', requireAdmin, validateObjectId(), deleteGalleryImage)

export default router
