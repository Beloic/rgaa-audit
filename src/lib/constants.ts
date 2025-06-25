export const RGAA_CRITERIA = {
  'images': {
    criteria: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9'],
    description: 'Images - Texte de remplacement, descriptions détaillées',
    wcagMapping: ['1.1.1', '1.4.5', '1.4.9'],
    totalCriteria: 9
  },
  'frames': {
    criteria: ['2.1', '2.2'],
    description: 'Cadres - Titres des frames et iframes',
    wcagMapping: ['4.1.2'],
    totalCriteria: 2
  },
  'colors': {
    criteria: ['3.1', '3.2', '3.3'],
    description: 'Couleurs - Information et contrastes',
    wcagMapping: ['1.4.1', '1.4.3', '1.4.6', '1.4.11'],
    totalCriteria: 3
  },
  'multimedia': {
    criteria: ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10', '4.11', '4.12', '4.13'],
    description: 'Multimédia - Sous-titres, transcriptions, contrôles',
    wcagMapping: ['1.2.1', '1.2.2', '1.2.3', '1.2.4', '1.2.5', '1.2.6', '1.2.7', '1.2.8', '1.2.9'],
    totalCriteria: 13
  },
  'tables': {
    criteria: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8'],
    description: 'Tableaux - En-têtes, résumés, structure',
    wcagMapping: ['1.3.1'],
    totalCriteria: 8
  },
  'links': {
    criteria: ['6.1', '6.2'],
    description: 'Liens - Intitulés explicites',
    wcagMapping: ['2.4.4', '2.4.9'],
    totalCriteria: 2
  },
  'scripts': {
    criteria: ['7.1', '7.2', '7.3', '7.4', '7.5'],
    description: 'Scripts - Accessibilité JavaScript',
    wcagMapping: ['2.1.1', '2.1.2', '4.1.3'],
    totalCriteria: 5
  },
  'mandatory_elements': {
    criteria: ['8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '8.10'],
    description: 'Éléments obligatoires - Titre, langue, validité',
    wcagMapping: ['2.4.2', '3.1.1', '3.2.4'],
    totalCriteria: 10
  },
  'structure': {
    criteria: ['9.1', '9.2', '9.3', '9.4'],
    description: 'Structuration de l\'information - Titres, listes',
    wcagMapping: ['1.3.1', '2.4.6'],
    totalCriteria: 4
  },
  'presentation': {
    criteria: ['10.1', '10.2', '10.3', '10.4', '10.5', '10.6', '10.7', '10.8', '10.9', '10.10', '10.11', '10.12', '10.13', '10.14'],
    description: 'Présentation de l\'information - CSS, espacement, responsive',
    wcagMapping: ['1.3.2', '1.4.4', '1.4.8', '1.4.10', '1.4.12'],
    totalCriteria: 14
  },
  'forms': {
    criteria: ['11.1', '11.2', '11.3', '11.4', '11.5', '11.6', '11.7', '11.8', '11.9', '11.10', '11.11', '11.12', '11.13'],
    description: 'Formulaires - Labels, aide, validation',
    wcagMapping: ['1.3.1', '2.4.6', '3.2.2', '3.3.1', '3.3.2', '3.3.3', '3.3.4', '4.1.2'],
    totalCriteria: 13
  },
  'navigation': {
    criteria: ['12.1', '12.2', '12.3', '12.4', '12.5', '12.6', '12.7', '12.8', '12.9', '12.10', '12.11'],
    description: 'Navigation - Liens d\'évitement, plan du site, navigation cohérente',
    wcagMapping: ['2.4.1', '2.4.5', '2.4.7', '2.4.8', '3.2.3'],
    totalCriteria: 11
  },
  'consultation': {
    criteria: ['13.1', '13.2', '13.3', '13.4', '13.5', '13.6', '13.7', '13.8', '13.9', '13.10', '13.11', '13.12'],
    description: 'Consultation - Temps, ouvertures, téléchargements',
    wcagMapping: ['2.2.1', '2.2.2', '2.3.1', '2.3.2', '2.3.3'],
    totalCriteria: 12
  }
};

// Validation : vérifier que tous les 106 critères RGAA sont présents
export const TOTAL_RGAA_CRITERIA = Object.values(RGAA_CRITERIA).reduce((total, theme) => total + theme.totalCriteria, 0);

// Liste complète des critères pour validation
export const ALL_RGAA_CRITERIA = Object.values(RGAA_CRITERIA).flatMap(theme => theme.criteria);

// Vérification de l'exhaustivité (doit être égal à 106)
if (TOTAL_RGAA_CRITERIA !== 106) {
  console.warn(`⚠️ RGAA: ${TOTAL_RGAA_CRITERIA}/106 critères définis. Vérifiez constants.ts`);
}

export const IMPACT_LEVELS = {
  low: { 
    label: 'Faible', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  medium: { 
    label: 'Moyen', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  moderate: { 
    label: 'Modéré', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  high: { 
    label: 'Important', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  serious: { 
    label: 'Sérieux', 
    color: 'text-red-700', 
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300'
  },
  critical: { 
    label: 'Critique', 
    color: 'text-red-800', 
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300'
  }
} as const;

export const RGAA_LEVELS = {
  A: { 
    label: 'A', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Niveau d\'accessibilité de base selon RGAA'
  },
  AA: { 
    label: 'AA', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Niveau d\'accessibilité standard selon RGAA'
  },
  AAA: { 
    label: 'AAA', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Niveau d\'accessibilité renforcé selon RGAA'
  }
} as const;

export const API_LIMITS = {
  MAX_HTML_SIZE: 1000000, // 1MB
  MAX_REQUESTS_PER_HOUR: 20, // Augmenté de 10 à 20
  TIMEOUT: 60000 // 60 secondes
};

export const TRANSLATIONS = {
  fr: {
    title: 'Audit d\'Accessibilité RGAA/WCAG',
    subtitle: 'Analysez l\'accessibilité de votre site web selon les standards RGAA et WCAG',
    urlPlaceholder: 'Entrez l\'URL de la page à analyser',
    htmlPlaceholder: 'Ou collez votre code HTML ici...',
    analyzeButton: 'Analyser l\'accessibilité',
    analyzing: 'Analyse en cours...',
    results: 'Résultats de l\'audit',
    violations: 'Non-conformités détectées',
    recommendations: 'Recommandations',
    score: 'Score d\'accessibilité',
    history: 'Historique des audits',
    noViolations: 'Aucune non-conformité majeure détectée !',
    error: 'Une erreur est survenue lors de l\'analyse',
    invalidUrl: 'URL invalide',
    tooLarge: 'Le contenu est trop volumineux',
    rateLimited: 'Trop de requêtes, veuillez réessayer plus tard'
  },
  en: {
    title: 'RGAA/WCAG Accessibility Audit',
    subtitle: 'Analyze your website accessibility according to RGAA and WCAG standards',
    urlPlaceholder: 'Enter the URL of the page to analyze',
    htmlPlaceholder: 'Or paste your HTML code here...',
    analyzeButton: 'Analyze accessibility',
    analyzing: 'Analyzing...',
    results: 'Audit results',
    violations: 'Violations detected',
    recommendations: 'Recommendations',
    score: 'Accessibility score',
    history: 'Audit history',
    noViolations: 'No major violations detected!',
    error: 'An error occurred during analysis',
    invalidUrl: 'Invalid URL',
    tooLarge: 'Content is too large',
    rateLimited: 'Too many requests, please try again later'
  }
}; 