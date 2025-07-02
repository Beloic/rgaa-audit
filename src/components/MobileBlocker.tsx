import { Monitor, Smartphone } from 'lucide-react';
import React from 'react';

interface MobileBlockerProps {
  onClose?: () => void;
}

export default function MobileBlocker({ onClose }: MobileBlockerProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-blocker-title"
      aria-describedby="mobile-blocker-desc"
    >
      <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 flex flex-col items-center text-center">
        <Monitor className="w-16 h-16 text-blue-600 mb-4" aria-hidden="true" />
        <h2 id="mobile-blocker-title" className="text-2xl font-bold text-gray-900 mb-2">
          Plateforme disponible uniquement sur ordinateur
        </h2>
        <p id="mobile-blocker-desc" className="text-gray-700 mb-6">
          La plateforme RGAA Audit n'est pas encore accessible sur mobile ou tablette.<br />
          Veuillez vous connecter depuis un ordinateur (PC ou Mac) pour lancer un audit d'accessibilité.
        </p>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          autoFocus
        >
          Retour
        </button>
        <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
          <Smartphone className="w-4 h-4" />
          Version mobile en cours de développement
        </div>
      </div>
    </div>
  );
} 