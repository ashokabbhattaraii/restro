import nodemailer from 'nodemailer'
import { logger } from './logger'

const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

function createTransport() {
  if (!SMTP_USER || !SMTP_PASS) {
    logger.warn('SMTP not configured — emails will not be sent. Set SMTP_USER and SMTP_PASS in .env')
    return null
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (!transporter) transporter = createTransport()
  return transporter
}

export function isMailConfigured(): boolean {
  return !!SMTP_USER && !!SMTP_PASS
}

export async function sendMail(options: {
  to: string
  subject: string
  html: string
  replyTo?: string
}): Promise<void> {
  const t = getTransporter()
  if (!t) return

  try {
    await t.sendMail({
      from: SMTP_USER!,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    })
    logger.info('Email sent', { to: options.to, subject: options.subject })
  } catch (err) {
    logger.error('Failed to send email', {
      error: err instanceof Error ? err.message : String(err),
      to: options.to,
      subject: options.subject,
    })
  }
}