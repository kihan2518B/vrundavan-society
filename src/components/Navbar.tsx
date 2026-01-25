'use client';
import { Info, Menu, Settings, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="bg-appSurface border-b border-appBorder sticky top-0 z-50 shadow-card">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <Link href={'/'}>
            <div className="w-10 h-10  flex items-center justify-center shadow-button">
                <Image
                  className="h-full w-full rounded-xl"
                  src="/vrundavan_park_logo.png"
                  alt="VP"
                  width={2000}
                  height={2000}
                />
            </div>
              </Link>
            <div>
              <h1 className="text-base font-bold text-appText leading-tight">Vrundavan Park</h1>
              <p className="text-[10px] text-appMuted leading-tight">
                Find vehicle owners instantly
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-lg bg-appPrimaryLight text-appPrimary flex items-center justify-center hover:bg-appPrimary hover:text-white transition"
            aria-label="Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="bg-appSurface border-t border-appBorder shadow-cardHover">
            <nav className="max-w-md mx-auto px-4 py-3 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-appPrimaryLight text-appText hover:text-appPrimary transition group"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} className="text-appMuted group-hover:text-appPrimary" />
                <span className="font-medium text-sm">Home</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-appPrimaryLight text-appText hover:text-appPrimary transition group"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} className="text-appMuted group-hover:text-appPrimary" />
                <span className="font-medium text-sm">Admin Panel</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-appPrimaryLight text-appText hover:text-appPrimary transition group"
                onClick={() => setIsOpen(false)}
              >
                <Info size={18} className="text-appMuted group-hover:text-appPrimary" />
                <span className="font-medium text-sm">About Us</span>
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
