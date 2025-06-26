import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from '@/contexts/LanguageContext';
import ClientLayout from '@/components/ClientLayout';

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
      <head>
        <script 
          defer 
          src="https://cloud.umami.is/script.js" 
          data-website-id="e0345360-55ba-4889-83ff-29e41e7086d2"
        ></script>
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
