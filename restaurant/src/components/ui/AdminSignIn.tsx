"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface AdminSignInProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function AdminSignIn({ onSubmit }: AdminSignInProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[100dvh] flex-col md:flex-row">
      {/* Left: form */}
      <section className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="animate-element animate-delay-100 mb-2">
            <span className="section-label">Admin Access</span>
          </div>

          <h1 className="animate-element animate-delay-200 mt-4 mb-2" style={{ fontSize: "clamp(36px,5vw,56px)", lineHeight: 1 }}>
            Welcome back
          </h1>
          <p className="animate-element animate-delay-300 mb-8">
            Sign in to manage your restaurant dashboard
          </p>

          <form action={onSubmit} className="space-y-5">
            <div className="animate-element animate-delay-300">
              <label className="block">
                <span>Email Address</span>
                <div className="mt-2 rounded-lg border border-[var(--card-border)] bg-[var(--surface)] backdrop-blur-sm transition-colors focus-within:border-[var(--primary)]">
                  <input
                    name="email"
                    type="email"
                    placeholder="admin@restaurant.com"
                    required
                    className="field w-full rounded-lg border-0 px-4 py-3"
                  />
                </div>
              </label>
            </div>

            <div className="animate-element animate-delay-400">
              <label className="block">
                <span>Password</span>
                <div className="relative mt-2 rounded-lg border border-[var(--card-border)] bg-[var(--surface)] backdrop-blur-sm transition-colors focus-within:border-[var(--primary)]">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="field w-full rounded-lg border-0 px-4 py-3 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-[var(--muted)] transition-colors hover:text-[var(--primary)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="animate-element animate-delay-500 btn btn-primary submit-btn"
            >
              Sign In
            </button>
          </form>
        </div>
      </section>

      {/* Right: hero image */}
      <section className="relative hidden flex-1 p-4 md:block">
        <div
          className="animate-slide-right animate-delay-300 absolute inset-4 rounded-2xl bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80)",
          }}
        >
          {/* scrim */}
          <div className="absolute inset-0 rounded-2xl" style={{ background: "var(--hero-scrim)" }} />
          {/* branding overlay */}
          <div className="absolute bottom-10 left-10 right-10 z-10 flex items-center gap-4">
            <img src="/logo.png" alt="Nepali Restaurant & Bar Logo" className="h-16 w-auto rounded-full object-contain filter drop-shadow-[0_0_10px_rgba(230,195,98,0.3)] bg-black/40 p-1" />
            <div>
              <p className="brand text-3xl" style={{ color: "var(--primary)" }}>
                Nepali Restaurant &amp; Bar
              </p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                Restaurant &amp; Bar · Sulaymaniyah
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
