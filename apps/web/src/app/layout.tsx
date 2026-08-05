import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/providers/app-providers';
import { SelloraFooter, SelloraHeader, SelloraTopBar, StorefrontFooter, StorefrontHeader } from '@/components/layout';
import { StorefrontHero } from '@/components/home';

export const metadata: Metadata = {
  title: 'Sellora — Modern E-Commerce Destination in Bangladesh',
  description: 'Your trusted online shopping destination for electronics, fashion, lifestyle, and home appliances.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+Bengali:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-brand-primary selection:text-white">
        <AppProviders>
          <StorefrontHeader />
          {children}
          <StorefrontFooter />
        </AppProviders>
      </body>
    </html>
  );
}
