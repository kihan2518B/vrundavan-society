'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 w-full border-t border-appBorder bg-appSurface">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-glow">
            <Image src="/apaxhub_logo_dark.png" alt="A" width={24} height={24} />
          </div>

          <div className="leading-tight">
            <p className="text-sm flex font-semibold text-appText">
              Built with{'  '}
              <Image
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/refs/heads/master/Emojis/Smilies/Light%20Blue%20Heart.png"
                alt="Love"
                width={25}
                height={25}
              />{' '}
              by
              {'  '}Apaxhub
            </p>
            <p className="text-xs text-appMuted">Digital products for real-world problems</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <a
            href="https://apaxhub.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-4 py-2 rounded-lg text-sm font-medium
              border border-apaxhubDark/30
              text-apaxhubDark
              bg-apaxhub/10
              hover:bg-apaxhub/20
              transition
            "
          >
            View Portfolio
          </a>

          <a
            href="tel:+918401442160"
            className="
              px-4 py-2 rounded-lg text-sm font-medium
              border border-appPrimary/30
              text-appPrimary
              bg-appPrimaryLight
              hover:bg-appPrimary hover:text-white
              transition
            "
          >
            Call Us
          </a>

          <a
            href="https://wa.me/918401442160?text=Hi%20Apaxhub,%20I%20need%20a%20custom%20app%20for%20my%20business."
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-4 py-2 rounded-lg text-sm font-medium
              border border-success/30
              text-success
              bg-successLight
              hover:bg-success hover:text-white
              transition
            "
          >
            WhatsApp
          </a>
        </div>

        {/* Legal / Note */}
        <p className="text-[11px] text-appMuted text-center">
          Need a custom app for your society or business? Contact Apaxhub.
        </p>
      </div>
    </footer>
  );
}
