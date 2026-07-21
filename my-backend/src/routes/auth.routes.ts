import { Router } from 'express'
import { login, logout, getMe } from '../controllers/auth.controller'
import { authRateLimiter } from '../middleware/rateLimit'
import { requireAdmin } from '../middleware/auth'

const router = Router()

router.post('/login', authRateLimiter, login)
router.post('/logout', logout)
router.get('/me', requireAdmin, getMe)

export default router
