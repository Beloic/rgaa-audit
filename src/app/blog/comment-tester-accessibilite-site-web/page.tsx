'use client';

<<<<<<< HEAD
=======
import { useState } from 'react';
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Calendar, Clock, ArrowLeft, TestTube, Users, Laptop, Smartphone, CheckCircle, Target, Settings, Eye, Keyboard } from 'lucide-react';
import Footer from '@/components/Footer';

export default function TesterAccessibilitePage() {
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
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">
          
          {/* Navigation de retour */}
          <nav className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg px-2 py-1 transition-colors"
              aria-label="Retour au blog"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Retour au blog
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>12 janvier 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>10 min de lecture</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Comment tester l'accessibilité de votre site web : Guide complet
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Méthodologie complète pour évaluer et améliorer l'accessibilité de votre site web. De l'audit automatisé aux tests utilisateurs, découvrez toutes les étapes essentielles.
              </p>
            </div>
          </header>

          {/* Article Content */}
          <article className="bg-white rounded-2xl shadow-lg p-8">
            
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-gray-700 leading-relaxed mb-6">
                Tester l'accessibilité de votre site web est une étape cruciale pour garantir une expérience inclusive. Cette démarche combine plusieurs approches complémentaires : audits automatisés, tests manuels et validation par des utilisateurs réels.
              </p>
              
<<<<<<< HEAD
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start">
                  <TestTube className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium mb-2">Approche progressive</p>
                    <p className="text-gray-700 text-sm">
=======
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <TestTube className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium mb-2">Approche progressive</p>
                    <p className="text-blue-700 text-sm">
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                      Nous vous proposons une méthodologie en 5 étapes, des tests les plus simples aux plus approfondis. Chaque niveau apporte des informations précieuses pour améliorer votre site.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Étape 1 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
<<<<<<< HEAD
                <span className="bg-gray-100 text-gray-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
                Tests automatisés rapides
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les outils automatisés détectent rapidement 20-30% des problèmes d'accessibilité. C'est un excellent point de départ pour identifier les erreurs les plus évidentes.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Outils recommandés</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-1">RGAA Audit</h4>
                        <p className="text-blue-700 text-sm">Audit complet avec IA, gratuit et en français</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-1">axe DevTools</h4>
                        <p className="text-gray-700 text-sm">Extension navigateur pour développeurs</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-1">Lighthouse</h4>
                        <p className="text-gray-700 text-sm">Intégré dans Chrome DevTools</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Ce qu'ils détectent</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Images sans texte alternatif</li>
                      <li>• Problèmes de contraste de couleurs</li>
                      <li>• Formulaires sans étiquettes</li>
                      <li>• Structure de titres incorrecte</li>
                      <li>• Liens sans intitulé explicite</li>
                      <li>• Erreurs de HTML sémantique</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-4 text-gray-600" aria-hidden="true" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Une démarche progressive et continue</h3>
                <p className="text-gray-700 mb-4">
                  L'accessibilité se construit étape par étape. Commencez par les tests automatisés, puis progressez vers des validations plus approfondies. Chaque test apporte de la valeur !
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/" 
                    className="inline-flex items-center bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 focus:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Commencer un audit gratuit
                  </Link>
                  <Link 
                    href="/blog" 
                    className="inline-flex items-center bg-gray-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-700 focus:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Voir d'autres guides
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

import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Calendar, Clock, ArrowLeft, TestTube, Users, Laptop, Smartphone, CheckCircle, Target, Settings, Eye, Keyboard } from 'lucide-react';
import Footer from '@/components/Footer';

