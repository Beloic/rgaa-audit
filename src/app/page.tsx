'use client';

import { useState, useEffect } from 'react';
import AuditForm from '@/components/AuditForm';
import AuditResults from '@/components/AuditResults';
import ComparativeTable from '@/components/ComparativeTable';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import ManualAuditPage from '@/components/ManualAuditPage';
import RGAAReference from '@/components/RGAAReference';

import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Zap, Target, Users, Star, AlertTriangle } from 'lucide-react';
import Footer from '@/components/Footer';
import type { AuditRequest, AuditResult, ComparativeResult, AnalysisProgress } from '@/types/audit';

export default function HomePage() {
  const { language } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [comparativeResult, setComparativeResult] = useState<ComparativeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>({
    step: 'idle',
    message: 'En attente...',
    progress: 0
  });
  const [activeSection, setActiveSection] = useState<'home' | 'analyze' | 'manual-audit' | 'rgaa-reference'>('home');

  // Détecter les paramètres URL pour changer de section automatiquement
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section && ['analyze', 'manual-audit', 'rgaa-reference'].includes(section)) {
      setActiveSection(section as 'analyze' | 'manual-audit' | 'rgaa-reference');
    }
  }, []);

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
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'analyse');
      }

      const result = await response.json();
      
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
      } else {
        setAuditResult(result as AuditResult);
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
      let errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      
      // Améliorer le message pour les erreurs de rate limiting
      if (errorMessage.includes('Limite de') && errorMessage.includes('requêtes')) {
        errorMessage = `⏰ ${errorMessage}\n\n💡 L'application utilise des crédits OpenAI limités pour l'analyse. Cette limite aide à maintenir le service gratuit pour tous.`;
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
    setProgress({ step: 'idle', message: 'En attente...', progress: 0 });
    
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

  // Nouvelle fonction pour démarrer une nouvelle analyse sans effacer les résultats précédents
  const handleStartNewAnalysis = () => {
    // Réinitialiser seulement l'état de progression et les erreurs
    setError(null);
    setProgress({ step: 'idle', message: 'En attente...', progress: 0 });
    
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
      setProgress({ step: 'idle', message: 'En attente...', progress: 0 });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Skip to main content link pour l'accessibilité */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:ring-2 focus:ring-blue-300"
        >
          Aller au contenu principal
        </a>

        {/* Topbar Navigation */}
        <TopBar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          onAnalyzeClick={handleAnalyzeClick}
        />

        {/* Sidebar Navigation - Masquée sur la page d'accueil */}
        {activeSection !== 'home' && (
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            hasAnalysis={!!auditResult || !!comparativeResult || isAnalyzing}
          />
        )}

        {/* Main Content */}
        <main id="main-content" className={`relative z-10 ${activeSection !== 'home' ? 'ml-64' : ''}`}>
          
          {/* Page d'accueil */}
          {activeSection === 'home' && (
            <>
              {/* Hero Section */}
              <div className="relative">
                {/* Hero Content */}
                <header className="text-center px-6 py-20 max-w-4xl mx-auto">
                  {/* Badge Product Hunt centré */}
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-2 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-sm border border-white/30" aria-label="Note sur Product Hunt">
                      <div className="flex" role="img" aria-label="5 étoiles sur 5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" aria-hidden="true" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">5.0 sur Product Hunt</span>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                    <span className="text-gray-900">Audit d'accessibilité </span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">RGAA</span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                    Découvrez et analysez l'accessibilité de votre site web selon les standards RGAA
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
                    <p className="text-gray-600 text-center">Analyse rapide avec WAVE, Axe Core et notre moteur RGAA exclusif</p>
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
            </>
          )}

          {/* Page Analyser */}
          {activeSection === 'analyze' && (
            <>
              {/* Formulaire d'audit - toujours visible */}
              <section id="audit-form" className={`px-6 ${!auditResult && !comparativeResult ? 'min-h-[calc(100vh-4rem)] flex items-center justify-center' : 'pt-8'}`} aria-labelledby="audit-form-heading">
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

              {/* Résultats d'audit - si disponibles */}
              {auditResult && (
                <section id="audit-results" className="mt-8 px-6 max-w-6xl mx-auto">
                  <AuditResults 
                    result={auditResult} 
                    language={language}
                    onNewAudit={handleNewAudit}
                  />
                </section>
              )}

              {/* Résultats comparatifs - si disponibles */}
              {comparativeResult && (
                <section id="audit-results" className="mt-8 px-6 max-w-7xl mx-auto">
                  <ComparativeTable 
                    result={comparativeResult} 
                    language={language}
                    onEngineClick={handleEngineClick}
                  />
                </section>
              )}


            </>
          )}

          {/* Page Audit Manuel */}
          {activeSection === 'manual-audit' && (
            <ManualAuditPage />
          )}

          {/* Page Référentiel RGAA */}
          {activeSection === 'rgaa-reference' && (
            <RGAAReference />
          )}

        </main>

        {/* Footer - seulement sur la page d'accueil */}
        {activeSection === 'home' && <Footer />}
      </div>
  );
}
