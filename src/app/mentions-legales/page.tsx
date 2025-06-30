'use client';

import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Mail, Calendar, Building, User, Globe, FileText, Phone, MapPin } from 'lucide-react';

export default function MentionsLegalesPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Skip to main content link pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:ring-2 focus:ring-blue-300"
      >
        Aller au contenu principal
      </a>

      {/* Topbar Navigation */}
      <TopBar />

      {/* Main Content */}
      <main id="main-content" className="relative z-10">
        {/* Header */}
        <header className="text-center px-6 pt-16 pb-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <FileText className="w-12 h-12 text-blue-600 mr-4" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-gray-900">
              Mentions Légales
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Informations légales et réglementaires concernant RGAA Audit, votre outil d'audit d'accessibilité numérique.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>Dernière mise à jour : 16 juin 2025</span>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            
            {/* Section 1 - Identification */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Building className="w-6 h-6 text-blue-600 mr-3" />
                1. Identification de l'éditeur
              </h2>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Informations personnelles
                    </h3>
                    <div className="space-y-2 text-blue-700">
                      <p><strong>Nom :</strong> Loïc Bernard</p>
                      <p><strong>Qualité :</strong> Développeur et éditeur du site</p>
                      <p><strong>Statut :</strong> Entrepreneur individuel</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Contact
                    </h3>
                    <div className="space-y-2 text-blue-700">
                      <p><strong>Email :</strong> <a href="mailto:hello@loicbernard.com" className="text-blue-600 hover:underline focus:underline focus:outline-none">hello@loicbernard.com</a></p>
                      <p><strong>Site web :</strong> <a href="https://rgaa-audit.com" className="text-blue-600 hover:underline focus:underline focus:outline-none">rgaa-audit.com</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 - Hébergement */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="w-6 h-6 text-green-600 mr-3" />
                2. Hébergement du site
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Informations d'hébergement</h3>
                <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                    <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                  </div>
                  <div>
                    <p><strong>Site web :</strong> <a href="https://vercel.com" className="text-blue-600 hover:underline focus:underline focus:outline-none" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
                    <p><strong>Type :</strong> Hébergement cloud sécurisé</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 - Propriété intellectuelle */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-purple-600 mr-3" />
                3. Propriété intellectuelle
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Droits d'auteur</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    L'ensemble de ce site web, incluant mais sans s'y limiter : les textes, images, graphiques, logos, icônes, 
                    sons, logiciels, et leur mise en forme, sont la propriété exclusive de Loïc Bernard, sauf mention contraire.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-800 text-sm">
                      <strong>© 2025 Loïc Bernard - Tous droits réservés</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Utilisation autorisée</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• <strong>Usage personnel :</strong> Consultation et utilisation du service d'audit</li>
                    <li>• <strong>Citation :</strong> Reproduction de courts extraits avec mention de la source</li>
                    <li>• <strong>Partage :</strong> Partage des liens vers les articles du blog</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Interdictions</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• <strong>Reproduction :</strong> Copie intégrale ou partielle sans autorisation</li>
                    <li>• <strong>Modification :</strong> Altération du contenu ou des fonctionnalités</li>
                    <li>• <strong>Distribution :</strong> Rediffusion commerciale sans accord préalable</li>
                    <li>• <strong>Ingénierie inverse :</strong> Tentative d'extraction du code source</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 - Responsabilité */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-yellow-600 mr-3" />
                4. Limitation de responsabilité
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Utilisation du service</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    RGAA Audit est fourni "en l'état" et "selon disponibilité". L'éditeur s'efforce de maintenir la disponibilité 
                    et la précision du service, mais ne peut garantir :
                  </p>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• L'absence d'interruptions ou d'erreurs</li>
                    <li>• L'exactitude absolue des résultats d'audit</li>
                    <li>• La compatibilité avec tous les environnements</li>
                    <li>• La disponibilité permanente du service</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Responsabilité de l'utilisateur</h3>
                  <p className="text-gray-700 leading-relaxed">
                    L'utilisateur est seul responsable de l'utilisation qu'il fait du service et des décisions prises 
                    sur la base des résultats d'audit. Il appartient à l'utilisateur de vérifier et valider 
                    les recommandations avant leur mise en œuvre.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 - Données et cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-green-600 mr-3" />
                5. Protection des données personnelles
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  RGAA Audit respecte votre vie privée et la réglementation en vigueur concernant la protection des données personnelles, 
                  notamment le Règlement Général sur la Protection des Données (RGPD).
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
                  <div>
                    <p><strong>Pour plus d'informations :</strong></p>
                    <ul className="mt-2 space-y-1">
                      <li>• <a href="/rgpd" className="text-blue-600 hover:underline focus:underline focus:outline-none">Politique RGPD</a></li>
                      <li>• <a href="/politique-confidentialite" className="text-blue-600 hover:underline focus:underline focus:outline-none">Politique de confidentialité</a></li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Vos droits :</strong></p>
                    <ul className="mt-2 space-y-1">
                      <li>• Accès à vos données</li>
                      <li>• Rectification et suppression</li>
                      <li>• Opposition au traitement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 - Accessibilité */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                6. Accessibilité numérique
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Notre engagement</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ce site est conçu dans le respect des règles 
                  d'accessibilité numérique. Nous nous efforçons de respecter les critères RGAA 4.1.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-800 text-sm">
                    <strong>Signaler un problème d'accessibilité :</strong> Si vous rencontrez des difficultés d'accès à une partie du site, 
                    contactez-nous à <a href="mailto:hello@loicbernard.com" className="text-blue-600 hover:underline focus:underline focus:outline-none">hello@loicbernard.com</a>
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 - Loi applicable */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 text-gray-600 mr-3" />
                7. Loi applicable et juridiction
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Droit applicable</h3>
                    <p className="text-gray-700 text-sm">
                      Les présentes mentions légales et l'utilisation du site RGAA Audit sont régies par le droit français.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Règlement des litiges</h3>
                    <p className="text-gray-700 text-sm">
                      En cas de litige, nous privilégions une résolution amiable. À défaut, les tribunaux français seront compétents.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 - Modifications */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-6 h-6 text-purple-600 mr-3" />
                8. Modifications des mentions légales
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  Ces mentions légales peuvent être modifiées à tout moment pour refléter les évolutions légales, 
                  réglementaires ou techniques. La version en vigueur est celle publiée sur cette page avec indication 
                  de la date de dernière mise à jour.
                </p>
              </div>
            </section>

            {/* Contact */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <Mail className="w-8 h-8 mx-auto mb-4 text-gray-600" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Questions juridiques ?</h3>
              <p className="mb-4 text-gray-700">
                Pour toute question concernant ces mentions légales ou l'utilisation de RGAA Audit, n'hésitez pas à nous contacter.
              </p>
              <a 
                href="mailto:hello@loicbernard.com" 
                className="inline-flex items-center bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 focus:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
} 