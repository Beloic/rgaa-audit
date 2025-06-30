import axios from 'axios';
import type { RGAAViolation } from '@/types/audit';
import puppeteer, { Browser, Page } from 'puppeteer';

// Configuration sécurisée
const WAVE_API_KEY = process.env.WAVE_API_KEY || '';

if (!WAVE_API_KEY) {
  console.warn('⚠️ WAVE_API_KEY non configurée - certaines fonctionnalités peuvent être limitées');
}

const WAVE_API_URL = 'https://wave.webaim.org/api/request';

interface WaveError {
  id: string;
  description: string;
  count: number;
  selectors: string[];
  contrast?: {
    foreground: string;
    background: string;
    ratio: number;
  };
}

interface WaveAlert {
  id: string;
  description: string;
  count: number;
  selectors: string[];
}

interface WaveResponse {
  status: {
    success: boolean;
    httpstatuscode: number;
  };
  statistics: {
    pagetitle: string;
    pageurl: string;
    time: number;
    creditsremaining: number;
    allitemcount: number;
    totalelements: number;
    waveurl: string;
  };
  categories: {
    error: {
      description: string;
      count: number;
      items: Record<string, WaveError>;
    };
    contrast: {
      description: string;
      count: number;
      items: Record<string, WaveError>;
    };
    alert: {
      description: string;
      count: number;
      items: Record<string, WaveAlert>;
    };
  };
}

/**
 * Mapping des codes d'erreur WAVE vers les critères RGAA
 */
const WAVE_TO_RGAA_MAPPING: Record<string, {
  criterion: string;
  level: 'A' | 'AA' | 'AAA';
  impact: 'low' | 'medium' | 'high' | 'critical';
  rgaaRule: string;
}> = {
  // Erreurs critiques
  'alt_missing': {
    criterion: '1.1',
    level: 'A',
    impact: 'critical',
    rgaaRule: 'Chaque image porteuse d\'information a-t-elle une alternative textuelle ?'
  },
  'alt_input_missing': {
    criterion: '1.3',
    level: 'A', 
    impact: 'critical',
    rgaaRule: 'Pour chaque image porteuse d\'information ayant une alternative textuelle, cette alternative est-elle pertinente ?'
  },
  'label_missing': {
    criterion: '11.1',
    level: 'A',
    impact: 'critical',
    rgaaRule: 'Chaque champ de formulaire a-t-il une étiquette ?'
  },
  'label_empty': {
    criterion: '11.2',
    level: 'A',
    impact: 'critical',
    rgaaRule: 'Chaque étiquette associée à un champ de formulaire est-elle pertinente ?'
  },
  'language_missing': {
    criterion: '8.3',
    level: 'A',
    impact: 'high',
    rgaaRule: 'Dans chaque page web, la langue par défaut est-elle présente ?'
  },
  'heading_empty': {
    criterion: '9.1',
    level: 'A',
    impact: 'high',
    rgaaRule: 'Dans chaque page web, l\'information est-elle structurée par l\'utilisation appropriée de titres ?'
  },
  'heading_skipped': {
    criterion: '9.1',
    level: 'A',
    impact: 'high',
    rgaaRule: 'Dans chaque page web, l\'information est-elle structurée par l\'utilisation appropriée de titres ?'
  },
  'link_empty': {
    criterion: '6.1',
    level: 'A',
    impact: 'high',
    rgaaRule: 'Chaque lien est-il explicite ?'
  },
  'button_empty': {
    criterion: '7.1',
    level: 'A',
    impact: 'high',
    rgaaRule: 'Chaque script est-il, si nécessaire, compatible avec les technologies d\'assistance ?'
  },
  'th_empty': {
    criterion: '5.6',
    level: 'A',
    impact: 'medium',
    rgaaRule: 'Pour chaque tableau de données, chaque en-tête de colonnes et chaque en-tête de lignes sont-ils correctement déclarés ?'
  },
  'aria_reference_broken': {
    criterion: '7.1',
    level: 'A',
    impact: 'high',
    rgaaRule: 'Chaque script est-il, si nécessaire, compatible avec les technologies d\'assistance ?'
  },

  // Erreurs de contraste
  'contrast': {
    criterion: '3.2',
    level: 'AA',
    impact: 'medium',
    rgaaRule: 'Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé ?'
  },

  // Alertes importantes
  'alt_suspicious': {
    criterion: '1.3',
    level: 'A',
    impact: 'medium',
    rgaaRule: 'Pour chaque image porteuse d\'information ayant une alternative textuelle, cette alternative est-elle pertinente ?'
  },
  'alt_redundant': {
    criterion: '1.2',
    level: 'A',
    impact: 'low',
    rgaaRule: 'Chaque image de décoration est-elle correctement ignorée par les technologies d\'assistance ?'
  },
  'link_suspicious': {
    criterion: '6.1',
    level: 'A',
    impact: 'medium',
    rgaaRule: 'Chaque lien est-il explicite ?'
  },
  'link_redundant': {
    criterion: '6.3',
    level: 'A',
    impact: 'low',
    rgaaRule: 'Chaque lien est-il explicite hors contexte ?'
  },
  'title_redundant': {
    criterion: '8.2',
    level: 'A',
    impact: 'low',
    rgaaRule: 'Pour chaque page web, le code source généré est-il valide selon le type de document spécifié ?'
  },
  'heading_possible': {
    criterion: '9.1',
    level: 'A',
    impact: 'medium',
    rgaaRule: 'Dans chaque page web, l\'information est-elle structurée par l\'utilisation appropriée de titres ?'
  },
  'list_possible': {
    criterion: '9.3',
    level: 'A',
    impact: 'low',
    rgaaRule: 'Dans chaque page web, chaque liste est-elle correctement structurée ?'
  },
  'tabindex': {
    criterion: '12.1',
    level: 'A',
    impact: 'medium',
    rgaaRule: 'Chaque ensemble de pages dispose-t-il de deux systèmes de navigation différents, au moins ?'
  }
};

