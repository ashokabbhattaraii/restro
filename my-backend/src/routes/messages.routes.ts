import { Router } from 'express'
import { getMessages, getMessage, createMessage, updateMessage, deleteMessage } from '../controllers/messages.controller'
import { requireAdmin } from '../middleware/auth'
import { validateObjectId } from '../middleware/validateObjectId'

const router = Router()

router.get('/', getMessages)
router.get('/:id', validateObjectId(), getMessage)
router.post('/', createMessage)
router.put('/:id', requireAdmin, validateObjectId(), updateMessage)
router.delete('/:id', requireAdmin, validateObjectId(), deleteMessage)

export default router
