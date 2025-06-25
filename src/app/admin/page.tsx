'use client';

import { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import AdminStats from '@/components/AdminStats';
import Link from 'next/link';

export default function AdminPage() {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Vérifier le mot de passe admin (vous pouvez le changer dans .env.local)
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'RGAAAudit2025Admin!Stats';
    
    if (adminPassword === expectedPassword) {
      setIsAuthenticated(true);
    } else {
      setError('Mot de passe administrateur incorrect');
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPassword('');
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {/* En-tête */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Administration
            </h1>
            <p className="text-lg text-red-600 font-semibold mb-2">
              Accès Restreint
            </p>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Cette page est réservée aux administrateurs. 
              Veuillez vous identifier pour accéder aux statistiques.
            </p>
          </div>

          {/* Formulaire d'authentification admin */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe administrateur
                </label>
                <input
                  id="adminPassword"
                  name="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Entrez le mot de passe admin"
                  required
                />
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !adminPassword.trim()}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  'Accéder aux statistiques'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour à l'application
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si authentifié, afficher les statistiques
  return (
    <div>
      {/* Barre de navigation admin */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
              <Lock className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Panel Administrateur</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Application
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      {/* Composant des statistiques */}
      <AdminStats adminPassword="RGAAAudit2025Admin!Stats" />
    </div>
  );
} 