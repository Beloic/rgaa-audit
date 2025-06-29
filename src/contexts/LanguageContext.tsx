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
    'home.mainTitle': 'Audit d\'accessibilité ',
    'home.mainDescription': 'Cette version alpha utilise les moteurs les plus performants pour aider les professionnels à réaliser leurs audits. Cet outil n\'a pas vocation à remplacer l\'expertise humaine.',
    
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
    'level.AAA': 'Niveau AAA',

    // Métadonnées de la page
    'meta.title': 'RGAA Audit - Testez l\'accessibilité de votre site',
    'meta.description': 'Outil d\'audit d\'accessibilité RGAA gratuit et intelligent. Rendez votre site web plus inclusif. Testez la conformité RGAA de votre site web instantanément.',

    // Blog
    'blog.title': 'Blog RGAA Audit',
    'blog.subtitle': 'Actualités, guides et bonnes pratiques pour l\'accessibilité web',
    'blog.featured': 'À la une',
    'blog.allArticles': 'Tous les articles',
    'blog.readTime': 'min de lecture',
    'blog.readFullArticle': 'Lire l\'article complet',
    'blog.backToBlog': 'Retour au blog',
    'blog.publishedOn': 'Publié le',
    'blog.skipToContent': 'Aller au contenu principal',

    // Articles du blog - Traductions générales
    'article.categories.regulation': 'Réglementation',
    'article.categories.guide': 'Guide',
    'article.categories.seo': 'SEO',
    'article.categories.mobile': 'Mobile',
    'article.categories.testing': 'Tests',
    'article.categories.colors': 'Couleurs',

    // Articles spécifiques
    'article.rgaa2025.title': 'RGAA 2025 : 5 nouvelles règles à connaître',
    'article.rgaa2025.excerpt': 'Découvrez les évolutions majeures du RGAA qui entreront en vigueur en 2025. Nouvelles obligations, critères renforcés et impacts pour les sites web.',
    
    'article.errors2025.title': 'Top 10 des erreurs d\'accessibilité les plus courantes',
    'article.errors2025.excerpt': 'Évitez les pièges les plus fréquents en matière d\'accessibilité web. Guide pratique avec exemples concrets et solutions pour chaque problème identifié.',

    'article.seoGuide.title': 'Accessibilité et SEO : le guide complet 2025',
    'article.seoGuide.excerpt': 'Comment l\'accessibilité web améliore votre référencement naturel. Techniques, outils et stratégies pour allier performance SEO et inclusion numérique.',

    'article.mobile.title': 'Accessibilité mobile : bonnes pratiques 2025',
    'article.mobile.excerpt': 'Optimisez l\'accessibilité de vos applications mobiles. Techniques de design inclusif, tests utilisateurs et conformité RGAA sur mobile.',

    'article.testing.title': 'Comment tester l\'accessibilité de votre site web : Guide complet',
    'article.testing.excerpt': 'Méthodologie complète pour évaluer et améliorer l\'accessibilité de votre site web. De l\'audit automatisé aux tests utilisateurs, découvrez toutes les étapes essentielles.',

    'article.colors.title': 'Couleurs et contrastes WCAG : Guide pratique 2025',
    'article.colors.excerpt': 'Maîtrisez les règles de contraste WCAG. Outils, techniques et bonnes pratiques pour des couleurs accessibles et conformes aux standards.',

    // Breadcrumb
    'breadcrumb.home': 'Accueil',
    'breadcrumb.blog': 'Blog',

    // Liens d'actions
    'action.startFreeAudit': 'Commencer un audit gratuit',
    'action.viewOtherGuides': 'Voir d\'autres guides',
    'action.prepareNow': 'Préparez-vous dès maintenant',

    // Messages contextuels
    'message.goodNews': 'Bonne nouvelle !',
    'message.perfectAlliance': 'L\'alliance parfaite',
    'message.essentialStake': 'Enjeu essentiel',
    'message.progressiveApproach': 'Une démarche progressive et continue',

    // Textes longs récurrents
    'text.accessibilityBuildsStepByStep': 'L\'accessibilité se construit étape par étape. Commencez par les tests automatisés, puis progressez vers des validations plus approfondies. Chaque test apporte de la valeur !',
    'text.discoverHowAccessibilityImproves': 'Découvrez comment l\'accessibilité web améliore naturellement votre référencement et booste vos performances SEO de manière durable.',

    // Article Erreurs courantes 2025
    'errors2025.title': 'Les erreurs d\'accessibilité les plus courantes en 2025',
    'errors2025.subtitle': 'Découvrez les 10 problèmes d\'accessibilité web les plus fréquemment rencontrés et comment les corriger facilement pour améliorer l\'expérience de tous vos utilisateurs.',
    'errors2025.intro': 'Malgré une sensibilisation croissante à l\'accessibilité web, certaines erreurs persistent de manière récurrente sur une majorité de sites internet. D\'après nos analyses de milliers de sites web en 2024 et 2025, voici les problèmes les plus fréquents que nous rencontrons.',
    'errors2025.goodNews': 'La plupart de ces erreurs sont facilement corrigibles avec quelques ajustements simples. Chaque correction apporte une amélioration significative de l\'expérience utilisateur.',
    
    'errors2025.error1.title': 'Textes alternatifs manquants ou inadéquats',
    'errors2025.error1.impact': '96% des sites analysés présentent cette erreur. Les lecteurs d\'écran ne peuvent pas décrire le contenu visuel aux utilisateurs malvoyants.',
    
    'errors2025.error2.title': 'Contraste de couleurs insuffisant',
    'errors2025.error2.description': 'Les ratios de contraste minimum requis par le RGAA sont souvent ignorés, rendant le texte difficile à lire pour les personnes ayant des difficultés visuelles.',
    'errors2025.error2.ratios': 'Ratios minimum : 4.5:1 pour le texte normal, 3:1 pour le texte large (18pt+ ou 14pt+ en gras)',
    
    'errors2025.error3.title': 'Navigation au clavier impossible',
    'errors2025.error3.description': 'De nombreux utilisateurs naviguent uniquement au clavier (handicap moteur, préférence, etc.). Les éléments interactifs doivent être accessibles via les touches Tab, Entrée et Espace.',
    'errors2025.error3.problems': 'Problèmes fréquents :',
    'errors2025.error3.solution': 'Utiliser les éléments HTML sémantiques (&lt;button&gt;, &lt;a&gt;) et tester la navigation avec la touche Tab uniquement.',
    
    'errors2025.error4.title': 'Structure de titres incohérente',
    'errors2025.error5.title': 'Formulaires sans étiquettes',
    'errors2025.error6.title': 'Liens non explicites',
    'errors2025.error7.title': 'Contenus uniquement en couleur',
    'errors2025.error8.title': 'Vidéos sans sous-titres',
    'errors2025.error9.title': 'Focus invisible ou supprimé',
    'errors2025.error10.title': 'Messages d\'erreur inaccessibles',
    
    'errors2025.conclusion.title': 'Un plan d\'action en 3 étapes',
    'errors2025.conclusion.step1': 'Audit automatisé avec des outils comme WAVE ou axe',
    'errors2025.conclusion.step2': 'Tests manuels ciblés sur les erreurs identifiées',
    'errors2025.conclusion.step3': 'Validation avec de vrais utilisateurs',
    
    // Termes récurrents dans les articles
    'common.frequentError': 'Erreur fréquente',
    'common.correction': 'Correction',
    'common.impact': 'Impact',
    'common.solution': 'Solution',
    'common.example': 'Exemple',
    'common.goodPractices': 'Bonnes pratiques',
    'common.problematicExample': 'Exemple problématique',
    'common.appropriateCorrection': 'Correction appropriée',
    'common.frequentProblems': 'Problèmes fréquents',
    'common.actionPlan': 'Plan d\'action',
    'common.steps': 'étapes',
    'common.readingTime': 'min de lecture',
    'common.publishedOn': 'Publié le',

    // Référentiel RGAA
    'rgaa.title': 'Référentiel RGAA',
    'rgaa.subtitle': 'Référentiel Général d\'Amélioration de l\'Accessibilité',
    'rgaa.description': 'Découvrez tous les critères d\'accessibilité du RGAA avec des explications détaillées et des exemples pratiques.',
    'rgaa.level.A': 'Niveau A - Essentiel',
    'rgaa.level.AA': 'Niveau AA - Standard',
    'rgaa.level.AAA': 'Niveau AAA - Optimal',
    'rgaa.themes': 'thèmes',
    'rgaa.criteria': 'critères',
    'rgaa.showCriteria': 'Afficher les critères',
    'rgaa.hideCriteria': 'Masquer les critères',
    'rgaa.examples': 'Exemples',
    'rgaa.learnMore': 'En savoir plus sur RGAA.fr',

    // Footer
    'footer.madeWith': 'Fait avec',
    'footer.by': 'par',
    'footer.contact': 'Contact',
    'footer.legal': 'Mentions légales',
    'footer.accessibility': 'Accessibilité',
    'footer.sitemap': 'Plan du site',

    // Messages d'interface
    'ui.waiting': 'En attente...',
    'ui.errorOccurred': 'Une erreur est survenue',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.quiz': 'Quiz',
    'nav.contact': 'Contact',
    
    // Page d'accueil
    'home.title': 'Test your website\'s RGAA accessibility',
    'home.subtitle': 'WAVE & RGAA Analysis Engine',
    'home.description': 'Instantly analyze your website\'s accessibility with our free tool based on WAVE and French RGAA criteria.',
    'home.mainTitle': 'Accessibility Audit',
    'home.mainDescription': 'This alpha version uses the most powerful engines to help professionals perform their audits. This tool is not intended to replace human expertise.',
    
    // Formulaire
    'form.url.placeholder': 'https://your-site.com',
    'form.analyze.button': 'Analyze',
    'form.analyzing': 'Analyzing...',
    
    // Résultats
    'results.score': 'Accessibility score',
    'results.violations': 'violations detected',
    'results.summary': 'Summary',
    'results.details': 'Violation details',
    
    // Impacts
    'impact.low': 'Low',
    'impact.medium': 'Medium',
    'impact.high': 'High',
    'impact.critical': 'Critical',
    
    // Niveaux
    'level.A': 'Level A',
    'level.AA': 'Level AA',
    'level.AAA': 'Level AAA',

    // Métadonnées de la page
    'meta.title': 'RGAA Audit - Test your website\'s accessibility',
    'meta.description': 'Free and intelligent RGAA accessibility audit tool. Make your website more inclusive. Test your website\'s RGAA compliance instantly.',

    // Blog
    'blog.title': 'RGAA Audit Blog',
    'blog.subtitle': 'News, guides and best practices for web accessibility',
    'blog.featured': 'Featured',
    'blog.allArticles': 'All articles',
    'blog.readTime': 'min read',
    'blog.readFullArticle': 'Read full article',
    'blog.backToBlog': 'Back to blog',
    'blog.publishedOn': 'Published on',
    'blog.skipToContent': 'Skip to main content',

    // Articles du blog - Traductions générales
    'article.categories.regulation': 'Regulation',
    'article.categories.guide': 'Guide',
    'article.categories.seo': 'SEO',
    'article.categories.mobile': 'Mobile',
    'article.categories.testing': 'Testing',
    'article.categories.colors': 'Colors',

    // Articles spécifiques
    'article.rgaa2025.title': 'RGAA 2025: 5 new rules to know',
    'article.rgaa2025.excerpt': 'Discover the major RGAA evolutions coming into effect in 2025. New obligations, enhanced criteria and impacts for websites.',
    
    'article.errors2025.title': 'Top 10 most common accessibility errors',
    'article.errors2025.excerpt': 'Avoid the most frequent web accessibility pitfalls. Practical guide with concrete examples and solutions for each identified problem.',

    'article.seoGuide.title': 'Accessibility and SEO: the complete 2025 guide',
    'article.seoGuide.excerpt': 'How web accessibility improves your natural search ranking. Techniques, tools and strategies to combine SEO performance and digital inclusion.',

    'article.mobile.title': 'Mobile accessibility: best practices 2025',
    'article.mobile.excerpt': 'Optimize your mobile applications\' accessibility. Inclusive design techniques, user testing and RGAA compliance on mobile.',

    'article.testing.title': 'How to test your website\'s accessibility: Complete guide',
    'article.testing.excerpt': 'Complete methodology to evaluate and improve your website\'s accessibility. From automated audit to user testing, discover all essential steps.',

    'article.colors.title': 'WCAG colors and contrasts: Practical guide 2025',
    'article.colors.excerpt': 'Master WCAG contrast rules. Tools, techniques and best practices for accessible colors compliant with standards.',

    // Breadcrumb
    'breadcrumb.home': 'Home',
    'breadcrumb.blog': 'Blog',

    // Liens d'actions
    'action.startFreeAudit': 'Start free audit',
    'action.viewOtherGuides': 'View other guides',
    'action.prepareNow': 'Prepare now',

    // Messages contextuels
    'message.goodNews': 'Good news!',
    'message.perfectAlliance': 'The perfect alliance',
    'message.essentialStake': 'Essential stake',
    'message.progressiveApproach': 'A progressive and continuous approach',

    // Textes longs récurrents
    'text.accessibilityBuildsStepByStep': 'Accessibility is built step by step. Start with automated tests, then progress towards more thorough validations. Each test brings value!',
    'text.discoverHowAccessibilityImproves': 'Discover how web accessibility naturally improves your referencing and boosts your SEO performance sustainably.',

    // Article Erreurs courantes 2025
    'errors2025.title': 'The most common accessibility errors in 2025',
    'errors2025.subtitle': 'Discover the 10 most frequently encountered web accessibility problems and how to fix them easily to improve all your users\' experience.',
    'errors2025.intro': 'Despite growing awareness of web accessibility, certain errors persist recurrently on a majority of websites. According to our analysis of thousands of websites in 2024 and 2025, here are the most frequent problems we encounter.',
    'errors2025.goodNews': 'Most of these errors are easily fixable with a few simple adjustments. Each correction brings a significant improvement to user experience.',
    
    'errors2025.error1.title': 'Missing or inadequate alternative texts',
    'errors2025.error1.impact': '96% of analyzed sites have this error. Screen readers cannot describe visual content to visually impaired users.',
    
    'errors2025.error2.title': 'Insufficient color contrast',
    'errors2025.error2.description': 'The minimum contrast ratios required by RGAA are often ignored, making text difficult to read for people with visual difficulties.',
    'errors2025.error2.ratios': 'Minimum ratios: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)',
    
    'errors2025.error3.title': 'Impossible keyboard navigation',
    'errors2025.error3.description': 'Many users navigate only with keyboard (motor disability, preference, etc.). Interactive elements must be accessible via Tab, Enter and Space keys.',
    'errors2025.error3.problems': 'Frequent problems:',
    'errors2025.error3.solution': 'Use semantic HTML elements (&lt;button&gt;, &lt;a&gt;) and test navigation with Tab key only.',
    
    'errors2025.error4.title': 'Inconsistent heading structure',
    'errors2025.error5.title': 'Forms without labels',
    'errors2025.error6.title': 'Non-explicit links',
    'errors2025.error7.title': 'Content only in color',
    'errors2025.error8.title': 'Videos without subtitles',
    'errors2025.error9.title': 'Invisible or removed focus',
    'errors2025.error10.title': 'Inaccessible error messages',
    
    'errors2025.conclusion.title': 'A 3-step action plan',
    'errors2025.conclusion.step1': 'Automated audit with tools like WAVE or axe',
    'errors2025.conclusion.step2': 'Manual tests targeted on identified errors',
    'errors2025.conclusion.step3': 'Validation with real users',
    
    // Termes récurrents dans les articles
    'common.frequentError': 'Frequent error',
    'common.correction': 'Correction',
    'common.impact': 'Impact',
    'common.solution': 'Solution',
    'common.example': 'Example',
    'common.goodPractices': 'Good practices',
    'common.problematicExample': 'Problematic example',
    'common.appropriateCorrection': 'Appropriate correction',
    'common.frequentProblems': 'Frequent problems',
    'common.actionPlan': 'Action plan',
    'common.steps': 'steps',
    'common.readingTime': 'min read',
    'common.publishedOn': 'Published on',

    // Référentiel RGAA
    'rgaa.title': 'RGAA Reference',
    'rgaa.subtitle': 'General Reference for Accessibility Improvement',
    'rgaa.description': 'Discover all RGAA accessibility criteria with detailed explanations and practical examples.',
    'rgaa.level.A': 'Level A - Essential',
    'rgaa.level.AA': 'Level AA - Standard',
    'rgaa.level.AAA': 'Level AAA - Optimal',
    'rgaa.themes': 'themes',
    'rgaa.criteria': 'criteria',
    'rgaa.showCriteria': 'Show criteria',
    'rgaa.hideCriteria': 'Hide criteria',
    'rgaa.examples': 'Examples',
    'rgaa.learnMore': 'Learn more on RGAA.fr',

    // Footer
    'footer.madeWith': 'Made with',
    'footer.by': 'by',
    'footer.contact': 'Contact',
    'footer.legal': 'Legal notice',
    'footer.accessibility': 'Accessibility',
    'footer.sitemap': 'Sitemap',

    // Messages d'interface
    'ui.waiting': 'Waiting...',
    'ui.errorOccurred': 'An error occurred',
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