// 'use client';
// import { useCallback, useEffect, useRef, useState } from 'react';

// interface BeforeInstallPromptEvent extends Event {
//   prompt: () => Promise<void>;
//   userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
// }

// export default function InstallPrompt() {
//   const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

//   const [canInstall, setCanInstall] = useState(false);
//   const [dismissed, setDismissed] = useState(() => {
//     if (typeof window === 'undefined') return false;
//     return localStorage.getItem('pwa-install-dismissed') === 'true';
//   });

//   const handleBeforeInstallPrompt = useCallback((event: Event) => {
//     const promptEvent = event as BeforeInstallPromptEvent;
//     promptEvent.preventDefault();
//     deferredPrompt.current = promptEvent;
//     setCanInstall(true);
//   }, []);

//   useEffect(() => {
//     if (typeof window === 'undefined' || dismissed) return;

//     window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
//     return () => {
//       window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
//     };
//   }, [handleBeforeInstallPrompt, dismissed]);

//   async function install() {
//     if (!deferredPrompt.current) return;

//     await deferredPrompt.current.prompt();
//     deferredPrompt.current = null;
//     setCanInstall(false);
//   }

//   function dismiss() {
//     setCanInstall(false);
//     setDismissed(true);
//     localStorage.setItem('pwa-install-dismissed', 'true');
//   }

//   if (!canInstall || dismissed) return null;

//   return (
//     <div className="bg-gradient-to-r from-appPrimaryLight to-apaxhub/10 border border-appPrimary/30 rounded-lg p-4 shadow-card">
//       <div className="flex items-start gap-3">
//         {/* App Icon */}
//         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-apaxhub to-apaxhubDark flex items-center justify-center flex-shrink-0 shadow-sm">
//           <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
//             />
//           </svg>
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           <h3 className="text-sm font-semibold text-appText mb-1">Install Vehicle Finder App</h3>
//           <p className="text-xs text-appMuted mb-3">
//             Get quick access from your home screen. No app store needed!
//           </p>

//           {/* Action Buttons */}
//           <div className="flex gap-2">
//             <button
//               onClick={install}
//               className="
//                 flex items-center gap-1.5 px-4 py-2 rounded-lg
//                 bg-appPrimary text-white
//                 text-xs font-semibold
//                 hover:bg-appPrimaryHover
//                 shadow-button transition-all
//               "
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                 />
//               </svg>
//               Install Now
//             </button>

//             <button
//               onClick={dismiss}
//               className="
//                 px-3 py-2 rounded-lg
//                 bg-white text-appMuted
//                 text-xs font-medium
//                 hover:bg-appBg hover:text-appText
//                 transition-all
//               "
//             >
//               Maybe Later
//             </button>
//           </div>
//         </div>

//         {/* Close Button */}
//         <button
//           onClick={dismiss}
//           className="flex-shrink-0 w-6 h-6 rounded-md hover:bg-white/50 transition-colors flex items-center justify-center"
//           aria-label="Dismiss"
//         >
//           <svg
//             className="w-4 h-4 text-appMuted"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// }
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  const nav = navigator as NavigatorStandalone;
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
}

export default function InstallPrompt() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  const [hasBIPEvent, setHasBIPEvent] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('pwa-install-dismissed') === 'true';
  });

  const isIOSDevice = useMemo(() => {
    return isIOS() && isSafari() && !isInStandaloneMode();
  }, []);

  const canInstall = useMemo(() => {
    if (dismissed) return false;
    if (isIOSDevice) return true;
    return hasBIPEvent;
  }, [dismissed, isIOSDevice, hasBIPEvent]);

  const handleBeforeInstallPrompt = useCallback((event: Event) => {
    const promptEvent = event as BeforeInstallPromptEvent;
    promptEvent.preventDefault();
    deferredPrompt.current = promptEvent;
    setHasBIPEvent(true); // ✅ allowed (event callback)
  }, []);

  useEffect(() => {
    if (dismissed || isIOSDevice) return;

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, [dismissed, isIOSDevice, handleBeforeInstallPrompt]);

  async function install() {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    deferredPrompt.current = null;
  }

  function dismiss() {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  }

  if (!canInstall) return null;

  return (
    <div className="bg-gradient-to-r from-appPrimaryLight to-apaxhub/10 border border-appPrimary/30 rounded-lg p-4 shadow-card">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-apaxhub to-apaxhubDark flex items-center justify-center">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-appText mb-1">Install Vehicle Finder App</h3>

          {isIOSDevice ? (
            <p className="text-xs text-appMuted mb-3">Safari → Share ⬆ → Add to Home Screen</p>
          ) : (
            <p className="text-xs text-appMuted mb-3">
              Get quick access from your home screen. No app store needed!
            </p>
          )}

          <div className="flex gap-2">
            {!isIOSDevice && (
              <button
                onClick={install}
                className="px-4 py-2 rounded-lg bg-appPrimary text-white text-xs font-semibold"
              >
                Install Now
              </button>
            )}

            <button
              onClick={dismiss}
              className="px-3 py-2 rounded-lg bg-white text-appMuted text-xs"
            >
              {isIOSDevice ? 'Got it' : 'Maybe Later'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
