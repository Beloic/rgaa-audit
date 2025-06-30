'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Calendar, Clock, ArrowRight, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const { language, t } = useLanguage();

  const articles = [
    {
      id: 'rgaa-2025-nouvelles-regles',
      title: t('article.rgaa2025.title'),
      excerpt: t('article.rgaa2025.excerpt'),
      date: '2024-12-03',
      readTime: '8',
      category: t('article.categories.regulation'),
      image: '🚨',
      tags: ['RGAA', t('article.categories.regulation'), '2025'],
      featured: true
    },
    {
      id: 'erreurs-accessibilite-courantes-2025',
      title: t('article.errors2025.title'),
      excerpt: t('article.errors2025.excerpt'),
      date: '2024-11-28',
      readTime: '12',
      category: t('article.categories.guide'),
      image: '⚠️',
      tags: ['RGAA', t('article.categories.guide')],
      featured: false
    },
    {
      id: 'accessibilite-seo-guide-complet',
      title: t('article.seoGuide.title'),
      excerpt: t('article.seoGuide.excerpt'),
      date: '2024-11-25',
      readTime: '15',
      category: t('article.categories.seo'),
      image: '🔍',
      tags: [t('article.categories.seo'), 'RGAA', 'Performance'],
      featured: false
    },
    {
      id: 'accessibilite-mobile-bonnes-pratiques',
      title: t('article.mobile.title'),
      excerpt: t('article.mobile.excerpt'),
      date: '2024-11-20',
      readTime: '10',
      category: t('article.categories.mobile'),
      image: '📱',
      tags: [t('article.categories.mobile'), 'RGAA', 'UX'],
      featured: false
    },
    {
      id: 'comment-tester-accessibilite-site-web',
      title: t('article.testing.title'),
      excerpt: t('article.testing.excerpt'),
      date: '2024-11-15',
      readTime: '10',
      category: t('article.categories.testing'),
      image: '🧪',
      tags: [t('article.categories.testing'), 'RGAA', t('article.categories.guide')],
      featured: false
    },
    {
      id: 'couleurs-contrastes-wcag-guide',
      title: t('article.colors.title'),
      excerpt: t('article.colors.excerpt'),
      date: '2024-11-10',
      readTime: '12',
      category: t('article.categories.colors'),
      image: '🎨',
      tags: [t('article.categories.colors'), 'WCAG', t('article.categories.guide')],
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
        {t('blog.skipToContent')}
      </a>

      {/* Topbar Navigation */}
      <TopBar />

      {/* Main Content */}
      <main id="main-content" className="relative z-10">
        {/* Header */}
        <header className="text-center px-6 pt-16 pb-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </header>

        {/* Articles */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          {/* Article mis en avant */}
          {articles.find(article => article.featured) && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('blog.featured')}</h2>
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
                              <span>{featuredArticle.readTime} {t('blog.readTime')}</span>
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
                        {t('blog.readFullArticle')}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('blog.allArticles')}</h2>
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
                        <span>{article.readTime} {t('blog.readTime')}</span>
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