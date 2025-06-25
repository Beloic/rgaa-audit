'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Calendar, Clock, ArrowRight, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const { language } = useLanguage();

  const articles = [
    {
      id: 'rgaa-2025-nouvelles-regles',
      title: 'RGAA 2025 : 5 nouvelles règles à connaître',
      excerpt: 'Découvrez les évolutions majeures du RGAA qui entreront en vigueur en 2025. Nouvelles obligations, critères renforcés et impacts pour les sites web.',
      date: '2024-12-03',
      readTime: '8 min',
      category: 'Réglementation',
      image: '🚨',
      tags: ['RGAA', 'Réglementation', '2025'],
      featured: true
    },
    {
      id: 'erreurs-accessibilite-courantes-2025',
      title: 'Top 10 des erreurs d\'accessibilité les plus courantes',
      excerpt: 'Évitez les pièges les plus fréquents en matière d\'accessibilité web. Guide pratique avec exemples concrets et solutions pour chaque problème identifié.',
      date: '2024-11-28',
      readTime: '12 min',
      category: 'Guide',
      image: '⚠️',
      tags: ['RGAA', 'Erreurs', 'Guide'],
      featured: false
    },
    {
      id: 'accessibilite-seo-guide-complet',
      title: 'Accessibilité et SEO : le guide complet 2025',
      excerpt: 'Comment l\'accessibilité web améliore votre référencement naturel. Techniques, outils et stratégies pour allier performance SEO et inclusion numérique.',
      date: '2024-11-25',
      readTime: '15 min',
      category: 'SEO',
      image: '🔍',
      tags: ['SEO', 'RGAA', 'Performance'],
      featured: false
    },
    {
      id: 'accessibilite-mobile-bonnes-pratiques',
      title: 'Accessibilité mobile : bonnes pratiques 2025',
      excerpt: 'Optimisez l\'accessibilité de vos applications mobiles. Techniques de design inclusif, tests utilisateurs et conformité RGAA sur mobile.',
      date: '2024-11-20',
      readTime: '10 min',
      category: 'Mobile',
      image: '📱',
      tags: ['Mobile', 'RGAA', 'UX'],
      featured: false
    }
  ];

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
        <header className="text-center px-6 pt-16 pb-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog RGAA Audit
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Actualités, guides et bonnes pratiques pour l'accessibilité web
          </p>
        </header>

        {/* Articles */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          {/* Article mis en avant */}
          {articles.find(article => article.featured) && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">À la une</h2>
              {(() => {
                const featuredArticle = articles.find(article => article.featured)!;
                return (
                  <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-4xl" role="img" aria-label="Alerte">{featuredArticle.image}</span>
                        <div>
                          <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                            {featuredArticle.category}
                          </span>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" aria-hidden="true" />
                              <span>{featuredArticle.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" aria-hidden="true" />
                              <span>{featuredArticle.readTime} de lecture</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        <Link 
                          href={`/blog/${featuredArticle.id}`}
                          className="hover:text-blue-600 focus:text-blue-600 transition-colors focus:outline-none focus:underline"
                        >
                          {featuredArticle.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>
                      
                      <Link 
                        href={`/blog/${featuredArticle.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 focus:text-blue-700 font-medium transition-colors focus:outline-none focus:underline"
                      >
                        Lire l'article complet
                        <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })()}
            </div>
          )}

          {/* Tous les articles */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Tous les articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article key={article.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl" role="img" aria-label="Icône de l'article">{article.image}</span>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      <Link 
                        href={`/blog/${article.id}`}
                        className="hover:text-blue-600 focus:text-blue-600 transition-colors focus:outline-none focus:underline"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
} 