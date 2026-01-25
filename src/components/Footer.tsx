// 'use client';

// import Image from 'next/image';

// export default function Footer() {
//   return (
//     <footer className="sticky bottom-0 w-full border-t border-appBorder bg-appSurface">
//       <div className="max-w-md mx-auto px-4 py-6 space-y-4">
//         {/* Branding */}
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-glow">
//             <Image src="/apaxhub_logo_dark.png" alt="A" width={24} height={24} />
//           </div>

//           <div className="leading-tight">
//             <p className="text-sm flex font-semibold text-appText">
//               Built with{'  '}
//               <Image src="/Blue Heart.png" alt="Love" width={25} height={25} /> by
//               {'  '}Apaxhub
//             </p>
//             <p className="text-xs text-appMuted">Digital products for real-world problems</p>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-wrap gap-2">
//           <Link
//             href="https://apaxhub.vercel.app"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="
//               px-4 py-2 rounded-lg text-sm font-medium
//               border border-apaxhubDark/30
//               text-apaxhubDark
//               bg-apaxhub/10
//               hover:bg-apaxhub/20
//               transition
//             "
//           >
//             View Portfolio
//           </Link>

//           <Link
//             href="tel:+918401442160"
//             className="
//               px-4 py-2 rounded-lg text-sm font-medium
//               border border-appPrimary/30
//               text-appPrimary
//               bg-appPrimaryLight
//               hover:bg-appPrimary hover:text-white
//               transition
//             "
//           >
//             Call Us
//           </Link>

//           <Link>
//             href="https://wa.me/918401442160?text=Hi%20Apaxhub,%20I%20need%20a%20custom%20app%20for%20my%20business."
//             target="_blank"
//             rel="noopener noreferrer"
//             className="
//               px-4 py-2 rounded-lg text-sm font-medium
//               border border-success/30
//               text-success
//               bg-successLight
//               hover:bg-success hover:text-white
//               transition
//             "
//           >
//             WhatsApp
//           </Link>
//         </div>

//         {/* Legal / Note */}
//         <p className="text-[11px] text-appMuted text-center">
//           Need a custom app for your society or business? Contact Apaxhub.
//         </p>
//       </div>
//     </footer>
//   );
// }

// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';

// export default function Footer() {
//   return (
//     <footer className="w-full border-t border-appBorder bg-appSurface">
//       <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-3">
//         {/* Branding */}
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-md flex items-center justify-center">
//             <Image src="/apaxhub_logo_dark.png" alt="Apaxhub" width={20} height={20} />
//           </div>

//           <div className="leading-tight">
//             <p className="text-xs font-semibold text-appText flex items-center gap-1">
//               Built with <Image src="/Blue Heart.png" alt="Love" width={25} height={25} /> by
//               Apaxhub
//             </p>
//             <p className="text-[11px] text-appMuted">Digital products for real-world problems</p>
//           </div>
//         </div>

//         {/* Icon Actions */}
//         <div className="flex items-center justify-center gap-3">
//           <Link
//             href="https://apaxhub.vercel.app"
//             target="_blank"
//             className="
//               w-9 h-9 rounded-full
//               flex items-center justify-center
//               bg-appBg hover:bg-appBorder
//               transition
//             "
//             aria-label="View Portfolio"
//           >
//             🌐
//           </Link>

//           <Link>
//             href="tel:+918401442160"
//             className="
//               w-9 h-9 rounded-full
//               flex items-center justify-center
//               bg-appBg hover:bg-appBorder
//               transition
//             "
//             aria-label="Call Apaxhub"
//           >
//             📞
//           </Link>

//           <Link>
//             href="https://wa.me/918401442160?text=Hi%20Apaxhub,%20I%20need%20a%20custom%20app%20for%20my%20business."
//             target="_blank"
//             rel="noopener noreferrer"
//             className="
//               w-9 h-9 rounded-full
//               flex items-center justify-center
//               bg-appBg hover:bg-appBorder
//               transition
//             "
//             aria-label="WhatsApp Apaxhub"
//           >
//             💬
//           </Link>
//         </div>

//         {/* Legal / Note */}
//         <p className="text-[10px] text-appMuted text-center">
//           Need a custom app for your society or business? Contact Apaxhub.
//         </p>
//       </div>
//     </footer>
//   );
// }
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Globe, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-appBorder bg-appSurface">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4">
        {/* IMPORTANT NOTE */}
        <div className="flex items-center justify-center gap-2 text-sm text-appText font-medium">
          <span>*ખાસ નોંધ*</span>
          <span className="text-appMuted">વૃંદાવન પાર્કના વોટ્સએપ ગૃપમા જોડાવાની લિંક</span>
          <Link
            href="https://chat.whatsapp.com/DmcmYC6MIEB9AgSzc4ii84"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join WhatsApp Group"
            className="text-success hover:scale-110 transition"
          >
            <Image
              src="/whatsapp_logo.png"
              width={200}
              height={200}
              alt="WhatsApp"
              className="w-8 h-8"
            />
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

                <div className="flex items-center gap-2 mt-2 text-sm text-appText">
                  <Link
                    href="tel:+919427250412"
                    className="hover:underline flex items-center gap-2"
                  >
                    <PhoneCall className="w-8 h-8" />
                    9427250412
                  </Link>
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
