import './globals.css';
import React from 'react';
import ForceDark from './ForceDark';
import dynamic from 'next/dynamic';
const LeftRail = dynamic(() => import('./components/LeftRail'), { ssr: false });
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'CollabAzure',
  description: 'DMS + E-sign + Chat',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.classList.add('dark');
                (function(){
                  var rerun = sessionStorage.getItem('sw_cleared');
                  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(regs){
                      if (regs && regs.length) {
                        Promise.all(regs.map(function(r){ return r.unregister(); })).then(function(){
                          if (!rerun) { sessionStorage.setItem('sw_cleared','1'); location.reload(); }
                        });
                      }
                    });
                  }
                  if (typeof window !== 'undefined' && 'caches' in window) {
                    caches.keys().then(function(keys){ return Promise.all(keys.map(function(k){ return caches.delete(k); })); });
                  }
                })();
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-gray-900 text-gray-100">
        <ForceDark />
        <LeftRail />
        <div className="pl-20">{children}</div>
      </body>
    </html>
  );
}
