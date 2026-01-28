import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/lib/queryprovider';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Noto_Sans_Gujarati } from 'next/font/google';

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

        <Footer />
      </body>
    </html>
  );
}
