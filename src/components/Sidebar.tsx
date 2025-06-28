'use client';

import { Monitor, FileCheck, BookOpen, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  fr: {
    intelligentAnalysis: 'Analyse intelligente',
    rgaaReference: 'Référentiel RGAA',
    auditHistory: 'Historique',
    versionAlpha: 'VERSION ALPHA',
    bugReport: 'Il est probable que vous rencontriez des bugs, merci de bien vouloir les remonter :',
    reportBug: 'Signaler un bug'
  },
  en: {
    intelligentAnalysis: 'Intelligent Analysis',
    rgaaReference: 'RGAA Reference',
    auditHistory: 'History',
    versionAlpha: 'ALPHA VERSION',
    bugReport: 'You may encounter bugs, please report them:',
    reportBug: 'Report a bug'
  }
};

interface SidebarProps {
  activeSection: 'analyze' | 'rgaa-reference' | 'history';
  onSectionChange: (section: 'analyze' | 'rgaa-reference' | 'history') => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const getButtonClasses = (section: string) => {
    const baseClasses = "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500";
    if (activeSection === section) {
      return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`;
    }
    return `${baseClasses} text-gray-700 hover:bg-gray-50 hover:text-gray-900`;
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 flex flex-col">
      <nav className="p-4 space-y-2 flex-1" aria-label="Navigation secondaire">
        <button
          onClick={() => onSectionChange('analyze')}
          className={getButtonClasses('analyze')}
          aria-current={activeSection === 'analyze' ? 'page' : undefined}
        >
          <Monitor className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium">{t.intelligentAnalysis}</span>
        </button>

        <button
          onClick={() => onSectionChange('history')}
          className={getButtonClasses('history')}
          aria-current={activeSection === 'history' ? 'page' : undefined}
        >
          <Clock className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium">{t.auditHistory}</span>
        </button>
        
        <button
          onClick={() => onSectionChange('rgaa-reference')}
          className={getButtonClasses('rgaa-reference')}
          aria-current={activeSection === 'rgaa-reference' ? 'page' : undefined}
        >
          <BookOpen className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium">{t.rgaaReference}</span>
        </button>
      </nav>
      
      {/* Section Alpha en bas */}
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
            className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
          >
            {t.reportBug}
          </a>
        </div>
      </div>
    </aside>
  );
} 