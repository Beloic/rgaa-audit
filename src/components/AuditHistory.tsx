'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ExternalLink, Trash2, RotateCcw, Search, Calendar, TrendingUp, AlertTriangle, Zap, Shield, Cpu, BarChart3, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AuditResult, ComparativeResult, AuditRequest } from '@/types/audit';
import { useAuth } from '@/contexts/AuthContext';

interface HistoricalAudit {
  id: string;
  user_email: string;
  url: string;
  timestamp: string;
  score: number;
  total_violations: number;
  result: AuditResult | ComparativeResult;
  engine: 'wave' | 'axe' | 'rgaa' | 'all';
  created_at: string;
  updated_at: string;
}

interface AuditHistoryProps {
  onResumeAudit: (auditData: { result: AuditResult | ComparativeResult; engine: 'wave' | 'axe' | 'rgaa' | 'all' }) => void;
}

const translations = {
  fr: {
    title: 'Gestion des audits',
    subtitle: 'Retrouvez et reprenez vos analyses précédentes',
    empty: 'Aucun audit dans l\'historique',
    emptyDescription: 'Commencez par analyser un site web pour voir l\'historique apparaître ici.',
    searchPlaceholder: 'Rechercher par URL...',
    resumeAudit: 'Reprendre l\'audit',
    deleteAudit: 'Supprimer',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet audit ?',
    cancel: 'Annuler',
    delete: 'Supprimer',
    clearAll: 'Vider l\'historique',
    confirmClearAll: 'Êtes-vous sûr de vouloir supprimer tout l\'historique ?',
    violations: 'violations',
    violation: 'violation',
    score: 'Score',
    analysisDate: 'Date d\'analyse',
    engine: 'Moteur',
    comparative: 'Comparative',
    totalAudits: 'audit(s) au total',
    lastWeek: 'Cette semaine',
    lastMonth: 'Ce mois-ci',
    older: 'Plus ancien',
    loading: 'Chargement...'
  },
  en: {
    title: 'Audit History',
    subtitle: 'Find and resume your previous analyses',
    empty: 'No audits in history',
    emptyDescription: 'Start by analyzing a website to see the history appear here.',
    searchPlaceholder: 'Search by URL...',
    resumeAudit: 'Resume audit',
    deleteAudit: 'Delete',
    confirmDelete: 'Are you sure you want to delete this audit?',
    cancel: 'Cancel',
    delete: 'Delete',
    clearAll: 'Clear history',
    confirmClearAll: 'Are you sure you want to delete all history?',
    violations: 'violations',
    violation: 'violation',
    score: 'Score',
    analysisDate: 'Analysis date',
    engine: 'Engine',
    comparative: 'Comparative',
    totalAudits: 'audit(s) total',
    lastWeek: 'This week',
    lastMonth: 'This month',
    older: 'Older',
    loading: 'Loading...'
  }
};

