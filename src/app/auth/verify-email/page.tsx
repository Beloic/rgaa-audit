'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Mail, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de vérification manquant');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      setStatus('loading');
      
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Votre email a été vérifié avec succès !');
        
        // Mettre à jour l'utilisateur pour marquer l'email comme vérifié
        if (user) {
          updateUser({ emailVerified: true });
        }
        
        // Rediriger vers l'accueil après 3 secondes
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Erreur lors de la vérification');
      }
    } catch (error) {
      console.error('Erreur vérification:', error);
      setStatus('error');
      setMessage('Erreur de connexion');
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) return;
    
    try {
      setIsResending(true);
      
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
        setMessage('Un nouvel email de confirmation a été envoyé !');
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Icône de statut */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 mb-4">
              {status === 'loading' && (
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-16 w-16 text-green-600" />
              )}
              {status === 'error' && (
                <XCircle className="h-16 w-16 text-red-600" />
              )}
              {status === 'expired' && (
                <Mail className="h-16 w-16 text-orange-600" />
              )}
            </div>

            {/* Titre */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {status === 'loading' && 'Vérification en cours...'}
              {status === 'success' && 'Email vérifié !'}
              {status === 'error' && 'Erreur de vérification'}
              {status === 'expired' && 'Lien expiré'}
            </h2>

            {/* Message */}
            <p className={`text-sm mb-6 ${
              status === 'success' ? 'text-green-600' :
              status === 'error' ? 'text-red-600' :
              status === 'expired' ? 'text-orange-600' :
              'text-gray-600'
            }`}>
              {message}
            </p>

            {/* Actions */}
            <div className="space-y-4">
              {status === 'success' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    Redirection automatique dans quelques secondes...
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Retourner à l'accueil
                  </Link>
                </div>
              )}

              {(status === 'error' || status === 'expired') && user && (
                <div className="space-y-3">
                  <button
                    onClick={resendVerificationEmail}
                    disabled={isResending}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Renvoyer l'email
                      </>
                    )}
                  </button>
                  
                  <div>
                    <Link
                      href="/"
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Retourner à l'accueil
                    </Link>
                  </div>
                </div>
              )}

              {!user && status === 'error' && (
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Retourner à l'accueil
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 