'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Globe, 
  Zap, 
  Shield, 
  Cpu,
  Calendar,
  Target,
  Award,
  Activity,
  PieChart,
  BarChart,
  LineChart
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import type { AuditHistory, RGAAViolation } from '@/types/audit';

// Type étendu pour les audits historiques avec plus de détails
interface HistoricalAudit extends AuditHistory {
  engine: 'wave' | 'axe' | 'rgaa' | 'all';
  result: {
    violations: RGAAViolation[];
    [key: string]: any;
  };
}

const translations = {
  fr: {
    title: 'Statistiques de vos audits',
    subtitle: 'Analyse complète de vos performances et tendances',
    totalAudits: 'Total des audits',
    averageViolations: 'Violations moyennes',
    totalViolations: 'Violations totales',
    complianceRate: 'Taux de conformité',
    recentActivity: 'Activité récente',
    engineBreakdown: 'Répartition par moteur',
    monthlyTrends: 'Tendances mensuelles',
    topViolations: 'Violations les plus fréquentes',
    performanceMetrics: 'Métriques de performance',
    noData: 'Aucune donnée disponible',
    startAuditing: 'Commencez par effectuer des audits pour voir vos statistiques',
    last7Days: '7 derniers jours',
    last30Days: '30 derniers jours',
    last90Days: '90 derniers jours',
    allTime: 'Tout le temps',
    period: 'Période',
    audits: 'audits',
    violations: 'violations',
    date: 'Date',
    url: 'URL',
    engine: 'Moteur',
    status: 'Statut',
    conform: 'Conforme',
    partiallyConform: 'Partiellement conforme',
    nonConform: 'Non conforme',
    critical: 'Critique',
    high: 'Élevé',
    medium: 'Moyen',
    low: 'Faible',
    criterion: 'Critère',
    errorType: 'Type d\'erreur',
    count: 'Nombre',
    percentage: 'Pourcentage',
    loginRequired: 'Connexion requise',
    loginRequiredDescription: 'Connectez-vous pour voir vos statistiques d\'audit.',
    loading: 'Chargement des statistiques...',
    comparative: 'Comparatif'
  },
  en: {
    title: 'Your Audit Statistics',
    subtitle: 'Complete analysis of your performance and trends',
    totalAudits: 'Total audits',
    averageViolations: 'Average violations',
    totalViolations: 'Total violations',
    complianceRate: 'Compliance rate',
    recentActivity: 'Recent activity',
    engineBreakdown: 'Engine breakdown',
    monthlyTrends: 'Monthly trends',
    topViolations: 'Most frequent violations',
    performanceMetrics: 'Performance metrics',
    noData: 'No data available',
    startAuditing: 'Start by performing audits to see your statistics',
    last7Days: 'Last 7 days',
    last30Days: 'Last 30 days',
    last90Days: 'Last 90 days',
    allTime: 'All time',
    period: 'Period',
    audits: 'audits',
    violations: 'violations',
    date: 'Date',
    url: 'URL',
    engine: 'Engine',
    status: 'Status',
    conform: 'Conform',
    partiallyConform: 'Partially conform',
    nonConform: 'Non conform',
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    criterion: 'Criterion',
    errorType: 'Error type',
    count: 'Count',
    percentage: 'Percentage',
    loginRequired: 'Login required',
    loginRequiredDescription: 'Please log in to view your audit statistics.',
    loading: 'Loading statistics...',
    comparative: 'Comparative'
  }
};

interface StatisticsProps {
  // Props pour les callbacks si nécessaire
}

