'use client';

import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Mail, Calendar, User, Lock, Eye, Database, Trash2 } from 'lucide-react';

export default function RGPDPage() {
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
            <Shield className="w-12 h-12 text-blue-600 mr-4" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-gray-900">
              RGPD
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Information sur la collecte et le traitement de vos données personnelles dans le cadre de l'utilisation de RGAA Audit.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>Dernière mise à jour : 16 juin 2025</span>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            
            {/* Section 1 - Responsable de traitement */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 text-blue-600 mr-3" />
                1. Responsable du traitement des données
              </h2>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le responsable du traitement des données personnelles collectées sur RGAA Audit est :
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Nom :</strong> Loïc Bernard</p>
                  <p><strong>Qualité :</strong> Dirigeant et développeur</p>
                  <p><strong>Email :</strong> <a href="mailto:hello@loicbernard.com" className="text-blue-600 hover:underline focus:underline focus:outline-none">hello@loicbernard.com</a></p>
                </div>
              </div>
            </section>

            {/* Section 2 - Données collectées */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Database className="w-6 h-6 text-green-600 mr-3" />
                2. Données personnelles collectées
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Données collectées automatiquement</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• <strong>Données techniques :</strong> Adresse IP, type de navigateur, système d'exploitation</li>
                    <li>• <strong>Données de navigation :</strong> Pages visitées, durée de session, interactions</li>
                    <li>• <strong>Cookies techniques :</strong> Préférences de langue, état de session</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Données d'audit</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• <strong>URL du site analysé :</strong> Adresse web soumise pour audit</li>
                    <li>• <strong>Contenu HTML :</strong> Code source temporairement analysé</li>
                    <li>• <strong>Résultats d'audit :</strong> Rapport d'accessibilité généré</li>
                  </ul>
                  <p className="text-gray-600 text-sm mt-3 italic">
                    Note : Le contenu HTML est traité temporairement et n'est pas stocké après l'analyse.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 - Finalités */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 text-purple-600 mr-3" />
                3. Finalités du traitement
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Finalités principales</h3>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• Fournir le service d'audit d'accessibilité</li>
                    <li>• Analyser et générer des rapports RGAA</li>
                    <li>• Améliorer la qualité du service</li>
                    <li>• Assurer le bon fonctionnement technique</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Finalités analytiques</h3>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• Comprendre l'usage du service</li>
                    <li>• Optimiser l'expérience utilisateur</li>
                    <li>• Détecter les problèmes techniques</li>
                    <li>• Développer de nouvelles fonctionnalités</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 - Base légale */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="w-6 h-6 text-red-600 mr-3" />
                4. Base légale du traitement
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-800 leading-relaxed mb-4">
                  Le traitement de vos données personnelles repose sur les bases légales suivantes :
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• <strong>Intérêt légitime :</strong> Fourniture du service d'audit d'accessibilité</li>
                  <li>• <strong>Consentement :</strong> Utilisation de cookies non essentiels (si applicable)</li>
                  <li>• <strong>Exécution du service :</strong> Traitement nécessaire à la réalisation de l'audit</li>
                </ul>
              </div>
            </section>

            {/* Section 5 - Durée de conservation */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-6 h-6 text-yellow-600 mr-3" />
                5. Durée de conservation
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p><strong className="text-gray-800">Données de session :</strong> <span className="text-gray-700">Supprimées à la fermeture du navigateur</span></p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p><strong className="text-gray-800">Logs techniques :</strong> <span className="text-gray-700">Conservés 30 jours maximum</span></p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p><strong className="text-gray-800">Contenu HTML analysé :</strong> <span className="text-gray-700">Non conservé (traitement en temps réel)</span></p>
                </div>
              </div>
            </section>

            {/* Section 6 - Vos droits */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-green-600 mr-3" />
                6. Vos droits
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-800 mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
                <div className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
                  <ul className="space-y-2">
                    <li>• <strong>Droit d'accès</strong> à vos données</li>
                    <li>• <strong>Droit de rectification</strong> des données inexactes</li>
                    <li>• <strong>Droit à l'effacement</strong> ("droit à l'oubli")</li>
                  </ul>
                  <ul className="space-y-2">
                    <li>• <strong>Droit à la limitation</strong> du traitement</li>
                    <li>• <strong>Droit à la portabilité</strong> des données</li>
                    <li>• <strong>Droit d'opposition</strong> au traitement</li>
                  </ul>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-800 text-sm">
                    <strong>Pour exercer vos droits :</strong> Contactez-nous à l'adresse{' '}
                    <a href="mailto:hello@loicbernard.com" className="text-blue-600 hover:underline focus:underline focus:outline-none">
                      hello@loicbernard.com
                    </a>{' '}
                    en précisant l'objet de votre demande.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 - Sécurité */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="w-6 h-6 text-blue-600 mr-3" />
                7. Sécurité des données
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-800 mb-4">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• <strong>Chiffrement HTTPS</strong> pour toutes les communications</li>
                  <li>• <strong>Minimisation des données</strong> collectées</li>
                  <li>• <strong>Accès restreint</strong> aux données personnelles</li>
                  <li>• <strong>Surveillance</strong> des accès et tentatives d'intrusion</li>
                  <li>• <strong>Sauvegarde sécurisée</strong> des systèmes</li>
                </ul>
              </div>
            </section>

            {/* Section 8 - Modifications */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Trash2 className="w-6 h-6 text-gray-600 mr-3" />
                8. Modifications de cette politique
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  Cette politique de protection des données peut être modifiée pour refléter les évolutions du service ou de la réglementation. 
                  Toute modification substantielle sera communiquée via cette page avec indication de la date de mise à jour.
                </p>
              </div>
            </section>

            {/* Contact */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <Mail className="w-8 h-8 mx-auto mb-4 text-gray-600" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Des questions sur vos données ?</h3>
              <p className="mb-4 text-gray-700">N'hésitez pas à nous contacter pour toute question relative à la protection de vos données personnelles.</p>
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