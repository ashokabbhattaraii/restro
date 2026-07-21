import { logger } from './logger'

interface RecaptchaVerifyResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  score?: number
  action?: string
  'error-codes'?: string[]
}

export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY

  if (!secret) {
    logger.warn('RECAPTCHA_SECRET_KEY is not configured. Allowing request without verification.')
    return true
  }

  if (!token || typeof token !== 'string') {
    return false
  }

  try {
    const params = new URLSearchParams()
    params.append('secret', secret)
    params.append('response', token)

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    if (!response.ok) {
      logger.error('reCAPTCHA verification request failed', { status: response.status })
      return false
    }

    const data = (await response.json()) as RecaptchaVerifyResponse

    if (!data.success) {
      logger.warn('reCAPTCHA verification failed', { errorCodes: data['error-codes'] })
      return false
    }

    return true
  } catch (err) {
    logger.error('reCAPTCHA verification request failed', {
      error: err instanceof Error ? err.message : String(err),
    })
    return false
  }
}
