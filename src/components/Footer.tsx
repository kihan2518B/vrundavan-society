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
//           <a
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
//           </a>

//           <a
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
//           </a>

//           <a
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
//           </a>
//         </div>

//         {/* Legal / Note */}
//         <p className="text-[11px] text-appMuted text-center">
//           Need a custom app for your society or business? Contact Apaxhub.
//         </p>
//       </div>
//     </footer>
//   );
// }

'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 w-full border-t border-appBorder bg-appSurface">
      <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-3">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md flex items-center justify-center">
            <Image src="/apaxhub_logo_dark.png" alt="Apaxhub" width={20} height={20} />
          </div>

          <div className="leading-tight">
            <p className="text-xs font-semibold text-appText flex items-center gap-1">
              Built with <Image src="/Blue Heart.png" alt="Love" width={25} height={25} /> by
              Apaxhub
            </p>
            <p className="text-[11px] text-appMuted">Digital products for real-world problems</p>
          </div>
        </div>

        {/* Icon Actions */}
        <div className="flex items-center justify-center gap-3">
          <Link
            href="https://apaxhub.vercel.app"
            target="_blank"
            className="
              w-9 h-9 rounded-full
              flex items-center justify-center
              bg-appBg hover:bg-appBorder
              transition
            "
            aria-label="View Portfolio"
          >
            🌐
          </Link>

          <a
            href="tel:+918401442160"
            className="
              w-9 h-9 rounded-full
              flex items-center justify-center
              bg-appBg hover:bg-appBorder
              transition
            "
            aria-label="Call Apaxhub"
          >
            📞
          </a>

          <a
            href="https://wa.me/918401442160?text=Hi%20Apaxhub,%20I%20need%20a%20custom%20app%20for%20my%20business."
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-9 h-9 rounded-full
              flex items-center justify-center
              bg-appBg hover:bg-appBorder
              transition
            "
            aria-label="WhatsApp Apaxhub"
          >
            💬
          </a>
        </div>

        {/* Legal / Note */}
        <p className="text-[10px] text-appMuted text-center">
          Need a custom app for your society or business? Contact Apaxhub.
        </p>
      </div>
    </footer>
  );
}
