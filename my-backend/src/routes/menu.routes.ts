import { Router } from 'express'
import { getMenuItems, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem, bulkCreateMenuItems } from '../controllers/menu.controller'
import { requireAdmin } from '../middleware/auth'
import { validateObjectId } from '../middleware/validateObjectId'

const router = Router()

router.get('/public', getMenuItems)
router.get('/', getMenuItems)
router.get('/:id', validateObjectId(), getMenuItem)
router.post('/', requireAdmin, createMenuItem)
router.post('/bulk', requireAdmin, bulkCreateMenuItems)
router.put('/:id', requireAdmin, validateObjectId(), updateMenuItem)
router.delete('/:id', requireAdmin, validateObjectId(), deleteMenuItem)

export default router
