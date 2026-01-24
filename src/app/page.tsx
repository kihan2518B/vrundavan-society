'use client';

import { useDebounce } from '@/hooks/useDebounce';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

type Vehicle = {
  vehicleNumber: string;
  ownerName: string;
  flatNumber: string;
  contactNumber: string;
  createdAt: string;
};
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function InstallPrompt() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  const [canInstall, setCanInstall] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('pwa-install-dismissed') === 'true';
  });

  const handleBeforeInstallPrompt = useCallback((event: Event) => {
    const promptEvent = event as BeforeInstallPromptEvent;
    promptEvent.preventDefault();
    deferredPrompt.current = promptEvent;
    setCanInstall(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || dismissed) return;

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, [handleBeforeInstallPrompt, dismissed]);

  async function install() {
    if (!deferredPrompt.current) return;

    await deferredPrompt.current.prompt();
    deferredPrompt.current = null;
    setCanInstall(false);
  }

  function dismiss() {
    setCanInstall(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  }

  if (!canInstall || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-appPrimaryLight to-apaxhub/10 border border-appPrimary/30 rounded-lg p-4 shadow-card">
      <div className="flex items-start gap-3">
        {/* App Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-apaxhub to-apaxhubDark flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-appText mb-1">Install Vehicle Finder App</h3>
          <p className="text-xs text-appMuted mb-3">
            Get quick access from your home screen. No app store needed!
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={install}
              className="
                flex items-center gap-1.5 px-4 py-2 rounded-lg
                bg-appPrimary text-white
                text-xs font-semibold
                hover:bg-appPrimaryHover
                shadow-button transition-all
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Install Now
            </button>

            <button
              onClick={dismiss}
              className="
                px-3 py-2 rounded-lg
                bg-white text-appMuted
                text-xs font-medium
                hover:bg-appBg hover:text-appText
                transition-all
              "
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={dismiss}
          className="flex-shrink-0 w-6 h-6 rounded-md hover:bg-white/50 transition-colors flex items-center justify-center"
          aria-label="Dismiss"
        >
          <svg
            className="w-4 h-4 text-appMuted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Vehicle | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState(true);

  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  function normalize(input: string) {
    return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedValue) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      setError(null);
      setSuggestions([]);

      try {
        const res = await fetch(`/api/vehicle?query=${normalize(debouncedValue)}`);
        if (!res.ok) {
          setError('Vehicle not found');
          return;
        }

        const data = await res.json();
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error(error);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedValue]);

  async function handleSearch() {
    if (!online) {
      setError('Search requires internet connection');
      return;
    }

    const vehicleNumber = normalize(value);
    if (vehicleNumber.length < 6) {
      setError('Enter a valid vehicle number');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/vehicle?number=${vehicleNumber}`);
      if (!res.ok) {
        setError('Vehicle not found');
        return;
      }

      const data = await res.json();
      setResult(data.data);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-appBg flex flex-col">
      {/* Header with Apaxhub Branding */}
      <header className="bg-appSurface border-b border-appBorder shadow-card">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-appText">Vehicle Pehchan</h1>
            <p className="text-xs text-appMuted">Find wrongly parked vehicle owners</p>
          </div>
          <Link
            href="/admin"
            className="text-xs bg-appPrimaryLight text-appPrimary px-3 py-1.5 rounded-md font-medium hover:bg-appPrimary hover:text-white transition-colors"
          >
            Manage Vehicles
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-5">
          {/* Install App Prompt */}
          <InstallPrompt />

          {/* Offline Warning */}
          {!online && (
            <div className="bg-warningLight border border-warning rounded-lg p-3 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-warning flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-appText">You're offline</p>
                <p className="text-xs text-appMuted mt-0.5">
                  Connect to internet to search vehicle owners
                </p>
              </div>
            </div>
          )}

          {/* Search Card */}
          <div className="bg-appSurface rounded-xl border border-appBorder shadow-card p-6 space-y-4">
            <div>
              <label
                htmlFor="vehicle-input"
                className="block text-sm font-medium text-appText mb-2"
              >
                Enter Vehicle Number
              </label>
              <input
                id="vehicle-input"
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., GJ01AB1234"
                className="
                  w-full rounded-lg border-2 border-appBorder
                  bg-white px-4 py-3.5 text-appText text-lg font-medium
                  placeholder:text-appMuted placeholder:font-normal
                  focus:outline-none focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                  transition-all uppercase
                "
              />
              {suggestions.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-y-auto border border-appBorder rounded-lg bg-white shadow-sm">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion}
                      onClick={() => setValue(suggestion)}
                      className="
                        px-4 py-2 hover:bg-appPrimaryLight/50
                        cursor-pointer text-appText text-sm
                      "
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-appMuted mt-2">
                Enter the full vehicle registration number
              </p>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !online}
              className="
                w-full rounded-lg bg-appPrimary text-white
                py-3.5 font-semibold text-base
                hover:bg-appPrimaryHover active:scale-98
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-button transition-all
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
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
                  Searching...
                </span>
              ) : (
                'Search Vehicle Owner'
              )}
            </button>
          </div>

          {/* Initial State */}
          {!loading && !result && !error && (
            <div className="text-center bg-appSurface rounded-lg border border-appBorder p-6">
              <svg
                className="w-16 h-16 text-appMuted mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm font-medium text-appText">Find Vehicle Owner</p>
              <p className="text-xs text-appMuted mt-1">
                Enter a vehicle number above to contact the owner
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-dangerLight border border-danger rounded-lg p-4">
              <div className="flex items-start gap-3">
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
                <div>
                  <p className="text-sm font-semibold text-appText">Vehicle Not Found</p>
                  <p className="text-xs text-appMuted mt-1">
                    Double-check the number or contact the society office for assistance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {result && (
            <div className="bg-successLight border border-success rounded-lg p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-success uppercase tracking-wide">
                    Owner Found
                  </p>
                  <h3 className="text-xl font-bold text-appText mt-1">{result.ownerName}</h3>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-2.5">
                <div className="flex items-center gap-3">
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <div>
                    <p className="text-xs text-appMuted">Flat / House Number</p>
                    <p className="text-base font-semibold text-appText">{result.flatNumber}</p>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${result.contactNumber}`}
                className="
                  block w-full rounded-lg border-2 border-appPrimary
                  bg-white text-appPrimary text-center
                  py-3 font-semibold text-sm
                  hover:bg-appPrimary hover:text-white
                  transition-all
                "
              >
                Contact via Phone
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Apaxhub Branding */}
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
    </main>
  );
}
