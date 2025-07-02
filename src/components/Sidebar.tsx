'use client';

import { Monitor, FileCheck, BookOpen, Clock, BarChart3, Accessibility } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    statistics: 'Statistiques',
    intelligentAnalysis: 'Analyse intelligente',
    rgaaReference: 'Référentiel RGAA',
    auditHistory: 'Gestion des audits',
    disabilitySimulator: "Simulateur d'Handicap",
    quiz: 'Quiz',
    versionAlpha: 'VERSION ALPHA',
    bugReport: 'Il est probable que vous rencontriez des bugs, merci de bien vouloir les remonter :',
    reportBug: 'Signaler un bug',
    // Version courte pour mobile
    statsShort: 'Stats',
    analyzeShort: 'Analyser',
    historyShort: 'Audits',
    simulatorShort: 'Handicap',
    quizShort: 'Quiz'
  },
  en: {
    statistics: 'Statistics',
    intelligentAnalysis: 'Intelligent Analysis',
    rgaaReference: 'RGAA Reference',
    auditHistory: 'History',
    disabilitySimulator: 'Disability Simulator',
    quiz: 'Quiz',
    versionAlpha: 'ALPHA VERSION',
    bugReport: 'You may encounter bugs, please report them:',
    reportBug: 'Report a bug',
    // Version courte pour mobile
    statsShort: 'Stats',
    analyzeShort: 'Analyze',
    historyShort: 'History',
    simulatorShort: 'Handicap',
    quizShort: 'Quiz'
  }
};

interface SidebarProps {
  activeSection: 'statistics' | 'analyze' | 'rgaa-reference' | 'history' | 'disability-simulator' | 'quiz';
  onSectionChange: (section: 'statistics' | 'analyze' | 'rgaa-reference' | 'history' | 'disability-simulator' | 'quiz') => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { language } = useLanguage();
  const t = translations[language];
  
  const getButtonClasses = (section: string) => {
    const baseClasses = "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border text-[15px]";
    if (activeSection === section) {
      return `${baseClasses} bg-blue-50 text-blue-700 border-blue-200`;
    }
    return `${baseClasses} text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent`;
  };

  const getMobileButtonClasses = (section: string) => {
    const baseClasses = "flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg touch-manipulation min-h-[60px]";
    if (activeSection === section) {
      return `${baseClasses} text-blue-600 bg-blue-50`;
    }
    return `${baseClasses} text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100`;
  };

  const navigationItems = [
    {
      id: 'analyze' as const,
      icon: Monitor,
      label: t.intelligentAnalysis,
      shortLabel: t.analyzeShort,
      description: 'Analyse automatisée RGAA'
    },
    {
      id: 'history' as const,
      icon: Clock,
      label: t.auditHistory,
      shortLabel: t.historyShort,
      description: 'Historique des audits'
    },
    {
      id: 'disability-simulator' as const,
      icon: Accessibility,
      label: t.disabilitySimulator,
      shortLabel: t.simulatorShort,
      description: 'Simulation de handicaps'
    },
    {
      id: 'statistics' as const,
      icon: BarChart3,
      label: t.statistics,
      shortLabel: t.statsShort,
      description: 'Statistiques et données'
    },
    {
      id: 'quiz' as const,
      icon: BookOpen,
      label: t.quiz,
      shortLabel: t.quizShort,
      description: 'Quiz accessibilité'
    }
  ];

  return (
    <>
      {/* Sidebar Desktop - cachée sur mobile */}
      <aside className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 flex-col justify-between">
        <nav className="p-4 space-y-2 flex-1" aria-label="Navigation secondaire">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={item.id === 'disability-simulator' 
                  ? getButtonClasses(item.id) + ' text-[13px]'
                  : getButtonClasses(item.id)
                }
                aria-current={activeSection === item.id ? 'page' : undefined}
                title={item.description}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className={`font-medium ${item.id === 'disability-simulator' ? 'whitespace-nowrap' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
        
        {/* Section Alpha en bas - Desktop */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <div className="border border-orange-500 text-orange-600 text-xs font-bold px-2 py-1 rounded-full inline-flex items-center gap-1 mb-2">
              <span className="text-[10px]">⚠️</span>
              {t.versionAlpha}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t.bugReport}
            </p>
            <a 
              href="https://trello.com/invite/b/685bed1c2b11059cc9d7e615/ATTI78b0cb2e987bf68a04e1f1e4198c0cb11AFF68E6/backlog-rgaa-audit" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              {t.reportBug}
            </a>
          </div>
        </div>
      </aside>

      {/* Bottom Navigation Mobile - visible uniquement sur mobile/tablette */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom"
        role="navigation" 
        aria-label="Navigation secondaire mobile"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={getMobileButtonClasses(item.id)}
                aria-current={activeSection === item.id ? 'page' : undefined}
                aria-label={`${item.label} - ${item.description}`}
              >
                <Icon 
                  className={`w-6 h-6 mb-1 ${activeSection === item.id ? 'text-blue-600' : 'text-gray-500'}`} 
                  aria-hidden="true" 
                />
                <span className={activeSection === item.id ? 'text-blue-600 font-semibold' : 'text-gray-600'}>
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Indicateur version Alpha mobile */}
        <div className="bg-orange-50 border-t border-orange-200 px-4 py-2">
          <div className="flex items-center justify-center">
            <span className="text-xs text-orange-600 font-medium">
              ⚠️ {t.versionAlpha} - 
              <a 
                href="https://trello.com/invite/b/685bed1c2b11059cc9d7e615/ATTI78b0cb2e987bf68a04e1f1e4198c0cb11AFF68E6/backlog-rgaa-audit" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                {t.reportBug}
              </a>
            </span>
          </div>
        </div>
      </nav>

      {/* Spacer pour éviter que le contenu soit caché derrière la bottom nav mobile */}
      <div className="lg:hidden h-24"></div>
    </>
  );
} 