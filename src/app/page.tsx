'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import AuditForm from '@/components/AuditForm';
import AuditResults from '@/components/AuditResults';
import ComparativeTable from '@/components/ComparativeTable';
import Statistics from '@/components/Statistics';
import RGAAReference from '@/components/RGAAReference';
import AuditHistory, { saveAuditToHistory } from '@/components/AuditHistory';
import Footer from '@/components/Footer';
import type { AuditRequest, AuditResult, ComparativeResult, AnalysisProgress } from '@/types/audit';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import SimulateurHandicap from '@/app/simulateur-handicap/page';
import QuizPage from '@/app/quiz/page';

import { 
  Shield, 
  Zap, 
  Users, 
  AlertTriangle, 
  BookOpen, 
  Eye,
  Headphones,
  MousePointer,
  Brain,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Composant FAQ
function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
      question: "Qu'est-ce que le RGAA et pourquoi est-il important ?",
      answer: "Le RGAA (Référentiel Général d'Amélioration de l'Accessibilité) est le standard français pour l'accessibilité numérique. Il est obligatoire pour les sites publics et les entreprises de plus de 250 salariés depuis 2019. Il garantit que votre site est accessible à tous les utilisateurs, y compris ceux en situation de handicap."
    },
    {
      question: "Cet outil détecte-t-il tous les problèmes d'accessibilité ?",
      answer: "Non, comme tous les outils automatisés, notre plateforme détecte environ 30% des problèmes d'accessibilité. Les 70% restants nécessitent un audit manuel par un expert. Cependant, notre outil vous donne une excellente base de départ et identifie les erreurs les plus courantes et critiques."
    },
    {
      question: "Quelle est la différence entre WAVE, Axe Core et le moteur RGAA ?",
      answer: "WAVE (WebAIM) excelle dans la détection des erreurs critiques avec une interface visuelle claire. Axe Core (Deque) offre une analyse plus approfondie avec des règles WCAG détaillées. Notre moteur RGAA est spécialement adapté aux critères français du RGAA 4.1. L'analyse comparative utilise les trois pour une couverture maximale."
    },
    {
      question: "Que faire après avoir identifié les problèmes ?",
      answer: "Une fois les problèmes identifiés, consultez nos guides de correction détaillés pour chaque type d'erreur. Nous recommandons de prioriser les erreurs critiques (en rouge) puis les alertes (en orange). N'hésitez pas à utiliser notre référentiel RGAA intégré pour comprendre les critères spécifiques."
    },
    {
      question: "L'outil fonctionne-t-il sur tous les types de sites ?",
      answer: "Notre outil analyse les sites web publics accessibles via une URL. Il fonctionne sur la plupart des sites (statiques, CMS, e-commerce, etc.) mais peut avoir des limitations sur les sites nécessitant une authentification ou utilisant beaucoup de JavaScript côté client."
    }
  ];

  return (
    <section aria-labelledby="faq-heading" className="px-6 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Questions fréquentes
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12">
          Tout ce que vous devez savoir sur l'audit d'accessibilité
        </p>
        
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <article key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg transition-colors"
                aria-expanded={openItems.includes(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="font-semibold text-gray-900 pr-4">{item.question}</h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
                )}
              </button>
              {openItems.includes(index) && (
                <div id={`faq-answer-${index}`} className="px-6 pb-4">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )}
            </article>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-blue-50 p-6 rounded-xl">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" aria-hidden="true" />
            <h3 className="font-semibold text-gray-900 mb-2">Besoin d'aide supplémentaire ?</h3>
            <p className="text-gray-600 mb-4">
              Consultez notre section blog pour des guides détaillés sur l'accessibilité web.
            </p>
            <a 
              href="/blog" 
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 focus:text-blue-700 focus:outline-none focus:underline"
            >
              Accéder au blog
              <Search className="w-4 h-4 ml-2" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { language, t } = useLanguage();
  const { user, updateUser } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [comparativeResult, setComparativeResult] = useState<ComparativeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>({
    step: 'idle',
    message: 'En attente...',
    progress: 0
  });
  const [activeSection, setActiveSection] = useState<'home' | 'statistics' | 'analyze' | 'rgaa-reference' | 'history' | 'disability-simulator' | 'quiz'>('home');

  // Détecter les paramètres URL pour changer de section automatiquement
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section && ['statistics', 'analyze', 'rgaa-reference', 'history', 'disability-simulator', 'quiz'].includes(section)) {
      setActiveSection(section as 'statistics' | 'analyze' | 'rgaa-reference' | 'history' | 'disability-simulator' | 'quiz');
    } else if (window.location.pathname === '/' && !section) {
      // Si on est sur la page d'accueil sans paramètre, rester sur home
      setActiveSection('home');
    }
  }, []);

  // Mettre à jour l'URL quand la section change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (activeSection === 'home') {
        url.searchParams.delete('section');
      } else {
        url.searchParams.set('section', activeSection);
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [activeSection]);

  // Fonctions de gestion de l'historique
  const handleResumeAudit = (auditData: { result: AuditResult | ComparativeResult; engine: 'wave' | 'axe' | 'rgaa' | 'all' }) => {
    // Distinguer entre résultat normal et comparatif
    if (auditData.engine === 'all') {
      setComparativeResult(auditData.result as ComparativeResult);
      setAuditResult(null);
    } else {
      setAuditResult(auditData.result as AuditResult);
      setComparativeResult(null);
    }
    
    setError(null);
    setProgress({ step: 'complete', message: 'Audit repris avec succès !', progress: 100 });
    setActiveSection('analyze');
    
    // Scroll vers les résultats
    setTimeout(() => {
      const resultsElement = document.getElementById('audit-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
        resultsElement.focus();
      }
    }, 500);
  };

  // Fonction pour gérer les changements de section de la sidebar
  const handleSidebarSectionChange = (section: 'statistics' | 'analyze' | 'rgaa-reference' | 'history' | 'disability-simulator' | 'quiz') => {
    setActiveSection(section);
    
    // Réinitialiser les résultats si on revient sur analyser et qu'il n'y a pas d'analyse en cours
    if (section === 'analyze' && !isAnalyzing) {
      setAuditResult(null);
      setComparativeResult(null);
      setError(null);
      setProgress({ step: 'idle', message: t('ui.waiting'), progress: 0 });
    }
  };

  // Fonction pour la TopBar (sans history)
  const handleTopBarSectionChange = (section: 'home' | 'statistics' | 'analyze' | 'rgaa-reference' | 'quiz') => {
    setActiveSection(section);
    
    // Réinitialiser les résultats si on revient sur analyser et qu'il n'y a pas d'analyse en cours
    if (section === 'analyze' && !isAnalyzing) {
      setAuditResult(null);
      setComparativeResult(null);
      setError(null);
      setProgress({ step: 'idle', message: t('ui.waiting'), progress: 0 });
    }
  };

  const handleAuditStart = async (request: AuditRequest) => {
    setIsAnalyzing(true);
    setError(null);
    setAuditResult(null);
    setComparativeResult(null);
    
    // Messages de progression différents selon le type d'analyse
    const isComparative = request.engine === 'all';
    const initialMessage = isComparative 
      ? 'Préparation de l\'analyse comparative...' 
      : 'Préparation de l\'analyse...';
    
    setProgress({ step: 'fetching', message: initialMessage, progress: 10 });

    // Simuler la progression manuelle sans arriver à 100%
    const progressSteps = isComparative ? [
      { step: 'fetching' as const, message: 'Lancement des 3 moteurs d\'analyse...', progress: 20 },
      { step: 'parsing' as const, message: 'Analyse RGAA, WAVE et Axe Core en parallèle...', progress: 40 },
      { step: 'analyzing' as const, message: 'Comparaison des résultats...', progress: 80 }
    ] : [
      { step: 'fetching' as const, message: 'Récupération du contenu...', progress: 20 },
      { step: 'parsing' as const, message: 'Analyse du HTML...', progress: 40 },
      { step: 'analyzing' as const, message: 'Analyse d\'accessibilité en cours...', progress: 80 }
    ];

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setProgress(progressSteps[currentStep]);
        currentStep++;
      }
    }, isComparative ? 2000 : 1500); // Plus de temps pour l'analyse comparative

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          userData: user // Envoyer les données utilisateur pour le comptage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'analyse');
      }

      const result = await response.json();
      
      // Mettre à jour les données utilisateur si elles ont été modifiées
      if (result.updatedUserData && updateUser) {
        updateUser(result.updatedUserData);
        console.log('✅ Données utilisateur mises à jour après audit');
      }
      
      // Nettoyer l'intervalle de progression
      clearInterval(progressInterval);
      
      // Marquer comme terminé seulement quand l'API a répondu avec des données valides
      const completeMessage = isComparative 
        ? 'Analyse comparative terminée !' 
        : 'Analyse terminée !';
      setProgress({ step: 'complete', message: completeMessage, progress: 100 });
      
      // Distinguer entre résultat normal et comparatif
      if (request.engine === 'all') {
        setComparativeResult(result as ComparativeResult);
        // Sauvegarder dans l'historique
        saveAuditToHistory(result as ComparativeResult, 'all', user?.email);
      } else {
        setAuditResult(result as AuditResult);
        // Sauvegarder dans l'historique
        saveAuditToHistory(result as AuditResult, request.engine || 'rgaa', user?.email);
      }
      
      setIsAnalyzing(false);
      
      // Rediriger vers la page Analyser après l'audit
      setActiveSection('analyze');
      
      // Scroll vers les résultats avec focus pour l'accessibilité
      setTimeout(() => {
        const resultsElement = document.getElementById('audit-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
          resultsElement.focus();
        }
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      let errorMessage = err instanceof Error ? err.message : t('ui.errorOccurred');
      
      // Gestion spécifique de l'erreur de vérification d'email
      if (errorMessage.includes('Veuillez vérifier votre adresse email')) {
        errorMessage = language === 'fr' 
          ? `Veuillez vérifier votre adresse email avant de pouvoir effectuer des analyses. Consultez votre boîte mail pour le lien de confirmation.`
          : `Please verify your email address before performing analyses. Check your inbox for the confirmation link.`;
      }
      // Améliorer le message pour les erreurs de rate limiting
      else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
        errorMessage = language === 'fr' 
          ? `⏰ Limite d'analyse atteinte. L'outil gratuit a des limitations pour maintenir le service accessible à tous.`
          : `⏰ Analysis limit reached. The free tool has limitations to keep the service accessible to everyone.`;
      }
      
      setError(errorMessage);
      setProgress({ step: 'error', message: errorMessage, progress: 0 });
      setIsAnalyzing(false);
      console.error('Audit error:', err);
    }
  };

  const handleNewAudit = () => {
    setAuditResult(null);
    setComparativeResult(null);
    setError(null);
    setProgress({ step: 'idle', message: t('ui.waiting'), progress: 0 });
    
    // Scroll vers le formulaire avec focus pour l'accessibilité
    const formElement = document.getElementById('audit-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      const firstInput = formElement.querySelector('input, select, textarea') as HTMLElement;
      if (firstInput) {
        firstInput.focus();
      }
    }
  };

  // Fonction pour gérer le clic sur "Analyser" depuis la TopBar
  const handleAnalyzeClick = () => {
    setActiveSection('analyze');
    // Réinitialiser les résultats si on revient sur analyser
    if (!isAnalyzing) {
      setAuditResult(null);
      setComparativeResult(null);
      setError(null);
      setProgress({ step: 'idle', message: t('ui.waiting'), progress: 0 });
    }
  };

  // Fonction pour gérer le clic sur un moteur dans l'analyse comparative
  const handleEngineClick = async (engine: 'wave' | 'axe' | 'rgaa', url: string) => {
    // Réinitialiser les résultats
    setComparativeResult(null);
    setAuditResult(null);
    setError(null);
    
    // Lancer une nouvelle analyse avec le moteur sélectionné
    const auditRequest: AuditRequest = {
      url: url,
      engine: engine,
      language: language
    };
    
    await handleAuditStart(auditRequest);
  };

  return (
          <div className="min-h-screen bg-blue-50">
        {/* Skip to main content link pour l'accessibilité */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:ring-2 focus:ring-blue-300"
        >
          Aller au contenu principal
        </a>

        {/* Topbar Navigation */}
        <TopBar 
          activeSection={activeSection === 'history' || activeSection === 'statistics' || activeSection === 'disability-simulator' || activeSection === 'quiz' ? 'home' : activeSection} 
          onSectionChange={handleTopBarSectionChange}
          onAnalyzeClick={handleAnalyzeClick}
        />

        {/* Banner de vérification d'email */}
        <div className={`${activeSection !== 'home' ? 'ml-64' : ''} relative z-10`}>
          <div className="px-6 pt-4">
            <EmailVerificationBanner />
          </div>
        </div>

        {/* Sidebar - seulement sur les pages autres que home */}
        {activeSection !== 'home' && (
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={handleSidebarSectionChange}
          />
        )}

        {/* Main Content */}
        <main id="main-content" className={`${activeSection !== 'home' ? 'ml-64' : ''} relative z-10`}>
          
          {/* Page d'accueil */}
          {activeSection === 'home' && (
            <>
              {/* Hero Section */}
              <div className="relative">
                {/* Hero Content */}
                <header className="text-center px-6 py-20 max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                    <span className="text-gray-900">
                      {t('home.mainTitle')}
                    </span>
                    <span className="text-blue-600">RGAA</span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                    {t('home.mainDescription')}
                  </p>
                </header>
              </div>

              {/* Formulaire d'audit sur la page d'accueil */}
              <section id="audit-form-home" className={`px-6 max-w-4xl mx-auto ${isAnalyzing ? "mb-8" : "mb-20"}`} aria-labelledby="audit-form-home-heading">
                <h2 id="audit-form-home-heading" className="sr-only">Formulaire d'audit d'accessibilité</h2>
                <AuditForm
                  onAuditStart={handleAuditStart}
                  progress={progress}
                  isAnalyzing={isAnalyzing}
                  analysisError={error}
                />
              </section>

              {/* Features - sur la page d'accueil */}
              <section aria-labelledby="features-heading" className="px-6 pb-20 max-w-6xl mx-auto">
                <h2 id="features-heading" className="sr-only">Fonctionnalités principales</h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <article className="flex flex-col items-center p-6 bg-white/80 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500">
                    <Zap className="w-12 h-12 text-blue-600 mb-4" aria-hidden="true" />
                    <h3 className="font-semibold text-gray-900 mb-2 text-center">Analyse semi-automatique</h3>
                    <p className="text-gray-600 text-center">Analyse rapide avec WAVE, Axe Core et le moteur RGAA exclusif. Aucune intelligence artificielle n'est utilisée.</p>
                  </article>
                  <article className="flex flex-col items-center p-6 bg-white/80 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500">
                    <Shield className="w-12 h-12 text-purple-600 mb-4" aria-hidden="true" />
                    <h3 className="font-semibold text-gray-900 mb-2 text-center">Conformité légale</h3>
                    <p className="text-gray-600 text-center">Respect des standards RGAA 4.1 et WCAG 2.1 pour votre mise en conformité réglementaire</p>
                  </article>
                  <article className="flex flex-col items-center p-6 bg-white/80 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500">
                    <Users className="w-12 h-12 text-green-600 mb-4" aria-hidden="true" />
                    <h3 className="font-semibold text-gray-900 mb-2 text-center">Impact social</h3>
                    <p className="text-gray-600 text-center">Rendez votre site accessible à tous, y compris aux 12 millions de personnes en situation de handicap en France</p>
                  </article>
                  <article className="flex flex-col items-center p-6 bg-white/80 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500">
                    <AlertTriangle className="w-12 h-12 text-orange-600 mb-4" aria-hidden="true" />
                    <h3 className="font-semibold text-gray-900 mb-2 text-center">Limites de l'automatisation</h3>
                    <p className="text-gray-600 text-center">Cet outil détecte environ 30% des problèmes d'accessibilité. Un guide d'analyse manuelle est disponible pour une conformité complète</p>
                  </article>
                </div>
              </section>

                            {/* Types de handicaps - Section éducative */}
              <section aria-labelledby="disabilities-types-heading" className="px-6 py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                  <h2 id="disabilities-types-heading" className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                    À qui s'adresse l'accessibilité ?
                  </h2>
                  <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
                    L'accessibilité numérique bénéficie à toutes les personnes, avec ou sans handicap
                  </p>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <article className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <Eye className="w-12 h-12 text-red-600 mb-4" aria-hidden="true" />
                      <h3 className="font-semibold text-gray-900 mb-3">Handicaps visuels</h3>
                      <p className="text-gray-600 text-sm mb-4">Cécité, malvoyance, daltonisme</p>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• Lecteurs d'écran</li>
                        <li>• Contrastes élevés</li>
                        <li>• Alternatives textuelles</li>
                      </ul>
                    </article>
                    
                    <article className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <Headphones className="w-12 h-12 text-blue-600 mb-4" aria-hidden="true" />
                      <h3 className="font-semibold text-gray-900 mb-3">Handicaps auditifs</h3>
                      <p className="text-gray-600 text-sm mb-4">Surdité, malentendance</p>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• Sous-titres</li>
                        <li>• Langue des signes</li>
                        <li>• Transcriptions</li>
                      </ul>
                    </article>
                    
                    <article className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <MousePointer className="w-12 h-12 text-green-600 mb-4" aria-hidden="true" />
                      <h3 className="font-semibold text-gray-900 mb-3">Handicaps moteurs</h3>
                      <p className="text-gray-600 text-sm mb-4">Paralysie, amputations, tremblements</p>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• Navigation au clavier</li>
                        <li>• Zones de clic étendues</li>
                        <li>• Commande vocale</li>
                      </ul>
                    </article>
                    
                    <article className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <Brain className="w-12 h-12 text-purple-600 mb-4" aria-hidden="true" />
                      <h3 className="font-semibold text-gray-900 mb-3">Handicaps cognitifs</h3>
                      <p className="text-gray-600 text-sm mb-4">Dyslexie, TDAH, troubles de la mémoire</p>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• Contenu simplifié</li>
                        <li>• Navigation claire</li>
                        <li>• Temps de lecture adapté</li>
                      </ul>
                    </article>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <FAQSection />


            </>
          )}

          {/* Page Statistiques */}
          {activeSection === 'statistics' && (
            <div className="min-h-screen">
              <Statistics />
            </div>
          )}

          {/* Page Analyser */}
          {activeSection === 'analyze' && (
            <>
              {/* Formulaire d'audit - visible seulement quand il n'y a pas de résultats */}
              {!auditResult && !comparativeResult && (
                <section id="audit-form" className="px-6 min-h-[calc(100vh-4rem)] flex items-center justify-center" aria-labelledby="audit-form-heading">
                  <div className="w-full max-w-4xl mx-auto">
                    <h2 id="audit-form-heading" className="sr-only">Formulaire d'audit d'accessibilité</h2>
                    <AuditForm
                      onAuditStart={handleAuditStart}
                      progress={progress}
                      isAnalyzing={isAnalyzing}
                      analysisError={error}
                    />
                  </div>
                </section>
              )}

              {/* Résultats d'audit - si disponibles */}
              {auditResult && (
                <section id="audit-results" className="px-6 max-w-6xl mx-auto pt-8">
                  <AuditResults 
                    result={auditResult} 
                    language={language}
                    onNewAudit={handleNewAudit}
                  />
                </section>
              )}

              {/* Résultats comparatifs - si disponibles */}
              {comparativeResult && (
                <section id="audit-results" className="px-6 max-w-7xl mx-auto pt-8">
                  <ComparativeTable 
                    result={comparativeResult} 
                    language={language}
                    onEngineClick={handleEngineClick}
                  />
                </section>
              )}

            </>
          )}

          {/* Page Référentiel RGAA */}
          {activeSection === 'rgaa-reference' && (
            <RGAAReference />
          )}

          {/* Page Historique */}
          {activeSection === 'history' && (
            <div className="min-h-screen">
              <AuditHistory 
                onResumeAudit={handleResumeAudit}
              />
            </div>
          )}

          {/* Page Simulateur d'Handicap */}
          {activeSection === 'disability-simulator' && (
            <SimulateurHandicap />
          )}

          {/* Page Quiz */}
          {activeSection === 'quiz' && (
            <QuizPage />
          )}

        </main>

        {/* Footer - seulement sur la page d'accueil */}
        {activeSection === 'home' && <Footer />}
      </div>
  );
}
