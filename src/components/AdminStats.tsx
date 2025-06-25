'use client';

import { useState, useEffect } from 'react';
import { Users, Eye, AlertTriangle, TrendingUp, Calendar, Clock, Globe, Shield } from 'lucide-react';

interface VisitorStat {
  timestamp: string;
  ip: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
}

interface DailyStat {
  date: string;
  attempts: number;
  successful: number;
  failed: number;
}

interface StatsData {
  totalAttempts: number;
  successfulLogins: number;
  failedAttempts: number;
  uniqueVisitors: number;
  lastActivity: string;
  visitors: VisitorStat[];
  analytics: {
    last24hAttempts: number;
    last24hSuccessful: number;
    last7daysAttempts: number;
    last7daysSuccessful: number;
    successRate: number;
    dailyStats: DailyStat[];
  };
}

interface AdminStatsProps {
  adminPassword: string;
}

export default function AdminStats({ adminPassword }: AdminStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats', {
          headers: {
            'x-admin-password': adminPassword
          }
        });

        if (!response.ok) {
          throw new Error('Accès non autorisé ou erreur serveur');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [adminPassword]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Administration - Statistiques de la Bêta
          </h1>
          <p className="text-gray-600">
            Dernière activité: {formatRelativeTime(stats.lastActivity)}
          </p>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Visiteurs uniques</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.uniqueVisitors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tentatives totales</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAttempts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Connexions réussies</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.successfulLogins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Taux de succès</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.analytics.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques période */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Dernières 24 heures
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tentatives</span>
                <span className="font-semibold">{stats.analytics.last24hAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Succès</span>
                <span className="font-semibold text-green-600">{stats.analytics.last24hSuccessful}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Échecs</span>
                <span className="font-semibold text-red-600">
                  {stats.analytics.last24hAttempts - stats.analytics.last24hSuccessful}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              7 derniers jours
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tentatives</span>
                <span className="font-semibold">{stats.analytics.last7daysAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Succès</span>
                <span className="font-semibold text-green-600">{stats.analytics.last7daysSuccessful}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Échecs</span>
                <span className="font-semibold text-red-600">
                  {stats.analytics.last7daysAttempts - stats.analytics.last7daysSuccessful}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique quotidien */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activité quotidienne (7 derniers jours)
          </h3>
          <div className="space-y-4">
            {stats.analytics.dailyStats.map((day, index) => (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-24 text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('fr-FR', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${Math.max(10, (day.attempts / Math.max(...stats.analytics.dailyStats.map(d => d.attempts))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-16 text-right">
                      {day.attempts} total
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-xs">
                    <span className="text-green-600">✓ {day.successful} succès</span>
                    <span className="text-red-600">✗ {day.failed} échecs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journal des visiteurs récents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Visiteurs récents (50 derniers)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">IP</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Raison</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Navigateur</th>
                </tr>
              </thead>
              <tbody>
                {stats.visitors.slice(-50).reverse().map((visitor, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-gray-900">
                      {formatDate(visitor.timestamp)}
                    </td>
                    <td className="py-2 text-sm text-gray-600 font-mono">
                      {visitor.ip}
                    </td>
                    <td className="py-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        visitor.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {visitor.success ? 'Succès' : 'Échec'}
                      </span>
                    </td>
                    <td className="py-2 text-sm text-gray-600">
                      {visitor.failureReason || '-'}
                    </td>
                    <td className="py-2 text-sm text-gray-600 max-w-xs truncate">
                      {visitor.userAgent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 