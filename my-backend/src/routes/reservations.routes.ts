import { Router } from 'express'
import { getReservations, getReservation, createReservation, updateReservation, deleteReservation, exportReservations } from '../controllers/reservations.controller'
import { requireAdmin } from '../middleware/auth'
import { validateObjectId } from '../middleware/validateObjectId'

const router = Router()

router.get('/', getReservations)
router.get('/export', requireAdmin, exportReservations)
router.get('/:id', validateObjectId(), getReservation)
router.post('/', createReservation)
router.put('/:id', requireAdmin, validateObjectId(), updateReservation)
router.delete('/:id', requireAdmin, validateObjectId(), deleteReservation)

export default router
