import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { connectDB } from './config/db'
import { logger } from './lib/logger'
import { requestLogger } from './middleware/requestLogger'
import { mongooseErrorHandler } from './middleware/errorHandler'
import { serverError, notFound } from './utils/response'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger'
import authRoutes from './routes/auth.routes'
import menuRoutes from './routes/menu.routes'
import eventsRoutes from './routes/events.routes'
import galleryRoutes from './routes/gallery.routes'
import staffRoutes from './routes/staff.routes'
import reservationRoutes from './routes/reservations.routes'
import messageRoutes from './routes/messages.routes'
import auditLogRoutes from './routes/audit-log.routes'
import offerRoutes from './routes/offers.routes'
import uploadRoutes from './routes/upload.routes'
import configRoutes from './routes/config.routes'

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(requestLogger)

app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/audit-log', auditLogRoutes)
app.use('/api/offers', offerRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/config', configRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none } .swagger-ui .scheme-container { margin: 0; padding: 12px 0 }',
  customSiteTitle: 'Nepali Restaurant API Docs',
}))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Nepali Restaurant API' })
})

app.use(mongooseErrorHandler)

app.use((_req, res) => {
  notFound(res, 'Route')
})

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  serverError(res, err, 'Unhandled error')
})

async function start() {
  await connectDB()
  app.listen(PORT, () => {
    logger.info('Express server started', { port: Number(PORT) })
  })
}

start()
