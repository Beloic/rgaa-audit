'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Target,
  Clock,
  TrendingUp,
  Award,
  AlertCircle,
  Eye,
  Filter,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import type { ComparativeResult, ComparativeViolation, RGAAViolation, EngineResult } from '@/types/audit';

interface ComparativeTableProps {
  result: ComparativeResult;
  language: 'fr' | 'en';
  onEngineClick?: (engine: 'wave' | 'axe' | 'rgaa', url: string) => void;
  updatedUserData?: any; // Données utilisateur fraîches de l'API analyze
}

const translations = {
  fr: {
    comparativeAnalysis: 'Analyse Comparative',
    engineComparison: 'Comparaison des Moteurs',
    summary: 'Résumé Comparatif',
    engineResults: 'Résultats par Moteur',
    commonViolations: 'Violations Communes',
    selectEngine: 'Sélectionner un moteur',
    allEngines: 'Tous les moteurs',
    consensusLevel: 'Niveau de Consensus',
    mostReliable: 'Moteur le Plus Fiable',
    analysisTime: 'Temps d\'Analyse',
    totalViolations: 'Violations Totales',
    score: 'Score',
    status: 'Statut',
    success: 'Réussi',
    failed: 'Échoué',
    detectedBy: 'Détecté par',
    engines: 'moteurs',
    engine: 'moteur',
    confidence: 'Confiance',
    high: 'Élevée',
    medium: 'Moyenne',
    low: 'Faible',
    criterion: 'Critère',
    level: 'Niveau',
    description: 'Description',
    impact: 'Impact',
    recommendation: 'Recommandation',
    bestScore: 'Meilleur Score',
    worstScore: 'Pire Score',
    averageScore: 'Score Moyen',
    violations: 'violations',
    ms: 'ms',
    showDetails: 'Voir les détails',
    hideDetails: 'Masquer les détails',
    noCommonViolations: 'Aucune violation commune détectée',
    noViolationsForEngine: 'Aucune violation pour ce moteur',
    engineSpecific: 'Spécifique à',
    critical: 'Critique',
    moderate: 'Modéré',
    reliable: 'Fiable',
    percentage: '%'
  },
  en: {
    comparativeAnalysis: 'Comparative Analysis',
    engineComparison: 'Engine Comparison',
    summary: 'Comparative Summary',
    engineResults: 'Results by Engine',
    commonViolations: 'Common Violations',
    selectEngine: 'Select an engine',
    allEngines: 'All engines',
    consensusLevel: 'Consensus Level',
    mostReliable: 'Most Reliable Engine',
    analysisTime: 'Analysis Time',
    totalViolations: 'Total Violations',
    score: 'Score',
    status: 'Status',
    success: 'Success',
    failed: 'Failed',
    detectedBy: 'Detected by',
    engines: 'engines',
    engine: 'engine',
    confidence: 'Confidence',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    criterion: 'Criterion',
    level: 'Level',
    description: 'Description',
    impact: 'Impact',
    recommendation: 'Recommendation',
    bestScore: 'Best Score',
    worstScore: 'Worst Score',
    averageScore: 'Average Score',
    violations: 'violations',
    ms: 'ms',
    showDetails: 'Show details',
    hideDetails: 'Hide details',
    noCommonViolations: 'No common violations detected',
    noViolationsForEngine: 'No violations for this engine',
    engineSpecific: 'Specific to',
    critical: 'Critical',
    moderate: 'Moderate',
    reliable: 'Reliable',
    percentage: '%'
  }
};

const getEngineName = (engine: 'wave' | 'axe' | 'rgaa') => {
  return engine === 'axe' ? 'AXE CORE' : 
         engine === 'rgaa' ? 'RGAA ENGINE' : 'WAVE';
};

const getEngineColor = (engine: 'wave' | 'axe' | 'rgaa') => {
  return engine === 'axe' ? 'blue' : 
         engine === 'rgaa' ? 'green' : 'purple';
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-orange-500';
  return 'text-red-600';
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'critical': return 'text-red-600';
    case 'high': case 'serious': return 'text-orange-600';
    case 'medium': case 'moderate': return 'text-yellow-600';
    default: return 'text-blue-600';
  }
};



