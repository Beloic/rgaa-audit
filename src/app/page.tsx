'use client';

import { useState, useEffect } from 'react';
import AuditForm from '@/components/AuditForm';
import AuditResults from '@/components/AuditResults';
import ComparativeTable from '@/components/ComparativeTable';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import RGAAReference from '@/components/RGAAReference';
import AuditHistory, { saveAuditToHistory } from '@/components/AuditHistory';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';

import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Zap, Target, Users, AlertTriangle } from 'lucide-react';
import Footer from '@/components/Footer';
import type { AuditRequest, AuditResult, ComparativeResult, AnalysisProgress } from '@/types/audit';

export default function HomePage() {
  const { language } = useLanguage();
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
  const [activeSection, setActiveSection] = useState<'home' | 'analyze' | 'rgaa-reference' | 'history'>('home');

  // Détecter les paramètres URL pour changer de section automatiquement
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section && ['analyze', 'rgaa-reference', 'history'].includes(section)) {
      setActiveSection(section as 'analyze' | 'rgaa-reference' | 'history');
    }
  }, []);

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

  const handleNewAuditFromHistory = async (request: AuditRequest) => {
    setActiveSection('analyze');
    // Attendre que le composant soit monté puis lancer l'audit
    setTimeout(() => {
      handleAuditStart(request);
    }, 100);
  };

  // Fonction pour gérer les changements de section de la sidebar
  const handleSidebarSectionChange = (section: 'analyze' | 'rgaa-reference' | 'history') => {
    setActiveSection(section);
    
    // Réinitialiser les résultats si on revient sur analyser et qu'il n'y a pas d'analyse en cours
    if (section === 'analyze' && !isAnalyzing) {
      setAuditResult(null);
      setComparativeResult(null);
      setError(null);
      setProgress({ step: 'idle', message: 'En attente...', progress: 0 });
    }
  };

  // Fonction pour la TopBar (sans history)
  const handleTopBarSectionChange = (section: 'home' | 'analyze' | 'rgaa-reference') => {
    setActiveSection(section);
    
    // Réinitialiser les résultats si on revient sur analyser et qu'il n'y a pas d'analyse en cours
    if (section === 'analyze' && !isAnalyzing) {
      setAuditResult(null);
      setComparativeResult(null);
      setError(null);
      setProgress({ step: 'idle', message: 'En attente...', progress: 0 });
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
        saveAuditToHistory(result as ComparativeResult, 'all');
      } else {
        setAuditResult(result as AuditResult);
        // Sauvegarder dans l'historique
        saveAuditToHistory(result as AuditResult, request.engine || 'rgaa');
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
      
      // Gestion spécifique de l'erreur de vérification d'email
      if (errorMessage.includes('Veuillez vérifier votre adresse email')) {
        errorMessage = language === 'fr' 
          ? `📧 Veuillez vérifier votre adresse email avant de pouvoir effectuer des analyses. Consultez votre boîte mail pour le lien de confirmation.`
          : `📧 Please verify your email address before performing analyses. Check your inbox for the confirmation link.`;
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
          activeSection={activeSection === 'history' ? 'home' : activeSection} 
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
                    <span className="text-gray-900">Audit d'accessibilité </span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">RGAA</span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                    Cette version alpha utilise les moteurs les plus performants pour aider les professionnels à réaliser leurs audits. Cet outil n'a pas vocation à remplacer l'expertise humaine.
                    <br /><br />
                    Nous travaillons actuellement sur le projet qui n'est pas toujours disponible.
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
            </>
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
                onNewAuditFromHistory={handleNewAuditFromHistory}
              />
            </div>
          )}

        </main>

        {/* Footer - seulement sur la page d'accueil */}
        {activeSection === 'home' && <Footer />}
      </div>
  );
}
