// 'use client';
// import React, { FormEvent, useState } from 'react';

// export default function Page() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     if (!email || !password) {
//       setError('Email and password are required');
//       return;
//     }
//     try {
//       await fetch('/api/login', {
//         method: 'POST',
//         body: JSON.stringify({ email, password }),
//       });
//       window.location.href = '/admin';
//     } catch (error: unknown) {
//       if (error) {
//         setError('Something went wrong try again with correct credentials');
//       }
//     }
//   }
//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="h-full w-full bg-appBg flex justify-center items-center flex-col"
//     >
//       {error && <p className="text-red-500">{error}</p>}
//       <input
//         type="email"
//         placeholder="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit" className="bg-appMuted">
//         Login
//       </button>
//     </form>
//   );
// }

'use client';

import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        setError('Invalid credentials. Please check your email and password.');
        setLoading(false);
        return;
      }

      // Successful login
      router.push('/admin');
    } catch (err) {
      console.error(err);
      setError('Connection error. Please check your internet and try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-appBg flex flex-col">
      {/* Header */}
      <header className="bg-appSurface border-b border-appBorder shadow-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-apaxhub to-apaxhubDark flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-appText">Vehicle Finder</h1>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs bg-appBg text-appText px-3 py-1.5 rounded-md font-medium hover:bg-appBorder transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Info Card */}
          <div className="bg-appSurface rounded-xl border border-appBorder shadow-card p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-appPrimaryLight flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-appPrimary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-appText mb-2">Society Admin Portal</h2>
                <p className="text-sm text-appMuted leading-relaxed">
                  This is a secure area for authorized society administrators to manage vehicle
                  registrations, update owner information, and maintain the vehicle database.
                </p>
              </div>
            </div>

            <div className="bg-appBg rounded-lg p-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <svg
                  className="w-5 h-5 text-appPrimary flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-appMuted">Add and update vehicle registrations</p>
              </div>
              <div className="flex items-start gap-2.5">
                <svg
                  className="w-5 h-5 text-appPrimary flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-appMuted">Manage owner and flat information</p>
              </div>
              <div className="flex items-start gap-2.5">
                <svg
                  className="w-5 h-5 text-appPrimary flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-appMuted">Export reports in Excel and PDF formats</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-appSurface rounded-xl border border-appBorder shadow-card p-6 space-y-5"
          >
            <div className="text-center mb-2">
              <h3 className="text-lg font-semibold text-appText">Administrator Login</h3>
              <p className="text-xs text-appMuted mt-1">
                Enter your credentials to access the admin panel
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-dangerLight border border-danger rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <svg
                  className="w-5 h-5 text-danger flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-appText">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="flex-shrink-0 text-danger hover:text-danger/80"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-appText mb-1.5">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-appMuted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@society.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="
                    w-full border-2 border-appBorder rounded-lg pl-10 pr-4 py-3
                    text-appText bg-white
                    focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                    disabled:bg-appBg disabled:cursor-not-allowed
                    transition-all
                  "
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-appText mb-1.5">
                Password <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-appMuted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="
                    w-full border-2 border-appBorder rounded-lg pl-10 pr-12 py-3
                    text-appText bg-white
                    focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                    disabled:bg-appBg disabled:cursor-not-allowed
                    transition-all
                  "
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-appMuted hover:text-appText transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full rounded-lg bg-appPrimary text-white
                py-3.5 font-semibold text-base
                hover:bg-appPrimaryHover active:scale-98
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-button transition-all
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In to Admin Panel
                </>
              )}
            </button>

            {/* Help Text */}
            <div className="text-center pt-2">
              <p className="text-xs text-appMuted">
                For access issues, contact your society management
              </p>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 bg-appPrimaryLight/30 border border-appPrimary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-appPrimary flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <p className="text-xs font-medium text-appText">Secure Connection</p>
                <p className="text-xs text-appMuted mt-0.5">
                  Your login credentials are encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-appSurface border-t border-appBorder mt-auto">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-apaxhub to-apaxhubDark flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-appText">Built by Apaxhub</p>
                <p className="text-[10px] text-appMuted">Digital Solutions</p>
              </div>
            </div>
            <a
              href="https://apaxhub.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-xs font-medium text-apaxhubDark
                px-4 py-2 rounded-lg
                bg-gradient-to-r from-apaxhub/10 to-apaxhubDark/10
                hover:from-apaxhub/20 hover:to-apaxhubDark/20
                border border-apaxhub/30
                transition-all flex items-center gap-1.5
              "
            >
              View Portfolio
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
          <p className="text-[10px] text-appMuted text-center mt-4">
            Need a custom app for your business? Let's talk!
          </p>
          <div className="flex justify-center gap-3 mt-3">
            <a
              href="tel:+918401442160"
              className="
      text-xs font-semibold
      px-4 py-2 rounded-lg
      border border-appBorder
      hover:bg-appSurface
      transition
    "
            >
              Call Apaxhub
            </a>

            <a
              href="https://wa.me/918401442160?text=Hi%20Apaxhub,%20I%20need%20a%20custom%20app%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="
      text-xs font-semibold
      px-4 py-2 rounded-lg
      bg-green-500 text-black
      hover:opacity-90
      transition
    "
            >
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
