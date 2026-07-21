import { Router } from 'express'
import { getConfig, updateConfig } from '../controllers/config.controller'
import { requireAdmin } from '../middleware/auth'

const router = Router()

// Public read — the reservation/contact pages need this for hours & limits.
router.get('/', getConfig)

// Admin writes (frontend useUpdateConfig posts here; also accept PUT).
router.post('/', requireAdmin, updateConfig)
router.put('/:id', requireAdmin, updateConfig)

export default router
