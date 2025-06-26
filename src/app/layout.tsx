import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from '@/contexts/LanguageContext';
import ClientLayout from '@/components/ClientLayout';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "RGAA Audit - Testez l'accessibilité de votre site",
  description: "Outil d'audit d'accessibilité RGAA gratuit et intelligent. Rendez votre site web plus inclusif. Testez la conformité RGAA de votre site web instantanément.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head></head>
      <body className="antialiased">
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
