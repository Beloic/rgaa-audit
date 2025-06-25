'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, LogOut } from 'lucide-react';

interface TopBarProps {
  activeSection?: 'home' | 'analyze' | 'manual-audit' | 'rgaa-reference';
  onSectionChange?: (section: 'home' | 'analyze' | 'manual-audit' | 'rgaa-reference') => void;
  onAnalyzeClick?: () => void;
}

export default function TopBar({ activeSection, onSectionChange, onAnalyzeClick }: TopBarProps) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { logout } = useAuth();

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

  const handleSectionClick = (section: 'home' | 'analyze' | 'manual-audit' | 'rgaa-reference') => {
    if (section === 'analyze' && onAnalyzeClick) {
      onAnalyzeClick();
    } else if (onSectionChange) {
      onSectionChange(section);
    } else {
      // Si on n'a pas de onSectionChange (pages blog, quiz, etc.), naviguer vers la page d'accueil
      if (section === 'home') {
        window.location.href = '/';
      } else if (section === 'analyze') {
        window.location.href = '/?section=analyze';
      }
    }
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter de la bêta ?')) {
      logout();
    }
  };

  return (
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
            <span className="border border-orange-500 text-orange-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <span className="text-[10px]">⚠️</span>
              ALPHA
            </span>
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
              href="/quiz"
              className={getLinkClasses('/quiz')}
              aria-current={isActive('/quiz') ? 'page' : undefined}
            >
              Quiz
            </Link>
          </div>

          {/* Actions et Sélecteur de langue */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Bouton de déconnexion */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 focus:text-red-600 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-2 py-1"
              aria-label="Se déconnecter de la bêta"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>

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
          </div>

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
    </nav>
  );
} 