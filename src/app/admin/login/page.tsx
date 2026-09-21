"use client";

import React, { useState, useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FormState = {
  error: string | null;
  fieldErrors: Record<string, string[] | undefined> | null;
};

const initialState: FormState = { error: null, fieldErrors: null };

// ---------------------------------------------------------------------------
// Login Action (client-side fetch wrapper for the Route Handler)
// ---------------------------------------------------------------------------

async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return {
      error: "Email dan password wajib diisi.",
      fieldErrors: null,
    };
  }

  try {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        error: data.error ?? "Email atau password tidak valid.",
        fieldErrors: data.details ?? null,
      };
    }

    // Success: trigger hard navigation so middleware re-evaluates cookie
    return { error: "__REDIRECT__", fieldErrors: null };
  } catch {
    return {
      error: "Terjadi kesalahan. Silakan coba lagi.",
      fieldErrors: null,
    };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("from") ?? "/admin";

  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect on success
  React.useEffect(() => {
    if (state.error === "__REDIRECT__") {
      router.push(returnTo);
    }
  }, [state.error, router, returnTo]);

  const hasError = state.error && state.error !== "__REDIRECT__";

  return (
    <div className="login-root">
      {/* Left — Brand Panel */}
      <div className="login-brand" aria-hidden="true">
        <div className="login-brand__inner">
          <div className="login-brand__wordmark">
            <span className="login-brand__name">ANTRABUMI</span>
            <span className="login-brand__tagline">
              Connecting Knowledge,<br />Nature, &amp; Communities.
            </span>
          </div>

          <div className="login-brand__pillars">
            {["Knowledge", "Nature", "Communities"].map((pillar) => (
              <div key={pillar} className="login-brand__pillar">
                <div className="login-brand__pillar-dot" />
                <span>{pillar}</span>
              </div>
            ))}
          </div>

          <p className="login-brand__caption">
            Admin Workspace — Restricted Access
          </p>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="login-form-panel">
        <div className="login-form-wrap">
          {/* Header */}
          <div className="login-form-header">
            <h1 className="login-form-title">Admin Masuk</h1>
            <p className="login-form-subtitle">
              Masuk ke panel administrasi ANTRABUMI
            </p>
          </div>

          {/* Error Banner */}
          {hasError && (
            <div className="login-error" role="alert" aria-live="polite">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
                <path
                  d="M8 5v3.5M8 10.5v.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>{state.error}</span>
            </div>
          )}

          {/* Form */}
          <form action={formAction} noValidate className="login-form">
            {/* Email */}
            <div className="login-field">
              <label htmlFor="login-email" className="login-label">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                className="login-input"
                placeholder="admin@antrabumi.org"
                aria-describedby={
                  state.fieldErrors?.email ? "login-email-error" : undefined
                }
                aria-invalid={!!state.fieldErrors?.email}
              />
              {state.fieldErrors?.email && (
                <span id="login-email-error" className="login-field-error" role="alert">
                  {state.fieldErrors.email[0]}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="login-password" className="login-label">
                Password
              </label>
              <div className="login-input-group">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isPending}
                  className="login-input login-input--password"
                  placeholder="••••••••"
                  aria-describedby={
                    state.fieldErrors?.password ? "login-pw-error" : undefined
                  }
                  aria-invalid={!!state.fieldErrors?.password}
                />
                <button
                  type="button"
                  className="login-toggle-pw"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  )}
                </button>
              </div>
              {state.fieldErrors?.password && (
                <span id="login-pw-error" className="login-field-error" role="alert">
                  {state.fieldErrors.password[0]}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isPending}
              className="login-submit"
              aria-busy={isPending}
            >
              {isPending ? (
                <span className="login-submit__loading">
                  <span className="login-spinner" aria-hidden="true" />
                  Memeriksa...
                </span>
              ) : (
                "Masuk ke Admin"
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="login-footnote">
            Akses dibatasi untuk pengguna yang berwenang.
            <br />
            Kontak: <a href="mailto:hello@antrabumi.org">hello@antrabumi.org</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        /* ---------------------------------------------------------------
           Login Layout
        --------------------------------------------------------------- */
        .login-root {
          display: flex;
          min-height: 100vh;
          background: #ffffff;
        }

        /* ---------------------------------------------------------------
           Brand panel (left)
        --------------------------------------------------------------- */
        .login-brand {
          display: none;
          position: sticky;
          top: 0;
          width: 420px;
          flex-shrink: 0;
          min-height: 100vh;
          background: #0a0a0a;
          color: #ffffff;
          overflow: hidden;
        }

        @media (min-width: 900px) {
          .login-brand {
            display: flex;
          }
        }

        .login-brand__inner {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem 2.5rem;
          width: 100%;
          height: 100vh;
        }

        .login-brand__wordmark {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .login-brand__name {
          font-family: var(--font-heading, 'Montserrat', sans-serif);
          font-size: 1.125rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #ffffff;
        }

        .login-brand__tagline {
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-size: 1.75rem;
          font-weight: 300;
          line-height: 1.35;
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: -0.01em;
        }

        .login-brand__pillars {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          padding: 2rem 0;
        }

        .login-brand__pillar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        .login-brand__pillar-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .login-brand__caption {
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-size: 0.6875rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.25);
        }

        /* ---------------------------------------------------------------
           Form panel (right)
        --------------------------------------------------------------- */
        .login-form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          background: #ffffff;
        }

        .login-form-wrap {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* ---------------------------------------------------------------
           Form header
        --------------------------------------------------------------- */
        .login-form-header {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .login-form-title {
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: #0a0a0a;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .login-form-subtitle {
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-size: 0.875rem;
          font-weight: 400;
          color: #6b7280;
          margin: 0;
        }

        /* ---------------------------------------------------------------
           Error banner
        --------------------------------------------------------------- */
        .login-error {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          padding: 0.875rem 1rem;
          border-radius: 6px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-size: 0.8125rem;
          font-weight: 500;
          animation: login-shake 0.3s ease;
        }

        @keyframes login-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        /* ---------------------------------------------------------------
           Form fields
        --------------------------------------------------------------- */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .login-label {
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .login-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input {
          width: 100%;
          height: 44px;
          padding: 0 0.875rem;
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-size: 0.9375rem;
          font-weight: 400;
          color: #0a0a0a;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
        }

        .login-input::placeholder {
          color: #9ca3af;
        }

        .login-input:focus {
          border-color: #0a0a0a;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.06);
        }

        .login-input:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .login-input[aria-invalid="true"] {
          border-color: #ef4444;
        }

        .login-input--password {
          padding-right: 2.75rem;
        }

        .login-toggle-pw {
          position: absolute;
          right: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          border-radius: 4px;
          transition: color 0.15s ease;
        }

        .login-toggle-pw:hover {
          color: #374151;
        }

        .login-toggle-pw:focus-visible {
          outline: 2px solid #0a0a0a;
          outline-offset: 2px;
        }

        .login-field-error {
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-size: 0.75rem;
          color: #ef4444;
          font-weight: 500;
        }

        /* ---------------------------------------------------------------
           Submit button
        --------------------------------------------------------------- */
        .login-submit {
          width: 100%;
          height: 48px;
          margin-top: 0.5rem;
          padding: 0 1.5rem;
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-size: 0.9375rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: #ffffff;
          background: #0a0a0a;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-submit:hover:not(:disabled) {
          opacity: 0.88;
        }

        .login-submit:active:not(:disabled) {
          transform: scale(0.99);
        }

        .login-submit:focus-visible {
          outline: 2px solid #0a0a0a;
          outline-offset: 3px;
        }

        .login-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .login-submit__loading {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        /* ---------------------------------------------------------------
           Spinner
        --------------------------------------------------------------- */
        .login-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: login-spin 0.65s linear infinite;
        }

        @keyframes login-spin {
          to { transform: rotate(360deg); }
        }

        /* ---------------------------------------------------------------
           Footnote
        --------------------------------------------------------------- */
        .login-footnote {
          font-family: var(--font-body, 'Montserrat', sans-serif);
          font-size: 0.75rem;
          color: #9ca3af;
          text-align: center;
          line-height: 1.6;
          margin: 0;
        }

        .login-footnote a {
          color: #6b7280;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .login-footnote a:hover {
          color: #0a0a0a;
        }

        /* ---------------------------------------------------------------
           Reduced motion
        --------------------------------------------------------------- */
        @media (prefers-reduced-motion: reduce) {
          .login-spinner {
            animation: none;
            opacity: 0.6;
          }
          .login-error {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
