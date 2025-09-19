import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dispatchar - Trucking & Logistics Collaboration Platform',
  description:
    'Revolutionary collaboration platform for trucking and logistics. Streamline operations with geofence check-ins, paperless document management, and instant communication.',
  keywords:
    'trucking, logistics, collaboration, dispatch, geofence, document management, fleet management',
  authors: [{ name: 'Dispatchar Team' }],
  openGraph: {
    title: 'Dispatchar - Trucking & Logistics Collaboration Platform',
    description:
      'Revolutionary collaboration platform for trucking and logistics.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dispatchar - Trucking & Logistics Collaboration Platform',
    description:
      'Revolutionary collaboration platform for trucking and logistics.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} min-h-screen text-gray-100 bg-black bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 pt-16 md:pt-20`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
