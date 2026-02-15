import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/lib/queryprovider';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Noto_Sans_Gujarati } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
const gujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Vrundavan Park',
  description: 'Search for vehicle owners in your society quickly and easily.',
  generator: 'v0.dev',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#fff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vrundavan Park" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-3C7CTSN78G"></Script>
        <Script id="google-analytics">
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-3C7CTSN78G');`}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vfs6w2y8y2");
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gujarati.className}
        antialiased bg-appBg text-appText min-h-screen flex flex-col`}
      >
        <Navbar />

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full">
          <Providers>{children}</Providers>
        </main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
