'use client';

import InstallPrompt from '@/components/InstallPrompt';
import { useDebounce } from '@/hooks/useDebounce';
import { Vehicle } from '@/types';
import { useEffect, useState } from 'react';

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
    if (!debouncedValue) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/vehicle?query=${normalize(debouncedValue)}`);
        if (!res.ok) return;

        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
      } catch {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  /* ---------------- Full Search ---------------- */
  async function handleSearch(s: string) {
    if (!online) {
      setError('Internet connection required');
      return;
    }

    const vehicleNumber = normalize(s);
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
    <div className="h-full bg-appBg flex flex-col">
      <main className="flex-1 pb-6">
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          <InstallPrompt />

          {/* Offline Banner */}
          {!online && (
            <div className="rounded-xl bg-warningLight border-l-4 border-warning p-4 flex items-start gap-3 shadow-card">
              <div className="w-5 h-5 rounded-full bg-warning flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <p className="font-semibold text-appText text-sm">You're offline</p>
                <p className="text-appMuted text-xs mt-0.5">Connect to search vehicles</p>
              </div>
            </div>
          )}

          {/* Search Card */}
          <div className="bg-appSurface rounded-2xl border border-appBorder shadow-card p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-appText">
                Enter Vehicle Number
              </label>

              <div className="relative">
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(value)}
                  placeholder="GJ01AB1234"
                  className="
                    w-full rounded-xl border-2 border-appBorder
                    px-5 py-4 text-lg font-bold uppercase tracking-wider
                    focus:border-appPrimary focus:ring-4 focus:ring-appPrimaryLight
                    outline-none transition bg-appBg
                    placeholder:text-appMuted/40 placeholder:font-normal
                  "
                />

                {loading && !result && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-3 border-appPrimary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-2 rounded-xl border border-appBorder bg-white shadow-cardHover overflow-hidden divide-y divide-appBorder">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSuggestions([]);
                        setValue(s);
                        handleSearch(s);
                      }}
                      className="w-full px-5 py-3 text-sm font-medium text-left cursor-pointer hover:bg-appPrimaryLight transition flex items-center justify-between group"
                    >
                      <span className="font-mono">{s}</span>
                      <span className="text-xs text-appMuted group-hover:text-appPrimary">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleSearch(value)}
              disabled={loading || !online}
              className="
                w-full py-4 rounded-xl bg-gradient-to-r from-appPrimary to-apaxhubDark 
                text-white font-bold text-base shadow-button
                hover:shadow-cardHover disabled:opacity-50 disabled:cursor-not-allowed
                transition-all active:scale-[0.98]
              "
            >
              {loading ? 'Searching...' : 'Search Vehicle Owner'}
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="rounded-xl bg-dangerLight border-l-4 border-danger p-4 shadow-card">
              <p className="font-bold text-appText flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-danger flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">✕</span>
                </span>
                Vehicle Not Found
              </p>
              <p className="text-appMuted text-sm mt-2 ml-7">
                Check the number or contact the society office
              </p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-3">
              {/* Owner Card */}
              <div className="rounded-2xl bg-gradient-to-br from-success to-success/90 p-6 text-white shadow-cardHover">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-90">
                      Vehicle Owner
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{result.ownerName}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>

                <div className="space-y-1 mb-4 bg-white/10 rounded-lg p-3">
                  <p className="text-sm opacity-90">
                    <span className="font-semibold font-mono text-base">
                      {result.vehicleNumber}
                    </span>
                  </p>
                  <p className="text-sm opacity-90">
                    Block {result.blockNumber} • Floor {result.floor}
                  </p>
                </div>

                <a
                  href={`tel:${result.ownerMobile}`}
                  className="
                    block text-center rounded-xl
                    bg-white text-success py-3.5 font-bold text-base
                    hover:bg-opacity-95 transition shadow-button
                    active:scale-[0.98]
                  "
                >
                  📞 Call Owner Now
                </a>
              </div>

              {/* Apartment Info */}
              <div className="rounded-xl bg-appSurface border border-appBorder p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-appPrimaryLight flex items-center justify-center">
                    <span className="text-xl">🏢</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-appMuted">Apartment</p>
                    <p className="font-bold text-appText">{result.apartmentName}</p>
                  </div>
                </div>
              </div>

              {/* Society Contacts */}
              <div className="rounded-xl bg-appSurface border border-appBorder p-5 shadow-card space-y-4">
                <p className="text-xs font-bold uppercase text-appMuted tracking-wider">
                  Society Contacts
                </p>

                <div className="flex items-center justify-between p-3 rounded-lg bg-appBg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-appPrimaryLight flex items-center justify-center">
                      <span className="text-lg">👨‍💼</span>
                    </div>
                    <div>
                      <p className="font-semibold text-appText text-sm">Pramukh</p>
                      <p className="text-xs text-appMuted">{result.pramukhName}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${result.pramukhMobile}`}
                    className="px-4 py-2 rounded-lg bg-appPrimary text-white text-sm font-semibold hover:bg-appPrimaryHover transition shadow-button"
                  >
                    Call
                  </a>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-appBg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-successLight flex items-center justify-center">
                      <span className="text-lg">👷</span>
                    </div>
                    <div>
                      <p className="font-semibold text-appText text-sm">Bahadur</p>
                      <p className="text-xs text-appMuted">{result.bahadurName}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${result.bahadurMobile}`}
                    className="px-4 py-2 rounded-lg bg-success text-white text-sm font-semibold hover:opacity-90 transition shadow-button"
                  >
                    Call
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
