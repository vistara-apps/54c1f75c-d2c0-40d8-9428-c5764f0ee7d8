import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GigFlow - Your streamlined path to freelance success',
  description: 'A Base MiniApp that matches freelancers with gigs based on skills and availability, automating the discovery and application process.',
  keywords: ['freelance', 'gigs', 'jobs', 'base', 'miniapp', 'blockchain'],
  authors: [{ name: 'GigFlow Team' }],
  openGraph: {
    title: 'GigFlow - Your streamlined path to freelance success',
    description: 'Automated gig matching for freelancers on Base',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
