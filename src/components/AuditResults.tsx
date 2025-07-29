'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Target,
  TrendingUp,
  Calendar,
  ExternalLink,
  Award,
  AlertCircle,
  Download,
  Lightbulb,
  Users,
  Eye,
  Code,
  Palette,
  Copy,
  ExternalLinkIcon,
  ChevronDown,
  ChevronUp,
  Info,
  X,
  ArrowUp,
  MapPin,
  Cpu
} from 'lucide-react';
import { IMPACT_LEVELS, RGAA_LEVELS } from '@/lib/constants';
import type { AuditResult, RGAAViolation } from '@/types/audit';

interface AuditResultsProps {
  result: AuditResult;
  language: 'fr' | 'en';
  onNewAudit?: () => void;
  updatedUserData?: any; // Données utilisateur fraîches de l'API analyze
}

interface ViolationCardProps {
  violation: RGAAViolation;
  language: 'fr' | 'en';
  index: number;
  engine?: 'wave' | 'axe' | 'rgaa';
}

// Helper pour obtenir le nom du moteur d'analyse
const getEngineName = (engine?: 'wave' | 'axe' | 'rgaa') => {
  return engine === 'axe' ? 'AXE CORE' : 
         engine === 'rgaa' ? 'RGAA ENGINE' : 'WAVE';
};

const translations = {
  fr: {
    results: 'Résultats de l\'audit',
    score: 'Score d\'accessibilité',
    violations: 'Non-conformités',
    summary: 'Résumé exécutif',
    noViolations: 'Aucune non-conformité détectée',
    recommendation: 'Recommandation',

    byLevel: 'Répartition par niveau RGAA',
    filters: 'Filtres',
    level: 'Niveau',
    impact: 'Impact',
    standard: 'Standard',
    all: 'Tous',
    rgaa: 'RGAA',
    wcag: 'WCAG',
    critical: 'Critique',
    high: 'Élevé',
    medium: 'Moyen',
    low: 'Faible',
    problems: 'problèmes détectés',
    congratulations: 'Félicitations !',
    noProblemsFilters: 'Aucun problème avec ces filtres',
    congratsText: 'Votre page respecte les critères d\'accessibilité analysés.',
    tryOtherFilters: 'Essayez de modifier les filtres pour voir d\'autres problèmes.',
    downloadReport: 'Télécharger le rapport',
    overallScore: 'Note globale',
    totalIssues: 'Problèmes totaux',
    criticalIssues: 'Problèmes critiques',
    aaLevel: 'Niveau AA',
    quickActions: 'Actions rapides',
    priorityFix: 'Priorité de correction',
    categories: {
      images: 'Images',
      forms: 'Formulaires', 
      navigation: 'Navigation',
      structure: 'Structure',
      colors: 'Couleurs',
      multimedia: 'Multimédia'
    },
    filterBy: 'Filtrer par',
    clearFilters: 'Effacer les filtres',
    category: 'Catégorie',
    noResultsWithFilters: 'Aucun problème avec ces filtres',
    tryChangingFilters: 'Essayez de modifier les filtres pour voir d\'autres problèmes.',
    showingResults: 'Affichage de {count} problème(s) sur {total}',
    backToTop: 'Remonter en haut',
    viewWaveReport: 'Voir le rapport WAVE complet',
    waveReportDescription: 'Ouvrir le rapport détaillé WAVE dans un nouvel onglet',
    
  },
  en: {
    results: 'Audit Results',
    score: 'Accessibility Score',
    violations: 'Non-compliances',
    summary: 'Executive Summary',
    noViolations: 'No non-compliance detected',
    recommendation: 'Recommendation',

    byLevel: 'Distribution by RGAA Level',
    filters: 'Filters',
    level: 'Level',
    impact: 'Impact',
    standard: 'Standard',
    all: 'All',
    rgaa: 'RGAA',
    wcag: 'WCAG',
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    problems: 'issues detected',
    congratulations: 'Congratulations!',
    noProblemsFilters: 'No issues with these filters',
    congratsText: 'Your page meets the analyzed accessibility criteria.',
    tryOtherFilters: 'Try changing the filters to see other issues.',
    downloadReport: 'Download Report',
    overallScore: 'Overall Score',
    totalIssues: 'Total Issues',
    criticalIssues: 'Critical Issues',
    aaLevel: 'AA Level',
    quickActions: 'Quick Actions',
    priorityFix: 'Fix Priority',
    categories: {
      images: 'Images',
      forms: 'Forms',
      navigation: 'Navigation',
      structure: 'Structure',
      colors: 'Colors',
      multimedia: 'Multimedia'
    },
    filterBy: 'Filter by',
    clearFilters: 'Clear filters',
    category: 'Category',
    noResultsWithFilters: 'No issues with these filters',
    tryChangingFilters: 'Try changing the filters to see other issues.',
    showingResults: 'Showing {count} issue(s) out of {total}',
    backToTop: 'Back to top',
    viewWaveReport: 'View Full WAVE Report',
    waveReportDescription: 'Open detailed WAVE report in new tab',
    
  }
};

