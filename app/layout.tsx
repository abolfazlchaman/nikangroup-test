import type { Metadata } from 'next';
import { Providers } from './providers';
import { Header } from './components/header';
import './globals.css';
import { Roboto } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Nikan Group Test | Abolfazl Chaman',
  description: 'A test project for Nikan Group by Abolfazl Chaman',
  robots: {
    index: false,
    follow: false,
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
          <Header />
          <main className='container mx-auto px-4 py-8'>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
