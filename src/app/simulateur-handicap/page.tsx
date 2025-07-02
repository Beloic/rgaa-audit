'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Palette, Settings, RotateCcw, Info, Keyboard, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
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
    cecite: t('simulator.blindness.description'),
    malvoyance: t('simulator.lowVision.description'),
    daltonisme: t('simulator.colorBlindness.description'),
    navigationClavier: t('simulator.keyboardNav.description'),
    tremblements: t('simulator.tremors.description')
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-24 lg:pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {t('simulator.title')}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {t('simulator.description')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <button
                onClick={resetSettings}
                className="flex items-center justify-center gap-2 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation min-h-[48px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="font-medium">{t('simulator.reset')}</span>
              </button>
              <button
                onClick={toggleSimulation}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors touch-manipulation min-h-[48px] ${
                  isSimulating
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isSimulating ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              >
                {isSimulating ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>{t('simulator.stopSimulation')}</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>{t('simulator.startSimulation')}</span>
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
                {t('simulator.activeSimulation')}
              </p>
            </div>
          </div>
        )}

        {/* Handicaps visuels */}
        <div className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{t('simulator.visualDisabilities')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Cécité */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <EyeOff className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{t('simulator.blindness.title')}</h3>
                  <p className="text-sm text-gray-500">{t('simulator.blindness.subtitle')}</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {handicapDescriptions.cecite}
              </p>

              <label className="flex items-center gap-3 cursor-pointer touch-manipulation py-1">
                <input
                  type="checkbox"
                  checked={settings.cecite}
                  onChange={(e) => setSettings({
                    ...settings,
                    cecite: e.target.checked,
                    malvoyance: { ...settings.malvoyance, enabled: false }
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-700 font-medium">{t('simulator.blindness.simulate')}</span>
              </label>
            </div>

            {/* Malvoyance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{t('simulator.lowVision.title')}</h3>
                  <p className="text-sm text-gray-500">{t('simulator.lowVision.subtitle')}</p>
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
                  <span className="text-gray-700 font-medium">{t('simulator.lowVision.simulate')}</span>
                </label>

                {settings.malvoyance.enabled && (
                  <div className="ml-7 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('simulator.lowVision.type')}
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
                        <option value="blur">{t('simulator.lowVision.blur')}</option>
                        <option value="tunnel">{t('simulator.lowVision.tunnel')}</option>
                        <option value="spots">{t('simulator.lowVision.spots')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('simulator.lowVision.severity')}: {settings.malvoyance.severity}%
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider slider-bar"
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
                  <h3 className="text-xl font-semibold text-gray-900">{t('simulator.colorBlindness.title')}</h3>
                  <p className="text-sm text-gray-500">{t('simulator.colorBlindness.subtitle')}</p>
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
                  <span className="text-gray-700 font-medium">{t('simulator.colorBlindness.simulate')}</span>
                </label>

                {settings.daltonisme.enabled && (
                  <div className="ml-7">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('simulator.colorBlindness.type')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'deuteranopia', label: t('simulator.colorBlindness.deuteranopia') },
                        { value: 'protanopia', label: t('simulator.colorBlindness.protanopia') },
                        { value: 'tritanopia', label: t('simulator.colorBlindness.tritanopia') },
                        { value: 'monochromacy', label: t('simulator.colorBlindness.monochromacy') }
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{t('simulator.motorDisabilities')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Navigation Clavier */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Keyboard className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{t('simulator.keyboardNav.title')}</h3>
                  <p className="text-sm text-gray-500">{t('simulator.keyboardNav.subtitle')}</p>
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
                <span className="text-gray-700 font-medium">{t('simulator.keyboardNav.simulate')}</span>
              </label>
              
              {settings.navigationClavier && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700" dangerouslySetInnerHTML={{ __html: t('simulator.keyboardNav.tip') }} />
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
                  <h3 className="text-xl font-semibold text-gray-900">{t('simulator.tremors.title')}</h3>
                  <p className="text-sm text-gray-500">{t('simulator.tremors.subtitle')}</p>
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
                  <span className="text-gray-700 font-medium">{t('simulator.tremors.simulate')}</span>
                </label>

                {settings.tremblements.enabled && (
                  <div className="ml-7 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('simulator.tremors.intensity')}: {settings.tremblements.intensity}%
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider slider-bar"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Exemples de test */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{t('simulator.testZone.title')}</h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {t('simulator.testZone.description')}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Test de couleurs */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">{t('simulator.testZone.colorTest')}</h4>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-red-500 rounded"></div>
                <div className="w-8 h-8 bg-green-500 rounded"></div>
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
                <div className="w-8 h-8 bg-yellow-500 rounded"></div>
              </div>
              <p className="text-sm text-gray-600">{t('simulator.testZone.colorLabels')}</p>
            </div>

            {/* Test de contraste */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">{t('simulator.testZone.contrastTest')}</h4>
              <div className="space-y-2">
                <div className="bg-black text-white p-2 text-sm rounded">{t('simulator.testZone.goodContrast')}</div>
                <div className="bg-gray-300 text-gray-400 p-2 text-sm rounded">{t('simulator.testZone.badContrast')}</div>
              </div>
            </div>

            {/* Test de navigation */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">{t('simulator.testZone.navigationTest')}</h4>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {t('simulator.testZone.button1')}
                </button>
                <button className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                  {t('simulator.testZone.button2')}
                </button>
                <input 
                  type="text" 
                  placeholder={t('simulator.testZone.inputField')}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Test de précision */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">{t('simulator.testZone.precisionTest')}</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm">{t('simulator.testZone.checkbox')}</span>
                </label>
                <div className="flex gap-1">
                  <button className="w-6 h-6 bg-red-500 text-white text-xs rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">1</button>
                  <button className="w-6 h-6 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">2</button>
                  <button className="w-6 h-6 bg-green-500 text-white text-xs rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">3</button>
                </div>
                <p className="text-xs text-gray-500">{t('simulator.testZone.smallButtons')}</p>
              </div>
            </div>
          </div>
          
          {/* Instructions spécifiques */}
          {(settings.navigationClavier || settings.tremblements.enabled) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">{t('simulator.testZone.activeInstructions')}</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {settings.navigationClavier && (
                  <li dangerouslySetInnerHTML={{ __html: t('simulator.testZone.keyboardInstructions') }} />
                )}
                {settings.tremblements.enabled && (
                  <li dangerouslySetInnerHTML={{ __html: t('simulator.testZone.tremorsInstructions') }} />
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Styles globaux pour l'accessibilité mobile et les interactions */}
      <style jsx global>{`
        /* Sliders améliorés pour mobile */
        input[type="range"].slider-bar {
          background: linear-gradient(to right, #d1d5db 0%, #d1d5db 100%);
          height: 0.75rem;
          border-radius: 0.75rem;
          min-height: 44px; /* Touch target minimum */
          padding: 10px 0;
        }
        input[type="range"].slider-bar::-webkit-slider-runnable-track {
          background: #d1d5db;
          height: 0.75rem;
          border-radius: 0.75rem;
        }
        input[type="range"].slider-bar::-webkit-slider-thumb {
          background: #2563eb;
          border: 3px solid #fff;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          -webkit-appearance: none;
          appearance: none;
          margin-top: -0.5rem;
          cursor: pointer;
        }
        input[type="range"].slider-bar:focus::-webkit-slider-thumb {
          outline: 3px solid #2563eb;
          outline-offset: 3px;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.5);
        }
        input[type="range"].slider-bar::-moz-range-thumb {
          background: #2563eb;
          border: 3px solid #fff;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          cursor: pointer;
        }
        input[type="range"].slider-bar::-ms-thumb {
          background: #2563eb;
          border: 3px solid #fff;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          cursor: pointer;
        }
        input[type="range"].slider-bar::-ms-fill-lower {
          background: #d1d5db;
          border-radius: 0.75rem;
        }
        input[type="range"].slider-bar::-ms-fill-upper {
          background: #d1d5db;
          border-radius: 0.75rem;
        }
        input[type="range"].slider-bar:focus {
          outline: none;
        }
        
        /* Checkboxes améliorées pour mobile */
        input[type="checkbox"] {
          min-width: 20px;
          min-height: 20px;
          cursor: pointer;
        }
        
        /* Boutons radio améliorés pour mobile */
        input[type="radio"] {
          min-width: 18px;
          min-height: 18px;
          cursor: pointer;
        }
        
        /* Zones de touch étendues pour les labels */
        label.touch-manipulation {
          min-height: 44px;
          display: flex;
          align-items: center;
          cursor: pointer;
          -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1);
        }
        
        /* Focus visible amélioré */
        button:focus,
        input:focus,
        select:focus {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }
        
        /* Curseur normal pendant tremblements */
        body[style*="transform"] {
          cursor: default !important;
        }
        body[style*="transform"] * {
          cursor: default !important;
        }
        
        /* Support du safe area pour mobile */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .safe-area-inset-bottom {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </div>
  );
} 