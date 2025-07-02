'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Palette, Settings, RotateCcw, Info, Keyboard, Activity } from 'lucide-react';

interface SimulationSettings {
  cecite: boolean;
  malvoyance: {
    enabled: boolean;
    severity: number; // 0-100
    type: 'blur' | 'tunnel' | 'spots';
  };
  daltonisme: {
    enabled: boolean;
    type: 'deuteranopia' | 'protanopia' | 'tritanopia' | 'monochromacy';
  };
  navigationClavier: boolean;
  tremblements: {
    enabled: boolean;
    intensity: number; // 0-100
  };
}

export default function SimulateurHandicap() {
  const [settings, setSettings] = useState<SimulationSettings>({
    cecite: false,
    malvoyance: {
      enabled: false,
      severity: 50,
      type: 'blur'
    },
    daltonisme: {
      enabled: false,
      type: 'deuteranopia'
    },
    navigationClavier: false,
    tremblements: {
      enabled: false,
      intensity: 50
    }
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const trembleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Appliquer les filtres CSS
  useEffect(() => {
    const body = document.body;
    
    if (!isSimulating) {
      body.style.filter = '';
      body.style.opacity = '';
      body.style.pointerEvents = '';
      body.className = body.className.replace(/vision-tunnel|vision-spots|keyboard-only/g, '').trim();
      // Arrêter les tremblements
      if (trembleIntervalRef.current) {
        clearInterval(trembleIntervalRef.current);
        trembleIntervalRef.current = null;
      }
      return;
    }

    let filters: string[] = [];
    
    // Navigation clavier seule
    if (settings.navigationClavier) {
      body.style.pointerEvents = 'none';
      body.classList.add('keyboard-only');
      // Créer un indicateur de focus visible
      if (!document.querySelector('.focus-indicator-style')) {
        const style = document.createElement('style');
        style.className = 'focus-indicator-style';
        style.textContent = `
          .keyboard-only *:focus {
            outline: 3px solid #ff6b35 !important;
            outline-offset: 2px !important;
            box-shadow: 0 0 0 5px rgba(255, 107, 53, 0.3) !important;
          }
          .keyboard-only {
            cursor: none !important;
          }
          .keyboard-only * {
            cursor: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      body.style.pointerEvents = '';
      body.className = body.className.replace(/keyboard-only/g, '').trim();
      const focusStyle = document.querySelector('.focus-indicator-style');
      if (focusStyle) focusStyle.remove();
    }

    // Tremblements
    if (settings.tremblements.enabled) {
      const intensity = settings.tremblements.intensity / 100;
      
      // Arrêter l'ancien intervalle s'il existe
      if (trembleIntervalRef.current) {
        clearInterval(trembleIntervalRef.current);
      }
      
      // Créer l'effet de tremblement
      trembleIntervalRef.current = setInterval(() => {
        const trembleX = (Math.random() - 0.5) * intensity * 8;
        const trembleY = (Math.random() - 0.5) * intensity * 8;
        body.style.transform = `translate(${trembleX}px, ${trembleY}px)`;
      }, 50);
    } else {
      body.style.transform = '';
      if (trembleIntervalRef.current) {
        clearInterval(trembleIntervalRef.current);
        trembleIntervalRef.current = null;
      }
    }
    
    // Cécité
    if (settings.cecite) {
      body.style.opacity = '0.05'; // Quasi-noir au lieu de totalement noir
      body.style.filter = 'contrast(0) brightness(0)';
      return;
    }

    // Malvoyance
    if (settings.malvoyance.enabled) {
      const severity = settings.malvoyance.severity / 100;
      switch (settings.malvoyance.type) {
        case 'blur':
          filters.push(`blur(${severity * 8}px)`);
          break;
        case 'tunnel':
          // Ajouter la classe CSS pour l'effet tunnel
          body.className = body.className.replace(/vision-tunnel|vision-spots/g, '').trim();
          body.classList.add('vision-tunnel');
          filters.push(`contrast(${1 + severity * 0.5})`);
          filters.push(`brightness(${1 - severity * 0.3})`);
          break;
        case 'spots':
          // Ajouter la classe CSS pour les taches aveugles
          body.className = body.className.replace(/vision-tunnel|vision-spots/g, '').trim();
          body.classList.add('vision-spots');
          filters.push(`contrast(${1 + severity})`);
          filters.push(`brightness(${1 - severity * 0.2})`);
          break;
      }
    } else {
      // Supprimer les classes si malvoyance non activée
      body.className = body.className.replace(/vision-tunnel|vision-spots/g, '').trim();
    }

    // Daltonisme
    if (settings.daltonisme.enabled) {
      switch (settings.daltonisme.type) {
        case 'deuteranopia':
          // Deutéranopie (insensibilité au vert)
          filters.push('sepia(50%) hue-rotate(20deg) saturate(1.2)');
          break;
        case 'protanopia':
          // Protanopie (insensibilité au rouge)
          filters.push('sepia(50%) hue-rotate(-20deg) saturate(1.1)');
          break;
        case 'tritanopia':
          // Tritanopie (insensibilité au bleu)
          filters.push('sepia(30%) hue-rotate(180deg) saturate(0.8)');
          break;
        case 'monochromacy':
          // Achromatopsie (vision en noir et blanc)
          filters.push('grayscale(100%) contrast(1.1)');
          break;
      }
    }

    body.style.filter = filters.join(' ');
  }, [settings, isSimulating]);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const resetSettings = () => {
    setSettings({
      cecite: false,
      malvoyance: {
        enabled: false,
        severity: 50,
        type: 'blur'
      },
      daltonisme: {
        enabled: false,
        type: 'deuteranopia'
      },
      navigationClavier: false,
      tremblements: {
        enabled: false,
        intensity: 50
      }
    });
    setIsSimulating(false);
  };

  const handicapDescriptions = {
    cecite: "La cécité est la perte totale ou quasi-totale de la vision. Les personnes aveugles dépendent des lecteurs d'écran et de la navigation au clavier.",
    malvoyance: "La malvoyance inclut diverses déficiences visuelles comme la vision floue, la vision tunnel, ou les taches aveugles.",
    daltonisme: "Le daltonisme affecte la perception des couleurs, notamment la distinction entre certaines couleurs comme le rouge et le vert.",
    navigationClavier: "Simulation de l'utilisation d'un ordinateur sans souris, uniquement avec le clavier. Essentiel pour les personnes ayant des handicaps moteurs.",
    tremblements: "Les tremblements moteurs rendent difficile le contrôle précis de la souris et des gestes. Fréquent avec Parkinson, sclérose en plaques, etc."
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Simulateur d'Handicap
              </h1>
              <p className="text-gray-600">
                Expérimentez différents types de handicaps visuels et moteurs pour mieux comprendre les défis d'accessibilité
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetSettings}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </button>
              <button
                onClick={toggleSimulation}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  isSimulating
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSimulating ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Arrêter la simulation
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Démarrer la simulation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Status */}
        {isSimulating && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-orange-400 mr-2" />
              <p className="text-orange-700 font-medium">
                Simulation active - Vous expérimentez actuellement les handicaps sélectionnés
              </p>
            </div>
          </div>
        )}

        {/* Handicaps visuels */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Handicaps visuels</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cécité */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <EyeOff className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Cécité</h3>
                  <p className="text-sm text-gray-500">Perte totale de la vision</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {handicapDescriptions.cecite}
              </p>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.cecite}
                  onChange={(e) => setSettings({
                    ...settings,
                    cecite: e.target.checked,
                    malvoyance: { ...settings.malvoyance, enabled: false }
                  })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Simuler la cécité</span>
              </label>
            </div>

            {/* Malvoyance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Malvoyance</h3>
                  <p className="text-sm text-gray-500">Déficience visuelle partielle</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {handicapDescriptions.malvoyance}
              </p>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.malvoyance.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      malvoyance: { ...settings.malvoyance, enabled: e.target.checked },
                      cecite: false
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Simuler la malvoyance</span>
                </label>

                {settings.malvoyance.enabled && (
                  <div className="ml-7 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de malvoyance
                      </label>
                      <select
                        value={settings.malvoyance.type}
                        onChange={(e) => setSettings({
                          ...settings,
                          malvoyance: {
                            ...settings.malvoyance,
                            type: e.target.value as 'blur' | 'tunnel' | 'spots'
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="blur">Vision floue</option>
                        <option value="tunnel">Vision tunnel</option>
                        <option value="spots">Taches aveugles</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sévérité: {settings.malvoyance.severity}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={settings.malvoyance.severity}
                        onChange={(e) => setSettings({
                          ...settings,
                          malvoyance: {
                            ...settings.malvoyance,
                            severity: parseInt(e.target.value)
                          }
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Daltonisme */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Daltonisme</h3>
                  <p className="text-sm text-gray-500">Déficience de la perception des couleurs</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {handicapDescriptions.daltonisme}
              </p>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.daltonisme.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      daltonisme: { ...settings.daltonisme, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Simuler le daltonisme</span>
                </label>

                {settings.daltonisme.enabled && (
                  <div className="ml-7">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de daltonisme
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'deuteranopia', label: 'Deutéranopie (vert-rouge)' },
                        { value: 'protanopia', label: 'Protanopie (rouge-vert)' },
                        { value: 'tritanopia', label: 'Tritanopie (bleu-jaune)' },
                        { value: 'monochromacy', label: 'Monochromatie (noir et blanc)' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-gray-50">
                          <input
                            type="radio"
                            name="daltonisme-type"
                            value={option.value}
                            checked={settings.daltonisme.type === option.value}
                            onChange={(e) => setSettings({
                              ...settings,
                              daltonisme: {
                                ...settings.daltonisme,
                                type: e.target.value as any
                              }
                            })}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Handicaps moteurs */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Handicaps moteurs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Navigation Clavier */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Keyboard className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Navigation Clavier</h3>
                  <p className="text-sm text-gray-500">Handicaps moteurs</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {handicapDescriptions.navigationClavier}
              </p>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.navigationClavier}
                  onChange={(e) => setSettings({
                    ...settings,
                    navigationClavier: e.target.checked
                  })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Désactiver la souris</span>
              </label>
              
              {settings.navigationClavier && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">
                    💡 <strong>Astuce :</strong> Utilisez Tab pour naviguer, Entrée pour cliquer, Espace pour cocher les cases.
                  </p>
                </div>
              )}
            </div>

            {/* Tremblements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Activity className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Tremblements</h3>
                  <p className="text-sm text-gray-500">Troubles moteurs</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {handicapDescriptions.tremblements}
              </p>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.tremblements.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      tremblements: { ...settings.tremblements, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Simuler les tremblements</span>
                </label>

                {settings.tremblements.enabled && (
                  <div className="ml-7 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intensité: {settings.tremblements.intensity}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={settings.tremblements.intensity}
                        onChange={(e) => setSettings({
                          ...settings,
                          tremblements: {
                            ...settings.tremblements,
                            intensity: parseInt(e.target.value)
                          }
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Exemples de test */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Zone de test</h3>
          <p className="text-gray-600 mb-6">
            Utilisez cette zone pour tester l'impact des handicaps simulés sur différents éléments visuels et interactifs.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Test de couleurs */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Test de couleurs</h4>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-red-500 rounded"></div>
                <div className="w-8 h-8 bg-green-500 rounded"></div>
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
                <div className="w-8 h-8 bg-yellow-500 rounded"></div>
              </div>
              <p className="text-sm text-gray-600">Rouge, Vert, Bleu, Jaune</p>
            </div>

            {/* Test de contraste */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Test de contraste</h4>
              <div className="space-y-2">
                <div className="bg-black text-white p-2 text-sm rounded">Bon contraste</div>
                <div className="bg-gray-300 text-gray-400 p-2 text-sm rounded">Mauvais contraste</div>
              </div>
            </div>

            {/* Test de navigation */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Test de navigation</h4>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Bouton 1
                </button>
                <button className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                  Bouton 2
                </button>
                <input 
                  type="text" 
                  placeholder="Champ de saisie"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Test de précision */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Test de précision</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm">Case à cocher</span>
                </label>
                <div className="flex gap-1">
                  <button className="w-6 h-6 bg-red-500 text-white text-xs rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">1</button>
                  <button className="w-6 h-6 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">2</button>
                  <button className="w-6 h-6 bg-green-500 text-white text-xs rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">3</button>
                </div>
                <p className="text-xs text-gray-500">Petits boutons difficiles à cliquer</p>
              </div>
            </div>
          </div>
          
          {/* Instructions spécifiques */}
          {(settings.navigationClavier || settings.tremblements.enabled) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Instructions pour les tests actifs :</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {settings.navigationClavier && (
                  <li>• <strong>Navigation clavier :</strong> Utilisez Tab/Shift+Tab pour naviguer, Entrée/Espace pour interagir</li>
                )}
                {settings.tremblements.enabled && (
                  <li>• <strong>Tremblements :</strong> Essayez de cliquer précisément sur les petits boutons</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 