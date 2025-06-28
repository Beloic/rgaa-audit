'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, AlertTriangle } from 'lucide-react';

interface UsageIndicatorProps {
  compact?: boolean;
}

export default function UsageIndicator({ compact = false }: UsageIndicatorProps) {
  const { user, getCurrentPlan, getRemainingAudits, canPerformAudit } = useAuth();

  if (!user) return null;

  const plan = getCurrentPlan();
  const remainingAudits = getRemainingAudits();
  const canAudit = canPerformAudit();

  // Ne pas afficher pour les plans Enterprise (illimité)
  if (plan.id === 'enterprise') return null;

  const getIndicatorColor = () => {
    if (remainingAudits === 0) return 'bg-red-500';
    if (remainingAudits <= 2) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getTextColor = () => {
    if (remainingAudits === 0) return 'text-red-700';
    if (remainingAudits <= 2) return 'text-orange-700';
    return 'text-green-700';
  };

  const getBgColor = () => {
    if (remainingAudits === 0) return 'bg-red-50 border-red-200';
    if (remainingAudits <= 2) return 'bg-orange-50 border-orange-200';
    return 'bg-green-50 border-green-200';
  };

  // Version compacte pour le menu
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getIndicatorColor()}`} />
            <span className="text-xs font-medium text-gray-700">
              {remainingAudits === 0 ? (
                'Limite atteinte'
              ) : (
                `${remainingAudits} audit${remainingAudits > 1 ? 's' : ''} restant${remainingAudits > 1 ? 's' : ''}`
              )}
            </span>
          </div>
          {remainingAudits <= 2 && (
            <button
              className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade
            </button>
          )}
        </div>
        
        {/* Mini barre de progression */}
        {plan.limits.auditsPerMonth !== 'unlimited' && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{user.usage.auditsThisMonth} / {plan.limits.auditsPerMonth}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${getIndicatorColor()}`}
                style={{ 
                  width: `${Math.min(100, (user.usage.auditsThisMonth / (plan.limits.auditsPerMonth as number)) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Version complète originale
  return (
    <div className={`border rounded-lg p-4 ${getBgColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {remainingAudits === 0 ? (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            ) : (
              <div className={`w-3 h-3 rounded-full ${getIndicatorColor()}`} />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`text-sm font-medium ${getTextColor()}`}>
                Plan {plan.name}
              </h3>
              {plan.id === 'free' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                  Gratuit
                </span>
              )}
            </div>
            
            <p className={`text-sm ${getTextColor()}`}>
              {remainingAudits === 0 ? (
                'Limite d\'audits atteinte ce mois-ci'
              ) : plan.limits.auditsPerMonth === 'unlimited' ? (
                'Audits illimités'
              ) : (
                `${remainingAudits} audit${remainingAudits > 1 ? 's' : ''} restant${remainingAudits > 1 ? 's' : ''} ce mois`
              )}
            </p>

            {/* Barre de progression */}
            {plan.limits.auditsPerMonth !== 'unlimited' && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{user.usage.auditsThisMonth} utilisés</span>
                  <span>{plan.limits.auditsPerMonth} total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${getIndicatorColor()}`}
                    style={{ 
                      width: `${Math.min(100, (user.usage.auditsThisMonth / (plan.limits.auditsPerMonth as number)) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bouton d'action */}
        {(remainingAudits <= 2 || plan.id === 'free') && (
          <div className="flex-shrink-0">
            <Link
              href="/pricing"
              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors bg-blue-600 text-white hover:bg-blue-700"
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade
            </Link>
          </div>
        )}
      </div>

      {/* Message d'encouragement */}
      {remainingAudits === 0 && (
        <div className="mt-3 pt-3 border-t border-red-200">
          <p className="text-xs text-red-600">
            💡 Passez au plan Pro pour 50 audits/mois ou Enterprise pour un accès illimité.
          </p>
        </div>
      )}

      {remainingAudits <= 2 && remainingAudits > 0 && plan.id === 'free' && (
        <div className="mt-3 pt-3 border-t border-orange-200">
          <p className="text-xs text-orange-600">
            💡 Plus que {remainingAudits} audit{remainingAudits > 1 ? 's' : ''} ! 
            Passez au Pro pour continuer sans limite.
          </p>
        </div>
      )}
    </div>
  );
} 