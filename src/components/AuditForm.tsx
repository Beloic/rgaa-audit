'use client';

import { useState } from 'react';
import { Globe, Zap, Search, Cpu, Shield, BarChart3, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AuditRequest, AnalysisProgress } from '@/types/audit';

interface AuditFormProps {
  onAuditStart: (request: AuditRequest) => void;
  progress: AnalysisProgress;
  isAnalyzing: boolean;
  analysisError?: string | null;
}

const translations = {
  fr: {
    title: 'Analyser votre site web',
    subtitle: 'Entrez l\'URL de votre site pour démarrer l\'audit d\'accessibilité',
    urlPlaceholder: 'https://exemple.com',
    analyzeButton: 'Analyser maintenant',
    analyzing: 'Analyse en cours...',
    urlError: 'Veuillez entrer une URL valide',
    progressStatus: 'Progression de l\'analyse',
    urlErrorId: 'url-error',
    engineLabel: 'Moteur d\'analyse',
    waveEngine: 'WAVE (WebAIM)',
    axeEngine: 'Axe Core (Deque)',
    waveDescription: 'Outil de référence pour l\'accessibilité web',
    axeDescription: 'Moteur d\'analyse automatisé performant',
    comparativeAnalysis: 'Analyse Comparative',
    comparativeDescription: 'Analyse avec tous les moteurs pour comparaison'
  },
  en: {
    title: 'Analyze your website',
    subtitle: 'Enter your website URL to start the accessibility audit',
    urlPlaceholder: 'https://example.com',
    analyzeButton: 'Analyze now',
    analyzing: 'Analyzing...',
    urlError: 'Please enter a valid URL',
    progressStatus: 'Analysis progress',
    urlErrorId: 'url-error',
    engineLabel: 'Analysis Engine',
    waveEngine: 'WAVE (WebAIM)',
    axeEngine: 'Axe Core (Deque)',
    waveDescription: 'Reference tool for web accessibility',
    axeDescription: 'High-performance automated analysis engine',
    comparativeAnalysis: 'Comparative Analysis',
    comparativeDescription: 'Analysis with all engines for comparison'
  }
};

