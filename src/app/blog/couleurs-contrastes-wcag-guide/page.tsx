'use client';

import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Clock, ArrowLeft, Palette, Eye, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import Footer from '@/components/Footer';

export default function CouleursContrastesPage() {
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
                  <span>10 janvier 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>12 {t('common.readingTime')}</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t('article.colors.title')}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('article.colors.excerpt')}
              </p>
            </div>
          </header>

          {/* Article Content */}
          <article className="bg-white rounded-2xl shadow-lg p-8">
            
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-gray-700 leading-relaxed mb-6">
                {language === 'fr' 
                  ? "Les couleurs et contrastes constituent l'un des piliers de l'accessibilité numérique. Un mauvais contraste peut rendre un site illisible pour de nombreux utilisateurs, notamment ceux ayant des déficiences visuelles, des troubles de la perception des couleurs ou utilisant l'appareil dans des conditions de luminosité difficiles."
                  : "Colors and contrasts are one of the pillars of digital accessibility. Poor contrast can make a website unreadable for many users, especially those with visual impairments, color perception disorders, or using the device in difficult lighting conditions."
                }
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Palette className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium mb-2">
                      {language === 'fr' ? 'À retenir' : 'Key takeaway'}
                    </p>
                    <p className="text-blue-700 text-sm">
                      {language === 'fr' 
                        ? "Un bon contraste améliore l'expérience pour tous les utilisateurs, pas seulement ceux en situation de handicap. C'est un investissement dans la qualité globale de votre interface."
                        : "Good contrast improves the experience for all users, not just those with disabilities. It's an investment in the overall quality of your interface."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Ratios WCAG */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'fr' ? 'Les ratios de contraste WCAG' : 'WCAG contrast ratios'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-green-600 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {language === 'fr' ? 'Niveau AA (Standard)' : 'Level AA (Standard)'}
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      <span className="text-sm">
                        <strong>4.5:1</strong> {language === 'fr' ? 'pour le texte normal' : 'for normal text'}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      <span className="text-sm">
                        <strong>3:1</strong> {language === 'fr' ? 'pour le texte large (18pt+ ou 14pt+ gras)' : 'for large text (18pt+ or 14pt+ bold)'}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-blue-600 mb-4 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    {language === 'fr' ? 'Niveau AAA (Optimal)' : 'Level AAA (Optimal)'}
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      <span className="text-sm">
                        <strong>7:1</strong> {language === 'fr' ? 'pour le texte normal' : 'for normal text'}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      <span className="text-sm">
                        <strong>4.5:1</strong> {language === 'fr' ? 'pour le texte large' : 'for large text'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-800 font-medium mb-2">
                      {language === 'fr' ? 'Composants d\'interface' : 'Interface components'}
                    </p>
                    <p className="text-yellow-700 text-sm">
                      {language === 'fr' 
                        ? "Les boutons, champs de formulaire et autres éléments interactifs doivent avoir un contraste minimum de 3:1 par rapport à l'arrière-plan."
                        : "Buttons, form fields and other interactive elements must have a minimum contrast of 3:1 against the background."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Outils de test */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'fr' ? 'Outils pour tester les contrastes' : 'Tools to test contrasts'}
              </h2>
              
              <div className="grid gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    {language === 'fr' ? 'Outils en ligne gratuits' : 'Free online tools'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">WebAIM Contrast Checker</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        {language === 'fr' ? 'L\'outil de référence, simple et efficace' : 'The reference tool, simple and effective'}
                      </p>
                      <a 
                        href="https://webaim.org/resources/contrastchecker/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {language === 'fr' ? 'Accéder à l\'outil' : 'Access the tool'}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Colour Contrast Analyser</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        {language === 'fr' ? 'Application desktop gratuite' : 'Free desktop application'}
                      </p>
                      <a 
                        href="https://www.tpgi.com/color-contrast-checker/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {language === 'fr' ? 'Télécharger' : 'Download'}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Exemples pratiques */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'fr' ? 'Exemples pratiques' : 'Practical examples'}
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-red-600 mb-4 flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    {language === 'fr' ? 'Contraste insuffisant' : 'Insufficient contrast'}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-200 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">Gris clair sur gris (1.5:1)</p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-lg text-center">
                      <p className="text-blue-300 text-sm">Bleu clair sur bleu très clair (2.1:1)</p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg text-center">
                      <p className="text-yellow-300 text-sm">Jaune sur jaune clair (1.8:1)</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-green-600 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {language === 'fr' ? 'Contraste conforme' : 'Compliant contrast'}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-300 p-4 rounded-lg text-center">
                      <p className="text-gray-900 text-sm font-medium">Noir sur blanc (21:1)</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-blue-900 text-sm font-medium">Bleu foncé sur bleu clair (8.2:1)</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-green-800 text-sm font-medium">Vert foncé sur vert clair (6.1:1)</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <Palette className="w-8 h-8 mx-auto mb-4 text-gray-600" aria-hidden="true" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {language === 'fr' ? 'L\'accessibilité des couleurs, c\'est pour tous' : 'Color accessibility is for everyone'}
                </h3>
                <p className="text-gray-700 mb-4">
                  {language === 'fr' 
                    ? "Un bon contraste améliore la lisibilité dans toutes les conditions : écrans en plein soleil, fatigue visuelle, déficiences visuelles temporaires ou permanentes."
                    : "Good contrast improves readability in all conditions: screens in direct sunlight, visual fatigue, temporary or permanent visual impairments."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/" 
                    className="inline-flex items-center bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 focus:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {t('action.startFreeAudit')}
                  </Link>
                  <Link 
                    href="/blog" 
                    className="inline-flex items-center bg-gray-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-700 focus:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    {t('action.viewOtherGuides')}
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