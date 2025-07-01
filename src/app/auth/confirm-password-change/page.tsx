'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Lock, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function ConfirmPasswordChangeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de réinitialisation manquant');
      return;
    }

    // Token présent, prêt pour la saisie du nouveau mot de passe
    setStatus('ready');
  }, [token]);

  const validatePasswords = () => {
    if (!newPassword || !confirmPassword) {
      setValidationError('Veuillez remplir tous les champs');
      return false;
    }

    if (newPassword.length < 6) {
      setValidationError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('Les mots de passe ne correspondent pas');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    setIsSubmitting(true);
    setValidationError('');

    try {
      const response = await fetch('/api/auth/confirm-password-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/auth/login?message=password-changed');
        }, 3000);
      } else {
        if (data.error.includes('expiré')) {
          setStatus('expired');
        } else {
          setStatus('error');
        }
        setMessage(data.error || 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      setStatus('error');
      setMessage('Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: 'bg-gray-200' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return {
      strength,
      label: labels[strength - 1] || 'Très faible',
      color: colors[strength - 1] || 'bg-red-500'
    };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-6">
            {/* Icône de statut */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 mb-4">
              {status === 'loading' && (
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              )}
              {status === 'ready' && (
                <Lock className="h-16 w-16 text-blue-600" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-16 w-16 text-green-600" />
              )}
              {(status === 'error' || status === 'expired') && (
                <XCircle className="h-16 w-16 text-red-600" />
              )}
            </div>

            {/* Titre */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {status === 'loading' && 'Vérification...'}
              {status === 'ready' && 'Nouveau mot de passe'}
              {status === 'success' && 'Mot de passe changé !'}
              {status === 'error' && 'Erreur'}
              {status === 'expired' && 'Lien expiré'}
            </h2>

            {/* Sous-titre */}
            {status === 'ready' && (
              <p className="text-sm text-gray-600">
                Choisissez un nouveau mot de passe sécurisé
              </p>
            )}
          </div>

          {status === 'success' && (
            <div className="text-center">
              <p className="text-sm text-green-600 mb-6">
                {message}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Redirection automatique vers la page de connexion...
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Se connecter maintenant
              </Link>
            </div>
          )}

          {(status === 'error' || status === 'expired') && (
            <div className="text-center">
              <p className="text-sm text-red-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  href="/auth/change-password"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Demander un nouveau lien
                </Link>
                <Link
                  href="/"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          )}

          {status === 'ready' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {validationError && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{validationError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nouveau mot de passe */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Votre nouveau mot de passe"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Indicateur de force du mot de passe */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 min-w-0 flex-shrink-0">
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Confirmez votre mot de passe"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Indicateur de correspondance */}
                {confirmPassword && (
                  <div className="mt-1">
                    {newPassword === confirmPassword ? (
                      <p className="text-xs text-green-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Les mots de passe correspondent
                      </p>
                    ) : (
                      <p className="text-xs text-red-600 flex items-center">
                        <XCircle className="w-3 h-3 mr-1" />
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Changement en cours...
                    </>
                  ) : (
                    'Changer le mot de passe'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Conseils de sécurité */}
          {status === 'ready' && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                💡 Conseils pour un mot de passe sécurisé
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Au moins 8 caractères</li>
                <li>• Mélange de majuscules et minuscules</li>
                <li>• Inclure des chiffres et symboles</li>
                <li>• Éviter les informations personnelles</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPasswordChangePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <ConfirmPasswordChangeContent />
    </Suspense>
  );
} 