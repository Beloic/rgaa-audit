import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from '@/contexts/LanguageContext';

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
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
