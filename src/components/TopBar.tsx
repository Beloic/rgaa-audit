'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import AuthModal from '@/components/AuthModal';

interface TopBarProps {
  activeSection?: 'home' | 'analyze' | 'rgaa-reference';
  onSectionChange?: (section: 'home' | 'analyze' | 'rgaa-reference') => void;
  onAnalyzeClick?: () => void;
}

export default function TopBar({ activeSection, onSectionChange, onAnalyzeClick }: TopBarProps) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
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

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Gestion du scroll et de l'accessibilité du menu mobile
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Focus sur le premier élément du menu
      setTimeout(() => {
        const firstMenuButton = document.querySelector('[data-mobile-menu-item]') as HTMLElement;
        if (firstMenuButton) {
          firstMenuButton.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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

  const getMobileLinkClasses = (path: string) => {
    const baseClasses = "w-full px-6 py-4 text-left text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg";
    if (isActive(path)) {
      return `${baseClasses} text-blue-600 bg-blue-50 border-l-4 border-blue-600`;
    }
    return `${baseClasses} text-gray-700 hover:text-gray-900 hover:bg-gray-50`;
  };

  const getMobileSectionClasses = (section: string) => {
    const baseClasses = "w-full px-6 py-4 text-left text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg cursor-pointer";
    if (activeSection === section) {
      return `${baseClasses} text-blue-600 bg-blue-50 border-l-4 border-blue-600`;
    }
    return `${baseClasses} text-gray-700 hover:text-gray-900 hover:bg-gray-50`;
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
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Navigation principale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              onClick={() => handleSectionClick('home')}
              className="flex items-center space-x-2 flex-shrink-0 cursor-pointer"
            >
              <Shield className="w-6 h-6 text-blue-600" aria-hidden="true" />
              <span className="text-lg font-bold text-gray-900">RGAA Audit</span>
              <span className="hidden sm:inline ml-2 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-300">ALPHA</span>
            </div>
            
            {/* Menu Navigation Desktop */}
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
            </div>

            {/* Actions utilisateur Desktop */}
            <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
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
                  <option value="fr">🇫🇷 {t('language.french')}</option>
                  <option value="en">🇬🇧 {t('language.english')}</option>
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
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
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
            </div>

            {/* Actions utilisateur Mobile */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Sélecteur de langue mobile */}
              <label htmlFor="language-select-mobile" className="sr-only">Choisir la langue</label>
              <div className="relative">
                <select 
                  id="language-select-mobile"
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                  className="appearance-none border border-gray-300 rounded-lg pl-2 pr-6 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
                  aria-label="Sélection de la langue"
                >
                  <option value="fr">🇫🇷</option>
                  <option value="en">🇬🇧</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                  <span className="text-gray-400 text-xs">▼</span>
                </div>
              </div>

              {/* Menu hamburger */}
              <button 
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 hover:text-gray-900 focus:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMobileMenuOpen}
                aria-haspopup="true"
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile fullscreen */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation mobile"
          >
            <div className="px-4 py-6 space-y-2">
              {/* Navigation principale */}
              <div className="space-y-2">
                <button
                  data-mobile-menu-item
                  onClick={() => handleSectionClick('home')}
                  className={getMobileSectionClasses('home')}
                  aria-current={activeSection === 'home' ? 'page' : undefined}
                >
                  Accueil
                </button>
                <button
                  data-mobile-menu-item
                  onClick={() => handleSectionClick('analyze')}
                  className={getMobileSectionClasses('analyze')}
                  aria-current={activeSection === 'analyze' ? 'page' : undefined}
                >
                  Analyser un site
                </button>
                <Link 
                  href="/blog"
                  className={getMobileLinkClasses('/blog')}
                  aria-current={isActive('/blog') ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  href="/tarifs"
                  className={getMobileLinkClasses('/tarifs')}
                  aria-current={isActive('/tarifs') ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tarifs
                </Link>
              </div>

              {/* Séparateur */}
              <div className="my-6 border-t border-gray-200"></div>

              {/* Section utilisateur mobile */}
              {isAuthenticated && user ? (
                <div className="space-y-4">
                  {/* Profil utilisateur */}
                  <div className="px-6 py-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                        <p className="text-sm text-blue-600 mt-1 flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                          Plan {getCurrentPlan().name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions utilisateur */}
                  <div className="space-y-2">
                    <button
                      onClick={() => { 
                        setIsMobileMenuOpen(false); 
                        window.location.href = '/auth/change-password'; 
                      }}
                      className="w-full px-6 py-4 text-left text-lg font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                    >
                      Changer mon mot de passe
                    </button>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full px-6 py-4 text-left text-lg font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Boutons d'authentification mobile */
                <div className="space-y-3 px-2">
                  <button
                    onClick={handleLoginClick}
                    className="w-full px-6 py-4 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="w-full px-6 py-4 text-lg font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset touch-manipulation"
                  >
                    S'inscrire gratuitement
                  </button>
                </div>
              )}

              {/* Section version ALPHA */}
              <div className="mt-8 px-6 py-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-bold border border-orange-300 mb-2">
                    ⚠️ VERSION ALPHA
                  </span>
                  <p className="text-sm text-orange-700 leading-relaxed">
                    Il est probable que vous rencontriez des bugs, merci de bien vouloir les remonter :
                  </p>
                  <a 
                    href="https://trello.com/invite/b/685bed1c2b11059cc9d7e615/ATTI78b0cb2e987bf68a04e1f1e4198c0cb11AFF68E6/backlog-rgaa-audit" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline mt-2 inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Signaler un bug
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modal d'authentification */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />

      {/* Overlay pour fermer les menus */}
      {(isUserMenuOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsMobileMenuOpen(false);
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
}