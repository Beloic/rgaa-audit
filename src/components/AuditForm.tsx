'use client';

import { useState, useEffect } from 'react';
import { Globe, Zap, Search, Cpu, Shield, BarChart3, UserPlus, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
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
    comparativeDescription: 'Analyse avec tous les moteurs pour comparaison',
    freeAuditUsed: 'Vous avez utilisé votre audit gratuit',
    signupRequired: 'Inscrivez-vous gratuitement pour continuer',
    signupDescription: 'Créez votre compte pour accéder à des audits illimités et sauvegarder votre historique',
    signupButton: 'S\'inscrire gratuitement',
    loginButton: 'Se connecter',
    orText: 'ou'
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
    comparativeDescription: 'Analysis with all engines for comparison',
    freeAuditUsed: 'You have used your free audit',
    signupRequired: 'Sign up for free to continue',
    signupDescription: 'Create your account to access unlimited audits and save your history',
    signupButton: 'Sign up for free',
    loginButton: 'Log in',
    orText: 'or'
  }
};

export default function AuditForm({ onAuditStart, progress, isAnalyzing, analysisError }: AuditFormProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<'wave' | 'axe' | 'rgaa' | 'all'>('rgaa');
  const [hasUsedFreeAudit, setHasUsedFreeAudit] = useState(false);

  const t = translations[language];

  // Vérifier si l'utilisateur non connecté a déjà effectué un audit
  useEffect(() => {
    if (!user) {
      const freeAuditUsed = localStorage.getItem('rgaa-free-audit-used');
      setHasUsedFreeAudit(!!freeAuditUsed);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Vérifier si l'utilisateur non connecté a déjà utilisé son audit gratuit
    if (!user && hasUsedFreeAudit) {
      setError('Vous devez vous inscrire pour effectuer plus d\'audits');
      return;
    }

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
    
    // Marquer que l'utilisateur non connecté a utilisé son audit gratuit
    if (!user) {
      localStorage.setItem('rgaa-free-audit-used', 'true');
      setHasUsedFreeAudit(true);
    }
    
    onAuditStart({ url: url.trim(), language, engine: selectedEngine });
  };

  // Si l'utilisateur non connecté a déjà utilisé son audit gratuit, afficher le message d'inscription
  if (!user && hasUsedFreeAudit) {
    return (
      <div className="relative">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-6 sm:p-8">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">{t.freeAuditUsed}</h3>
              <p className="mt-1 text-sm text-gray-500">{t.signupRequired}</p>
              <p className="mt-1 text-sm text-gray-500">{t.signupDescription}</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    // Ouvrir la modal d'inscription
                    const event = new CustomEvent('openAuthModal', { detail: { tab: 'register' } });
                    window.dispatchEvent(event);
                  }}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t.signupButton}
                </button>
                <span className="text-gray-400 self-center text-sm">{t.orText}</span>
                <button
                  onClick={() => {
                    // Ouvrir la modal de connexion
                    const event = new CustomEvent('openAuthModal', { detail: { tab: 'login' } });
                    window.dispatchEvent(event);
                  }}
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  {t.loginButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="url-input" className="block text-sm font-medium leading-6 text-gray-900">
                URL du site web
              </label>
              <div className="mt-2">
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                    className={`block w-full rounded-md border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 ${
                      error ? 'ring-red-300 focus:ring-red-500' : ''
                    }`}
                    disabled={isAnalyzing}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? t.urlErrorId : undefined}
                  />
                </div>
              </div>
            </div>

            {/* Sélecteur de moteur d'analyse */}
            <div>
              <label htmlFor="engine-select" className="block text-sm font-medium leading-6 text-gray-900">
                {t.engineLabel}
              </label>
              <div className="mt-2">
                <select
                  id="engine-select"
                  value={selectedEngine}
                  onChange={(e) => setSelectedEngine(e.target.value as 'wave' | 'axe' | 'rgaa' | 'all')}
                  disabled={isAnalyzing}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="rgaa">RGAA Engine (Recommandé)</option>
                  <option value="wave">WAVE</option>
                  <option value="axe">Axe Core</option>
                  <option value="all">Analyse comparative (Alpha)</option>
                </select>
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
                  <div className="ml-3">
                    <p className="text-sm text-red-700 whitespace-pre-line">
                      {analysisError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isAnalyzing}
                className={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isAnalyzing
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600'
                }`}
                aria-describedby={isAnalyzing ? "analyzing-status" : undefined}
              >
                {isAnalyzing ? (
                  <>
                    <div 
                      className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block" 
                      aria-hidden="true"
                    />
                    <span id="analyzing-status">{t.analyzing}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2 inline" aria-hidden="true" />
                    {t.analyzeButton}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}