function EngineCard({ 
  engineResult, 
  language, 
  onClick 
}: { 
  engineResult: EngineResult; 
  language: 'fr' | 'en';
  onClick?: () => void;
}) {
  const t = translations[language];
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-200 ${
        onClick && engineResult.success 
          ? 'cursor-pointer hover:shadow-xl hover:border-blue-300 hover:-translate-y-1' 
          : ''
      }`}
      onClick={onClick && engineResult.success ? onClick : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${engineResult.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h3 className="text-lg font-semibold text-gray-900">
            {getEngineName(engineResult.engine)}
          </h3>
        </div>
        <div className="text-sm text-gray-500">
          {engineResult.analysisTime}{t.ms}
        </div>
      </div>
      
      {engineResult.success ? (
        <div className="space-y-3">          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t.totalViolations}</span>
            <span className="text-lg font-semibold text-gray-900">
              {engineResult.result.totalViolations}
            </span>
          </div>
          {onClick && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-blue-600 font-medium">
                {language === 'fr' ? 'Cliquer pour voir l\'analyse détaillée' : 'Click to view detailed analysis'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600">{t.failed}</p>
          {engineResult.error && (
            <p className="text-xs text-gray-500 mt-1">{engineResult.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

function ViolationRow({ violation, detectedBy, language }: { 
  violation: RGAAViolation; 
  detectedBy: ('wave' | 'axe' | 'rgaa')[]; 
  language: 'fr' | 'en' 
}) {
  const t = translations[language];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm font-medium text-gray-900">
                {t.criterion} {violation.criterion}
              </span>
              <span className="text-sm text-gray-500">
                {t.level} {violation.level}
              </span>
            </div>
            
            <p className="text-gray-700 mb-2">{violation.description}</p>
            


            <div className="flex items-center space-x-2 mt-2">
              {detectedBy.map((engine) => (
                <span
                  key={engine}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    getEngineColor(engine) === 'blue' ? 'bg-blue-100 text-blue-800' :
                    getEngineColor(engine) === 'green' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}
                >
                  {getEngineName(engine)}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-4 flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <>
                {t.hideDetails}
                <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                {t.showDetails}
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {violation.recommendation && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">{t.recommendation}</h4>
                <p className="text-sm text-gray-600">{violation.recommendation}</p>
              </div>
            )}
            
            {violation.element && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Sélecteur CSS</h4>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{violation.element}</code>
              </div>
            )}

            {violation.htmlSnippet && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">HTML</h4>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {violation.htmlSnippet}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparativeTable({ result, language, onEngineClick, updatedUserData }: ComparativeTableProps) {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'summary' | 'common'>('summary');
  const [selectedEngine, setSelectedEngine] = useState<'all' | 'wave' | 'axe' | 'rgaa'>('all');
  
  // Incrémenter le compteur d'audits après affichage des résultats comparatifs
  useEffect(() => {
    const incrementAuditCounter = async () => {
      try {
        // Utiliser les données fraîches de l'API analyze si disponibles, sinon le localStorage
        let userData;
        
        if (updatedUserData) {
          console.log('📈 Utilisation des données utilisateur fraîches de l\'API analyze (comparative)...');
          userData = updatedUserData;
        } else {
          console.log('📈 Utilisation des données utilisateur du localStorage (comparative)...');
          const userDataString = localStorage.getItem('userData');
          if (!userDataString) {
            console.warn('⚠️ Aucune donnée utilisateur disponible pour l\'incrémentation (comparative)');
            return;
          }
          userData = JSON.parse(userDataString);
        }
        
        console.log('📈 Incrémentation du compteur d\'audits après affichage des résultats comparatifs...');
        console.log('📊 Données utilisateur avant incrémentation (comparative):', {
          email: userData.email,
          auditsToday: userData.usage?.auditsToday,
          lastAuditDate: userData.usage?.lastAuditDate
        });
        
        const response = await fetch('/api/user/increment-audit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userData })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.updatedUserData) {
            // Mettre à jour les données utilisateur dans le localStorage
            localStorage.setItem('userData', JSON.stringify(data.updatedUserData));
            console.log('✅ Compteur d\'audits incrémenté avec succès (analyse comparative)');
            console.log('📊 Nouvelles données (comparative):', {
              auditsToday: data.updatedUserData.usage?.auditsToday,
              auditsTotal: data.updatedUserData.usage?.auditsTotal
            });
          }
        } else {
          console.error('❌ Erreur lors de l\'incrémentation:', await response.text());
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'incrémentation des audits:', error);
      }
    };

    // Incrémenter immédiatement après le montage du composant (affichage des résultats)
    incrementAuditCounter();
  }, [updatedUserData]); // Dépendre de updatedUserData
  
  const successfulEngines = result.engines.filter(e => e.success);
  
  // Créer les violations comparatives
  const comparativeViolations: ComparativeViolation[] = [];
  
  // Ajouter les violations communes
  result.commonViolations.forEach(violation => {
    const detectedBy = successfulEngines
      .filter(engine => engine.result.violations.some(v => 
        v.criterion === violation.criterion && v.level === violation.level
      ))
      .map(engine => engine.engine);
    
    comparativeViolations.push({
      violation,
      detectedBy,
      confidence: detectedBy.length >= 3 ? 'high' : detectedBy.length === 2 ? 'medium' : 'low'
    });
  });
  
  // Ajouter les violations spécifiques
  Object.entries(result.engineSpecificViolations).forEach(([engineName, violations]) => {
    violations.forEach(violation => {
      // Vérifier si cette violation n'est pas déjà dans les communes
      const isCommon = result.commonViolations.some(common => 
        common.criterion === violation.criterion && common.level === violation.level
      );
      
      if (!isCommon) {
        comparativeViolations.push({
          violation,
          detectedBy: [engineName as 'wave' | 'axe' | 'rgaa'],
          confidence: 'low'
        });
      }
    });
  });

  // Filtrer les violations selon le moteur sélectionné
  const filteredViolations = selectedEngine === 'all' 
    ? comparativeViolations 
    : comparativeViolations.filter(cv => cv.detectedBy.includes(selectedEngine));

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.comparativeAnalysis}</h2>
        <p className="text-lg text-gray-600">
          Analyse de <span className="font-semibold">{result.url}</span> avec {result.engines.length} moteurs
        </p>
      </div>

      {/* Résultats par moteur */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.engineResults}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.engines.map((engineResult) => (
            <EngineCard 
              key={engineResult.engine}
              engineResult={engineResult}
              language={language}
              onClick={() => onEngineClick?.(engineResult.engine, result.url)}
            />
          ))}
        </div>
      </div>

      {/* Toggle pour sélectionner le moteur */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.selectEngine}
        </label>
        <select
          value={selectedEngine}
          onChange={(e) => setSelectedEngine(e.target.value as 'all' | 'wave' | 'axe' | 'rgaa')}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">{t.allEngines}</option>
          {successfulEngines.map((engine) => (
            <option key={engine.engine} value={engine.engine}>
              {getEngineName(engine.engine)}
            </option>
          ))}
        </select>
      </div>

      {/* Onglets pour les violations */}
      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t.summary}
            </button>
            <button
              onClick={() => setActiveTab('common')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'common'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t.commonViolations} ({result.commonViolations.length})
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Résumé de l'analyse comparative</h4>
                    <div className="mt-2 text-sm text-yellow-700 space-y-1">
                      <p>• <strong>{result.totalUniqueViolations}</strong> violations uniques détectées au total</p>
                      <p>• <strong>{result.commonViolations.length}</strong> violations communes détectées par plusieurs moteurs</p>
                      <p>• <strong>{successfulEngines.length}/{result.engines.length}</strong> moteurs ont réussi l'analyse</p>
                      <p>• Niveau de consensus: <strong>{result.summary.consensusLevel}%</strong></p>
                      {selectedEngine !== 'all' && (
                        <p>• Affichage filtré pour: <strong>{getEngineName(selectedEngine)}</strong></p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {filteredViolations.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedEngine === 'all' 
                      ? `Toutes les violations (${filteredViolations.length})`
                      : `Violations détectées par ${getEngineName(selectedEngine)} (${filteredViolations.length})`
                    }
                  </h4>
                  {filteredViolations.map((compViolation, index) => (
                    <ViolationRow
                      key={`${compViolation.violation.criterion}-${index}`}
                      violation={compViolation.violation}
                      detectedBy={compViolation.detectedBy}
                      language={language}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">
                    {selectedEngine === 'all' 
                      ? t.noCommonViolations
                      : t.noViolationsForEngine
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'common' && (
            <div className="space-y-3">
              {result.commonViolations.length > 0 ? (
                result.commonViolations.map((violation, index) => {
                  const detectedBy = successfulEngines
                    .filter(engine => engine.result.violations.some(v => 
                      v.criterion === violation.criterion && v.level === violation.level
                    ))
                    .map(engine => engine.engine);
                  
                  return (
                    <ViolationRow
                      key={`common-${violation.criterion}-${index}`}
                      violation={violation}
                      detectedBy={detectedBy}
                      language={language}
                    />
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">{t.noCommonViolations}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 