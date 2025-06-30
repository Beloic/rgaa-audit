'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Calendar, Clock, ArrowLeft, AlertTriangle, Eye, Mouse, Keyboard, Volume2, CheckCircle, XCircle, Lightbulb, Target } from 'lucide-react';
import Footer from '@/components/Footer';

export default function ErreursCourantesPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Skip to main content link pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:ring-2 focus:ring-blue-300"
      >
        {t('blog.skipToContent')}
      </a>

      {/* Topbar Navigation */}
      <TopBar />

      {/* Main Content */}
      <main id="main-content" className="relative z-10">
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">
          
          {/* Navigation de retour */}
          <nav className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg px-2 py-1 transition-colors"
              aria-label={t('blog.backToBlog')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              {t('blog.backToBlog')}
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>15 janvier 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>8 {t('common.readingTime')}</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t('errors2025.title')}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('errors2025.subtitle')}
              </p>
            </div>
          </header>

          {/* Article Content */}
          <article className="bg-white rounded-2xl shadow-lg p-8">
            
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-gray-700 leading-relaxed mb-6">
                {t('errors2025.intro')}
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Lightbulb className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium mb-2">{t('message.goodNews')}</p>
                    <p className="text-blue-700 text-sm">
                      {t('errors2025.goodNews')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Erreur 1 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-red-100 text-red-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
                {t('errors2025.error1.title')}
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-red-600 mb-3 flex items-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      {t('common.frequentError')}
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <code className="text-sm text-red-800">
                        &lt;img src="graph.png"&gt;<br/>
                        &lt;img src="logo.png" alt="logo"&gt;<br/>
                        &lt;img src="btn.png" alt="image"&gt;
                      </code>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-green-600 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {t('common.correction')}
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <code className="text-sm text-green-800">
                        &lt;img src="graph.png" alt="Évolution des ventes 2024 : +15%"&gt;<br/>
                        &lt;img src="logo.png" alt="RGAA Audit"&gt;<br/>
                        &lt;img src="btn.png" alt="Télécharger le rapport"&gt;
                      </code>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    <strong>{t('common.impact')} :</strong> {t('errors2025.error1.impact')}
                  </p>
                </div>
              </div>
            </section>

            {/* Erreur 2 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-red-100 text-red-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
                {t('errors2025.error2.title')}
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('errors2025.error2.description')}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-red-600 mb-3">{t('common.problematicExample')}</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-300 text-sm">Texte en bleu clair sur fond bleu (ratio 1.5:1)</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-green-600 mb-3">{t('common.appropriateCorrection')}</h3>
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <p className="text-blue-900 text-sm font-medium">Texte en bleu foncé sur fond bleu clair (ratio 7.2:1)</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>{t('errors2025.error2.ratios')}</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Erreur 3 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-red-100 text-red-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
                {t('errors2025.error3.title')}
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-start mb-4">
                  <Keyboard className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {t('errors2025.error3.description')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">{t('errors2025.error3.problems')}</h4>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• Boutons créés avec des <code>&lt;div&gt;</code> non focusables</li>
                    <li>• Menus déroulants qui se ferment au focus clavier</li>
                    <li>• Indicateurs de focus supprimés ou invisibles</li>
                    <li>• Ordre de tabulation illogique</li>
                    <li>• Piège au clavier dans les modales</li>
                  </ul>
                </div>
                
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>{t('common.solution')} :</strong> {t('errors2025.error3.solution')}
                  </p>
                </div>
              </div>
            </section>

            {/* Erreurs supplémentaires */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres erreurs fréquentes</h2>
              
              <div className="grid gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm">6</span>
                    Liens non explicites
                  </h3>
                  <p className="text-gray-700 text-sm">Liens "Cliquez ici" ou "En savoir plus" sans contexte.</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm">7</span>
                    Contenus uniquement en couleur
                  </h3>
                  <p className="text-gray-700 text-sm">Informations transmises seulement par la couleur (ex: "champs en rouge").</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm">8</span>
                    Vidéos sans sous-titres
                  </h3>
                  <p className="text-gray-700 text-sm">Contenus multimédias inaccessibles aux personnes sourdes ou malentendantes.</p>
                </div>
              </div>
            </section>

            {/* Plan d'action */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-6 h-6 text-blue-600 mr-3" />
                Plan d'action pour corriger ces erreurs
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <ol className="text-blue-800 space-y-3">
                  <li><strong>1. Audit initial :</strong> Utilisez des outils comme RGAA Audit pour identifier les problèmes</li>
                  <li><strong>2. Priorisation :</strong> Commencez par les erreurs les plus critiques (images, navigation clavier)</li>
                  <li><strong>3. Formation :</strong> Sensibilisez vos équipes aux bonnes pratiques</li>
                  <li><strong>4. Tests utilisateurs :</strong> Faites tester votre site par des personnes en situation de handicap</li>
                  <li><strong>5. Amélioration continue :</strong> Intégrez l'accessibilité dans vos processus de développement</li>
                </ol>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <Shield className="w-8 h-8 mx-auto mb-4 text-gray-600" aria-hidden="true" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">L'accessibilité, un investissement rentable</h3>
                <p className="text-gray-700">
                  Corriger ces erreurs courantes améliore l'expérience de tous vos utilisateurs, élargit votre audience et réduit les risques juridiques. Commencez dès aujourd'hui !
                </p>
                <div className="mt-4">
                  <Link 
                    href="/" 
                    className="inline-flex items-center bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 focus:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Tester mon site gratuitement
                  </Link>
                </div>
              </div>
            </section>
          </article>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
} 