export default function AuditHistory({ onResumeAudit }: AuditHistoryProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const t = translations[language];
  const [audits, setAudits] = useState<HistoricalAudit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [clearAllConfirm, setClearAllConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Cache pour éviter les rechargements inutiles
  const cache = useRef<{ email: string; data: HistoricalAudit[]; timestamp: number } | null>(null);
  const loadingRef = useRef(false);

  // Charger l'historique depuis l'API Supabase (base de données) - OPTIMISÉ
  const loadHistory = useCallback(async (userEmail: string) => {
    // Éviter les appels multiples simultanés
    if (loadingRef.current) {
      console.log('⏸️ Chargement déjà en cours, ignoré');
      return;
    }

    // Vérifier le cache (valide pendant 5 minutes)
    const now = Date.now();
    if (cache.current && 
        cache.current.email === userEmail && 
        (now - cache.current.timestamp) < 5 * 60 * 1000) {
      console.log('💾 Données chargées depuis le cache');
      setAudits(cache.current.data);
      setHasLoaded(true);
      return;
    }

    try {
      loadingRef.current = true;
      setIsLoading(true);
      
      console.log('🔍 Chargement historique depuis API pour:', userEmail);
      
      // Appeler l'API pour récupérer l'historique depuis Supabase
      const response = await fetch(`/api/audit-history?userEmail=${encodeURIComponent(userEmail)}`);
      
      if (!response.ok) {
        console.error('❌ Erreur API historique:', response.status, response.statusText);
        // Fallback vers localStorage si l'API échoue
        const historyKey = `rgaa-audit-history-${userEmail}`;
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const parsed: HistoricalAudit[] = JSON.parse(stored);
          parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setAudits(parsed);
          // Mettre en cache
          cache.current = { email: userEmail, data: parsed, timestamp: now };
          console.log('📂 Fallback vers localStorage:', parsed.length, 'audits');
        } else {
          setAudits([]);
          cache.current = { email: userEmail, data: [], timestamp: now };
        }
        return;
      }
      
      const data = await response.json();
      console.log('✅ Historique API chargé:', data.total, 'audits');
      
      if (data.success && data.audits) {
        // Les audits sont déjà triés par timestamp DESC dans l'API
        setAudits(data.audits);
        // Mettre en cache
        cache.current = { email: userEmail, data: data.audits, timestamp: now };
      } else {
        setAudits([]);
        cache.current = { email: userEmail, data: [], timestamp: now };
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement de l\'historique depuis l\'API:', error);
      
      // Fallback vers localStorage en cas d'erreur
      try {
        const historyKey = `rgaa-audit-history-${userEmail}`;
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const parsed: HistoricalAudit[] = JSON.parse(stored);
          parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setAudits(parsed);
          // Mettre en cache
          cache.current = { email: userEmail, data: parsed, timestamp: now };
          console.log('📂 Fallback vers localStorage après erreur API:', parsed.length, 'audits');
        } else {
          setAudits([]);
          cache.current = { email: userEmail, data: [], timestamp: now };
        }
      } catch (fallbackError) {
        console.error('❌ Erreur fallback localStorage:', fallbackError);
        setAudits([]);
        cache.current = { email: userEmail, data: [], timestamp: now };
      }
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
      loadingRef.current = false;
    }
  }, []);

  // Effet optimisé - se déclenche seulement quand l'email change
  useEffect(() => {
    if (!user?.email) {
      setAudits([]);
      setHasLoaded(true);
      cache.current = null;
      return;
    }

    // Charger seulement si on n'a pas encore chargé pour cet utilisateur
    if (!hasLoaded || (cache.current && cache.current.email !== user.email)) {
      setHasLoaded(false);
      loadHistory(user.email);
    }
  }, [user?.email, loadHistory, hasLoaded]); // Dépendance optimisée: seulement user?.email

  // Sauvegarder l'historique dans localStorage (spécifique à l'utilisateur)
  const saveHistory = useCallback((newAudits: HistoricalAudit[]) => {
    try {
      if (!user?.email) return;
      
      const historyKey = `rgaa-audit-history-${user.email}`;
      localStorage.setItem(historyKey, JSON.stringify(newAudits));
      setAudits(newAudits);
      
      // Mettre à jour le cache
      cache.current = { email: user.email, data: newAudits, timestamp: Date.now() };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique:', error);
    }
  }, [user?.email]);

  // Filtrer les audits selon le terme de recherche
  const filteredAudits = audits.filter(audit =>
    audit.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouper les audits par période
  const groupAuditsByPeriod = (audits: HistoricalAudit[]) => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const groups = {
      lastMonth: [] as HistoricalAudit[],
      older: [] as HistoricalAudit[]
    };

    audits.forEach(audit => {
      const auditDate = new Date(audit.timestamp);
      if (auditDate >= oneMonthAgo) {
        groups.lastMonth.push(audit);
      } else {
        groups.older.push(audit);
      }
    });

    return groups;
  };

  const groupedAudits = groupAuditsByPeriod(filteredAudits);

  // Supprimer un audit
  const deleteAudit = (id: string) => {
    const newAudits = audits.filter(audit => audit.id !== id);
    saveHistory(newAudits);
    setDeleteConfirm(null);
  };

  // Vider tout l'historique
  const clearAllHistory = () => {
    saveHistory([]);
    setClearAllConfirm(false);
  };

  // Reprendre un audit
  const handleResumeAudit = (audit: HistoricalAudit) => {
    onResumeAudit({
      result: audit.result,
      engine: audit.engine
    });
  };

  // Fonction pour formater la date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour obtenir la couleur du score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // Fonction pour obtenir le nom du moteur
  const getEngineName = (engine: string) => {
    switch (engine) {
      case 'wave': return 'WAVE';
      case 'axe': return 'Axe Core';
      case 'rgaa': return 'RGAA';
      case 'all': return t.comparative;
      default: return engine.toUpperCase();
    }
  };

  // Fonction pour obtenir l'icône SVG du moteur
  const getEngineIcon = (engine: string, className: string = "w-6 h-6") => {
    switch (engine) {
      case 'rgaa':
        return <Zap className={className} />;
      case 'wave':
        return <Shield className={className} />;
      case 'axe':
        return <Cpu className={className} />;
      case 'all':
        return <BarChart3 className={className} />;
      default:
        return <Zap className={className} />;
    }
  };

  // Fonction pour obtenir un badge selon le moteur
  const getEngineBadge = (engine: string) => {
    const configs = {
      'rgaa': { color: 'bg-blue-100 text-blue-800' },
      'wave': { color: 'bg-purple-100 text-purple-800' },
      'axe': { color: 'bg-orange-100 text-orange-800' },
      'all': { color: 'bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800' }
    };
    
    const config = configs[engine as keyof typeof configs] || configs.rgaa;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{getEngineIcon(engine, "w-3 h-3")}</span>
        {getEngineName(engine)}
      </span>
    );
  };

  // Composant pour afficher un groupe d'audits
  const AuditGroup = ({ title, audits }: { title: string; audits: HistoricalAudit[] }) => {
    if (audits.length === 0) return null;

    return (
      <div className="mb-8 animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gray-500" />
          {title}
          <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {audits.length}
          </span>
        </h3>
        <div className="grid gap-6">
          {audits.map((audit, index) => (
            <div
              key={audit.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* En-tête avec URL et actions principales */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => window.open(audit.url, '_blank', 'noopener,noreferrer')}
                        className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center hover:from-blue-200 hover:to-indigo-200 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        title={`Ouvrir ${audit.url} dans un nouvel onglet`}
                      >
                        <ExternalLink className="w-5 h-5 text-blue-600" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 truncate mb-1">
                        {audit.url}
                      </h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span>{formatDate(audit.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4 transition-opacity">
                    <button
                      onClick={() => handleResumeAudit(audit)}
                      className="inline-flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span className="font-medium">{t.resumeAudit}</span>
                    </button>
                    <button
                      onClick={() => router.push(`/audit-management/${audit.id}`)}
                      className="inline-flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Target className="w-5 h-5" />
                      <span className="font-medium">Gestion</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Corps avec métriques et détails */}
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  {/* Moteur d'analyse utilisé */}
                  <div className="flex flex-col items-center justify-center p-0 h-full">
                    <div className="bg-purple-50 border border-purple-100 rounded-xl shadow w-full py-6 flex flex-col items-center justify-center mb-2 h-full">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-200/60 text-purple-700 mb-2">
                        {getEngineIcon(audit.engine, "w-6 h-6")}
                      </span>
                      <span className="text-sm font-semibold text-purple-800" style={{fontFamily: 'inherit'}}>{getEngineName(audit.engine)}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Moteur d'analyse</span>
                  </div>
                  {/* Violations */}
                  <div className="flex flex-col items-center justify-center p-0 h-full">
                    <div className="bg-red-50 border border-red-100 rounded-xl shadow w-full py-6 flex flex-col items-center justify-center mb-2 h-full">
                      <span className="text-2xl font-extrabold text-red-700 mb-1" style={{fontFamily: 'inherit'}}>{audit.total_violations}</span>
                      <span className="text-xs font-medium text-red-600" style={{fontFamily: 'inherit'}}>violations</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Violations détectées</span>
                  </div>
                  {/* Statut de conformité */}
                  <div className="flex flex-col items-center justify-center p-0 h-full">
                    <div className={`rounded-xl shadow w-full py-6 flex flex-col items-center justify-center mb-2 border h-full ${
                      audit.score >= 90 
                        ? 'bg-green-50 border-green-100' 
                        : audit.score >= 50 
                        ? 'bg-orange-50 border-orange-100'
                        : 'bg-red-50 border-red-100'
                    }`}>
                      <span className={`text-sm font-bold mb-1 ${
                        audit.score >= 90 ? 'text-green-700' :
                        audit.score >= 50 ? 'text-orange-700' :
                        'text-red-700'
                      }`} style={{fontFamily: 'inherit'}}>
                        {audit.score >= 90 ? 'Bon niveau' :
                         audit.score >= 50 ? 'Partiellement conforme' :
                         'Non conforme'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Statut de conformité</span>
                  </div>
                </div>
              </div>

              {/* Pied avec actions amélioré */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 flex items-center space-x-2">
                    <span className="bg-white px-2 py-1 rounded-md font-mono">#{audit.id.slice(-8)}</span>
                    <span>•</span>
                    <span>{audit.engine.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setDeleteConfirm(audit.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 group"
                    >
                      <Trash2 className="w-3 h-3 mr-1 group-hover:animate-pulse" />
                      {t.deleteAudit}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* En-tête amélioré */}
      <header className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center mb-3" style={{fontFamily: 'inherit'}}>
                <Clock className="w-10 h-10 mr-4 text-blue-600" />
                {t.title}
              </h1>
              <p className="text-gray-600 text-lg" style={{fontFamily: 'inherit'}}>{t.subtitle}</p>
              
              {/* Message si utilisateur non connecté */}
              {!user && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note :</strong> Vous n'êtes pas connecté. L'historique des audits est temporaire et sera perdu si vous fermez votre navigateur.
                  </p>
                </div>
              )}
              
              {/* Statistiques rapides */}
              {audits.length > 0 && (
                <div className="flex items-center space-x-6 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{audits.length}</div>
                    <div className="text-sm text-gray-500">Audits totaux</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {audits.reduce((acc, audit) => acc + audit.total_violations, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Violations totales</div>
                  </div>
                </div>
              )}
            </div>
            
            {audits.length > 0 && (
              <button
                onClick={() => setClearAllConfirm(true)}
                className="inline-flex items-center px-4 py-2 bg-white border border-red-200 text-red-600 font-normal rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all shadow-sm text-sm"
                style={{fontFamily: 'inherit'}}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t.clearAll}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Barre de recherche et filtres améliorée */}
      {audits.length > 0 && (
        <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="font-medium">{filteredAudits.length}</span> sur <span className="font-medium">{audits.length}</span> {t.totalAudits}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t.loading}</h2>
            <p className="text-gray-600 leading-relaxed">Récupération de vos audits en cours...</p>
          </div>
        </div>
      ) : audits.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t.empty}</h2>
            <p className="text-gray-600 leading-relaxed">{t.emptyDescription}</p>
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/?section=analyze'}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Commencer un audit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <AuditGroup title={t.lastMonth} audits={groupedAudits.lastMonth} />
          <AuditGroup title={t.older} audits={groupedAudits.older} />

          {filteredAudits.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
              <p className="text-gray-600">Aucun audit trouvé pour "<span className="font-medium">{searchTerm}</span>"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmation pour vider tout l'historique amélioré */}
      {clearAllConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t.confirmClearAll}
              </h3>
              <p className="text-gray-600 mb-6">
                Cette action supprimera définitivement tous vos audits. Cette action ne peut pas être annulée.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setClearAllConfirm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={clearAllHistory}
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression individuelle - même style que "vider l'historique" */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t.confirmDelete}
              </h3>
              <p className="text-gray-600 mb-6">
                Cette action ne peut pas être annulée.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm) {
                      deleteAudit(deleteConfirm);
                    }
                  }}
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Fonction utilitaire pour sauvegarder un audit dans l'historique
export const saveAuditToHistory = (result: AuditResult | ComparativeResult, engine: 'wave' | 'axe' | 'rgaa' | 'all', userEmail?: string) => {
  try {
    // Si pas d'utilisateur connecté, utiliser l'ancien système global (fallback)
    const historyKey = userEmail ? `rgaa-audit-history-${userEmail}` : 'rgaa-audit-history';
    const stored = localStorage.getItem(historyKey);
    let audits: HistoricalAudit[] = stored ? JSON.parse(stored) : [];

    // Déterminer le score correct selon le type de résultat
    let score: number;
    let totalViolations: number;

    if (engine === 'all' && 'summary' in result) {
      // Résultat comparatif - utiliser le meilleur score ou la moyenne
      const comparativeResult = result as ComparativeResult;
      if (comparativeResult.summary && comparativeResult.summary.bestScore !== undefined) {
        score = comparativeResult.summary.bestScore;
      } else if (comparativeResult.summary && comparativeResult.summary.averageScore !== undefined) {
        score = comparativeResult.summary.averageScore;
      } else {
        score = 0;
      }
      totalViolations = comparativeResult.totalUniqueViolations || 0;
    } else {
      // Résultat simple (AuditResult)
      const auditResult = result as AuditResult;
      score = auditResult.score || 0;
      totalViolations = auditResult.totalViolations || 0;
    }

    // S'assurer que le score est un nombre entier
    score = Math.round(score);

    const newAudit: HistoricalAudit = {
      id: Date.now().toString(),
      user_email: userEmail || '',
      url: result.url || 'URL inconnue',
      timestamp: new Date().toISOString(),
      score: score,
      total_violations: totalViolations,
      result,
      engine,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Debug pour vérifier les valeurs
    console.log('Sauvegarde audit:', {
      url: result.url,
      engine,
      score,
      totalViolations,
      resultType: 'summary' in result ? 'comparative' : 'simple',
      userEmail: userEmail || 'utilisateur non connecté'
    });

    // Ajouter en premier (plus récent)
    audits.unshift(newAudit);

    // Limiter à 50 audits maximum
    if (audits.length > 50) {
      audits = audits.slice(0, 50);
    }

    localStorage.setItem(historyKey, JSON.stringify(audits));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'audit dans l\'historique:', error);
  }
}; 