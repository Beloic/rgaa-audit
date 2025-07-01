'use client';

import { Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">RGAA Audit</span>
            </div>
            <p className="text-sm leading-6 text-gray-300">
              {language === 'fr' 
                ? "Outil d'audit d'accessibilité conçu pour un web plus inclusif et conforme aux standards RGAA."
                : "Accessibility audit tool designed for a more inclusive and RGAA-compliant web."
              }
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  {language === 'fr' ? 'Ressources' : 'Resources'}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a 
                      href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      RGAA 4.1
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://design.numerique.gouv.fr/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      Design System FR
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://accessibilite.public.lu/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      AccessiLux
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Navigation</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a href="/blog" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/tarifs" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Tarifs
                    </a>
                  </li>
                  <li>
                    <a href="/quiz" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Quiz
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  {language === 'fr' ? 'Légal' : 'Legal'}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a href="/politique-confidentialite" className="text-sm leading-6 text-gray-300 hover:text-white">
                      {language === 'fr' ? 'Politique de confidentialité' : 'Privacy policy'}
                    </a>
                  </li>
                  <li>
                    <a href="/mentions-legales" className="text-sm leading-6 text-gray-300 hover:text-white">
                      {language === 'fr' ? 'Mentions légales' : 'Legal notice'}
                    </a>
                  </li>
                  <li>
                    <a href="/rgpd" className="text-sm leading-6 text-gray-300 hover:text-white">
                      RGPD
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            &copy; 2025 RGAA Audit. {language === 'fr' 
              ? "Développé pour améliorer l'accessibilité numérique."
              : "Developed to improve digital accessibility."
            }
          </p>
        </div>
      </div>
    </footer>
  );
} 