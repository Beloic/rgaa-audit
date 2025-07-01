'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, LogOut, User, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleSectionClick = (section: 'home' | 'analyze' | 'rgaa-reference') => {
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  const handleRegisterClick = () => {
    setAuthModalTab('register');
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authLogout();
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <div 
              onClick={() => handleSectionClick('home')}
              className="-m-1.5 p-1.5 cursor-pointer"
            >
              <span className="sr-only">RGAA Audit</span>
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" aria-hidden="true" />
                <span className="text-xl font-bold text-gray-900">RGAA Audit</span>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            <button
              onClick={() => handleSectionClick('home')}
              className={`text-sm font-semibold leading-6 ${
                activeSection === 'home' ? 'text-blue-600' : 'text-gray-900'
              } hover:text-blue-600 transition-colors`}
            >
              Accueil
            </button>
            <button
              onClick={() => handleSectionClick('analyze')}
              className={`text-sm font-semibold leading-6 ${
                activeSection === 'analyze' ? 'text-blue-600' : 'text-gray-900'
              } hover:text-blue-600 transition-colors`}
            >
              Analyser
            </button>
            <Link
              href="/blog"
              className={`text-sm font-semibold leading-6 ${
                isActive('/blog') ? 'text-blue-600' : 'text-gray-900'
              } hover:text-blue-600 transition-colors`}
            >
              Blog
            </Link>
            <Link
              href="/tarifs"
              className={`text-sm font-semibold leading-6 ${
                isActive('/tarifs') ? 'text-blue-600' : 'text-gray-900'
              } hover:text-blue-600 transition-colors`}
            >
              Tarifs
            </Link>
            <Link
              href="/quiz"
              className={`text-sm font-semibold leading-6 ${
                isActive('/quiz') ? 'text-blue-600' : 'text-gray-900'
              } hover:text-blue-600 transition-colors`}
            >
              Quiz
            </Link>
          </div>

          {/* Right side actions */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-6">
            {/* Language selector */}
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
              className="text-sm font-semibold text-gray-900 border-0 bg-transparent focus:ring-0 cursor-pointer"
            >
              <option value="fr">🇫🇷 FR</option>
              <option value="en">🇬🇧 EN</option>
            </select>

            {isAuthenticated && user ? (
              /* User menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-x-2 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-900 font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="mt-1">
                                               <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                         {getCurrentPlan()?.name || 'Gratuit'} - {getRemainingAudits()} audits restants
                       </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <div className="flex items-center gap-x-2">
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth buttons */
              <div className="flex items-center gap-x-4">
                <button
                  onClick={handleLoginClick}
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50 bg-white">
              <div className="flex items-center justify-between p-6">
                <div 
                  onClick={() => handleSectionClick('home')}
                  className="-m-1.5 p-1.5 cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="h-8 w-8 text-blue-600" aria-hidden="true" />
                    <span className="text-xl font-bold text-gray-900">RGAA Audit</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="space-y-2 px-6 py-6">
                <button
                  onClick={() => handleSectionClick('home')}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Accueil
                </button>
                <button
                  onClick={() => handleSectionClick('analyze')}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Analyser
                </button>
                <Link
                  href="/blog"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/tarifs"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tarifs
                </Link>
                <Link
                  href="/quiz"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Quiz
                </Link>
              </div>
              <div className="border-t border-gray-200 px-6 py-6">
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                                         <div className="mt-2">
                       <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                         {getCurrentPlan()?.name || 'Gratuit'} - {getRemainingAudits()} audits restants
                       </span>
                     </div>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <LogOut className="h-5 w-5" />
                      {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleLoginClick}
                      className="block w-full rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Se connecter
                    </button>
                    <button
                      onClick={handleRegisterClick}
                      className="block w-full rounded-md bg-blue-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                      S'inscrire
                    </button>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                    className="block w-full rounded-md border-gray-300 text-base font-semibold text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="fr">🇫🇷 Français</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}