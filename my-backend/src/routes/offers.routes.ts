import { Router } from 'express'
import { getOffers, getOffer, createOffer, updateOffer, deleteOffer } from '../controllers/offers.controller'
import { requireAdmin } from '../middleware/auth'
import { validateObjectId } from '../middleware/validateObjectId'

const router = Router()

router.get('/public', getOffers)
router.get('/:id', validateObjectId(), getOffer)
router.get('/', requireAdmin, getOffers)
router.post('/', requireAdmin, createOffer)
router.put('/:id', requireAdmin, validateObjectId(), updateOffer)
router.delete('/:id', requireAdmin, validateObjectId(), deleteOffer)

export default router
