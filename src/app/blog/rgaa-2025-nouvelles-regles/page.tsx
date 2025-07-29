'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Calendar, Clock, ArrowLeft, Users, AlertTriangle, TrendingUp, CheckCircle, XCircle, FileText, Building, CreditCard } from 'lucide-react';
import Footer from '@/components/Footer';

export default function ArticlePage() {
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
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <nav aria-label="Fil d'Ariane">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-gray-700 focus:text-gray-700 transition-colors focus:outline-none focus:underline">Accueil</Link></li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">›</span>
                <Link href="/blog" className="hover:text-gray-700 focus:text-gray-700 transition-colors focus:outline-none focus:underline">Blog</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">›</span>
                <span className="text-gray-900">RGAA 2025 : nouvelles règles</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-6 py-12">
          {/* En-tête de l'article */}
          <header className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-5xl" role="img" aria-label="Alerte">🚨</span>
              <div>
                <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full mb-2">
                  Réglementation
                </span>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <span>22 janvier 2025</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span>8 min de lecture</span>
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Accessibilité web en 2025 : le RGAA impose de nouvelles règles, comment s'y préparer ?
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Le RGAA (Référentiel Général d'Amélioration de l'Accessibilité) va connaître plusieurs évolutions importantes en 2025. Basé 
              sur des normes internationales, ce référentiel verra son rayon d'application élargi le <strong>28 juin 2025</strong>. Découvrez les 4 points qui vont évoluer cet été.
            </p>
          </header>

          {/* Contenu de l'article */}
          <div className="prose max-w-none">
            {/* Introduction */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <p className="text-blue-800 leading-relaxed">
                <strong>Enjeu essentiel</strong> pour réduire la fracture numérique et offrir à toutes et tous les mêmes possibilités, l'accessibilité web revêt une importance toute particulière ces dernières années. Longtemps cantonné au bon vouloir des créateurs de sites web ou de solutions, le fait de rendre une plateforme accessible à toutes les personnes, y compris celles en situation de handicap, est entré dans la loi.
              </p>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Élaboré dans le cadre de la loi sur l'égalité des droits et des chances de 2005, le RGAA, ou Référentiel Général d'Amélioration de l'Accessibilité, déployé en 2009 et mis à jour régulièrement depuis, impose aux services publics, de l'État et des collectivités, de rendre leurs plateformes numériques accessibles à toutes et tous. Il s'appuie sur des normes internationales, comme les WCAG (Web Content Accessibility Guidelines), et verra son rayon d'application élargi le <strong>28 juin 2025</strong>. Découvrez les 4 points qui vont évoluer cet été.
            </p>

            {/* Point 1 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
                L'extension du périmètre d'application
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  À partir du 28 juin 2025, de nouvelles obligations en matière d'accessibilité numérique s'appliqueront à certaines entreprises privées, mais le RGAA ne s'étend pas à l'ensemble du secteur privé.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-800 font-medium mb-2">Qui est concerné ?</p>
                      <p className="text-yellow-700 text-sm">
                        Le RGAA reste obligatoire uniquement pour les organismes publics et certaines grandes entreprises privées réalisant un chiffre d'affaires supérieur à <strong>250 millions d'euros</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  Cependant, la réglementation européenne impose de nouvelles exigences d'accessibilité à partir du 28 juin 2025, qui concerneront certains produits et services spécifiques :
                </p>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Produits concernés
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Ordinateurs, tablettes, smartphones</li>
                      <li>• Guichets automatiques bancaires</li>
                      <li>• Distributeurs de titres de transport</li>
                      <li>• Box Internet et télévision</li>
                      <li>• Liseuses numériques</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Services concernés
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Commerce électronique</li>
                      <li>• Services bancaires aux consommateurs</li>
                      <li>• Communications électroniques</li>
                      <li>• Services de médias audiovisuels</li>
                      <li>• Services de transport de personnes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Point 2 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
                De nouveaux délais de mise en conformité
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-start mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      À partir du <strong>29 juin 2025</strong>, tous les services numériques fournis devront être accessibles, qu'ils soient nouveaux ou déjà existants.
                    </p>
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Exception limitée</h4>
                  <p className="text-orange-700 text-sm">
                    Les contrats de services conclus avant le 28 juin 2025 peuvent continuer sans modification jusqu'à leur terme, et au plus tard jusqu'au <strong>28 juin 2030</strong>.
                  </p>
                </div>
                
                <p className="text-gray-700 leading-relaxed mt-4">
                  Ce délai vise à permettre aux organismes concernés de s'adapter aux nouvelles exigences : formation des équipes, intégration des pratiques d'accessibilité dans les processus de développement et refonte progressive des plateformes numériques.
                </p>
              </div>
            </section>

            {/* Point 3 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
                Le renforcement des sanctions
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Le non-respect des obligations d'accessibilité numérique sera désormais plus sévèrement sanctionné.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Organismes publics
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white rounded p-3 border border-red-200">
                        <div className="text-2xl font-bold text-red-600">50 000 €</div>
                        <div className="text-sm text-red-700">par service non conforme</div>
                        <div className="text-xs text-red-600 mt-1">renouvelable tous les 6 mois</div>
                      </div>
                      <div className="bg-white rounded p-3 border border-red-200">
                        <div className="text-2xl font-bold text-red-600">25 000 €</div>
                        <div className="text-sm text-red-700">si déclarations non publiées</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Entreprises privées
                    </h4>
                    <p className="text-orange-700 text-sm leading-relaxed">
                      Les entreprises relevant des nouvelles obligations (commerce électronique, services bancaires, télécommunications) s'exposent à des sanctions spécifiques variables selon les secteurs.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Point 4 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
                Quels organismes de contrôle concernés ?
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Pour assurer le respect des règles, de nouveaux organismes seront chargés de superviser et contrôler la conformité des services numériques :
                </p>
                
                <div className="grid gap-4">
                  <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      DG
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800">DGCCRF</h4>
                      <p className="text-blue-700 text-sm">Direction générale de la concurrence, de la consommation et de la répression des fraudes - Contrôles généraux</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      AR
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">ARCEP</h4>
                      <p className="text-green-700 text-sm">Surveillance des services de communication électronique</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      AC
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800">Arcom</h4>
                      <p className="text-purple-700 text-sm">Contrôle des services audiovisuels</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      BF
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-800">Banque de France</h4>
                      <p className="text-indigo-700 text-sm">Responsabilité des moyens de paiement numériques</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>



            {/* Conclusion */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4">Préparez-vous dès maintenant</h2>
                <p className="text-blue-100 leading-relaxed mb-6">
                  Avec l'entrée en vigueur de ces nouvelles règles le 28 juin 2025, il est crucial de commencer dès maintenant la mise en conformité de vos services numériques. L'accessibilité n'est plus une option, c'est une obligation légale qui garantit l'égalité d'accès pour tous.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 focus:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 text-center"
                  >
                    Tester mon site maintenant
                  </Link>
                  <Link 
                    href="/quiz"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 focus:bg-white focus:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 text-center"
                  >
                    Tester mes connaissances
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 pt-8">
            <Link 
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 focus:text-blue-700 font-medium transition-colors focus:outline-none focus:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Retour au blog
            </Link>
          </div>
        </article>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
} 