/**
 * Analyser une URL avec l'API WAVE
 */
export async function analyzeUrlWithWave(url: string): Promise<RGAAViolation[]> {
  try {
    console.log('🌊 Lancement analyse WAVE...');
    
    const response = await axios.get(WAVE_API_URL, {
      params: {
        key: WAVE_API_KEY,
        url: url,
        format: 'json',
        reporttype: 4, // Format détaillé avec toutes les données
      },
      timeout: 30000, // 30 secondes timeout
    });

    const waveData: WaveResponse = response.data;
    
    if (!waveData.status.success) {
      throw new Error(`Erreur WAVE API: ${waveData.status.httpstatuscode}`);
    }

    console.log(`📊 WAVE Stats: ${waveData.statistics.allitemcount} éléments analysés, ${waveData.statistics.creditsremaining} crédits restants`);

    const violations: RGAAViolation[] = [];

    // Traiter les erreurs
    if (waveData.categories.error.items) {
      Object.entries(waveData.categories.error.items).forEach(([errorId, error]) => {
        const mapping = WAVE_TO_RGAA_MAPPING[errorId];
        if (mapping) {
          // Créer une violation pour chaque instance de l'erreur
          for (let i = 0; i < error.count; i++) {
            violations.push({
              ruleId: `wave-error-${errorId}-${i}`,
              criterion: mapping.criterion,
              level: mapping.level,
              impact: mapping.impact,
              description: error.description,
              element: error.selectors[i] || error.selectors[0] || 'Élément non spécifié',
              recommendation: generateRecommendation(errorId, error.description),
              context: `Critère RGAA ${mapping.criterion}: ${mapping.rgaaRule}`
            });
          }
        }
      });
    }

    // Traiter les erreurs de contraste
    if (waveData.categories.contrast.items) {
      Object.entries(waveData.categories.contrast.items).forEach(([contrastId, contrastError]) => {
        const mapping = WAVE_TO_RGAA_MAPPING['contrast'];
        if (mapping) {
          for (let i = 0; i < contrastError.count; i++) {
            const contrastInfo = contrastError.contrast ? 
              ` (Ratio: ${contrastError.contrast.ratio}, Couleurs: ${contrastError.contrast.foreground} sur ${contrastError.contrast.background})` : '';
            
            violations.push({
              ruleId: `wave-contrast-${contrastId}-${i}`,
              criterion: mapping.criterion,
              level: mapping.level,
              impact: mapping.impact,
              description: `${contrastError.description}${contrastInfo}`,
              element: contrastError.selectors[i] || contrastError.selectors[0] || 'Élément non spécifié',
              recommendation: 'Augmentez le contraste en modifiant les couleurs de texte ou d\'arrière-plan pour atteindre un ratio d\'au moins 4.5:1 pour le texte normal ou 3:1 pour le texte agrandi.',
              context: `Critère RGAA ${mapping.criterion}: ${mapping.rgaaRule}`
            });
          }
        }
      });
    }

    // Traiter les alertes importantes
    if (waveData.categories.alert.items) {
      Object.entries(waveData.categories.alert.items).forEach(([alertId, alert]) => {
        const mapping = WAVE_TO_RGAA_MAPPING[alertId];
        if (mapping) {
          for (let i = 0; i < alert.count; i++) {
            violations.push({
              ruleId: `wave-alert-${alertId}-${i}`,
              criterion: mapping.criterion,
              level: mapping.level,
              impact: mapping.impact,
              description: alert.description,
              element: alert.selectors[i] || alert.selectors[0] || 'Élément non spécifié',
              recommendation: generateRecommendation(alertId, alert.description),
              context: `Critère RGAA ${mapping.criterion}: ${mapping.rgaaRule}`
            });
          }
        }
      });
    }

    console.log(`✅ Analyse WAVE terminée: ${violations.length} violations détectées`);
    console.log(`🔗 Rapport WAVE détaillé: ${waveData.statistics.waveurl}`);
    
    return violations;

  } catch (error) {
    console.error('❌ Erreur analyse WAVE:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error('URL invalide ou non accessible par WAVE');
      } else if (error.response?.status === 402) {
        throw new Error('Crédits WAVE épuisés');
      } else if (error.response?.status === 403) {
        throw new Error('Clé API WAVE invalide');
      }
    }
    throw new Error(`Erreur WAVE: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Générer des recommandations spécifiques selon le type d'erreur WAVE
 */
function generateRecommendation(errorId: string, description: string): string {
  const recommendations: Record<string, string> = {
    'alt_missing': 'Ajoutez un attribut alt descriptif à cette image pour expliquer son contenu aux utilisateurs de lecteurs d\'écran.',
    'alt_input_missing': 'Ajoutez un attribut alt ou un libellé approprié à ce bouton image pour indiquer son action.',
    'label_missing': 'Associez une étiquette visible à ce champ de formulaire en utilisant l\'élément <label> ou l\'attribut aria-labelledby.',
    'label_empty': 'Fournissez un texte d\'étiquette descriptif pour identifier clairement ce champ de formulaire.',
    'language_missing': 'Ajoutez l\'attribut lang="fr" (ou la langue appropriée) à l\'élément <html> de la page.',
    'heading_empty': 'Ajoutez du contenu textuel à ce titre ou supprimez-le s\'il n\'est pas nécessaire.',
    'heading_skipped': 'Utilisez une hiérarchie logique de titres (h1, h2, h3...) sans sauter de niveau.',
    'link_empty': 'Ajoutez un texte descriptif à ce lien pour indiquer sa destination ou son action.',
    'button_empty': 'Ajoutez un texte ou un attribut aria-label à ce bouton pour indiquer son action.',
    'th_empty': 'Ajoutez du contenu textuel aux en-têtes de tableau pour identifier les colonnes ou lignes.',
    'aria_reference_broken': 'Vérifiez que les ID référencés dans les attributs ARIA existent dans le DOM.',
    'alt_suspicious': 'Vérifiez que le texte alternatif décrit effectivement le contenu informatif de l\'image.',
    'alt_redundant': 'Considérez utiliser alt="" pour les images décoratives ou supprimez le texte alternatif redondant.',
    'link_suspicious': 'Rendez le texte du lien plus descriptif ou ajoutez du contexte avec aria-label.',
    'link_redundant': 'Combinez les liens adjacents identiques ou ajoutez du contexte pour les différencier.',
    'title_redundant': 'Supprimez l\'attribut title redondant ou fournissez des informations complémentaires utiles.',
    'heading_possible': 'Considérez utiliser un élément de titre (h1-h6) pour structurer cette section.',
    'list_possible': 'Considérez utiliser une liste (ul, ol) pour structurer ces éléments connexes.',
    'tabindex': 'Évitez les valeurs tabindex positives et préférez l\'ordre naturel du DOM.'
  };

  return recommendations[errorId] || `Corrigez ce problème d'accessibilité: ${description}`;
}

/**
 * Vérifier les crédits WAVE restants
 */
export async function checkWaveCredits(): Promise<number> {
  try {
    // Faire un appel test pour vérifier les crédits
    const response = await axios.get(WAVE_API_URL, {
      params: {
        key: WAVE_API_KEY,
        url: 'https://example.com',
        format: 'json',
        reporttype: 1, // Format minimal pour économiser les crédits
      },
      timeout: 10000,
    });

    const waveData: WaveResponse = response.data;
    return waveData.statistics.creditsremaining;
  } catch (error) {
    console.error('Erreur vérification crédits WAVE:', error);
    return -1;
  }
} 