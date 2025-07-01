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
    <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
      {faqItems.map((item, index) => (
        <div key={index} className="pt-6">
          <dt>
            <button
              onClick={() => toggleItem(index)}
              className="flex w-full items-start justify-between text-left text-gray-900"
              aria-expanded={openItems.includes(index)}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="text-base font-semibold leading-7">{item.question}</span>
              <span className="ml-6 flex h-7 items-center">
                {openItems.includes(index) ? (
                  <ChevronUp className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-6 w-6" aria-hidden="true" />
                )}
              </span>
            </button>
          </dt>
          {openItems.includes(index) && (
            <dd id={`faq-answer-${index}`} className="mt-2 pr-12">
              <p className="text-base leading-7 text-gray-600">{item.answer}</p>
            </dd>
          )}
        </div>
      ))}
      <div className="pt-6">
        <div className="rounded-2xl bg-gray-50 p-6">
          <div className="flex items-center gap-x-3">
            <BookOpen className="h-6 w-6 text-blue-600" aria-hidden="true" />
            <h3 className="text-base font-semibold leading-7 text-gray-900">Besoin d'aide supplémentaire ?</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Consultez notre section blog pour des guides détaillés sur l'accessibilité web.
          </p>
          <div className="mt-4">
            <a 
              href="/blog" 
              className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500"
            >
              Accéder au blog <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </dl>
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
  const [activeSection, setActiveSection] = useState<'home' | 'statistics' | 'analyze' | 'rgaa-reference' | 'history'>('home');

  // Détecter les paramètres URL pour changer de section automatiquement
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section && ['statistics', 'analyze', 'rgaa-reference', 'history'].includes(section)) {
      setActiveSection(section as 'statistics' | 'analyze' | 'rgaa-reference' | 'history');
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
  const handleSidebarSectionChange = (section: 'statistics' | 'analyze' | 'rgaa-reference' | 'history') => {
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
  const handleTopBarSectionChange = (section: 'home' | 'statistics' | 'analyze' | 'rgaa-reference') => {
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
    const formElement = document.getElementById('audit-form-home');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      const firstInput = formElement.querySelector('input') as HTMLElement;
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 500);
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
    <div className="min-h-screen bg-white">
        {/* Skip to main content link pour l'accessibilité */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:ring-2 focus:ring-blue-300"
        >
          Aller au contenu principal
        </a>

        {/* Topbar Navigation */}
        <TopBar 
          activeSection={activeSection === 'history' || activeSection === 'statistics' ? 'home' : activeSection} 
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
        <main id="main-content" className={`${activeSection !== 'home' ? 'ml-64' : ''} relative`}>
          
          {/* Page d'accueil */}
          {activeSection === 'home' && (
            <>
              {/* Hero Section - Inspiré de Salient */}
              <div className="relative overflow-hidden bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                      Audit d'accessibilité {' '}
                      <span className="text-blue-600">RGAA</span> simplifié
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      Analysez votre site web en quelques secondes et identifiez les problèmes d'accessibilité. 
                      Conforme aux standards RGAA 4.1 et WCAG 2.1.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                      <button
                        onClick={() => {
                          const formElement = document.getElementById('audit-form-home');
                          if (formElement) {
                            formElement.scrollIntoView({ behavior: 'smooth' });
                            const firstInput = formElement.querySelector('input') as HTMLElement;
                            if (firstInput) {
                              setTimeout(() => firstInput.focus(), 500);
                            }
                          }
                        }}
                        className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Analyser maintenant
                      </button>
                      <a href="/blog" className="text-sm font-semibold leading-6 text-gray-900">
                        En savoir plus <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulaire d'audit - Design Salient */}
              <section id="audit-form-home" className="py-24 sm:py-32 bg-gray-50" aria-labelledby="audit-form-home-heading">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl">
                    <h2 id="audit-form-home-heading" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-8">
                      Analyser votre site Web
                    </h2>
                    <p className="text-lg leading-8 text-gray-600 text-center mb-12">
                      Entrez l'URL de votre site pour commencer l'audit d'accessibilité
                    </p>
                    <AuditForm
                      onAuditStart={handleAuditStart}
                      progress={progress}
                      isAnalyzing={isAnalyzing}
                      analysisError={error}
                    />
                  </div>
                </div>
              </section>

              {/* Features - Style Salient */}
              <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Fonctionnalités</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      Tout ce dont vous avez besoin pour l'accessibilité
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      Notre plateforme combine plusieurs moteurs d'analyse pour vous donner une vue complète 
                      des problèmes d'accessibilité de votre site.
                    </p>
                  </div>
                  <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                      <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                            <Zap className="h-6 w-6 text-white" aria-hidden="true" />
                          </div>
                          Analyse semi-automatique
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">
                          Analyse rapide avec WAVE, Axe Core et le moteur RGAA exclusif. Aucune intelligence artificielle n'est utilisée.
                        </dd>
                      </div>
                      <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                            <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                          </div>
                          Conformité légale
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">
                          Respect des standards RGAA 4.1 et WCAG 2.1 pour votre mise en conformité réglementaire.
                        </dd>
                      </div>
                      <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                            <Users className="h-6 w-6 text-white" aria-hidden="true" />
                          </div>
                          Impact social
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">
                          Rendez votre site accessible à tous, y compris aux 12 millions de personnes en situation de handicap en France.
                        </dd>
                      </div>
                      <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                            <AlertTriangle className="h-6 w-6 text-white" aria-hidden="true" />
                          </div>
                          Limites de l'automatisation
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">
                          Cet outil détecte environ 30% des problèmes d'accessibilité. Un guide d'analyse manuelle est disponible pour une conformité complète.
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>

              {/* Types de handicaps - Style Salient */}
              <section className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Accessibilité</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      À qui s'adresse l'accessibilité ?
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      L'accessibilité numérique bénéficie à toutes les personnes, avec ou sans handicap.
                    </p>
                  </div>
                  <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                          <Eye className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                          Handicaps visuels
                        </dt>
                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                          <p className="flex-auto">Cécité, malvoyance, daltonisme</p>
                          <div className="mt-6">
                            <ul className="text-sm text-gray-500 space-y-1">
                              <li>• Lecteurs d'écran</li>
                              <li>• Contrastes élevés</li>
                              <li>• Alternatives textuelles</li>
                            </ul>
                          </div>
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                          <Headphones className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                          Handicaps auditifs
                        </dt>
                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                          <p className="flex-auto">Surdité, malentendance</p>
                          <div className="mt-6">
                            <ul className="text-sm text-gray-500 space-y-1">
                              <li>• Sous-titres</li>
                              <li>• Langue des signes</li>
                              <li>• Transcriptions</li>
                            </ul>
                          </div>
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                          <MousePointer className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                          Handicaps moteurs
                        </dt>
                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                          <p className="flex-auto">Paralysie, amputations, tremblements</p>
                          <div className="mt-6">
                            <ul className="text-sm text-gray-500 space-y-1">
                              <li>• Navigation au clavier</li>
                              <li>• Zones de clic étendues</li>
                              <li>• Commande vocale</li>
                            </ul>
                          </div>
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                          <Brain className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                          Handicaps cognitifs
                        </dt>
                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                          <p className="flex-auto">Dyslexie, TDAH, troubles de la mémoire</p>
                          <div className="mt-6">
                            <ul className="text-sm text-gray-500 space-y-1">
                              <li>• Contenu simplifié</li>
                              <li>• Navigation claire</li>
                              <li>• Temps de lecture adapté</li>
                            </ul>
                          </div>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>

              {/* FAQ Section - Style Salient */}
              <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
                    <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Questions fréquentes</h2>
                    <FAQSection />
                  </div>
                </div>
              </section>

            </>
          )}

          {/* Page Statistiques */}
          {activeSection === 'statistics' && (
            <div className="min-h-screen bg-white">
              <Statistics />
            </div>
          )}

          {/* Page Analyser */}
          {activeSection === 'analyze' && (
            <div className="bg-white">
              {/* Formulaire d'audit - visible seulement quand il n'y a pas de résultats */}
              {!auditResult && !comparativeResult && (
                <section id="audit-form" className="py-24 sm:py-32" aria-labelledby="audit-form-heading">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl">
                      <h2 id="audit-form-heading" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-8">
                        Analyser votre site Web
                      </h2>
                      <AuditForm
                        onAuditStart={handleAuditStart}
                        progress={progress}
                        isAnalyzing={isAnalyzing}
                        analysisError={error}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Résultats d'audit - si disponibles */}
              {auditResult && (
                <section id="audit-results" className="py-8">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <AuditResults 
                      result={auditResult} 
                      language={language}
                      onNewAudit={handleNewAudit}
                    />
                  </div>
                </section>
              )}

              {/* Résultats comparatifs - si disponibles */}
              {comparativeResult && (
                <section id="audit-results" className="py-8">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <ComparativeTable 
                      result={comparativeResult} 
                      language={language}
                      onEngineClick={handleEngineClick}
                    />
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Page Référentiel RGAA */}
          {activeSection === 'rgaa-reference' && (
            <div className="bg-white">
              <RGAAReference />
            </div>
          )}

          {/* Page Historique */}
          {activeSection === 'history' && (
            <div className="min-h-screen bg-white">
              <AuditHistory 
                onResumeAudit={handleResumeAudit}
              />
            </div>
          )}

        </main>

        {/* Footer - seulement sur la page d'accueil */}
        {activeSection === 'home' && <Footer />}
      </div>
  );
}
