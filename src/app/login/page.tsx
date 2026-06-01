'use client'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAdmin } from '@/context/AdminContext'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

const LOCKOUT_AFTER = 3
const LOCKOUT_SECONDS = 30

export default function LoginPage() {
  const { login, admin, loading } = useAdmin()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [failCount, setFailCount] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!loading && admin) router.replace('/admin')
  }, [admin, loading, router])

  useEffect(() => {
    if (countdown <= 0) return
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [countdown])

  const onSubmit = async (data: FormData) => {
    if (countdown > 0) return
    setError('')
    setIsSubmitting(true)
    try {
      await login(data.email, data.password)
      router.push('/admin')
    } catch {
      const next = failCount + 1
      setFailCount(next)
      if (next >= LOCKOUT_AFTER) {
        setCountdown(LOCKOUT_SECONDS)
        setFailCount(0)
      }
      setError('Invalid credentials. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLocked = countdown > 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#121414' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#f2ca50' }} />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#121414' }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
        style={{ opacity: 0.05 }}
      >
        <defs>
          <pattern id="diamond" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#f2ca50" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diamond)" />
      </svg>

      <div
        className="relative z-10 w-full"
        style={{ maxWidth: 420, padding: '0 16px' }}
      >
        <div
          style={{
            background: 'rgba(30,32,32,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(242,202,80,0.25)',
            borderRadius: 8,
            padding: 48,
          }}
        >
          <div className="text-center mb-6">
            <p style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)', fontSize: 22, color: '#f2ca50', marginBottom: 4 }}>
              🇳🇵 Nepali Restaurant &amp; Bar
            </p>
            <h1 style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)', fontSize: 32, color: '#e2e2e2', fontWeight: 700, margin: 0 }}>
              Admin Portal
            </h1>
            <p style={{ fontFamily: 'var(--font-body, "DM Sans", sans-serif)', fontSize: 14, color: '#d0c5af', marginTop: 8 }}>
              Sign in to manage your restaurant
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d0c5af', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="admin@nepalirestaurant.com"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${errors.email ? '#ef4444' : '#e2e2e2'}`,
                  color: '#e2e2e2',
                  fontSize: 15,
                  padding: '8px 0',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>
              )}
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d0c5af', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1px solid ${errors.password ? '#ef4444' : '#e2e2e2'}`,
                    color: '#e2e2e2',
                    fontSize: 15,
                    padding: '8px 32px 8px 0',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#99907c', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 4,
                  padding: '10px 14px',
                  marginBottom: 20,
                  color: '#fca5a5',
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLocked}
              style={{
                width: '100%',
                background: isLocked || isSubmitting ? 'rgba(212,175,55,0.4)' : '#d4af37',
                color: '#3c2f00',
                border: 'none',
                borderRadius: 4,
                padding: '14px 0',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: isSubmitting || isLocked ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'background 0.2s',
              }}
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              ) : isLocked ? (
                `Try again in ${countdown}s`
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
