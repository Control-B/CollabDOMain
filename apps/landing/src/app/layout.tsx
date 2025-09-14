import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dispatch - Trucking & Logistics Collaboration Platform',
  description:
    'Revolutionary collaboration platform for trucking and logistics. Streamline operations with geofence check-ins, paperless document management, and instant communication.',
  keywords:
    'trucking, logistics, collaboration, dispatch, geofence, document management, fleet management',
  authors: [{ name: 'Dispatch Team' }],
  openGraph: {
    title: 'Dispatch - Trucking & Logistics Collaboration Platform',
    description:
      'Revolutionary collaboration platform for trucking and logistics.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dispatch - Trucking & Logistics Collaboration Platform',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
