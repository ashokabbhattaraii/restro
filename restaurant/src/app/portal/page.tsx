'use client'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react'
import { useAdmin } from '@/context/AdminContext'
import ThemeToggle from '@/components/layout/ThemeToggle'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

const LOCKOUT_AFTER = 3
const LOCKOUT_SECONDS = 30

const FOOD_IMAGE = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=2200&q=90"

export default function PortalPage() {
  const { login, admin, loading } = useAdmin()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [failCount, setFailCount] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [mounted, setMounted] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { setMounted(true) }, [])

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

  if (loading || !mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--background)' }}
      >
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, color-mix(in srgb, var(--gold) 7%, transparent) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, color-mix(in srgb, var(--gold) 4%, transparent) 0%, transparent 50%)',
        }}
      />

      <div
        className="fixed z-50"
        style={{ top: 20, right: 20 }}
      >
        <ThemeToggle />
      </div>

      <div
        className="lg:hidden absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${FOOD_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
        }}
      />

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${FOOD_IMAGE})`,
            filter: 'brightness(0.40) saturate(1.1)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, color-mix(in srgb, var(--background) 65%, transparent) 0%, transparent 40%, color-mix(in srgb, var(--background) 80%, transparent) 100%)',
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full select-none">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 16px',
              background: 'color-mix(in srgb, var(--primary) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 25%, transparent)',
              borderRadius: 6,
              color: 'var(--primary)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            <LockKeyhole size={14} />
            Admin Access
          </div>

          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display, "Playfair Display", serif)',
                fontSize: 42,
                fontWeight: 500,
                color: 'var(--body)',
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Sangita
            </h1>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: 16,
                margin: '6px 0 0',
                letterSpacing: '0.02em',
              }}
            >
              Nepali Restaurant &bull; Bar &bull; Events
            </p>
          </div>
        </div>
      </div>

      <div
        className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8"
        style={{ background: 'var(--background)' }}
      >
        <div
          ref={cardRef}
          className="login-card w-full"
          style={{
            maxWidth: 420,
            background: 'var(--modal)',
            border: '1px solid color-mix(in srgb, var(--gold) 18%, transparent)',
            borderRadius: 14,
            padding: 'clamp(28px, 5vw, 44px) clamp(24px, 4vw, 40px)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="lg:hidden text-center mb-7">
            <h1
              style={{
                fontFamily: 'var(--font-display, "Playfair Display", serif)',
                fontSize: 28,
                fontWeight: 500,
                color: 'var(--primary)',
                margin: 0,
              }}
            >
              Sangita
            </h1>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: 12,
                margin: '2px 0 0',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Admin Portal
            </p>
          </div>

          <div className="text-center mb-7">
            <div
              style={{
                display: 'inline-flex',
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'linear-gradient(135deg, var(--gold), var(--primary))',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <LockKeyhole size={22} style={{ color: 'var(--ink)' }} />
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--body)',
                margin: 0,
              }}
            >
              Welcome back
            </h2>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: 14,
                margin: '6px 0 0',
              }}
            >
              Sign in to manage your restaurant
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="admin@nepalirestaurant.com"
                className="login-input"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--surface)',
                  border: `1px solid ${errors.email ? 'var(--danger)' : 'color-mix(in srgb, var(--gold) 15%, transparent)'}`,
                  borderRadius: 10,
                  color: 'var(--body)',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 160ms, box-shadow 160ms',
                }}
                onFocus={(e) => {
                  if (!errors.email) e.target.style.borderColor = 'color-mix(in srgb, var(--gold) 40%, transparent)'
                  e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--gold) 10%, transparent)'
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none'
                  if (!errors.email) e.target.style.borderColor = 'color-mix(in srgb, var(--gold) 15%, transparent)'
                }}
              />
              {errors.email && (
                <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 6 }}>{errors.email.message}</p>
              )}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="login-input"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 14px',
                    background: 'var(--surface)',
                    border: `1px solid ${errors.password ? 'var(--danger)' : 'color-mix(in srgb, var(--gold) 15%, transparent)'}`,
                    borderRadius: 10,
                    color: 'var(--body)',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 160ms, box-shadow 160ms',
                  }}
                  onFocus={(e) => {
                    if (!errors.password) e.target.style.borderColor = 'color-mix(in srgb, var(--gold) 40%, transparent)'
                    e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--gold) 10%, transparent)'
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none'
                    if (!errors.password) e.target.style.borderColor = 'color-mix(in srgb, var(--gold) 15%, transparent)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    padding: 0,
                    display: 'flex',
                    opacity: 0.6,
                    transition: 'opacity 160ms',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 6 }}>{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div
                style={{
                  background: 'color-mix(in srgb, var(--danger) 10%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--danger) 22%, transparent)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginBottom: 20,
                  color: 'var(--danger)',
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}

            {isLocked && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'color-mix(in srgb, var(--gold) 8%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--gold) 20%, transparent)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginBottom: 20,
                  color: 'var(--primary)',
                  fontSize: 13,
                }}
              >
                <LockKeyhole size={16} />
                Too many attempts. Retry in {countdown}s
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLocked}
              className="login-submit"
              style={{
                width: '100%',
                padding: '13px 0',
                background: isLocked || isSubmitting
                  ? 'color-mix(in srgb, var(--gold) 30%, transparent)'
                  : 'linear-gradient(135deg, var(--gold), var(--primary))',
                color: 'var(--ink)',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.06em',
                cursor: isSubmitting || isLocked ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'opacity 160ms, box-shadow 200ms, transform 160ms',
                boxShadow: isLocked || isSubmitting
                  ? 'none'
                  : '0 2px 12px color-mix(in srgb, var(--gold) 25%, transparent)',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting && !isLocked) {
                  e.currentTarget.style.opacity = '0.92'
                  e.currentTarget.style.boxShadow = '0 4px 24px color-mix(in srgb, var(--gold) 35%, transparent)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
                if (!isLocked && !isSubmitting) {
                  e.currentTarget.style.boxShadow = '0 2px 12px color-mix(in srgb, var(--gold) 25%, transparent)'
                }
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

          <p
            style={{
              textAlign: 'center',
              color: 'color-mix(in srgb, var(--muted) 60%, transparent)',
              fontSize: 12,
              marginTop: 24,
              letterSpacing: '0.04em',
            }}
          >
            &copy; {new Date().getFullYear()} Sangita. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-card {
          animation: cardIn 0.5s ease-out both;
        }
        .login-input::placeholder {
          color: color-mix(in srgb, var(--body) 35%, transparent);
        }
        .login-submit:active:not(:disabled) {
          transform: scale(0.98);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
