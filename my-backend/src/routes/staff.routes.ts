import { Router } from 'express'
import { getStaff, createStaff, updateStaff, deleteStaff } from '../controllers/staff.controller'
import { requireAdmin } from '../middleware/auth'
import { validateObjectId } from '../middleware/validateObjectId'

const router = Router()

router.get('/public', getStaff)
router.get('/', getStaff)
router.post('/', requireAdmin, createStaff)
router.put('/:id', requireAdmin, validateObjectId(), updateStaff)
router.delete('/:id', requireAdmin, validateObjectId(), deleteStaff)

export default router
