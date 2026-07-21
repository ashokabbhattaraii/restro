import { Router } from 'express'
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/events.controller'
import { requireAdmin } from '../middleware/auth'
import { validateObjectId } from '../middleware/validateObjectId'

const router = Router()

router.get('/public', getEvents)
router.get('/', getEvents)
router.get('/:id', validateObjectId(), getEvent)
router.post('/', requireAdmin, createEvent)
router.put('/:id', requireAdmin, validateObjectId(), updateEvent)
router.delete('/:id', requireAdmin, validateObjectId(), deleteEvent)

export default router
