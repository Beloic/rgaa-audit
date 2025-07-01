'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import AuthModal from '@/components/AuthModal';

interface TopBarProps {
  activeSection?: 'home' | 'analyze' | 'rgaa-reference';
  onSectionChange?: (section: 'home' | 'analyze' | 'rgaa-reference') => void;
  onAnalyzeClick?: () => void;
}

export default function TopBar({ activeSection, onSectionChange, onAnalyzeClick }: TopBarProps) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout: authLogout, getRemainingAudits, getCurrentPlan } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Écouter les événements d'ouverture de la modal d'authentification
  useEffect(() => {
    const handleOpenAuthModal = (event: CustomEvent) => {
      const { tab } = event.detail;
      setAuthModalTab(tab);
      setIsAuthModalOpen(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal as EventListener);
    
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal as EventListener);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "font-medium transition-colors focus:outline-none focus:underline";
    if (isActive(path)) {
      return `${baseClasses} text-blue-600 hover:text-blue-700 focus:text-blue-700`;
    }
    return `${baseClasses} text-gray-600 hover:text-gray-900 focus:text-gray-900`;
  };

  const getSectionClasses = (section: string) => {
    const baseClasses = "font-medium transition-colors focus:outline-none focus:underline cursor-pointer";
    if (activeSection === section) {
      return `${baseClasses} text-blue-600 hover:text-blue-700 focus:text-blue-700`;
    }
    return `${baseClasses} text-gray-600 hover:text-gray-900 focus:text-gray-900`;
  };



  const handleSectionClick = (section: 'home' | 'analyze' | 'rgaa-reference') => {
    if (section === 'analyze' && onAnalyzeClick) {
      onAnalyzeClick();
    } else if (onSectionChange) {
      onSectionChange(section);
    } else {
      if (section === 'home') {
        window.location.href = '/';
      } else if (section === 'analyze') {
        window.location.href = '/?section=analyze';
      }
    }
  };

  const handleLoginClick = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthModalTab('register');
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authLogout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Navigation principale">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              onClick={() => handleSectionClick('home')}
              className="flex items-center space-x-2 flex-shrink-0 cursor-pointer"
            >
              <Shield className="w-6 h-6 text-blue-600" aria-hidden="true" />
              <span className="text-lg font-bold text-gray-900">RGAA Audit</span>
            </div>
            
            {/* Menu Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <span 
                onClick={() => handleSectionClick('home')}
                className={getSectionClasses('home')}
                aria-current={activeSection === 'home' ? 'page' : undefined}
              >
                Accueil
              </span>
              <span 
                onClick={() => handleSectionClick('analyze')}
                className={getSectionClasses('analyze')}
                aria-current={activeSection === 'analyze' ? 'page' : undefined}
              >
                Analyser
              </span>
              <Link 
                href="/blog"
                className={getLinkClasses('/blog')}
                aria-current={isActive('/blog') ? 'page' : undefined}
              >
                Blog
              </Link>
              <Link 
                href="/tarifs"
                className={getLinkClasses('/tarifs')}
                aria-current={isActive('/tarifs') ? 'page' : undefined}
              >
                Tarifs
              </Link>
              <Link 
                href="/quiz"
                className={getLinkClasses('/quiz')}
                aria-current={isActive('/quiz') ? 'page' : undefined}
              >
                Quiz
              </Link>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Sélecteur de langue */}
              <label htmlFor="language-select-topbar" className="sr-only">Choisir la langue</label>
              <div className="relative">
                <select 
                  id="language-select-topbar"
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                  className="appearance-none border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer min-w-0"
                  aria-label="Sélection de la langue"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇬🇧 English</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <span className="text-gray-400 text-sm">▼</span>
                </div>
              </div>

              {/* Actions d'authentification */}
              {isAuthenticated && user ? (
                /* Menu utilisateur connecté */
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 focus:text-gray-900 transition-colors rounded-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Menu utilisateur"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Menu déroulant */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
                      {/* Section utilisateur */}
                      <div className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            <p className="text-xs text-blue-600 mt-1 flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                              Plan {getCurrentPlan().name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Section déconnexion */}
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={() => { setIsUserMenuOpen(false); window.location.href = '/auth/change-password'; }}
                          className="w-full px-4 py-2.5 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center space-x-3 transition-colors"
                        >
                          <span className="font-medium">Changer mon mot de passe</span>
                        </button>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">{isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Boutons d'authentification pour utilisateurs non connectés */
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLoginClick}
                    className="text-gray-700 hover:text-gray-900 focus:text-gray-900 px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    S'inscrire
                  </button>
                </div>
              )}

              {/* Menu mobile */}
              <div className="md:hidden flex-shrink-0">
                <button 
                  className="text-gray-600 hover:text-gray-900 focus:text-gray-900 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Menu mobile"
                >
                  <span className="text-xl">☰</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal d'authentification */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />

      {/* Overlay pour fermer le menu utilisateur */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
}