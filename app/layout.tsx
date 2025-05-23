import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import './globals.css';
import { Roboto } from 'next/font/google';
import Navbar from '@/app/components/Navbar';
import { Footer } from './components/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'Nikan Group Test | Abolfazl Chaman',
  description: 'A test project for Nikan Group by Abolfazl Chaman',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nikan Group Test',
  },
};

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={roboto.variable}>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <Providers>
          <Navbar />
          <main className='container mx-auto px-4 py-8'>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