function ViolationCard({ violation, language, index, engine }: ViolationCardProps) {
  const impactConfig = IMPACT_LEVELS[violation.impact];
  const levelConfig = RGAA_LEVELS[violation.level];
  const t = translations[language];
  
  // État pour contrôler l'ouverture/fermeture de la section recommandation - FERMÉ PAR DÉFAUT
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);
  const [violationWithPosition, setViolationWithPosition] = useState<RGAAViolation>(violation);

  // Fonction pour détecter et filtrer les sélecteurs CSS de l'interface WAVE
  const isWaveInterfaceSelector = (selector: string): boolean => {
    if (!selector) return false;
    
    const selectorLower = selector.toLowerCase();
    
    // Patterns spécifiques aux icônes et interface WAVE
    const waveInterfacePatterns = [
      // Icônes WAVE
      'icon_group',
      'icon_',
      'waveicon',
      'wave_icon',
      
      // Interface WAVE
      'wave_',
      '#wave',
      '.wave',
      'waveimg',
      'waveform',
      'wave-',
      'wave_sidebar',
      'wave_panel',
      'wave_details',
      'wave_container',
      'wave_summary',
      'wave_report',
      
      // Éléments de navigation WAVE
      'sidebar',
      'navigation',
      'menu',
      'toolbar',
      'panel',
      'tab',
      'button',
      
      // Classes d'icônes génériques souvent utilisées par WAVE
      'fa-',
      'fas',
      'far',
      'fab',
      'material-icons',
      'mdi-',
      'glyphicon',
      
      // Éléments d'interface spécifiques
      'ui-',
      'control-',
      'widget-',
      'overlay-',
      'popup-',
      'modal-',
      'tooltip-'
    ];
    
    // Vérifier si le sélecteur contient des patterns WAVE
    const hasWavePattern = waveInterfacePatterns.some(pattern => 
      selectorLower.includes(pattern)
    );
    
    // Vérifier si c'est un sélecteur d'élément d'interface
    const isInterfaceElement = /^(li|ul|div|span|button|a)\.(icon|wave|ui|control|sidebar|panel|menu|nav)/i.test(selector) ||
                              selector.includes('[class*="icon"]') ||
                              selector.includes('[id*="wave"]') ||
                              selector.includes('[class*="wave"]');
    
    // Vérifier si le sélecteur commence par des éléments suspects
    const startsWithSuspicious = /^(#wave|\.wave|#icon|\.icon|#ui-|\.ui-|#sidebar|\.sidebar)/i.test(selector);
    
    return hasWavePattern || isInterfaceElement || startsWithSuspicious;
  };

  // Fonction pour nettoyer ou remplacer le sélecteur WAVE
  const getCleanSelector = (originalSelector: string): string | null => {
    if (!originalSelector) return null;
    
    console.log('🔍 Analyse du sélecteur:', originalSelector);
    
    // Si c'est un sélecteur de l'interface WAVE, on tente de l'améliorer
    if (isWaveInterfaceSelector(originalSelector)) {
      console.log('⚠️ Sélecteur WAVE détecté, tentative d\'amélioration...');
      
      // Si on a un extrait HTML, on peut essayer d'en extraire un meilleur sélecteur
      if (violation.htmlSnippet) {
        console.log('📄 Analyse du HTML snippet:', violation.htmlSnippet.substring(0, 200) + '...');
        
        // Extraire le nom de balise du HTML snippet
        const tagMatch = violation.htmlSnippet.match(/<(\w+)/);
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase();
          
          // Extraire les attributs utiles
          const idMatch = violation.htmlSnippet.match(/id=["']([^"']+)["']/);
          const classMatch = violation.htmlSnippet.match(/class=["']([^"']+)["']/);
          const nameMatch = violation.htmlSnippet.match(/name=["']([^"']+)["']/);
          const typeMatch = violation.htmlSnippet.match(/type=["']([^"']+)["']/);
          const roleMatch = violation.htmlSnippet.match(/role=["']([^"']+)["']/);
          const titleMatch = violation.htmlSnippet.match(/title=["']([^"']+)["']/);
          
          // Priorité 1: ID unique et pertinent
          if (idMatch && idMatch[1]) {
            const id = idMatch[1];
            // Vérifier que l'ID n'est pas un élément WAVE
            if (!isWaveInterfaceSelector(`#${id}`)) {
              console.log('✅ ID pertinent trouvé:', `#${id}`);
              return `#${id}`;
            }
          }
          
          // Priorité 2: Classes pertinentes
          if (classMatch && classMatch[1]) {
            const classes = classMatch[1].split(' ').filter(cls => 
              cls.length > 2 && 
              !cls.includes('wave') && 
              !cls.includes('icon') && 
              !cls.includes('ui-') &&
              !cls.includes('fa-') &&
              !cls.includes('mdi-') &&
              !cls.toLowerCase().includes('hidden') &&
              !cls.toLowerCase().includes('invisible')
            );
            
            if (classes.length > 0) {
              const bestClass = classes[0];
              const selector = `${tagName}.${bestClass}`;
              console.log('✅ Classe pertinente trouvée:', selector);
              return selector;
            }
          }
          
          // Priorité 3: Attributs spécifiques pour les formulaires
          if (tagName === 'input' || tagName === 'select' || tagName === 'textarea') {
            if (nameMatch && nameMatch[1]) {
              const selector = `${tagName}[name="${nameMatch[1]}"]`;
              console.log('✅ Sélecteur par nom trouvé:', selector);
              return selector;
            }
            if (typeMatch && typeMatch[1]) {
              const selector = `${tagName}[type="${typeMatch[1]}"]`;
              console.log('✅ Sélecteur par type trouvé:', selector);
              return selector;
            }
          }
          
          // Priorité 4: Attribut role
          if (roleMatch && roleMatch[1]) {
            const selector = `${tagName}[role="${roleMatch[1]}"]`;
            console.log('✅ Sélecteur par rôle trouvé:', selector);
            return selector;
          }
          
          // Priorité 5: Balise seule si c'est un élément sémantique
          const semanticTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'main', 'nav', 'header', 'footer', 'article', 'section', 'aside', 'figure', 'figcaption'];
          if (semanticTags.includes(tagName)) {
            console.log('✅ Balise sémantique trouvée:', tagName);
            return tagName;
          }
          
          // Priorité 6: Pour les liens et boutons, essayer d'extraire le texte
          if (tagName === 'a' || tagName === 'button') {
            const textMatch = violation.htmlSnippet.match(/>([^<]+)</);
            if (textMatch && textMatch[1] && textMatch[1].trim().length > 0) {
              const text = textMatch[1].trim().substring(0, 20);
              console.log(`✅ ${tagName} avec texte trouvé:`, `${tagName} (texte: "${text}")`);
              return `${tagName}[text*="${text}"]`;
            }
          }
          
          console.log('⚠️ Fallback sur la balise:', tagName);
          return tagName;
        }
      }
      
      // Dernière tentative: utiliser la description de la violation pour inférer l'élément
      if (violation.description) {
        const desc = violation.description.toLowerCase();
        if (desc.includes('image') || desc.includes('img')) {
          console.log('✅ Élément image inféré de la description');
          return 'img';
        }
        if (desc.includes('lien') || desc.includes('link')) {
          console.log('✅ Élément lien inféré de la description');
          return 'a';
        }
        if (desc.includes('bouton') || desc.includes('button')) {
          console.log('✅ Élément bouton inféré de la description');
          return 'button';
        }
        if (desc.includes('titre') || desc.includes('heading') || desc.includes('h1') || desc.includes('h2')) {
          console.log('✅ Élément titre inféré de la description');
          return 'h1, h2, h3, h4, h5, h6';
        }
        if (desc.includes('formulaire') || desc.includes('form') || desc.includes('input')) {
          console.log('✅ Élément formulaire inféré de la description');
          return 'input, select, textarea';
        }
      }
      
      console.log('❌ Impossible d\'améliorer le sélecteur, masquage de la section');
      return null;
    }
    
    console.log('✅ Sélecteur valide conservé:', originalSelector);
    return originalSelector;
  };

  // Fonction pour copier le sélecteur CSS
  const copySelector = async () => {
    const cleanSelector = getCleanSelector(violation.element || '');
    if (cleanSelector) {
      try {
        await navigator.clipboard.writeText(cleanSelector);
        // Feedback visuel temporaire
        const copyElement = document.querySelector(`#copy-selector-${index}`);
        if (copyElement) {
          const originalContent = copyElement.innerHTML;
          copyElement.innerHTML = '✓ Copié';
          setTimeout(() => {
            copyElement.innerHTML = originalContent;
          }, 2000);
        }
      } catch (err) {
        console.error('Erreur copie:', err);
      }
    }
  };

  // Fonction pour ouvrir la page avec le sélecteur en surbrillance
  const highlightInPage = () => {
    const cleanSelector = getCleanSelector(violation.element || '');
    if (cleanSelector && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('highlight', cleanSelector);
      window.open(url.toString(), '_blank');
    }
  };

  // Fonction pour générer l'explication du problème selon les normes
  const getProblemExplanation = (violation: RGAAViolation): string => {
    const ruleId = violation.ruleId?.toLowerCase() || '';
    const description = violation.description?.toLowerCase() || '';
    const criterion = violation.criterion || '';

    // Images
    if (ruleId.includes('image') || description.includes('image') || description.includes('alt')) {
      return "Les images sans texte alternatif ne peuvent pas être comprises par les utilisateurs aveugles ou malvoyants utilisant des lecteurs d'écran. Le critère RGAA 1.1 exige qu'une alternative textuelle soit fournie pour toute image porteuse d'information.";
    }

    // Boutons
    if (ruleId.includes('button') || description.includes('bouton')) {
      return "Les boutons sans nom accessible ne peuvent pas être identifiés par les technologies d'assistance. Le critère RGAA 6.1 impose que chaque lien et bouton ait un intitulé explicite pour que l'utilisateur comprenne sa fonction.";
    }

    // Liens
    if (ruleId.includes('link') || description.includes('lien')) {
      return "Les liens sans intitulé explicite créent de la confusion pour les utilisateurs de lecteurs d'écran qui naviguent de lien en lien. Le critère RGAA 6.1 exige que chaque lien ait un intitulé permettant d'en comprendre la fonction et la destination.";
    }

    // Titres et hiérarchie
    if (ruleId.includes('heading') || description.includes('titre') || description.includes('hiérarchie')) {
      return "Une hiérarchie de titres incorrecte ou l'absence de titre principal (h1) empêche les utilisateurs de technologies d'assistance de naviguer efficacement dans le contenu. Le critère RGAA 9.1 impose une structure de titres logique et hiérarchique.";
    }

    // Formulaires et labels
    if (ruleId.includes('label') || ruleId.includes('form') || description.includes('formulaire') || description.includes('champ')) {
      return "Les champs de formulaire sans étiquette (label) ne peuvent pas être identifiés par les utilisateurs aveugles ou malvoyants. Le critère RGAA 11.1 exige que chaque champ de formulaire ait une étiquette explicite et correctement associée.";
    }

    // Langue
    if (ruleId.includes('lang') || description.includes('langue')) {
      return "L'absence d'indication de langue empêche les lecteurs d'écran de prononcer correctement le contenu. Le critère RGAA 8.3 impose de spécifier la langue principale de chaque page et des changements de langue dans le contenu.";
    }

    // Couleurs et contrastes
    if (ruleId.includes('color') || description.includes('couleur') || description.includes('contraste')) {
      return "Un contraste insuffisant ou l'utilisation exclusive de la couleur pour transmettre une information exclut les utilisateurs malvoyants ou daltoniens. Les critères RGAA 3.2 et 3.3 imposent des ratios de contraste minimaux et des alternatives à la couleur.";
    }

    // Focus et navigation clavier
    if (ruleId.includes('focus') || description.includes('focus') || description.includes('clavier')) {
      return "L'absence d'indicateur de focus ou une navigation clavier défaillante empêche les utilisateurs qui ne peuvent pas utiliser une souris de naviguer efficacement. Le critère RGAA 10.7 exige un indicateur de focus visible sur tous les éléments interactifs.";
    }

    // Tableaux
    if (ruleId.includes('table') || description.includes('tableau')) {
      return "Les tableaux sans en-têtes correctement identifiés ne peuvent pas être compris par les utilisateurs de lecteurs d'écran. Le critère RGAA 5.6 impose d'identifier clairement les en-têtes de colonnes et de lignes dans les tableaux de données.";
    }

    // Médias et vidéos
    if (description.includes('vidéo') || description.includes('audio') || description.includes('média')) {
      return "Les contenus audio et vidéo sans alternative textuelle (sous-titres, transcription) excluent les utilisateurs sourds ou malentendants. Les critères RGAA 4.1 à 4.3 imposent des alternatives pour tous les médias temporels.";
    }

    // IDs dupliqués
    if (ruleId.includes('duplicate-id') || description.includes('dupliqué')) {
      return "Les identifiants (ID) dupliqués perturbent le fonctionnement des technologies d'assistance qui s'appuient sur ces identifiants uniques pour créer des associations. Le critère RGAA 8.2 impose l'unicité des identifiants dans une page.";
    }

    // Titre de page
    if (description.includes('titre') && (description.includes('page') || description.includes('document'))) {
      return "L'absence de titre de page ou un titre vide empêche les utilisateurs de comprendre le contenu de la page dans leurs favoris, onglets ou historique. Le critère RGAA 8.5 exige un titre de page pertinent et unique.";
    }

    // ARIA et accessibilité sémantique
    if (ruleId.includes('aria') || description.includes('aria')) {
      return "Les attributs ARIA incorrects ou manquants empêchent les technologies d'assistance de comprendre correctement la structure et les interactions de la page. Les critères RGAA 7.1 à 7.5 imposent un usage correct des propriétés ARIA.";
    }

    // Par défaut selon le niveau RGAA
    switch (violation.level) {
      case 'A':
        return "Cette non-conformité viole les critères de base de l'accessibilité (niveau A) et empêche certains utilisateurs handicapés d'accéder au contenu ou aux fonctionnalités.";
      case 'AA':
        return "Cette non-conformité viole les critères de niveau AA requis par la loi et les bonnes pratiques, créant des barrières pour les utilisateurs de technologies d'assistance.";
      case 'AAA':
        return "Cette non-conformité viole les critères de niveau AAA qui garantissent une accessibilité optimale pour tous les utilisateurs.";
      default:
        return "Cette non-conformité crée des barrières à l'accessibilité et empêche certains utilisateurs handicapés d'accéder pleinement au contenu.";
    }
  };

  const handleShowPosition = async (violation: RGAAViolation) => {
    // Si la position est déjà disponible, l'afficher directement
    if (violationWithPosition.position) {
      showPositionModal(violationWithPosition);
      return;
    }

    // Sinon, capturer la position via l'API
    setIsLoadingPosition(true);
    
    try {
      // Récupérer l'URL depuis le contexte ou localStorage
      const currentUrl = window.location.href.includes('localhost') 
        ? sessionStorage.getItem('lastAnalyzedUrl') || ''
        : window.location.href;

      const response = await fetch('/api/capture-position', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: currentUrl,
          violation: violation
        }),
      });

      const data = await response.json();

      if (data.success && data.position) {
        const updatedViolation = { ...violation, position: data.position };
        setViolationWithPosition(updatedViolation);
        showPositionModal(updatedViolation);
      } else {
        // Afficher un message d'erreur
        showPositionModal(null, data.message || 'Impossible de localiser cet élément');
      }
    } catch (error) {
      console.error('Erreur lors de la capture de position:', error);
      showPositionModal(null, 'Erreur lors de la localisation de l\'élément');
    } finally {
      setIsLoadingPosition(false);
    }
  };

  const showPositionModal = (violation: RGAAViolation | null, errorMessage?: string) => {
    // Créer un overlay pour montrer la position
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    `;
    
    const positionBox = document.createElement('div');
    positionBox.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      text-align: center;
    `;
    
    if (violation?.position) {
      positionBox.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">Position de l'élément</h3>
        <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">${violation.description}</p>
        <div style="background: #f3f4f6; padding: 10px; border-radius: 4px; margin-bottom: 15px;">
          <strong>Coordonnées:</strong><br>
          X: ${violation.position.x}px, Y: ${violation.position.y}px<br>
          Taille: ${violation.position.width}px × ${violation.position.height}px<br>
          <code style="font-size: 12px; color: #6b7280;">${violation.position.selector}</code>
        </div>
        <p style="margin: 0; color: #6b7280; font-size: 12px;">Cliquez n'importe où pour fermer</p>
      `;
    } else {
      positionBox.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #dc2626;">Localisation impossible</h3>
        <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">${errorMessage || 'Impossible de localiser cet élément sur la page'}</p>
        <p style="margin: 0; color: #6b7280; font-size: 12px;">Cliquez pour fermer</p>
      `;
    }
    
    overlay.appendChild(positionBox);
    document.body.appendChild(overlay);
    
    overlay.onclick = () => document.body.removeChild(overlay);
    
    // Fermer automatiquement après 10 secondes
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 10000);
  };

  return (
    <div className="group border border-gray-200 rounded-xl bg-white overflow-hidden shadow-md">
      <div className="p-6">
        {/* En-tête avec numéro, titre et badge */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-start mb-4">
              <span className="text-xs text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded-md border whitespace-nowrap">
                #{index + 1}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4 leading-tight break-words">
              {violation.description}
            </h3>
          </div>
          
          <div className="flex-shrink-0 ml-6 flex items-center justify-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border shadow-sm whitespace-nowrap ${
              violation.level === 'A' ? 'bg-orange-100 text-orange-800 border-orange-300' :
              violation.level === 'AA' ? 'bg-blue-100 text-blue-800 border-blue-300' :
              violation.level === 'AAA' ? 'bg-green-100 text-green-800 border-green-300' :
              'bg-gray-100 text-gray-800 border-gray-300'
            }`}>
              RGAA {violation.level}
            </span>
          </div>
        </div>

        {/* Critère RGAA - pleine largeur */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 shadow-sm w-full">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Critère RGAA : </span>
            <span className="font-mono break-words">{violation.criterion}</span>
          </div>
        </div>

        {/* Sélecteur CSS ou indication WAVE - pleine largeur */}
        {(() => {
          // Vérifier si on vient de WAVE
          const isFromWave = engine === 'wave';
          
          if (isFromWave) {
            // Pour WAVE, afficher un simple texte informatif
            return (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm w-full">
                <div className="flex items-center text-sm text-blue-700">
                  <Code className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="font-medium">Voir dans WAVE</span>
                </div>
              </div>
            );
          } else {
            // Pour les autres moteurs, utiliser la logique normale
            const cleanSelector = getCleanSelector(violation.element || '');
            return cleanSelector && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm w-full">
                <div className="flex items-center justify-between text-sm text-blue-700 mb-3 flex-wrap gap-2">
                  <div className="flex items-center">
                    <Code className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="font-medium">Sélecteur CSS :</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      id={`copy-selector-${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        copySelector();
                      }}
                      className="flex items-center px-3 py-1 text-xs bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-md transition-colors cursor-pointer shadow-sm whitespace-nowrap"
                      title="Copier le sélecteur"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          copySelector();
                        }
                      }}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copier
                    </span>
                  </div>
                </div>
                <code className="text-sm text-blue-800 bg-white px-3 py-2 rounded-lg border border-blue-200 block break-all word-break-all overflow-wrap-anywhere w-full">
                  {cleanSelector}
                </code>
              </div>
            );
          }
        })()}

        {/* Extrait HTML - pleine largeur */}
        {violation.htmlSnippet && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm w-full">
            <div className="flex items-center text-sm text-red-700 mb-3">
              <Code className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-medium">Code HTML problématique :</span>
            </div>
            <pre className="text-xs text-red-800 bg-white px-3 py-2 rounded-lg border border-red-200 overflow-x-auto whitespace-pre-wrap break-words w-full">
              <code className="break-words word-break-all">{violation.htmlSnippet}</code>
            </pre>
          </div>
        )}
      </div>
      
      {/* Section recommandation collapsible */}
                      <div className="border-t border-gray-200 bg-blue-50/30">
        <button
          onClick={() => setIsRecommendationOpen(!isRecommendationOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-blue-50/50 transition-colors"
        >
          <div className="flex items-center min-w-0 flex-1">
            <Lightbulb className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" aria-hidden="true" />
            <h4 className="font-medium text-gray-900 text-base break-words">
              {t.recommendation}
            </h4>
          </div>
          {isRecommendationOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
          )}
        </button>
        
        {isRecommendationOpen && (
          <div className="px-6 pb-6">
            {/* Explication du problème selon les normes */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0" />
                <h5 className="font-medium text-orange-900">Pourquoi est-ce un problème ?</h5>
              </div>
              <p className="text-orange-800 text-sm leading-relaxed break-words">
                {getProblemExplanation(violation)}
              </p>
            </div>

            {/* Solution recommandée */}
            <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                <h5 className="font-medium text-green-900">Solution recommandée</h5>
              </div>
              <p className="text-gray-700 leading-relaxed break-words">
                {violation.recommendation}
              </p>
            </div>

            {/* Actions de guidance */}
            <div className="mt-4 flex flex-wrap gap-3">
              {(() => {
                const cleanSelector = getCleanSelector(violation.element || '');
                return cleanSelector && (
                  <>
                    <button
                      onClick={copySelector}
                      className="flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors shadow-sm hover:shadow whitespace-nowrap"
                    >
                      <Copy className="w-3 h-3 mr-1.5" />
                      Copier sélecteur CSS
                    </button>
                    <button
                      onClick={() => {
                        const devToolsCode = `document.querySelector('${cleanSelector}')?.scrollIntoView({behavior: 'smooth', block: 'center'}); document.querySelector('${cleanSelector}')?.style.outline = '3px solid red';`;
                        navigator.clipboard.writeText(devToolsCode);
                        alert('Code copié ! Collez-le dans la console du navigateur pour localiser l\'élément.');
                      }}
                      className="flex items-center px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors shadow-sm hover:shadow whitespace-nowrap"
                    >
                      <Target className="w-3 h-3 mr-1.5" />
                      Localiser dans DevTools
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
                 )}
       </div>
    </div>
  );
}

function AccessibilityLevelCard({ result, language }: { result: AuditResult; language: 'fr' | 'en' }) {
  const engineName = getEngineName(result.engine);
  
  // Déterminer le niveau de conformité selon la méthodologie RGAA officielle
  const getAccessibilityLevel = () => {
    console.log('🔍 Détermination du niveau de conformité RGAA:');
    console.log('  - Nombre total de violations:', result.violations.length);
    console.log('  - Score obtenu:', result.score);
    
    // Classification selon les seuils RGAA officiels
    // Note: Une analyse automatique ne peut pas garantir une conformité totale
    if (result.score >= 90) {
      console.log('  ✅ Niveau: BON NIVEAU (90%+ des critères respectés)');
      return 'GOOD'; // Bon niveau mais pas totalement conforme
    } else if (result.score >= 50) {
      console.log('  ⚠️ Niveau: PARTIELLEMENT CONFORME (50-89% des critères respectés)');
      return 'A'; // Niveau intermédiaire pour partiellement conforme
    } else {
      console.log('  ❌ Niveau: NON CONFORME (<50% des critères respectés)');
      return 'NONE'; // Niveau le plus bas pour non conforme
    }
  };

  const level = getAccessibilityLevel();

  const levelConfig = {
    'GOOD': {
      label: language === 'fr' ? 'Bon niveau' : 'Good level',
      description: language === 'fr' 
        ? 'Le site présente un bon niveau d\'accessibilité selon l\'analyse automatique. Une vérification manuelle reste recommandée pour une conformité totale.' 
        : 'The site shows good accessibility level based on automated analysis. Manual verification is still recommended for full compliance.',
      color: 'bg-green-500',
      textColor: 'text-white',
      borderColor: 'border-green-600',
      bgGradient: 'bg-green-50',
      icon: '✅'
    },
    'A': {
      label: language === 'fr' ? 'Partiellement conforme' : 'Partially compliant',
      description: language === 'fr' 
        ? 'Le site respecte une partie des critères mais présente des points bloquants' 
        : 'The site meets most criteria but has blocking issues',
      color: 'bg-orange-500',
      textColor: 'text-white',
      borderColor: 'border-orange-600',
      bgGradient: 'bg-orange-50',
      icon: '⚠️'
    },
    'NONE': {
      label: language === 'fr' ? 'Non conforme' : 'Non-compliant',
      description: language === 'fr' 
        ? 'Le site ne répond pas aux critères essentiels d\'accessibilité' 
        : 'The site does not meet essential accessibility criteria',
      color: 'bg-red-500',
      textColor: 'text-white',
      borderColor: 'border-red-600',
      bgGradient: 'bg-red-50',
      icon: '❌'
    }
  };

  const config = levelConfig[level];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 w-full">
      <div className={`${config.bgGradient} px-6 py-4 border-b ${config.borderColor.replace('border-', 'border-')}`}>
        <div className="flex items-center justify-center space-x-3">
          <span className="text-2xl">{config.icon}</span>
          <h3 className="text-xl font-bold text-gray-900 text-center">
            {language === 'fr' ? 'Niveau d\'accessibilité' : 'Accessibility Level'}
          </h3>
        </div>
      </div>
      <div className="p-6 text-center">
        <div className={`inline-flex items-center px-6 py-3 rounded-full text-xl font-bold ${config.color} ${config.textColor} border-2 ${config.borderColor} shadow-lg mb-4 mx-auto`}>
          {config.label}
        </div>
        <p className="text-gray-600 leading-relaxed mb-4">
          {config.description}
        </p>
        <div className="text-sm text-gray-500">
          <div className="space-y-1">
            <div>{result.violations.length} {language === 'fr' ? 'problèmes détectés' : 'issues detected'}</div>
            {result.totalViolations !== result.violations.length && (
              <div className="text-xs text-gray-400">
                (Total backend: {result.totalViolations})
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  color = 'blue',
  trend
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
  trend?: 'up' | 'down' | 'stable';
}) {
  const colorConfigs = {
    blue: {
              header: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-600'
    },
    green: {
              header: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      icon: 'text-green-600'
    },
    red: {
              header: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      icon: 'text-red-600'
    },
    orange: {
              header: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      icon: 'text-orange-600'
    },
    purple: {
              header: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      icon: 'text-purple-600'
    }
  };

  const config = colorConfigs[color];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className={`${config.header} px-6 py-4 border-b ${config.border} flex items-center justify-center min-h-[60px]`}>
        <h3 className={`text-sm font-semibold ${config.text} text-center leading-tight`}>{title}</h3>
      </div>
      <div className="p-6 flex flex-col items-center justify-center min-h-[120px]">
        <p className="text-3xl font-bold text-gray-900 text-center leading-none">{value}</p>
        {subtitle && <p className="text-sm text-gray-600 text-center mt-2 leading-tight">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function AuditResults({ result, language, onNewAudit, updatedUserData }: AuditResultsProps) {
  const t = translations[language];
  const engineName = getEngineName(result.engine);
  
  // État pour le filtre par catégorie uniquement
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'images' | 'forms' | 'navigation' | 'structure' | 'colors' | 'multimedia'>('all');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // L'incrémentation se fait maintenant automatiquement dans l'API /analyze après analyse réussie
  // Plus besoin d'incrémenter depuis le composant frontend
  
  // Détecter le scroll pour afficher le bouton de retour en haut
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Fonction pour déterminer la catégorie d'une violation
  const getViolationCategory = (violation: RGAAViolation): string => {
    const description = violation.description?.toLowerCase() || '';
    const ruleId = violation.ruleId?.toLowerCase() || '';
    const criterion = violation.criterion || '';
    
    // Images
    if (ruleId.includes('image') || description.includes('image') || description.includes('alt') || 
        criterion.startsWith('1.')) {
      return 'images';
    }
    
    // Formulaires
    if (ruleId.includes('form') || ruleId.includes('label') || description.includes('formulaire') || 
        description.includes('champ') || criterion.startsWith('11.')) {
      return 'forms';
    }
    
    // Navigation
    if (ruleId.includes('link') || description.includes('lien') || description.includes('navigation') ||
        criterion.startsWith('6.') || criterion.startsWith('12.')) {
      return 'navigation';
    }
    
    // Structure
    if (ruleId.includes('heading') || description.includes('titre') || description.includes('hiérarchie') ||
        criterion.startsWith('9.') || criterion.startsWith('8.')) {
      return 'structure';
    }
    
    // Couleurs
    if (ruleId.includes('color') || description.includes('couleur') || description.includes('contraste') ||
        criterion.startsWith('3.')) {
      return 'colors';
    }
    
    // Multimédia
    if (ruleId.includes('video') || ruleId.includes('audio') || description.includes('vidéo') ||
        description.includes('audio') || criterion.startsWith('4.')) {
      return 'multimedia';
    }
    
    return 'structure'; // Par défaut
  };
  
  // Filtrer les violations selon la catégorie sélectionnée
  const filteredViolations = result.violations.filter(violation => {
    return selectedCategory === 'all' || getViolationCategory(violation) === selectedCategory;
  });
  
  // Réinitialiser le filtre
  const resetFilters = () => {
    setSelectedCategory('all');
  };

  // Fonctions pour télécharger et partager
  const handleDownloadReport = async () => {
    try {
      // Utiliser le générateur de rapport RGAA officiel conforme au modèle gouvernemental
      const { generateRGAAReport } = await import('@/lib/report-generator');
      
      const reportConfig = {
        serviceName: result.url || 'Site web analysé',
        auditorName: 'Système d\'audit automatisé RGAA',
        auditDate: new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        rgaaVersion: '4.1',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript'],
        tools: [
          'Analyseur RGAA automatisé avec Puppeteer v21+',
          'Calculs de contraste WCAG 2.1 (algorithme officiel)',
          'Tests de responsive design multi-écrans (320px, 768px, 1200px)',
          'Vérification de navigation clavier automatisée',
          'Analyse des zones tactiles (minimum 44x44px)',
          'Tests de zoom jusqu\'à 200% selon RGAA 10.4',
          'Vérification d\'espacement de texte personnalisé'
        ],
        testEnvironment: [
          'Chrome 120+ avec simulation de technologies d\'assistance',
          'Tests automatisés de navigation au clavier (Tab, Shift+Tab)',
          'Calculs de luminance et contraste selon WCAG 2.1',
          'Tests responsive : mobile (320px), tablette (768px), desktop (1200px)',
          'Vérification du focus visible selon RGAA 10.7',
          'Tests de reflow au zoom 200% selon RGAA 10.4'
        ],
        samplePages: [
          {
            name: 'Page analysée',
            url: result.url || 'Contenu HTML fourni',
            comments: `Analyse automatisée complète - ${result.totalViolations} non-conformités détectées`
          }
        ]
      };
      
      // Générer le rapport conforme au modèle officiel RGAA
      const blob = await generateRGAAReport(result, reportConfig);
      
      // Télécharger le rapport
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const siteName = result.url ? 
        result.url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50) : 
        'analyse';
      a.download = `rapport-audit-rgaa-${siteName}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Feedback visuel de succès
      const downloadButton = document.querySelector('[data-download-button]') as HTMLElement;
      if (downloadButton) {
        const originalText = downloadButton.textContent;
        const originalBg = downloadButton.className;
        
        downloadButton.textContent = '📄 Rapport RGAA téléchargé !';
        downloadButton.className = downloadButton.className.replace('bg-blue-600', 'bg-green-600');
        
        setTimeout(() => {
          downloadButton.textContent = originalText;
          downloadButton.className = originalBg;
        }, 3000);
      }
      
    } catch (error) {
      console.error('Erreur lors de la génération du rapport RGAA:', error);
      
      // Message d'erreur adapté selon la langue
      const errorMessage = language === 'fr' ? 
        'Erreur lors de la génération du rapport PDF RGAA. Veuillez réessayer dans quelques instants.' :
        'Error generating RGAA PDF report. Please try again in a few moments.';
      
      alert(errorMessage);
    }
  };

  // Calculer la couleur du score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="max-w-7xl w-full space-y-8 px-6">
      
      {/* Message informatif si 0 violations */}
      {result.totalViolations === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                {language === 'fr' ? `Analyse ${engineName} terminée` : `${engineName} Analysis Completed`}
              </h3>
              <p className="text-blue-800 mb-3">
                {language === 'fr' 
                  ? `${engineName} a terminé l'analyse mais n'a détecté aucune violation d'accessibilité. Cela peut signifier :`
                  : `${engineName} completed the analysis but detected no accessibility violations. This could mean:`
                }
              </p>
              <ul className="list-disc list-inside text-blue-700 space-y-1 mb-4">
                <li>{language === 'fr' ? 'Votre site est très bien optimisé pour l\'accessibilité' : 'Your site is very well optimized for accessibility'}</li>
                <li>{language === 'fr' ? `${engineName} n'a pas pu analyser complètement cette URL` : `${engineName} could not fully analyze this URL`}</li>
                <li>{language === 'fr' ? 'Certains contenus peuvent nécessiter une analyse manuelle' : 'Some content may require manual analysis'}</li>
              </ul>
              <p className="text-blue-700 text-sm">
                {language === 'fr' 
                  ? result.engine === 'axe' 
                    ? `💡 ${engineName} a analysé automatiquement cette page. Certains critères peuvent nécessiter une vérification manuelle.`
                    : `💡 Consultez l'onglet Chrome ouvert par ${engineName} pour voir le rapport détaillé et vérifier s'il y a des éléments à analyser manuellement.`
                  : result.engine === 'axe'
                    ? `💡 ${engineName} automatically analyzed this page. Some criteria may require manual verification.`
                    : `💡 Check the Chrome tab opened by ${engineName} to see the detailed report and verify if there are elements to analyze manually.`
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header Section - cohérent avec les autres blocs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-blue-50 px-8 py-6 border-b border-blue-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center min-w-0 flex-1">
              <Award className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-blue-900 break-words">{t.results}</h1>
                <p className="text-blue-700 text-sm mt-1">Analyse d'accessibilité RGAA/WCAG</p>
              </div>
            </div>
            <div className="flex items-center text-blue-700 text-sm whitespace-nowrap">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(result.timestamp).toLocaleDateString(language)}
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              {result.url && (
                <div className="flex items-center text-gray-600 mb-6">
                  <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors underline break-all"
                  >
                    {result.url}
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 flex-wrap gap-2">
              {/* Bouton Rapport WAVE - affiché seulement si waveReportUrl est disponible */}
              {result.waveReportUrl && (
                <a
                  href={result.waveReportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:from-green-700 focus:to-green-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium shadow-sm whitespace-nowrap transform hover:scale-105"
                  title={t.waveReportDescription}
                >
                  <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
                  {t.viewWaveReport}
                </a>
              )}
              
              <button 
                onClick={handleDownloadReport}
                data-download-button
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium shadow-sm whitespace-nowrap"
                aria-label={t.downloadReport}
              >
                <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                {t.downloadReport}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bloc de synthèse modernisé et uniformisé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-8 items-stretch h-full">
        {/* Widget moteur */}
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[160px] bg-purple-50 border border-purple-100 rounded-2xl shadow-lg p-8 text-center h-full">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-200/60 text-purple-700 mb-3">
            <Cpu className="w-7 h-7" />
          </span>
          <div className="text-lg font-bold text-purple-800 mb-1">{engineName}</div>
          <div className="text-gray-500 text-sm">Moteur d'analyse</div>
        </div>
        {/* Widget violations */}
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[160px] bg-red-50 border border-red-100 rounded-2xl shadow-lg p-8 text-center h-full">
          <span className="text-3xl font-extrabold text-red-800 mb-3">{result.totalViolations}</span>
          <div className="text-gray-500 text-sm">Violations détectées</div>
        </div>
        {/* Widget conformité */}
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[160px] bg-orange-50 border border-orange-100 rounded-2xl shadow-lg p-8 text-center h-full">
          <span className="text-lg font-bold text-orange-800 mb-3">{result.score >= 90 ? 'Bon niveau' : result.score >= 50 ? 'Partiellement conforme' : 'Non conforme'}</span>
          <div className="text-gray-500 text-sm">Statut de conformité</div>
        </div>
      </div>

      {/* Niveau d'accessibilité et Répartition par niveau RGAA côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Niveau d'accessibilité */}
        <div className="flex justify-center">
          <AccessibilityLevelCard result={result} language={language} />
        </div>

        {/* Par niveau RGAA */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                          <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
            <h3 className="text-xl font-bold text-blue-900">{t.byLevel}</h3>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(result.violationsByLevel).map(([level, count]) => {
              const config = RGAA_LEVELS[level as keyof typeof RGAA_LEVELS];
              const percentage = result.totalViolations > 0 ? (count / result.totalViolations) * 100 : 0;
              
              return (
                <div key={level} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.bgColor} ${config.color} border`}>
                        RGAA {config.label}
                      </span>
                      <span className="text-sm text-gray-600 font-medium">{count} problème{count !== 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 group-hover:shadow-md ${
                        config.color.includes('green') ? 'bg-green-500' :
                        config.color.includes('orange') ? 'bg-orange-500' :
                        config.color.includes('blue') ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Liste des violations détectées avec filtres */}
      {result.violations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                          <div className="bg-red-50 px-6 py-4 border-b border-red-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-xl font-bold text-red-900 break-words min-w-0 flex-1">
                {language === 'fr' ? 'Problèmes d\'accessibilité détectés' : 'Accessibility Issues Detected'}
              </h3>
              <span className="text-sm text-red-700 font-medium whitespace-nowrap">
                {result.violations.length} {language === 'fr' ? 'problème(s)' : 'issue(s)'} • {engineName}
              </span>
            </div>
          </div>
          
          {/* Section des filtres par catégorie */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            {/* Toggles de catégories */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: t.all },
                { value: 'images', label: t.categories.images },
                { value: 'forms', label: t.categories.forms },
                { value: 'navigation', label: t.categories.navigation },
                { value: 'structure', label: t.categories.structure },
                { value: 'colors', label: t.categories.colors },
                { value: 'multimedia', label: t.categories.multimedia }
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            
            {/* Compteur de résultats filtrés */}
            <div className="mt-3 pt-2 text-sm text-gray-600">
              {t.showingResults
                .replace('{count}', filteredViolations.length.toString())
                .replace('{total}', result.violations.length.toString())}
            </div>
          </div>
          
          <div className="p-6">
            {/* Affichage des violations filtrées */}
            {filteredViolations.length > 0 ? (
              <div className="space-y-8">
                {filteredViolations.map((violation, index) => (
                  <ViolationCard 
                    key={`${violation.ruleId}-${violation.element}-${index}`}
                    violation={violation} 
                    language={language} 
                    index={index}
                    engine={result.engine}
                  />
                ))}
              </div>
            ) : (
              /* Message si aucun résultat avec les filtres */
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t.noResultsWithFilters}
                </h3>
                <p className="text-gray-600">
                  {t.tryChangingFilters}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bouton de retour en haut */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={t.backToTop}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      </div>
    </div>
  );
} 