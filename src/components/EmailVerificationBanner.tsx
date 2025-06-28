'use client';

import { useState } from 'react';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function EmailVerificationBanner() {
  const { user, updateUser } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');

  // Ne pas afficher le banner si :
  // - L'utilisateur n'est pas connecté
  // - L'email est déjà vérifié
  if (!user || user.emailVerified) {
    return null;
  }

  const resendVerificationEmail = async () => {
    setIsResending(true);
    setMessage('');

    try {
      // Générer un nouveau token
      const newToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: user.email, 
          token: newToken 
        }),
      });

      if (response.ok) {
        setMessage('Email de confirmation renvoyé !');
        // Mettre à jour le token et la date d'envoi
        updateUser({
          emailVerificationToken: newToken,
          emailVerificationSentAt: new Date().toISOString()
        });
      } else {
        setMessage('Erreur lors de l\'envoi');
      }
    } catch (error) {
      setMessage('Erreur de connexion');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 py-3 px-4 mb-6">
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
          <div className="text-sm text-blue-800 text-center">
            <span className="font-medium">Vérifiez votre email :</span>
            <span className="ml-1 text-blue-700">
              Un email de confirmation a été envoyé à <strong>{user.email}</strong>
            </span>
            <div className="mt-1 text-xs text-blue-600">
              Pensez à vérifier vos spams si vous ne le trouvez pas
            </div>
            {message && (
              <span className="ml-2 text-xs text-blue-600 inline-flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                {message}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={resendVerificationEmail}
          disabled={isResending}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {isResending ? (
            <>
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Envoi...
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3 mr-1" />
              Renvoyer
            </>
          )}
        </button>
      </div>
    </div>
  );
} 