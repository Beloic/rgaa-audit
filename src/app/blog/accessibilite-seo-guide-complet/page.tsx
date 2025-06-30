'use client';

import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { Calendar, Clock, ArrowLeft, Search, Target, TrendingUp, Users, CheckCircle, Eye, Globe } from 'lucide-react';
import Footer from '@/components/Footer';

export default function AccessibiliteSeoPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Skip to main content link pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Aller au contenu principal
      </a>

      <TopBar />
      
      <main id="main-content" className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 focus:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au blog
            </Link>
          </nav>

          {/* Header de l'article */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Accessibilité et SEO : pourquoi vont-ils de pair ?
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <time dateTime="2025-01-08">8 janvier 2025</time>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>8 min de lecture</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <Search className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 font-medium mb-2">L'alliance parfaite</p>
                  <p className="text-blue-700 text-sm">
                    Découvrez comment l'accessibilité web améliore naturellement votre référencement et booste vos performances SEO de manière durable.
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Contenu de l'article */}
          <article className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-xl text-gray-600 leading-relaxed">
                Saviez-vous que <strong>67% des critères d'accessibilité RGAA impactent directement le SEO</strong> ? L'accessibilité et le référencement naturel partagent un objectif commun : offrir la meilleure expérience possible aux utilisateurs.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Dans ce guide complet, nous explorons cette synergie naturelle et vous montrons comment une approche accessible peut transformer vos performances SEO.
              </p>
            </section>

            {/* Section 1: Les fondements communs */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-6 h-6 text-blue-600 mr-3" />
                Les fondements communs
              </h2>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Google et l'accessibilité</h3>
                
                <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-700 mb-6">
                  "Les pratiques d'accessibilité aident souvent à améliorer l'utilisabilité de votre site pour tous."
                  <br />
                  <cite className="text-sm text-gray-600">— Google Search Central</cite>
                </blockquote>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Objectifs partagés :</h4>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Contenu structuré et logique</li>
                      <li>• Navigation intuitive</li>
                      <li>• Temps de chargement optimaux</li>
                      <li>• Expérience utilisateur fluide</li>
                      <li>• Compatibilité multi-appareils</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Bénéficiaires :</h4>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Utilisateurs en situation de handicap</li>
                      <li>• Robots d'indexation</li>
                      <li>• Utilisateurs mobiles</li>
                      <li>• Connexions lentes</li>
                      <li>• Tous les visiteurs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Impact direct sur le SEO */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
                Impact direct sur le référencement
              </h2>

              <div className="space-y-8">
                
                {/* Structure HTML sémantique */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">1. Structure HTML sémantique</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Pour l'accessibilité :</h4>
                      <ul className="text-gray-600 space-y-1 text-sm">
                        <li>• Navigation au clavier fluide</li>
                        <li>• Lecteurs d'écran efficaces</li>
                        <li>• Compréhension du contenu</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Pour le SEO :</h4>
                      <ul className="text-gray-600 space-y-1 text-sm">
                        <li>• Crawl facilité pour Google</li>
                        <li>• Hiérarchie claire des contenus</li>
                        <li>• Rich snippets possibles</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700">
                      <strong>Exemple :</strong> Utiliser les balises &lt;h1&gt;, &lt;h2&gt;, &lt;nav&gt;, &lt;main&gt; aide autant les lecteurs d'écran que l'indexation Google.
                    </p>
                  </div>
                </div>

                {/* Alternatives textuelles */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">2. Alternatives textuelles des images</h3>
                  
                  <p className="text-gray-700 mb-4">
                    Les attributs alt descriptifs servent à la fois l'accessibilité et le référencement des images.
                  </p>

                  <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-gray-800 mb-2">Impact SEO mesuré :</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>+28%</strong> de trafic depuis Google Images</li>
                      <li>• <strong>+15%</strong> d'amélioration du référencement général</li>
                      <li>• Meilleur positionnement sur les requêtes visuelles</li>
                    </ul>
                  </div>
                </div>

                {/* Performance et vitesse */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">3. Performance et vitesse</h3>
                  
                  <p className="text-gray-700 mb-4">
                    L'optimisation pour l'accessibilité améliore naturellement les Core Web Vitals, facteur de ranking majeur.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded">
                      <h4 className="font-medium text-blue-800 mb-2">Optimisations communes :</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Images optimisées et lazy loading</li>
                        <li>• CSS et JS minifiés</li>
                        <li>• Fonts web optimisées</li>
                        <li>• Contenu structuré</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="font-medium text-gray-800 mb-2">Résultats mesurés :</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Score Lighthouse +20 points</li>
                        <li>• LCP amélioré de 1.2s</li>
                        <li>• CLS réduit de 0.05</li>
                        <li>• FID under 100ms</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Stratégies gagnantes */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 text-blue-600 mr-3" />
                Stratégies gagnantes pour 2025
              </h2>

              <div className="space-y-6">
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">1. Optimisation du maillage interne</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Liens accessibles :</h4>
                      <ul className="text-gray-600 space-y-1 text-sm">
                        <li>• Textes de liens explicites</li>
                        <li>• Indication des liens externes</li>
                        <li>• États de focus visibles</li>
                        <li>• Navigation au clavier</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Bénéfices SEO :</h4>
                      <ul className="text-gray-600 space-y-1 text-sm">
                        <li>• Crawl budget optimisé</li>
                        <li>• Page Rank distribué</li>
                        <li>• Ancres contextuelles</li>
                        <li>• Profondeur de site réduite</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">2. Contenu inclusif et SEO</h3>
                  
                  <p className="text-gray-700 mb-4">
                    Un contenu accessible est naturellement mieux référencé car il répond aux critères de qualité de Google.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Bonnes pratiques :</h4>
                    <ul className="text-blue-700 space-y-1 text-sm">
                      <li>• Langage simple et clair (niveau 8e-9e année)</li>
                      <li>• Phrases courtes et structure logique</li>
                      <li>• Définition des acronymes et termes techniques</li>
                      <li>• Contenu multiformat (texte, audio, vidéo)</li>
                      <li>• Transcriptions et sous-titres</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">3. Mobile-first accessible</h3>
                  
                  <p className="text-gray-700 mb-4">
                    Avec l'index mobile-first de Google, l'accessibilité mobile devient cruciale pour le SEO.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Critères essentiels :</h4>
                      <ul className="text-gray-600 space-y-1 text-sm">
                        <li>• Zones de touch minimum 44px</li>
                        <li>• Contraste suffisant en plein soleil</li>
                        <li>• Navigation au pouce facilitée</li>
                        <li>• Formulaires accessibles</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Impact SEO :</h4>
                      <ul className="text-gray-600 space-y-1 text-sm">
                        <li>• Mobile usability score amélioré</li>
                        <li>• Taux de rebond réduit</li>
                        <li>• Temps de session augmenté</li>
                        <li>• Signaux utilisateur positifs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Outils et mesure */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="w-6 h-6 text-blue-600 mr-3" />
                Outils de mesure et optimisation
              </h2>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">Outils gratuits recommandés</h3>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-800">Google Lighthouse</h4>
                        <p className="text-sm text-gray-600">Audit accessibilité + performance SEO</p>
                      </div>
                      
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-800">axe DevTools</h4>
                        <p className="text-sm text-gray-600">Détection automatique des problèmes</p>
                      </div>
                      
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-800">WAVE</h4>
                        <p className="text-sm text-gray-600">Évaluation visuelle de l'accessibilité</p>
                      </div>
                      
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-800">Google Search Console</h4>
                        <p className="text-sm text-gray-600">Suivi des Core Web Vitals</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">KPIs à suivre</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-gray-800 text-sm">Accessibilité</h4>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1">
                          <li>• Score Lighthouse Accessibility</li>
                          <li>• Erreurs axe détectées</li>
                          <li>• Conformité RGAA AA</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-gray-800 text-sm">SEO technique</h4>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1">
                          <li>• Core Web Vitals</li>
                          <li>• Mobile-friendly test</li>
                          <li>• Structured data validity</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-gray-800 text-sm">Performance business</h4>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1">
                          <li>• Trafic organique</li>
                          <li>• Taux de conversion</li>
                          <li>• Temps de session</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Checklist finale */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3" />
                Checklist SEO + Accessibilité
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 mb-4 font-medium">Votre site est-il optimisé ? Vérifiez ces points essentiels :</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Structure et contenu ✓</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>□ Hiérarchie de titres logique (H1-H6)</li>
                      <li>□ Attributs alt sur toutes les images</li>
                      <li>□ Liens avec textes explicites</li>
                      <li>□ Contenu lisible et structuré</li>
                      <li>□ Meta descriptions accessibles</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Performance et technique ✓</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>□ Score Lighthouse &gt; 90 (toutes catégories)</li>
                      <li>□ Navigation clavier fonctionnelle</li>
                      <li>□ Contrastes conformes RGAA AA</li>
                      <li>□ Site mobile-friendly</li>
                      <li>□ Temps de chargement &lt; 3s</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Conclusion et CTA */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Conclusion</h2>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  L'accessibilité et le SEO ne sont plus des considérations séparées : ils forment un écosystème intégré qui détermine le succès en ligne. En 2025, les sites qui excellent dans les deux domaines dominent les résultats de recherche.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-8">
                  Investir dans l'accessibilité, c'est investir dans un SEO durable et performant. C'est aussi contribuer à un web plus inclusif pour tous les utilisateurs.
                </p>

                <div className="flex justify-center">
                  <Link 
                    href="/" 
                    className="inline-flex items-center bg-blue-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-blue-700 focus:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Auditer votre site maintenant
                  </Link>
                </div>
              </div>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
} 