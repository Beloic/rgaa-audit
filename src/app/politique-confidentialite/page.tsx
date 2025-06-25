'use client';

import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Mail, Calendar, Cookie, Eye, Globe, Lock, Users, Settings } from 'lucide-react';

export default function PolitiqueConfidentialitePage() {
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
            <Shield className="w-12 h-12 text-green-600 mr-4" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-gray-900">
              Politique de Confidentialité
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment RGAA Audit protège votre vie privée et utilise vos informations pour améliorer votre expérience d'audit d'accessibilité.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>Dernière mise à jour : 16 juin 2025</span>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            
            {/* Introduction */}
            <section className="mb-12">
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <h2 className="text-xl font-bold text-green-800 mb-3">Notre engagement</h2>
                <p className="text-green-700 leading-relaxed">
                  Chez RGAA Audit, nous nous engageons à protéger votre vie privée et à être transparents sur la façon dont nous collectons, 
                  utilisons et protégeons vos informations. Cette politique explique nos pratiques en matière de confidentialité.
                </p>
              </div>
            </section>

            {/* Section 1 - Collecte d'informations */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="w-6 h-6 text-blue-600 mr-3" />
                1. Informations que nous collectons
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Informations collectées automatiquement
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• <strong>Données de navigation :</strong> Pages visitées, temps passé, actions effectuées</li>
                    <li>• <strong>Informations techniques :</strong> Adresse IP, navigateur, système d'exploitation</li>
                    <li>• <strong>Données d'utilisation :</strong> Fréquence d'utilisation, fonctionnalités utilisées</li>
                    <li>• <strong>Cookies :</strong> Préférences utilisateur, état de session</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Informations que vous nous fournissez
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• <strong>URLs d'audit :</strong> Adresses des sites web que vous souhaitez analyser</li>
                    <li>• <strong>Paramètres de préférence :</strong> Langue, options d'affichage</li>
                    <li>• <strong>Communications :</strong> Messages envoyés via le formulaire de contact</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 - Utilisation des informations */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="w-6 h-6 text-green-600 mr-3" />
                2. Comment nous utilisons vos informations
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Services principaux</h3>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• Effectuer des audits d'accessibilité RGAA</li>
                    <li>• Générer des rapports personnalisés</li>
                    <li>• Sauvegarder vos préférences</li>
                    <li>• Fournir un support technique</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Amélioration du service</h3>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• Analyser l'utilisation pour améliorer l'UX</li>
                    <li>• Développer de nouvelles fonctionnalités</li>
                    <li>• Optimiser les performances</li>
                    <li>• Détecter et corriger les bugs</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 - Cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Cookie className="w-6 h-6 text-yellow-600 mr-3" />
                3. Utilisation des cookies
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Cookies essentiels</h3>
                  <p className="text-gray-700 mb-3">Ces cookies sont nécessaires au fonctionnement du site :</p>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• <strong>Session :</strong> Maintien de votre session de navigation</li>
                    <li>• <strong>Préférences :</strong> Sauvegarde de vos paramètres (langue, thème)</li>
                    <li>• <strong>Sécurité :</strong> Protection contre les attaques CSRF</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Cookies analytiques (optionnels)</h3>
                  <p className="text-gray-700 mb-3">Ces cookies nous aident à comprendre l'utilisation du site :</p>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• <strong>Statistiques :</strong> Pages visitées, durée de session</li>
                    <li>• <strong>Performance :</strong> Temps de chargement, erreurs</li>
                    <li>• <strong>Utilisation :</strong> Fonctionnalités les plus utilisées</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 - Partage d'informations */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="w-6 h-6 text-red-600 mr-3" />
                4. Partage de vos informations
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Lock className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Politique de non-partage</h3>
                    <p className="text-gray-700 mb-4">
                      <strong>Nous ne vendons, ne louons, ni ne partageons vos informations personnelles avec des tiers à des fins commerciales.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 - Sécurité */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                5. Sécurité de vos données
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 mb-3">Mesures techniques</h3>
                  <ul className="text-blue-700 space-y-2 text-sm">
                    <li>• <strong>Chiffrement SSL/TLS</strong> pour toutes les communications</li>
                    <li>• <strong>Serveurs sécurisés</strong> avec accès restreint</li>
                    <li>• <strong>Sauvegardes régulières</strong> et chiffrées</li>
                    <li>• <strong>Monitoring</strong> des intrusions 24/7</li>
                  </ul>
                </div>
                
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
                  <h3 className="font-semibold text-cyan-800 mb-3">Mesures organisationnelles</h3>
                  <ul className="text-cyan-700 space-y-2 text-sm">
                    <li>• <strong>Accès limité</strong> aux données personnelles</li>
                    <li>• <strong>Formation</strong> à la sécurité des données</li>
                    <li>• <strong>Audits réguliers</strong> de sécurité</li>
                    <li>• <strong>Politique</strong> de mot de passe strict</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6 - Vos droits */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 text-green-600 mr-3" />
                6. Vos droits et contrôles
              </h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-4">Vous avez le contrôle de vos données</h3>
                <div className="grid md:grid-cols-2 gap-4 text-green-700 text-sm">
                  <ul className="space-y-2">
                    <li>• <strong>Accéder</strong> à vos données personnelles</li>
                    <li>• <strong>Corriger</strong> les informations inexactes</li>
                    <li>• <strong>Supprimer</strong> vos données (droit à l'oubli)</li>
                  </ul>
                  <ul className="space-y-2">
                    <li>• <strong>Limiter</strong> le traitement de vos données</li>
                    <li>• <strong>Exporter</strong> vos données (portabilité)</li>
                    <li>• <strong>Vous opposer</strong> au traitement</li>
                  </ul>
                </div>
                
                <div className="mt-4 p-4 bg-green-100 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Comment exercer vos droits ?</h4>
                  <p className="text-green-700 text-sm">
                    Envoyez-nous un email à{' '}
                    <a href="mailto:hello@loicbernard.com" className="text-green-600 hover:underline focus:underline focus:outline-none font-medium">
                      hello@loicbernard.com
                    </a>{' '}
                    avec l'objet "Droits RGPD" en précisant votre demande. Nous vous répondrons dans les 30 jours.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 - Conservation des données */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-6 h-6 text-purple-600 mr-3" />
                7. Conservation des données
              </h2>
              
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p><strong className="text-purple-800">Données de session :</strong> <span className="text-purple-700">Supprimées automatiquement à la fermeture du navigateur</span></p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p><strong className="text-purple-800">Données d'audit :</strong> <span className="text-purple-700">Traitées en temps réel, non conservées</span></p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p><strong className="text-purple-800">Logs techniques :</strong> <span className="text-purple-700">Conservés 30 jours pour la sécurité et le débogage</span></p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p><strong className="text-purple-800">Correspondances :</strong> <span className="text-purple-700">Conservées 3 ans pour le suivi des demandes</span></p>
                </div>
              </div>
            </section>

            {/* Section 8 - Enfants */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 text-orange-600 mr-3" />
                8. Protection des mineurs
              </h2>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <p className="text-orange-800 leading-relaxed">
                  RGAA Audit ne collecte pas sciemment d'informations personnelles auprès de mineurs de moins de 16 ans. 
                  Si nous découvrons qu'un mineur nous a fourni des informations personnelles, nous les supprimerons immédiatement. 
                  Si vous pensez qu'un mineur nous a fourni des informations personnelles, contactez-nous à{' '}
                  <a href="mailto:hello@loicbernard.com" className="text-orange-600 hover:underline focus:underline focus:outline-none font-medium">
                    hello@loicbernard.com
                  </a>.
                </p>
              </div>
            </section>

            {/* Section 9 - Modifications */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="w-6 h-6 text-gray-600 mr-3" />
                9. Modifications de cette politique
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous pouvons mettre à jour cette politique de confidentialité de temps en temps pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires.
                </p>
                <p className="text-gray-700">
                  <strong>Notification des modifications :</strong> Nous vous informerons de toute modification importante via cette page avec indication de la date de mise à jour.
                </p>
              </div>
            </section>

            {/* Contact */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <Mail className="w-8 h-8 mx-auto mb-4 text-gray-600" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Questions sur votre confidentialité ?</h3>
              <p className="mb-4 text-gray-700">
                Nous sommes là pour vous aider à comprendre et exercer vos droits en matière de confidentialité.
              </p>
              <a 
                href="mailto:hello@loicbernard.com" 
                className="inline-flex items-center bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 focus:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Contactez-nous
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