export default function AuditForm({ onAuditStart, progress, isAnalyzing, analysisError }: AuditFormProps) {
  const { language } = useLanguage();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<'wave' | 'axe' | 'rgaa' | 'all'>('rgaa');
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError(t.urlError);
      return;
    }
    try {
      new URL(url);
    } catch {
      setError(t.urlError);
      return;
    }
    
    // Stocker l'URL dans sessionStorage pour la fonctionnalité de localisation
    sessionStorage.setItem('lastAnalyzedUrl', url.trim());
    
    onAuditStart({ url: url.trim(), language, engine: selectedEngine });
  };

  // Fonction pour renvoyer l'email de vérification
  const handleResendVerificationEmail = async () => {
    setIsResendingEmail(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Afficher un message de succès temporaire
        const successMessage = language === 'fr' 
          ? 'Email de vérification renvoyé avec succès !'
          : 'Verification email sent successfully!';
        setError(successMessage);
        setTimeout(() => setError(''), 5000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du renvoi de l\'email');
      }
    } catch (error) {
      setError('Erreur lors du renvoi de l\'email');
    } finally {
      setIsResendingEmail(false);
    }
  };

  // Fonction de liste d'attente désactivée temporairement
  // const handleWaitlistSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setEmailError('');

  //   if (!email.trim()) {
  //     setEmailError(t.emailError);
  //     return;
  //   }

  //   // Validation email simple
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email.trim())) {
  //     setEmailError(t.emailError);
  //     return;
  //   }

  //   try {
  //     const response = await fetch('/api/waitlist', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email: email.trim(),
  //         language: language
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setIsSubmitted(true);
  //     } else {
  //       setEmailError(data.error || t.emailError);
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de l\'inscription:', error);
  //     setEmailError(language === 'fr' ? 'Erreur lors de l\'inscription' : 'Subscription error');
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
        {/* Formulaire d'audit principal */}
        <>
          {/* Header */}
          <header className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.title}</h2>
            <p className="text-gray-600 text-lg">{t.subtitle}</p>
            <p className="text-gray-500 text-sm mt-2">
              Version Alpha - vos retours sont les bienvenus : 
              <a 
                href="https://trello.com/invite/b/685bed1c2b11059cc9d7e615/ATTI78b0cb2e987bf68a04e1f1e4198c0cb11AFF68E6/backlog-rgaa-audit" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 ml-1 underline"
              >
                Signaler un bug
              </a>
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="url"
                  id="url-input"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError('');
                  }}
                  placeholder={t.urlPlaceholder}
                  className={`block w-full pl-12 pr-4 py-4 border rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 ${
                    error 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300'
                  }`}
                  disabled={isAnalyzing}
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? t.urlErrorId : undefined}
                />
              </div>
            </div>

            {/* Sélecteur de moteur d'analyse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t.engineLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* RGAA Engine - Moteur par défaut */}
                <button
                  type="button"
                  onClick={() => setSelectedEngine('rgaa')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 relative ${
                    selectedEngine === 'rgaa'
                      ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-25'
                  } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={isAnalyzing}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <Zap className={`w-8 h-8 ${selectedEngine === 'rgaa' ? 'text-green-600' : 'text-gray-400'}`} />
                    <div className="text-center">
                      <h3 className={`font-semibold ${selectedEngine === 'rgaa' ? 'text-green-900' : 'text-gray-700'}`}>
                        RGAA ENGINE
                      </h3>
                      <p className={`text-sm mt-1 ${selectedEngine === 'rgaa' ? 'text-green-700' : 'text-gray-500'}`}>
                        {language === 'fr' 
                          ? 'Le moteur le plus rapide'
                          : 'The fastest engine'
                        }
                      </p>
                    </div>
                  </div>
                </button>

                {/* WAVE Engine */}
                <button
                  type="button"
                  onClick={() => setSelectedEngine('wave')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    selectedEngine === 'wave'
                      ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
                  } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={isAnalyzing}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <Shield className={`w-8 h-8 ${selectedEngine === 'wave' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="text-center">
                      <h3 className={`font-semibold ${selectedEngine === 'wave' ? 'text-blue-900' : 'text-gray-700'}`}>
                        WAVE
                      </h3>
                      <p className={`text-sm mt-1 ${selectedEngine === 'wave' ? 'text-blue-700' : 'text-gray-500'}`}>
                        {language === 'fr' 
                          ? 'Outil de référence avec analyse visuelle'
                          : 'Reference tool with visual analysis'
                        }
                      </p>
                    </div>
                  </div>
                </button>

                {/* Axe Core Engine */}
                <button
                  type="button"
                  onClick={() => setSelectedEngine('axe')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    selectedEngine === 'axe'
                      ? 'border-purple-500 bg-purple-50 shadow-lg transform scale-105'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25'
                  } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={isAnalyzing}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <Cpu className={`w-8 h-8 ${selectedEngine === 'axe' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div className="text-center">
                      <h3 className={`font-semibold ${selectedEngine === 'axe' ? 'text-purple-900' : 'text-gray-700'}`}>
                        AXE CORE
                      </h3>
                      <p className={`text-sm mt-1 ${selectedEngine === 'axe' ? 'text-purple-700' : 'text-gray-500'}`}>
                        {language === 'fr' 
                          ? 'Moteur d\'analyse automatisé performant'
                          : 'High-performance automated analysis engine'
                        }
                      </p>
                    </div>
                  </div>
                </button>

                {/* Analyse Comparative - NOUVEAU */}
                <button
                  type="button"
                  onClick={() => setSelectedEngine('all')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 relative ${
                    selectedEngine === 'all'
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg transform scale-105'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-25'
                  } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={isAnalyzing}
                >
                  {/* Badge ALPHA */}
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    ALPHA
                  </div>
                  <div className="flex flex-col items-center space-y-3">
                    <BarChart3 className={`w-8 h-8 ${selectedEngine === 'all' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <div className="text-center">
                      <h3 className={`font-semibold ${selectedEngine === 'all' ? 'text-indigo-900' : 'text-gray-700'}`}>
                        {t.comparativeAnalysis.toUpperCase()}
                      </h3>
                      <p className={`text-sm mt-1 ${selectedEngine === 'all' ? 'text-indigo-700' : 'text-gray-500'}`}>
                        {t.comparativeDescription}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
                <p id={t.urlErrorId} className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Progress */}
            {isAnalyzing && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6" role="status" aria-live="polite">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-blue-600 mr-2 animate-pulse" aria-hidden="true" />
                    <span className="text-blue-900 font-medium">{progress.message}</span>
                  </div>
                  <span className="text-blue-600 text-sm font-medium" aria-label={`${t.progressStatus}: ${progress.progress}%`}>
                    {progress.progress}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress.progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={t.progressStatus}
                  />
                </div>
              </div>
            )}

            {/* Analysis Error message */}
            {analysisError && !isAnalyzing && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6" role="alert">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-red-700 whitespace-pre-line mb-3">
                      {analysisError}
                    </p>
                    
                    {/* Bouton de renvoi d'email si l'erreur est liée à la vérification d'email */}
                    {analysisError.includes('Veuillez vérifier votre adresse email') && (
                      <button
                        type="button"
                        onClick={handleResendVerificationEmail}
                        disabled={isResendingEmail}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isResendingEmail ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            {language === 'fr' ? 'Envoi...' : 'Sending...'}
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            {language === 'fr' ? 'Renvoyer l\'email de vérification' : 'Resend verification email'}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isAnalyzing}
              className={`w-full flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isAnalyzing
                  ? 'bg-gray-400 text-white cursor-not-allowed focus:ring-gray-400'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:from-blue-700 focus:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-blue-500'
              }`}
              aria-describedby={isAnalyzing ? "analyzing-status" : undefined}
            >
              {isAnalyzing ? (
                <>
                  <div 
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" 
                    aria-hidden="true"
                  />
                  <span id="analyzing-status">{t.analyzing}</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" aria-hidden="true" />
                  {t.analyzeButton}
                </>
              )}
            </button>
          </form>
        </>
      </div>
    </div>
  );
} 