'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

const translations = {
  fr: {
    manualAuditGuide: 'Guide d\'audit manuel',
    manualAuditDescription: 'Critères RGAA nécessitant un audit manuel - Ces points de conformité requièrent une évaluation humaine',
    progressLabel: 'Progression',
    completed: 'complétées',
    total: 'au total',
    auditThemes: {
      navigationInteraction: 'Navigation et interaction',
      comprehensionCognition: 'Compréhension et cognition',
      assistiveTechnologies: 'Tests avec technologies d\'assistance',
      userExperience: 'Expérience utilisateur',
      contentQuality: 'Qualité du contenu',
      contextTiming: 'Contexte et timing',
      complianceValidation: 'Conformité et validation'
    },
    auditSteps: {
      navigationInteraction: [
        'Tester la navigation complète au clavier (2.1.1, 2.1.2) - Tab, Shift+Tab, flèches',
        'Vérifier l\'ordre logique de navigation (2.4.3) - séquence cohérente',
        'Contrôler l\'absence de piège du clavier (2.1.2) - possibilité de sortir',
        'Valider les temps de réponse suffisants (2.2.1) - délais appropriés',
        'Tester le contrôle des médias temporels (2.2.2) - pause, stop, contrôles'
      ],
      comprehensionCognition: [
        'Évaluer la clarté du contenu (3.1.3, 3.1.4) - langage simple et compréhensible',
        'Contrôler les instructions compréhensibles (3.3.2) - étiquettes explicites',
        'Vérifier l\'aide contextuelle (3.3.5) - assistance disponible si nécessaire',
        'Tester la prévention des erreurs (3.3.4, 3.3.6) - validation et confirmation',
        'Valider l\'adaptation aux préférences système - thème sombre, réduction animations'
      ],
      assistiveTechnologies: [
        'Tester avec lecteurs d\'écran (NVDA, JAWS, VoiceOver) - annonces correctes',
        'Valider la navigation vocale fonctionnelle - commandes vocales',
        'Contrôler l\'annonce correcte des changements - contenus dynamiques',
        'Tester la restitution des contenus dynamiques - ARIA live regions',
        'Vérifier la compatibilité multi-navigateurs et technologies d\'assistance'
      ],
      userExperience: [
        'Évaluer l\'utilisabilité générale - facilité d\'utilisation',
        'Tester l\'efficacité des parcours utilisateur - tâches accomplies facilement',
        'Mesurer la satisfaction des utilisateurs handicapés - feedback réel',
        'Analyser la charge cognitive - complexité mentale acceptable',
        'Valider l\'adaptation aux besoins spécifiques - personnalisation'
      ],
      contentQuality: [
        'Vérifier la pertinence des alternatives textuelles (1.1.1) - description appropriée',
        'Contrôler la qualité des transcriptions (1.2.1, 1.2.3) - exactitude complète',
        'Valider l\'exactitude des sous-titres (1.2.2) - synchronisation parfaite',
        'Tester l\'audiodescription appropriée (1.2.5) - description des éléments visuels',
        'Contrôler la langue des passages étrangers (3.1.2) - attribut lang correct'
      ],
      contextTiming: [
        'Justifier les limites de temps - nécessité réelle démontrée',
        'Tester la possibilité d\'étendre les délais - mécanisme d\'extension',
        'Contrôler le contenu en mouvement - possibilité d\'arrêt ou pause',
        'Valider la gestion des redirections automatiques - information préalable',
        'Vérifier l\'absence d\'éléments clignotants dangereux - épilepsie'
      ],
      complianceValidation: [
        'Effectuer des tests de robustesse cross-browser - tous navigateurs principaux',
        'Valider avec différentes technologies d\'assistance - diversité des outils',
        'Tester sur dispositifs mobiles réels - iOS, Android, tablettes',
        'Conduire des tests avec de vrais utilisateurs - personnes en situation de handicap',
        'Assurer la conformité légale complète - respect intégral du RGAA 4.1'
      ]
    }
  },
  en: {
    manualAuditGuide: 'Manual Audit Guide',
    manualAuditDescription: 'RGAA criteria requiring manual audit - These compliance points require human evaluation',
    progressLabel: 'Progress',
    completed: 'completed',
    total: 'total',
    auditThemes: {
      navigationInteraction: 'Navigation and interaction',
      comprehensionCognition: 'Understanding and cognition',
      assistiveTechnologies: 'Tests with assistive technologies',
      userExperience: 'User experience',
      contentQuality: 'Content quality',
      contextTiming: 'Context and timing',
      complianceValidation: 'Compliance and validation'
    },
    auditSteps: {
      navigationInteraction: [
        'Test complete keyboard navigation (2.1.1, 2.1.2) - Tab, Shift+Tab, arrows',
        'Check logical navigation order (2.4.3) - coherent sequence',
        'Control absence of keyboard traps (2.1.2) - ability to exit',
        'Validate sufficient response times (2.2.1) - appropriate delays',
        'Test control of timed media (2.2.2) - pause, stop, controls'
      ],
      comprehensionCognition: [
        'Evaluate content clarity (3.1.3, 3.1.4) - simple and understandable language',
        'Control understandable instructions (3.3.2) - explicit labels',
        'Check contextual help (3.3.5) - assistance available when needed',
        'Test error prevention (3.3.4, 3.3.6) - validation and confirmation',
        'Validate adaptation to system preferences - dark theme, reduced animations'
      ],
      assistiveTechnologies: [
        'Test with screen readers (NVDA, JAWS, VoiceOver) - correct announcements',
        'Validate functional voice navigation - voice commands',
        'Control correct announcement of changes - dynamic content',
        'Test restitution of dynamic content - ARIA live regions',
        'Check multi-browser and assistive technology compatibility'
      ],
      userExperience: [
        'Evaluate general usability - ease of use',
        'Test efficiency of user journeys - tasks easily accomplished',
        'Measure satisfaction of disabled users - real feedback',
        'Analyze cognitive load - acceptable mental complexity',
        'Validate adaptation to specific needs - customization'
      ],
      contentQuality: [
        'Check relevance of text alternatives (1.1.1) - appropriate description',
        'Control quality of transcriptions (1.2.1, 1.2.3) - complete accuracy',
        'Validate accuracy of subtitles (1.2.2) - perfect synchronization',
        'Test appropriate audio description (1.2.5) - description of visual elements',
        'Control language of foreign passages (3.1.2) - correct lang attribute'
      ],
      contextTiming: [
        'Justify time limits - real necessity demonstrated',
        'Test ability to extend deadlines - extension mechanism',
        'Control moving content - ability to stop or pause',
        'Validate management of automatic redirects - prior information',
        'Check absence of dangerous blinking elements - epilepsy'
      ],
      complianceValidation: [
        'Perform cross-browser robustness tests - all major browsers',
        'Validate with different assistive technologies - diversity of tools',
        'Test on real mobile devices - iOS, Android, tablets',
        'Conduct tests with real users - people with disabilities',
        'Ensure complete legal compliance - full RGAA 4.1 compliance'
      ]
    }
  }
};

