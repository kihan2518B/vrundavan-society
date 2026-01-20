'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Vehicle = {
  vehicleNumber: string;
  ownerName: string;
  flatNumber: string;
  contactNumber: string;
  createdAt: string;
};

export default function HomePage() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState(true);

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
    <main className="min-h-screen bg-appBg flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        <Link href={'/admin'} className="bg-appSurface text-appText border border-appText">
          Society Admin
        </Link>

        {!online && (
          <p className="text-center text-xs text-appMuted">
            You’re offline. Connect to search vehicle owners.
          </p>
        )}

        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter vehicle number"
          className="
            w-full rounded-lg border border-appBorder
            bg-appSurface px-4 py-3 text-appText
            focus:outline-none focus:ring-2 focus:ring-primary
          "
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="
            w-full rounded-lg bg-primary text-black
            py-3 font-medium disabled:opacity-60
          "
        >
          {loading ? 'Searching…' : 'Search'}
        </button>

        {!loading && !result && !error && (
          <p className="text-center text-sm text-appMuted">
            Enter a vehicle number to find the owner
          </p>
        )}

        {error && (
          <div className="rounded-lg border border-appBorder bg-appSurface p-4">
            <p className="text-sm font-medium text-appText">Vehicle not found</p>
            <p className="mt-1 text-sm text-appMuted">
              Check the number or contact the society office for help.
            </p>
          </div>
        )}

        {result && (
          <div className="rounded-lg bg-appSurface border border-appBorder p-4 space-y-2">
            <p className="text-sm text-appMuted">Vehicle Owner</p>
            <p className="text-lg font-semibold text-appText">{result.ownerName}</p>
            <p className="text-sm text-appText">
              Flat / House: <span className="font-medium">{result.flatNumber}</span>
            </p>
            <button
              className="
                w-full rounded-md border border-primary
                text-sm font-medium text-appText
                py-2 hover:bg-primary/10
              "
            >
              Contact via Society Office
            </button>
          </div>
        )}

        <p className="text-center text-xs text-primary/70">Built by Apaxhub</p>
      </div>
    </main>
  );
}
