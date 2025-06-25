'use client';

import { useState } from 'react';
import { Lightbulb, FileText, Loader2, Download, Copy, CheckCircle, AlertCircle } from 'lucide-react';

interface SummaryAdvicePageProps {
  auditResults?: any;
}

export default function SummaryAdvicePage({ auditResults }: SummaryAdvicePageProps) {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateSummary = async () => {
    if (!auditResults || !auditResults.violations || auditResults.violations.length === 0) {
      setError('Aucun résultat d\'audit disponible. Veuillez d\'abord effectuer une analyse.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          violations: auditResults.violations,
          url: auditResults.url || 'URL non spécifiée'
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Erreur lors de la génération du résumé:', error);
      setError('Erreur lors de la génération du résumé. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (summary) {
      try {
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Erreur lors de la copie:', error);
      }
    }
  };

  const handleDownload = () => {
    if (summary) {
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-audit-accessibilite-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const hasResults = auditResults && auditResults.violations && auditResults.violations.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Lightbulb className="w-8 h-8 text-yellow-600 mr-4" />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Résumé et conseils</h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  🧪 BÊTA
                </span>
              </div>
              <p className="text-gray-600">
                Générez un résumé personnalisé et des conseils d'amélioration basés sur votre audit d'accessibilité
              </p>
              <p className="text-purple-600 text-sm mt-1 font-medium">
                ⚡ Fonctionnalité expérimentale - Vos retours sont les bienvenus !
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className={`p-4 rounded-lg ${hasResults ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className="flex items-center">
                {hasResults ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                )}
                <span className={`font-medium ${hasResults ? 'text-green-800' : 'text-yellow-800'}`}>
                  {hasResults ? 'Résultats d\'audit disponibles' : 'Aucun résultat d\'audit'}
                </span>
              </div>
              <p className={`text-sm mt-1 ${hasResults ? 'text-green-700' : 'text-yellow-700'}`}>
                {hasResults 
                  ? `${auditResults.violations.length} violation(s) détectée(s)` 
                  : 'Effectuez d\'abord une analyse pour générer un résumé'
                }
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${summary ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="flex items-center">
                <FileText className={`w-5 h-5 mr-2 ${summary ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`font-medium ${summary ? 'text-blue-800' : 'text-gray-600'}`}>
                  {summary ? 'Résumé généré' : 'Résumé non généré'}
                </span>
              </div>
              <p className={`text-sm mt-1 ${summary ? 'text-blue-700' : 'text-gray-500'}`}>
                {summary ? 'Prêt à consulter et télécharger' : 'Cliquez sur générer pour créer le résumé'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={generateSummary}
              disabled={isGenerating || !hasResults}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Générer le résumé et conseils
                </>
              )}
            </button>

            {summary && (
              <div className="flex space-x-3">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-800 font-medium">Erreur</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Summary Content */}
        {summary && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Résumé personnalisé de l'audit</h2>
              <p className="text-gray-600">
                Analyse générée par IA basée sur les {auditResults?.violations?.length || 0} violation(s) détectée(s)
              </p>
            </div>
            
            <div className="p-8">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {summary}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help */}
        {!hasResults && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun résultat d'audit disponible
              </h3>
              <p className="text-gray-600 mb-6">
                Pour générer un résumé personnalisé, veuillez d'abord effectuer une analyse d'accessibilité sur votre site web.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Retourner au dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 