'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import BetaProtection from '@/components/BetaProtection';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { language, t } = useLanguage();

  // Mise à jour des métadonnées selon la langue
  useEffect(() => {
    // Mise à jour du titre de la page
    document.title = t('meta.title');
    
    // Mise à jour de la description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta.description'));
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = t('meta.description');
      document.head.appendChild(newMetaDescription);
    }

    // Mise à jour de la langue du document
    document.documentElement.lang = language === 'fr' ? 'fr' : 'en';
  }, [language, t]);

  return (
    <BetaProtection>
      <EmailVerificationBanner />
      {children}
    </BetaProtection>
  );
} 