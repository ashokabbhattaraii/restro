import { Router } from 'express'
import { getAuditLog, getAuditLogEntry, exportAuditLog } from '../controllers/audit-log.controller'
import { requireAdmin } from '../middleware/auth'
import { validateObjectId } from '../middleware/validateObjectId'

const router = Router()

router.get('/', requireAdmin, getAuditLog)
router.get('/export', requireAdmin, exportAuditLog)
router.get('/:id', requireAdmin, validateObjectId(), getAuditLogEntry)

export default router
