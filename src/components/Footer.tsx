'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Globe, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-appBorder bg-appSurface">
      <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col gap-4">
        {/* IMPORTANT NOTE */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-appText">
          <span>*ખાસ નોંધ*</span>
          <span className="text-appMuted text-center">
            વૃંદાવન પાર્કના વોટ્સએપ ગૃપમા જોડાવાની લિંક
          </span>
          <Link
            href="https://chat.whatsapp.com/DmcmYC6MIEB9AgSzc4ii84"
            target="_blank"
            className="hover:scale-105 transition"
            aria-label="Join WhatsApp Group"
          >
            <Image src="/whatsapp_logo.png" alt="WhatsApp" width={24} height={24} />
          </Link>
        </div>

        {/* PROMOTION CARDS */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* APAXHUB CARD */}
          <div className="flex-1 border border-appBorder rounded-xl p-4 flex gap-3 items-start">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center">
              <Image src="/apaxhub_logo_dark.png" alt="Apaxhub" width={22} height={22} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-appText flex items-center gap-1">
                Built with ❤️ by Apaxhub
              </p>
              <p className="text-sm text-appMuted mt-0.5 font-[\'Noto Sans Gujarati\',sans-serif]">
                પ્રીમિયમ વેબસાઇટ્સ • કસ્ટમ સોફ્ટવેર • બિઝનેસ ઓટોમેશન
              </p>

              {/* ICON ACTIONS */}
              <div className="flex items-center gap-3 mt-2">
                <Link
                  href="https://apaxhub.vercel.app"
                  target="_blank"
                  aria-label="Apaxhub Website"
                  className="text-appMuted hover:text-appPrimary transition"
                >
                  <Globe className="w-8 h-8" />
                </Link>

                <Link
                  href="tel:+918401442160"
                  suppressHydrationWarning
                  aria-label="Call Apaxhub"
                  className="text-appMuted hover:text-appPrimary transition"
                >
                  <PhoneCall className="w-8 h-8" />
                </Link>

                <Link
                  href="https://wa.me/918401442160?text=Hi%20Apaxhub,%20I%20need%20a%20custom%20app%20for%20my%20business."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Apaxhub"
                  className="text-appMuted hover:text-success transition flex items-center gap-2"
                >
                  <Image
                    src={'/whatsapp_logo.png'}
                    alt="W"
                    height={200}
                    width={200}
                    className="w-10 h-10"
                  />
                  8401442160
                </Link>
              </div>
            </div>
          </div>

          {/* SHIV BATTERY ZONE CARD */}
          <Link
            href="https://share.google/2JPngVz5HFA8lbE1i"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex-1 border border-appBorder rounded-xl p-4
              hover:bg-appBg transition
            "
          >
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                <Image
                  src="/shivbatteryzone_logo.png"
                  alt="Shiv Battery Zone"
                  width={22}
                  height={22}
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-appText">Shiv Battery Zone</p>
                <p className="text-sm text-appMuted leading-snug mt-0.5 font-[\'Noto Sans Gujarati\',sans-serif]">
                  દરેક પ્રકારની બેટરી & ઇનવટૅર મળશે.
                  <br />
                  બાઈક & કારના વીમા કરી આપવામા આવશે
                </p>

                <div className="flex items-center gap-2 mt-2 text-appMuted">
                  <Link
                    href="tel:+919427250412"
                    suppressHydrationWarning
                    aria-label="Call Apaxhub"
                    className="text-appMuted hover:text-appPrimary transition"
                  >
                    <PhoneCall className="w-8 h-8" />
                  </Link>
                  <Link
                    href="https://wa.me/919427250412"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp Apaxhub"
                    className="text-appText hover:text-success transition flex items-center gap-2"
                  >
                    <Image
                      src={'/whatsapp_logo.png'}
                      alt="W"
                      height={200}
                      width={200}
                      className="w-10 h-10"
                    />
                  </Link>
                  9427250412
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-[10px] text-appMuted text-center">
          Need a custom app for your society or business? Contact Apaxhub.
        </p>
      </div>
    </footer>
  );
}