export default function TesterAccessibilitePage() {
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
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">
          
          {/* Navigation de retour */}
          <nav className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg px-2 py-1 transition-colors"
              aria-label="Retour au blog"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Retour au blog
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>12 janvier 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>10 min de lecture</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Comment tester l'accessibilité de votre site web : Guide complet
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Méthodologie complète pour évaluer et améliorer l'accessibilité de votre site web. De l'audit automatisé aux tests utilisateurs, découvrez toutes les étapes essentielles.
              </p>
            </div>
          </header>

          {/* Article Content */}
          <article className="bg-white rounded-2xl shadow-lg p-8">
            
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-gray-700 leading-relaxed mb-6">
                Tester l'accessibilité de votre site web est une étape cruciale pour garantir une expérience inclusive. Cette démarche combine plusieurs approches complémentaires : audits automatisés, tests manuels et validation par des utilisateurs réels.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start">
                  <TestTube className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium mb-2">Approche progressive</p>
                    <p className="text-gray-700 text-sm">
                      Nous vous proposons une méthodologie en 5 étapes, des tests les plus simples aux plus approfondis. Chaque niveau apporte des informations précieuses pour améliorer votre site.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Étape 1 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-gray-100 text-gray-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
=======
                <span className="bg-blue-100 text-blue-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                Tests automatisés rapides
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les outils automatisés détectent rapidement 20-30% des problèmes d'accessibilité. C'est un excellent point de départ pour identifier les erreurs les plus évidentes.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Outils recommandés</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-1">RGAA Audit</h4>
                        <p className="text-blue-700 text-sm">Audit complet avec IA, gratuit et en français</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-1">axe DevTools</h4>
                        <p className="text-gray-700 text-sm">Extension navigateur pour développeurs</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-1">Lighthouse</h4>
                        <p className="text-gray-700 text-sm">Intégré dans Chrome DevTools</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Ce qu'ils détectent</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Images sans texte alternatif</li>
                      <li>• Problèmes de contraste de couleurs</li>
                      <li>• Formulaires sans étiquettes</li>
                      <li>• Structure de titres incorrecte</li>
                      <li>• Liens sans intitulé explicite</li>
                      <li>• Erreurs de HTML sémantique</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Étape 2 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
<<<<<<< HEAD
                <span className="bg-gray-100 text-gray-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
=======
                <span className="bg-blue-100 text-blue-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                Navigation au clavier uniquement
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-start mb-4">
<<<<<<< HEAD
                  <Keyboard className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" />
=======
                  <Keyboard className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Testez votre site en utilisant uniquement le clavier. C'est le test manuel le plus révélateur et le plus facile à réaliser.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Protocole de test :</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Touches à utiliser</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Tab</kbd> : Navigation vers l'avant</li>
                        <li>• <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Shift+Tab</kbd> : Navigation vers l'arrière</li>
                        <li>• <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Entrée</kbd> : Activer liens/boutons</li>
                        <li>• <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Espace</kbd> : Activer boutons/checkboxes</li>
                        <li>• <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Échap</kbd> : Fermer modales</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Points à vérifier</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Tous les éléments interactifs sont accessibles</li>
                        <li>• L'ordre de navigation est logique</li>
                        <li>• Le focus est toujours visible</li>
                        <li>• Pas de piège au clavier</li>
                        <li>• Les menus s'ouvrent et se ferment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Étape 3 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
<<<<<<< HEAD
                <span className="bg-gray-100 text-gray-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
=======
                <span className="bg-blue-100 text-blue-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                Test avec lecteur d'écran
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les lecteurs d'écran révèlent des problèmes invisibles à l'œil nu. Ce test simule l'expérience des utilisateurs aveugles ou malvoyants.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Lecteurs d'écran gratuits</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-1">NVDA (Windows)</h4>
                        <p className="text-blue-700 text-sm">Gratuit, open source, très utilisé</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-1">VoiceOver (Mac/iOS)</h4>
                        <p className="text-gray-700 text-sm">Intégré nativement, touche Cmd+F5</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-1">TalkBack (Android)</h4>
                        <p className="text-gray-700 text-sm">Pour tester l'accessibilité mobile</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Scénarios de test</h3>
                    <ol className="text-gray-700 space-y-2 text-sm">
                      <li>1. Navigation dans les titres (H1, H2, H3...)</li>
                      <li>2. Lecture des descriptions d'images</li>
                      <li>3. Remplissage d'un formulaire</li>
                      <li>4. Navigation dans un tableau</li>
                      <li>5. Interaction avec une liste déroulante</li>
                      <li>6. Utilisation d'une fonction de recherche</li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            {/* Étape 4 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
<<<<<<< HEAD
                <span className="bg-gray-100 text-gray-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
=======
                <span className="bg-blue-100 text-blue-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                Tests de perception et cognitive
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ces tests évaluent l'accessibilité pour les personnes ayant des difficultés visuelles, auditives ou cognitives.
                </p>
                
                <div className="grid gap-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Tests visuels</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Zoom à 200% : le contenu reste-t-il utilisable ?</li>
                      <li>• Simulation daltonisme (extensions navigateur)</li>
                      <li>• Navigation sans images (images désactivées)</li>
                      <li>• Test en forte luminosité/faible contraste</li>
                    </ul>
                  </div>
                  
<<<<<<< HEAD
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Tests auditifs</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
=======
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-3">Tests auditifs</h3>
                    <ul className="text-blue-700 space-y-1 text-sm">
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                      <li>• Vidéos : sous-titres présents et de qualité ?</li>
                      <li>• Audio : transcription disponible ?</li>
                      <li>• Alertes sonores : alternative visuelle ?</li>
                      <li>• Test sans audio activé</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Tests cognitifs</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Simplicité du langage et des instructions</li>
                      <li>• Temps suffisant pour les actions</li>
                      <li>• Possibilité d'annuler/corriger</li>
                      <li>• Navigation intuitive et cohérente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Étape 5 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
<<<<<<< HEAD
                <span className="bg-gray-100 text-gray-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">5</span>
=======
                <span className="bg-blue-100 text-blue-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">5</span>
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                Tests utilisateurs réels
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-start mb-4">
<<<<<<< HEAD
                  <Users className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" />
=======
                  <Users className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Les tests avec de vrais utilisateurs en situation de handicap sont l'étalon-or pour valider l'accessibilité réelle de votre site.
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Comment organiser</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Recruter via des associations spécialisées</li>
                      <li>• Préparer des scénarios réalistes</li>
                      <li>• Prévoir 30-45 minutes par session</li>
                      <li>• Enregistrer (avec accord) pour l'équipe</li>
                      <li>• Rémunérer les participants</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Profils à tester</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Utilisateurs aveugles/malvoyants</li>
                      <li>• Personnes avec handicap moteur</li>
                      <li>• Utilisateurs sourds/malentendants</li>
                      <li>• Personnes avec troubles cognitifs</li>
                      <li>• Seniors avec difficultés multiples</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

<<<<<<< HEAD
            {/* Checklist */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 text-gray-600 mr-3" />
                Checklist de validation
              </h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-800 mb-4 font-medium">Votre site est-il prêt ? Vérifiez ces points essentiels :</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Tests automatisés ✓</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>□ Audit RGAA Audit réalisé</li>
                      <li>□ Score Lighthouse > 90</li>
=======
            {/* Outils spécialisés */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="w-6 h-6 text-gray-600 mr-3" />
                Outils et extensions utiles
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Extensions navigateur</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-700 text-sm">Colour Contrast Analyser</h4>
                      <p className="text-gray-600 text-xs">Vérifie les ratios de contraste</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 text-sm">HeadingsMap</h4>
                      <p className="text-gray-600 text-xs">Visualise la structure des titres</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 text-sm">WAVE</h4>
                      <p className="text-gray-600 text-xs">Évaluation visuelle de l'accessibilité</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Outils de simulation</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-700 text-sm">Stark (Figma/Sketch)</h4>
                      <p className="text-gray-600 text-xs">Simulation des déficiences visuelles</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 text-sm">No Coffee</h4>
                      <p className="text-gray-600 text-xs">Extension pour simuler différents handicaps</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 text-sm">Funkify</h4>
                      <p className="text-gray-600 text-xs">Simulateur complet de handicaps</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Checklist */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3" />
                Checklist de validation
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 mb-4 font-medium">Votre site est-il prêt ? Vérifiez ces points essentiels :</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-700 mb-3">Tests automatisés ✓</h3>
                    <ul className="text-blue-700 space-y-1 text-sm">
                      <li>□ Audit RGAA Audit réalisé</li>
                      <li>□ Score Lighthouse &gt; 90</li>
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                      <li>□ Aucune erreur axe critique</li>
                    </ul>
                  </div>
                  
                  <div>
<<<<<<< HEAD
                    <h3 className="font-semibold text-gray-700 mb-3">Tests manuels ✓</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
=======
                    <h3 className="font-semibold text-blue-700 mb-3">Tests manuels ✓</h3>
                    <ul className="text-blue-700 space-y-1 text-sm">
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                      <li>□ Navigation clavier complète</li>
                      <li>□ Test lecteur d'écran effectué</li>
                      <li>□ Zoom 200% fonctionnel</li>
                    </ul>
                  </div>
                  
                  <div>
<<<<<<< HEAD
                    <h3 className="font-semibold text-gray-700 mb-3">Validation utilisateur ✓</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
=======
                    <h3 className="font-semibold text-blue-700 mb-3">Validation utilisateur ✓</h3>
                    <ul className="text-blue-700 space-y-1 text-sm">
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                      <li>□ Test avec utilisateurs handicapés</li>
                      <li>□ Feedback intégré</li>
                      <li>□ Améliorations implémentées</li>
                    </ul>
                  </div>
                  
                  <div>
<<<<<<< HEAD
                    <h3 className="font-semibold text-gray-700 mb-3">Documentation ✓</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
=======
                    <h3 className="font-semibold text-blue-700 mb-3">Documentation ✓</h3>
                    <ul className="text-blue-700 space-y-1 text-sm">
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
                      <li>□ Déclaration d'accessibilité</li>
                      <li>□ Plan d'amélioration</li>
                      <li>□ Contact accessibilité</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-4 text-gray-600" aria-hidden="true" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Une démarche progressive et continue</h3>
                <p className="text-gray-700 mb-4">
                  L'accessibilité se construit étape par étape. Commencez par les tests automatisés, puis progressez vers des validations plus approfondies. Chaque test apporte de la valeur !
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/" 
                    className="inline-flex items-center bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 focus:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Commencer un audit gratuit
                  </Link>
                  <Link 
                    href="/blog" 
                    className="inline-flex items-center bg-gray-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-700 focus:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Voir d'autres guides
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
<<<<<<< HEAD
} 
=======
}
>>>>>>> 9aabe477813cab8c339d85d797afeffbe5fea9e7