export default function ManualAuditPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [openThemes, setOpenThemes] = useState<Set<string>>(new Set());

  const toggleChecked = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const toggleTheme = (theme: string) => {
    const newOpen = new Set(openThemes);
    if (newOpen.has(theme)) {
      newOpen.delete(theme);
    } else {
      newOpen.add(theme);
    }
    setOpenThemes(newOpen);
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'navigationInteraction': return '⌨️';
      case 'comprehensionCognition': return '🧠';
      case 'assistiveTechnologies': return '🔊';
      case 'userExperience': return '👥';
      case 'contentQuality': return '📄';
      case 'contextTiming': return '⏱️';
      case 'complianceValidation': return '✅';
      default: return '📋';
    }
  };

  const themes = Object.keys(t.auditThemes) as Array<keyof typeof t.auditThemes>;
  const completedCount = checkedItems.size;
  const totalCount = themes.reduce((total, theme) => total + t.auditSteps[theme].length, 0);
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="w-full">
      {/* Header principal avec padding */}
      <div className="px-6 pt-6">
        <div className="bg-white rounded-t-2xl shadow-lg border border-gray-200 border-b-0">
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 px-8 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lightbulb className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-green-900">{t.manualAuditGuide}</h1>
                  <p className="text-green-700 text-sm mt-1">{t.manualAuditDescription}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-900">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-green-700">{t.progressLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Barre de progression sticky - SANS padding pour qu'elle puisse coller */}
      <div className="sticky top-0 z-20 bg-white border-x border-gray-200 shadow-sm mx-6">
        <div className="px-8 py-4">
          <div className="flex justify-between text-sm text-green-700 mb-2">
            <span>{completedCount} {t.completed}</span>
            <span>{totalCount} {t.total}</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Contenu principal avec padding */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-b-2xl shadow-lg border border-gray-200 border-t-0">
          <div className="p-8">
            <div className="space-y-6">
              {themes.map((theme) => {
                const isOpen = openThemes.has(theme);
                const steps = t.auditSteps[theme];
                const themeCompletedCount = steps.filter((_, index) => 
                  checkedItems.has(`${theme}-${index}`)
                ).length;

                return (
                  <div key={theme} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
                      onClick={() => toggleTheme(theme)}
                      aria-expanded={isOpen}
                      aria-controls={`theme-${theme}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3" role="img" aria-hidden="true">
                            {getThemeIcon(theme)}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{t.auditThemes[theme]}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {themeCompletedCount}/{steps.length} étapes complétées
                            </p>
                          </div>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div id={`theme-${theme}`} className="px-6 py-4 bg-white border-t border-gray-200">
                        <ul className="space-y-3">
                          {steps.map((step, index) => {
                            const itemId = `${theme}-${index}`;
                            const isChecked = checkedItems.has(itemId);

                            return (
                              <li key={index} className="flex items-start">
                                <label className="flex items-start cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleChecked(itemId)}
                                    className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                  />
                                  <span className={`ml-3 text-sm leading-relaxed transition-colors ${
                                    isChecked 
                                      ? 'text-gray-500 line-through' 
                                      : 'text-gray-900 group-hover:text-gray-700'
                                  }`}>
                                    {step}
                                  </span>
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 