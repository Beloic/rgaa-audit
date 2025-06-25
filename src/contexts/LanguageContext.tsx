'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traductions simplifiées
const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.blog': 'Blog',
    'nav.quiz': 'Quiz',
    'nav.contact': 'Contact',
    
    // Page d'accueil
    'home.title': 'Testez l\'accessibilité RGAA de votre site',
    'home.subtitle': 'Moteur d\'analyse WAVE & RGAA',
    'home.description': 'Analysez instantanément l\'accessibilité de votre site web avec notre outil gratuit basé sur WAVE et les critères RGAA français.',
    
    // Formulaire
    'form.url.placeholder': 'https://votre-site.com',
    'form.analyze.button': 'Analyser',
    'form.analyzing': 'Analyse en cours...',
    
    // Résultats
    'results.score': 'Score d\'accessibilité',
    'results.violations': 'violations détectées',
    'results.summary': 'Résumé',
    'results.details': 'Détails des violations',
    
    // Impacts
    'impact.low': 'Faible',
    'impact.medium': 'Moyen',
    'impact.high': 'Élevé',
    'impact.critical': 'Critique',
    
    // Niveaux
    'level.A': 'Niveau A',
    'level.AA': 'Niveau AA',
    'level.AAA': 'Niveau AAA'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.pricing': 'Pricing',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    
    // Homepage
    'home.title': 'Test your website\'s RGAA accessibility',
    'home.subtitle': 'WAVE & RGAA Analysis Engine',
    'home.description': 'Instantly analyze your website\'s accessibility with our free tool based on WAVE and French RGAA criteria.',
    
    // Form
    'form.url.placeholder': 'https://your-site.com',
    'form.analyze.button': 'Analyze',
    'form.analyzing': 'Analyzing...',
    
    // Results
    'results.score': 'Accessibility Score',
    'results.violations': 'violations detected',
    'results.summary': 'Summary',
    'results.details': 'Violation Details',
    
    // Impacts
    'impact.low': 'Low',
    'impact.medium': 'Medium',
    'impact.high': 'High',
    'impact.critical': 'Critical',
    
    // Levels
    'level.A': 'Level A',
    'level.AA': 'Level AA',
    'level.AAA': 'Level AAA'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 