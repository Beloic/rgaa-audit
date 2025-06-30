'use client';

import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Clock, ArrowLeft, Smartphone, Tablet, Target } from 'lucide-react';
import Footer from '@/components/Footer';

export default function AccessibiliteMobilePage() {
  // const { language } = useLanguage(); // Décommenter si besoin d'internationalisation

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
                  <span>10 janvier 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>9 min de lecture</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Accessibilité mobile : Spécificités et bonnes pratiques
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                L'accessibilité sur mobile présente des défis uniques. Découvrez les spécificités du tactile, les gestes d'accessibilité et les bonnes pratiques pour une expérience mobile inclusive.
              </p>
            </div>
          </header>

          {/* Article Content */}
          <article className="bg-white rounded-2xl shadow-lg p-8">
            
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-gray-700 leading-relaxed mb-6">
                Avec plus de 60% du trafic web sur mobile, l'accessibilité mobile n'est plus optionnelle. Les appareils tactiles introduisent de nouveaux paradigmes d'interaction qui nécessitent une approche spécifique pour garantir l'inclusivité.
              </p>
              
              Écrans plus petits, interactions tactiles, contextes d'usage variés (transport, extérieur...) et technologies d'assistance mobiles créent de nouveaux enjeux d'accessibilité.
            </p>
          </section>

          {/* Technologies d'assistance mobile */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              Technologies d'assistance mobiles
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <p className="text-gray-700 leading-relaxed mb-6">
                Les smartphones et tablettes intègrent nativement des technologies d'assistance sophistiquées, différentes de celles du desktop.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    iOS (iPhone/iPad)
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-1">VoiceOver</h4>
                      <p className="text-blue-700 text-sm">Lecteur d'écran avec gestes tactiles spécifiques</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-1">Voice Control</h4>
                      <p className="text-blue-700 text-sm">Contrôle vocal complet de l'interface</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-1">Switch Control</h4>
                      <p className="text-blue-700 text-sm">Navigation par contacteurs externes</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Tablet className="w-5 h-5 mr-2" />
                    Android
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-1">TalkBack</h4>
                      <p className="text-gray-700 text-sm">Lecteur d'écran avec feedback vocal et vibration</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-1">Voice Access</h4>
                      <p className="text-gray-700 text-sm">Commandes vocales pour la navigation</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-1">Select to Speak</h4>
                      <p className="text-gray-700 text-sm">Lecture vocale du contenu sélectionné</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gestes d'accessibilité et interactions tactiles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              Gestes d'accessibilité et interactions tactiles
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start mb-4">
                <div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Les utilisateurs de technologies d'assistance mobiles utilisent des gestes spécifiques très différents de la navigation standard.
                  </p>
                </div>
              </div>
              
              <div className="grid gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Gestes VoiceOver (iOS)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <ul className="text-gray-700 space-y-2 text-sm">
                        <li>• <strong>Balayage droit/gauche :</strong> Navigation entre éléments</li>
                        <li>• <strong>Double tap :</strong> Activation d'un élément</li>
                        <li>• <strong>Triple tap :</strong> Actions contextuelles</li>
                        <li>• <strong>Rotation :</strong> Navigation par type d'éléments</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="text-gray-700 space-y-2 text-sm">
                        <li>• <strong>Balayage 3 doigts :</strong> Défilement</li>
                        <li>• <strong>Tap 3 doigts :</strong> Informations position</li>
                        <li>• <strong>Z avec 2 doigts :</strong> Retour arrière</li>
                        <li>• <strong>Scrub :</strong> Fermeture d'alertes</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Gestes TalkBack (Android)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <ul className="text-gray-700 space-y-2 text-sm">
                        <li>• <strong>Balayage droit/gauche :</strong> Navigation linéaire</li>
                        <li>• <strong>Balayage haut/bas :</strong> Granularité de lecture</li>
                        <li>• <strong>Double tap :</strong> Activation</li>
                        <li>• <strong>Tap + maintien :</strong> Menu contextuel</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="text-gray-700 space-y-2 text-sm">
                        <li>• <strong>Balayage 3 doigts :</strong> Défilement</li>
                        <li>• <strong>Tap 3 doigts :</strong> Informations position</li>
                        <li>• <strong>Z avec 2 doigts :</strong> Retour arrière</li>
                        <li>• <strong>Scrub :</strong> Fermeture d'alertes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Accessibilité mobile */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              Accessibilité mobile
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start mb-4">
                <div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Les spécificités mobiles demandent une attention particulière mais les bénéfices sont immenses.
                  </p>
                </div>
              </div>
              
              <div className="grid gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Exigences d'accessibilité</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <ul className="text-gray-700 space-y-2 text-sm">
                        <li>□ Zones tactiles ≥ 44px</li>
                        <li>□ Espacement ≥ 8px entre éléments</li>
                        <li>□ Feedback tactile approprié</li>
                        <li>□ Actions confirmées si destructives</li>
                      </ul>
                    </div>
                    
                    <div>
                      <ul className="text-gray-700 space-y-2 text-sm">
                        <li>□ VoiceOver fonctionnel (iOS)</li>
                        <li>□ TalkBack fonctionnel (Android)</li>
                        <li>□ Voice Control supporté</li>
                        <li>□ Switch Control accessible</li>
                      </ul>
                    </div>
                    
                    <div>
                      <ul className="text-gray-700 space-y-2 text-sm">
                        <li>□ Portrait et paysage supportés</li>
                        <li>□ Zoom 200% fonctionnel</li>
                        <li>□ Contenu adapté aux petits écrans</li>
                        <li>□ Navigation mobile optimisée</li>
                      </ul>
                    </div>
                    
                    <div>
                      <ul className="text-gray-700 space-y-2 text-sm">
                        <li>□ Contraste élevé pour l'extérieur</li>
                        <li>□ Usage d'une main possible</li>
                        <li>□ Sauvegarde automatique</li>
                        <li>□ Timeouts adaptés</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-8">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-4 text-gray-600" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">L'accessibilité mobile, un enjeu majeur</h3>
              <p className="text-gray-700 mb-4">
                Avec la domination du mobile, ignorer l'accessibilité tactile c'est exclure une part importante de vos utilisateurs. Les spécificités mobiles demandent une attention particulière mais les bénéfices sont immenses.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
} 