export default function Statistics({}: StatisticsProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = translations[language];
  const [audits, setAudits] = useState<HistoricalAudit[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Charger les audits de l'utilisateur
  useEffect(() => {
    const loadAudits = () => {
      try {
        if (!user) {
          setAudits([]);
          setIsLoading(false);
          return;
        }

        const historyKey = `rgaa-audit-history-${user.email}`;
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const parsed: HistoricalAudit[] = JSON.parse(stored);
          setAudits(parsed);
        } else {
          setAudits([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des audits:', error);
        setAudits([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudits();
  }, [user]);

  // Filtrer les audits selon la période sélectionnée
  const getFilteredAudits = () => {
    if (selectedPeriod === 'all') return audits;

    const now = new Date();
    const daysAgo = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    return audits.filter(audit => new Date(audit.timestamp) >= cutoffDate);
  };

  const filteredAudits = getFilteredAudits();

  // Calculer les statistiques
  const calculateStats = () => {
    if (filteredAudits.length === 0) {
      return {
        totalAudits: 0,
        averageViolations: 0,
        totalViolations: 0,
        complianceRate: 0,
        engineBreakdown: {},
        topViolations: [],
        monthlyData: []
      };
    }

    const totalAudits = filteredAudits.length;
    const totalViolations = filteredAudits.reduce((sum, audit) => sum + audit.totalViolations, 0);
    const averageViolations = Math.round(totalViolations / totalAudits);
    const compliantAudits = filteredAudits.filter(audit => audit.totalViolations === 0).length;
    const complianceRate = Math.round((compliantAudits / totalAudits) * 100);

    // Répartition par moteur
    const engineBreakdown = filteredAudits.reduce((acc, audit) => {
      acc[audit.engine] = (acc[audit.engine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Violations les plus fréquentes
    const violationCounts: Record<string, number> = {};
    filteredAudits.forEach(audit => {
      if ('violations' in audit.result) {
        audit.result.violations.forEach(violation => {
          const key = violation.criterion || 'unknown';
          violationCounts[key] = (violationCounts[key] || 0) + 1;
        });
      }
    });

    const topViolations = Object.entries(violationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([criterion, count]) => ({ criterion, count }));

    // Données mensuelles pour les graphiques
    const monthlyData = filteredAudits.reduce((acc, audit) => {
      const date = new Date(audit.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { audits: 0, violations: 0 };
      }
      
      acc[monthKey].audits += 1;
      acc[monthKey].violations += audit.totalViolations;
      
      return acc;
    }, {} as Record<string, { audits: number; violations: number }>);

    const monthlyDataArray = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        audits: data.audits,
        violations: data.violations
      }));

    return {
      totalAudits,
      averageViolations,
      totalViolations,
      complianceRate,
      engineBreakdown,
      topViolations,
      monthlyData: monthlyDataArray
    };
  };

  const stats = calculateStats();

  // Obtenir le nom du moteur
  const getEngineName = (engine: string) => {
    switch (engine) {
      case 'wave': return 'WAVE';
      case 'axe': return 'Axe Core';
      case 'rgaa': return 'RGAA';
      case 'all': return t.comparative;
      default: return engine.toUpperCase();
    }
  };

  // Obtenir l'icône du moteur
  const getEngineIcon = (engine: string) => {
    switch (engine) {
      case 'rgaa': return <Zap className="w-4 h-4" />;
      case 'wave': return <Shield className="w-4 h-4" />;
      case 'axe': return <Cpu className="w-4 h-4" />;
      case 'all': return <BarChart3 className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  // Obtenir le statut de conformité
  const getComplianceStatus = (violations: number) => {
    if (violations === 0) return { status: t.conform, color: 'text-green-600 bg-green-50' };
    if (violations <= 5) return { status: t.partiallyConform, color: 'text-yellow-600 bg-yellow-50' };
    return { status: t.nonConform, color: 'text-red-600 bg-red-50' };
  };

  // Obtenir la couleur pour le type d'impact
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-600';
      case 'serious': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Obtenir le nom traduit de l'impact
  const getImpactName = (impact: string) => {
    switch (impact) {
      case 'critical': return t.critical;
      case 'serious': return t.critical;
      case 'high': return t.high;
      case 'moderate': return t.medium;
      case 'medium': return t.medium;
      case 'low': return t.low;
      default: return impact;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.loginRequired}</h2>
          <p className="text-gray-600">{t.loginRequiredDescription}</p>
        </div>
      </div>
    );
  }

  if (filteredAudits.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.noData}</h2>
          <p className="text-gray-600">{t.startAuditing}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* En-tête */}
      <header className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center mb-3">
                <BarChart3 className="w-10 h-10 mr-4 text-blue-600" />
                {t.title}
              </h1>
              <p className="text-gray-600 text-lg">{t.subtitle}</p>
            </div>
            
            {/* Sélecteur de période */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d' | 'all')}
                  className="border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="7d">{t.last7Days}</option>
                  <option value="30d">{t.last30Days}</option>
                  <option value="90d">{t.last90Days}</option>
                  <option value="all">{t.allTime}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total audits */}
        <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center border border-blue-100">
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-200/60 shadow text-blue-700">
              <BarChart3 className="w-7 h-7" />
            </span>
          </div>
          <div className="text-4xl font-extrabold text-blue-900 mb-2">{stats.totalAudits}</div>
          <div className="text-base text-blue-700 font-medium tracking-wide">{t.totalAudits}</div>
        </div>
        {/* Total violations */}
        <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center border border-orange-100">
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-200/60 shadow text-orange-700">
              <AlertTriangle className="w-7 h-7" />
            </span>
          </div>
          <div className="text-4xl font-extrabold text-orange-900 mb-2">{stats.totalViolations}</div>
          <div className="text-base text-orange-700 font-medium tracking-wide">{t.totalViolations}</div>
        </div>
        {/* Compliance rate */}
        <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center border border-purple-100">
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-200/60 shadow text-purple-700">
              <Award className="w-7 h-7" />
            </span>
          </div>
          <div className="text-4xl font-extrabold text-purple-900 mb-2">{stats.complianceRate}%</div>
          <div className="text-base text-purple-700 font-medium tracking-wide">{t.complianceRate}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Répartition par moteur */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-600" />
            {t.engineBreakdown}
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.engineBreakdown).map(([engine, count]) => (
              <div key={engine} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {getEngineIcon(engine)}
                  <span className="ml-2 font-medium text-gray-700">{getEngineName(engine)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900">{count}</span>
                  <span className="text-sm text-gray-500 ml-1">{t.audits}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Violations les plus fréquentes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            {t.topViolations}
          </h3>
          <div className="space-y-3">
            {stats.topViolations.map((violation, index) => (
              <div key={violation.criterion} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-700">{t.criterion} {violation.criterion}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{violation.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tendances mensuelles */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <LineChart className="w-5 h-5 mr-2 text-green-600" />
          {t.monthlyTrends}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t.period}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t.audits}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t.violations}</th>
              </tr>
            </thead>
            <tbody>
              {stats.monthlyData.map((data) => (
                <tr key={data.month} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{data.month}</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">{data.audits}</td>
                  <td className="py-3 px-4 text-gray-900">{data.violations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activité récente */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          {t.recentActivity}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t.date}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t.url}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t.engine}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t.violations}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.slice(0, 10).map((audit) => {
                const compliance = getComplianceStatus(audit.totalViolations);
                return (
                  <tr key={audit.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(audit.timestamp).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-medium truncate max-w-xs">
                      {audit.url}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getEngineIcon(audit.engine)}
                        <span className="ml-1 text-gray-700">{getEngineName(audit.engine)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{audit.totalViolations}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${compliance.color}`}>
                        {compliance.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 