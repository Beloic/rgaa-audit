import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, saveUser } from '@/lib/database';

// Configuration pour Vercel Pro - durée maximale pour les analyses complexes
export const maxDuration = 300; // 5 minutes
import type { AuditResult, RGAAViolation, EngineResult, ComparativeResult } from '@/types/audit';

// Types pour les plans de tarification
interface PlanLimits {
  auditsPerMonth: number | 'unlimited';
  teamMembers: number | 'unlimited';
  storage: number | 'unlimited';
  apiAccess: boolean;
  prioritySupport: boolean;
  customReports: boolean;
  whiteLabel: boolean;
}

// Configuration des plans
const PLAN_CONFIGS: Record<string, PlanLimits> = {
  free: {
    auditsPerMonth: 2,
    teamMembers: 1,
    storage: 1,
    apiAccess: false,
    prioritySupport: false,
    customReports: false,
    whiteLabel: false
  },
  pro: {
    auditsPerMonth: 50,
    teamMembers: 5,
    storage: 10,
    apiAccess: true,
    prioritySupport: true,
    customReports: true,
    whiteLabel: false
  },
  enterprise: {
    auditsPerMonth: 'unlimited',
    teamMembers: 'unlimited',
    storage: 'unlimited',
    apiAccess: true,
    prioritySupport: true,
    customReports: true,
    whiteLabel: true
  }
};

// Fonction pour récupérer les limites d'un plan
function getPlanLimits(planId: string): PlanLimits {
  return PLAN_CONFIGS[planId] || PLAN_CONFIGS.free;
}

interface WaveResults {
  errors: Array<{
    type: string;
    description: string;
    selector: string;
    context: string;
    raw_text?: string;
    severity?: string;
  }>;
  alerts: Array<{
    type: string;
    description: string;
    selector: string;
    context: string;
    raw_text?: string;
    severity?: string;
  }>;
  features: any[];
  summary: {
    errors: number;
    alerts: number;
    features: number;
  };
  raw_data: any;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Début de l\'analyse complète...');

    const { url, engine = 'wave', userData } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL manquante' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    // Vérifier les limites d'audit si un utilisateur est fourni (sauf pour les utilisateurs bêta)
    if (userData) {
      const { subscription, usage } = userData;
      
      // Les utilisateurs bêta ont un accès illimité
      const isBetaUser = userData.betaAccess?.granted && !userData.betaAccess?.hasQuit;
      
      if (!isBetaUser) {
        // Récupérer les limites du plan
        const planLimits = getPlanLimits(subscription?.plan || 'free');
        
        // Vérifier si l'utilisateur peut effectuer un audit
        if (planLimits.auditsPerMonth !== 'unlimited' && 
            usage.auditsThisMonth >= planLimits.auditsPerMonth) {
          return NextResponse.json(
            { error: 'Limite d\'audits atteinte pour ce mois. Passez à un plan supérieur pour continuer.' },
            { 
              status: 403,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              }
            }
          );
        }
        
        console.log(`👤 Audit pour utilisateur ${userData.email} - ${usage.auditsThisMonth + 1}/${planLimits.auditsPerMonth} audits ce mois`);
      } else {
        console.log(`👤 Audit pour utilisateur bêta ${userData.email} - Accès illimité ✅`);
      }
    }

    // Valider l'URL
    try {
      new URL(url);
    } catch (error) {
      return NextResponse.json(
        { error: 'URL invalide' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    // Si engine='all', lancer l'analyse comparative avec tous les moteurs
    if (engine === 'all') {
      const comparativeResult = await runComparativeAnalysis(url);
      
      // Incrémenter le compteur d'audits pour l'analyse comparative (sauf pour les utilisateurs bêta)
      let updatedUserData = null;
      if (userData) {
        const isBetaUser = userData.betaAccess?.granted && !userData.betaAccess?.hasQuit;
        
        if (!isBetaUser) {
          updatedUserData = {
            ...userData,
            usage: {
              ...userData.usage,
              auditsThisMonth: userData.usage.auditsThisMonth + 1,
              auditsTotal: userData.usage.auditsTotal + 1,
              lastAuditDate: new Date().toISOString()
            }
          };
          
          // Sauvegarder dans la base de données si en mode API
          const USE_API = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_USE_API === 'true';
          if (USE_API) {
            try {
              saveUser(updatedUserData);
              console.log(`💾 Données utilisateur sauvegardées en base pour ${userData.email}`);
            } catch (error) {
              console.warn(`⚠️ Erreur sauvegarde base de données pour ${userData.email}:`, error);
            }
          }
          
          console.log(`✅ Audit comparatif comptabilisé pour ${userData.email}: ${updatedUserData.usage.auditsThisMonth}/${getPlanLimits(userData.subscription?.plan || 'free').auditsPerMonth}`);
        } else {
          // Pour les utilisateurs bêta, on ne change pas les données d'usage
          updatedUserData = userData;
          console.log(`✅ Audit comparatif pour utilisateur bêta ${userData.email} - Non comptabilisé (accès illimité)`);
        }
      }
      
      return NextResponse.json({ 
        ...comparativeResult, 
        updatedUserData 
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    // Analyse avec un seul moteur (comportement existant)
    const violations = engine === 'axe' 
      ? await launchAxeAnalysis(url)
      : engine === 'rgaa'
      ? await launchRGAAAnalysis(url)
      : await launchWaveAnalysis(url);
    
    // Calculer les métriques
    const totalViolations = violations.length;
    const score = engine === 'axe' 
      ? calculateScoreFromAxe(violations)
      : engine === 'rgaa'
      ? calculateScoreFromRGAA(violations)
      : calculateScoreFromWave(violations);
    const impactGroups = groupByImpact(violations);
    const levelGroups = groupByLevel(violations);
    const summary = generateSummary(violations, engine);
    
    const result: AuditResult = {
      url,
      timestamp: new Date(),
      totalViolations,
      score,
      violations,
      summary,
      violationsByImpact: impactGroups,
      violationsByLevel: levelGroups,
      engine,
      // URL du rapport WAVE web pour consultation visuelle
      waveReportUrl: engine === 'wave' ? `https://wave.webaim.org/report#/${encodeURIComponent(url)}` : undefined
    };

    // Incrémenter le compteur d'audits si un utilisateur est fourni (sauf pour les utilisateurs bêta)
    let updatedUserData = null;
    if (userData) {
      const isBetaUser = userData.betaAccess?.granted && !userData.betaAccess?.hasQuit;
      
      if (!isBetaUser) {
        updatedUserData = {
          ...userData,
          usage: {
            ...userData.usage,
            auditsThisMonth: userData.usage.auditsThisMonth + 1,
            auditsTotal: userData.usage.auditsTotal + 1,
            lastAuditDate: new Date().toISOString()
          }
        };
        
        // Sauvegarder dans la base de données si en mode API
        const USE_API = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_USE_API === 'true';
        if (USE_API) {
          try {
            saveUser(updatedUserData);
            console.log(`💾 Données utilisateur sauvegardées en base pour ${userData.email}`);
          } catch (error) {
            console.warn(`⚠️ Erreur sauvegarde base de données pour ${userData.email}:`, error);
          }
        }
        
        console.log(`✅ Audit comptabilisé pour ${userData.email}: ${updatedUserData.usage.auditsThisMonth}/${getPlanLimits(userData.subscription?.plan || 'free').auditsPerMonth}`);
      } else {
        // Pour les utilisateurs bêta, on ne change pas les données d'usage
        updatedUserData = userData;
        console.log(`✅ Audit pour utilisateur bêta ${userData.email} - Non comptabilisé (accès illimité)`);
      }
    }

    return NextResponse.json({ 
      ...result, 
      updatedUserData 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
    
      } catch (error) {
    console.error('❌ Erreur dans l\'API:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'analyse. Veuillez vérifier que l\'URL est accessible.',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

// Nouvelle fonction pour lancer l'analyse comparative avec tous les moteurs
async function runComparativeAnalysis(url: string): Promise<ComparativeResult> {
  console.log('🔄 Lancement de l\'analyse comparative avec tous les moteurs...');
  
  const engines: ('wave' | 'axe' | 'rgaa')[] = ['rgaa', 'axe', 'wave'];
  const engineResults: EngineResult[] = [];
  
  // Lancer les analyses en parallèle pour gagner du temps
  const analysisPromises = engines.map(async (engineName) => {
    const startTime = Date.now();
    console.log(`🚀 Lancement de ${engineName.toUpperCase()}...`);
    
    try {
      let violations: RGAAViolation[];
      
      switch (engineName) {
        case 'rgaa':
          violations = await launchRGAAAnalysis(url);
          break;
        case 'axe':
          violations = await launchAxeAnalysis(url);
          break;
        case 'wave':
          violations = await launchWaveAnalysis(url);
          break;
        default:
          throw new Error(`Moteur inconnu: ${engineName}`);
      }
      
      const analysisTime = Date.now() - startTime;
      
      // Calculer les métriques pour ce moteur
      const totalViolations = violations.length;
      const score = engineName === 'axe' 
        ? calculateScoreFromAxe(violations)
        : engineName === 'rgaa'
        ? calculateScoreFromRGAA(violations)
        : calculateScoreFromWave(violations);
      const impactGroups = groupByImpact(violations);
      const levelGroups = groupByLevel(violations);
      const summary = generateSummary(violations, engineName);
    
    const result: AuditResult = {
        url,
        timestamp: new Date(),
        totalViolations,
      score,
        violations,
        summary,
        violationsByImpact: impactGroups,
        violationsByLevel: levelGroups,
        engine: engineName,
        // URL du rapport WAVE web pour consultation visuelle
        waveReportUrl: engineName === 'wave' ? `https://wave.webaim.org/report#/${encodeURIComponent(url)}` : undefined
      };
      
      console.log(`✅ ${engineName.toUpperCase()} terminé: ${violations.length} violations, score: ${score}/100, temps: ${analysisTime}ms`);
      
      return {
        engine: engineName,
        result,
        analysisTime,
        success: true
      };
    
  } catch (error) {
      const analysisTime = Date.now() - startTime;
      console.error(`❌ Erreur ${engineName.toUpperCase()}:`, error);
      
      return {
        engine: engineName,
        result: {
          url,
          timestamp: new Date(),
          totalViolations: 0,
          score: 0,
          violations: [],
          summary: `Erreur lors de l'analyse ${engineName.toUpperCase()}`,
          violationsByImpact: { low: 0, medium: 0, high: 0, critical: 0 },
          violationsByLevel: { A: 0, AA: 0, AAA: 0 },
          engine: engineName
        },
        analysisTime,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  });
  
  // Attendre que toutes les analyses se terminent
  const results = await Promise.all(analysisPromises);
  
  // Analyser les résultats pour créer le rapport comparatif
  const successfulResults = results.filter(r => r.success);
  const allViolations = successfulResults.flatMap(r => r.result.violations);
  
  // Identifier les violations communes et spécifiques
  const commonViolations = findCommonViolations(successfulResults);
  const engineSpecificViolations = {
    wave: results.find(r => r.engine === 'wave')?.result.violations || [],
    axe: results.find(r => r.engine === 'axe')?.result.violations || [],
    rgaa: results.find(r => r.engine === 'rgaa')?.result.violations || []
  };
  
  // Calculer les métriques du résumé
  const scores = successfulResults.map(r => r.result.score);
  const bestScore = Math.max(...scores);
  const worstScore = Math.min(...scores);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Déterminer le moteur le plus fiable (celui qui trouve le plus de violations communes)
  const mostReliableEngine = determineMostReliableEngine(successfulResults, commonViolations);
  
  // Calculer le niveau de consensus
  const consensusLevel = calculateConsensusLevel(successfulResults, commonViolations);
  
  const comparativeResult: ComparativeResult = {
    url,
    timestamp: new Date(),
    engines: results,
    totalUniqueViolations: removeDuplicateViolations(allViolations).length,
    commonViolations,
    engineSpecificViolations,
    summary: {
      bestScore,
      worstScore,
      averageScore: Math.round(averageScore),
      mostReliableEngine,
      consensusLevel
    }
  };
  
  console.log('🎉 Analyse comparative terminée!');
  console.log(`📊 Résumé: ${successfulResults.length}/${engines.length} moteurs réussis`);
  console.log(`🔍 Violations: ${comparativeResult.totalUniqueViolations} uniques, ${commonViolations.length} communes`);
  console.log(`📈 Scores: ${worstScore}-${bestScore} (moyenne: ${Math.round(averageScore)})`);
  
  return comparativeResult;
}

// Fonctions utilitaires pour l'analyse comparative
function findCommonViolations(results: EngineResult[]): RGAAViolation[] {
  if (results.length < 2) return [];
  
  const [first, ...others] = results;
  const commonViolations: RGAAViolation[] = [];
  
  first.result.violations.forEach(violation => {
    const isCommon = others.every(otherResult => 
      otherResult.result.violations.some(otherViolation => 
        violationsAreSimilar(violation, otherViolation)
      )
    );
    
    if (isCommon) {
      commonViolations.push(violation);
    }
  });
  
  return commonViolations;
}

function violationsAreSimilar(v1: RGAAViolation, v2: RGAAViolation): boolean {
  // Considérer les violations comme similaires si elles ont le même critère et niveau
  return v1.criterion === v2.criterion && v1.level === v2.level;
}

function removeDuplicateViolations(violations: RGAAViolation[]): RGAAViolation[] {
  const seen = new Set();
  return violations.filter(violation => {
    const key = `${violation.criterion}-${violation.level}-${violation.description}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function determineMostReliableEngine(results: EngineResult[], commonViolations: RGAAViolation[]): 'wave' | 'axe' | 'rgaa' {
  let bestEngine: 'wave' | 'axe' | 'rgaa' = 'rgaa';
  let bestScore = 0;
  
  results.forEach(result => {
    const commonFound = result.result.violations.filter(violation => 
      commonViolations.some(common => violationsAreSimilar(violation, common))
    ).length;
    
    const reliability = commonFound / Math.max(1, result.result.violations.length);
    
    if (reliability > bestScore) {
      bestScore = reliability;
      bestEngine = result.engine;
    }
  });
  
  return bestEngine;
}

function calculateConsensusLevel(results: EngineResult[], commonViolations: RGAAViolation[]): number {
  const totalViolations = results.reduce((sum, result) => sum + result.result.violations.length, 0);
  if (totalViolations === 0) return 100;
  
  const consensusScore = (commonViolations.length * results.length) / totalViolations;
  return Math.round(Math.min(100, consensusScore * 100));
}

// Gérer les requêtes OPTIONS pour CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Fonction pour lancer l'analyse WAVE avec Puppeteer (intégrée)
async function launchWaveAnalysis(url: string): Promise<RGAAViolation[]> {
  console.log(`🌊 Lancement de WAVE via le site web avec l'URL: ${url}`);

  try {
    // Import dynamique de Puppeteer-core et Chromium pour Vercel
    const puppeteer = await import('puppeteer-core');
    const chromium = await import('@sparticuz/chromium-min');
    
    let browser;
    let isConnectedToExisting = false;
    
    // User agents aléatoires pour éviter la détection
    const userAgents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
    ];
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    // Configuration simplifiée pour macOS avec gestion robuste des erreurs
    console.log(`📱 Lancement d'une nouvelle instance Chrome pour WAVE...`);
    
    // Détecter l'environnement (local vs production)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    const isMacOS = process.platform === 'darwin';
    
    // URL du package Chromium pour Vercel
    const chromiumPack = "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";
    
    try {
      let launchConfig: any;
      
      if (isProduction) {
        // Configuration Vercel avec chromium-min
        console.log(`🏗️ Configuration Vercel avec chromium-min...`);
        launchConfig = {
          args: chromium.default.args,
          executablePath: await chromium.default.executablePath(chromiumPack),
          headless: true,
          protocolTimeout: 300000, // 5 minutes pour éviter les timeouts
          defaultViewport: { width: 1920, height: 1080 }
        };
      } else {
        // Configuration locale - Chrome visible pour WAVE
        console.log(`🏠 Configuration locale pour développement (mode visible)...`);
        launchConfig = {
          headless: false, // TOUJOURS visible en local pour WAVE
          protocolTimeout: 300000, // 5 minutes au lieu du défaut (30 secondes)
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--allow-running-insecure-content',
            '--disable-blink-features=AutomationControlled',
            '--exclude-switches=enable-automation',
            '--user-agent=' + randomUserAgent,
            '--new-window', // Ouvrir dans une nouvelle fenêtre
            '--start-maximized' // Démarrer maximisé pour une meilleure visibilité
          ],
          defaultViewport: null,
          ignoreDefaultArgs: ['--enable-automation', '--enable-blink-features=AutomationControlled'],
          timeout: 60000 // Augmenté à 60 secondes
        };

        // Ajouter le chemin explicite sur macOS
        if (isMacOS) {
          launchConfig.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        }
      }

      browser = await puppeteer.default.launch(launchConfig);
      isConnectedToExisting = false;
      console.log(`✅ Chrome lancé avec succès pour WAVE! (${isProduction ? 'production/Vercel' : 'local'}, ${process.platform})`);
      
    } catch (launchError) {
      console.log(`⚠️ Échec du lancement, essai avec configuration minimale...`, launchError);
      
      // Fallback : configuration ultra-minimale
      browser = await puppeteer.default.launch({
        headless: true,
        protocolTimeout: 300000, // 5 minutes même en fallback
        args: isProduction ? chromium.default.args : [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-dev-shm-usage'
        ],
        executablePath: isProduction ? await chromium.default.executablePath(chromiumPack) : undefined,
        defaultViewport: null,
        timeout: 60000 // Augmenté à 60 secondes
      });
      console.log(`✅ Chrome lancé en mode fallback pour WAVE!`);
    }

    const page = await browser.newPage();
    
    // Configurer des timeouts plus longs pour éviter les erreurs de protocole
    await page.setDefaultTimeout(120000); // 2 minutes pour les sélecteurs
    await page.setDefaultNavigationTimeout(120000); // 2 minutes pour la navigation
    
    // Anti-détection simplifié pour éviter les erreurs
    await page.evaluateOnNewDocument(() => {
      // Masquer seulement les traces principales d'automation
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
        configurable: true
      });
    });
    
    // User agent personnalisé
    await page.setUserAgent(randomUserAgent);
    
    // Viewport aléatoire pour paraître naturel
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1536, height: 864 },
      { width: 1280, height: 800 }
    ];
    const randomViewport = viewports[Math.floor(Math.random() * viewports.length)];
    await page.setViewport(randomViewport);
    
    // Headers HTTP ultra-réalistes
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'sec-ch-ua': '"Google Chrome";v="120", "Chromium";v="120", "Not=A?Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"'
    });
    
    // Fonctions pour simuler un comportement ultra-humain
    const humanDelay = () => Math.random() * 300 + 150; // Entre 150-450ms
    const randomMove = async () => {
      const x = Math.random() * randomViewport.width;
      const y = Math.random() * randomViewport.height;
      await page.mouse.move(x, y, { 
        steps: Math.floor(Math.random() * 7) + 2 // 2-8 étapes pour le mouvement
      });
    };
    
    // Simulation de scroll aléatoire (comportement humain)
    const randomScroll = async () => {
      await page.evaluate(() => {
        window.scrollTo(0, Math.random() * 200);
      });
    };
    
    // Naviguer vers WAVE avec gestion d'erreur robuste
    console.log(`📄 Ouverture du site WAVE...`);
    await randomMove();
    
    try {
      await page.goto('https://wave.webaim.org/', { 
        waitUntil: 'networkidle0',
        timeout: 45000 
      });
      console.log(`✅ Site WAVE chargé avec succès`);
    } catch (navError) {
      console.log(`⚠️ Erreur de navigation vers WAVE, nouvelle tentative...`);
      await page.goto('https://wave.webaim.org/', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
    }

    // Simulation d'un utilisateur qui lit la page
    await new Promise(resolve => setTimeout(resolve, humanDelay()));
    await randomMove();
    await randomScroll();
    await new Promise(resolve => setTimeout(resolve, humanDelay()));

    console.log('✅ Site WAVE chargé. Saisie de l\'URL...');
    
    // Attendre le champ URL avec patience humaine
    await page.waitForSelector('input[name="url"], input#url, input[type="url"]', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, humanDelay()));
    
    // Saisie directe de l'URL utilisateur
    const urlInput = await page.$('input[name="url"], input#url, input[type="url"]');
    if (urlInput) {
      console.log(`🔗 Saisie directe de l'URL: ${url}`);
      
      // Mouvement précis vers l'input
      const inputBox = await urlInput.boundingBox();
      if (inputBox) {
        await page.mouse.move(
          inputBox.x + inputBox.width / 2 + Math.random() * 20 - 10, 
          inputBox.y + inputBox.height / 2 + Math.random() * 10 - 5,
          { steps: Math.floor(Math.random() * 5) + 3 }
        );
        await new Promise(resolve => setTimeout(resolve, humanDelay()));
      }
      
      await urlInput.click();
      await new Promise(resolve => setTimeout(resolve, humanDelay()));
      
      // Sélection et remplacement ultra-naturels
      await page.keyboard.down('Control');
      await page.keyboard.press('a');
      await page.keyboard.up('Control');
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
      await page.keyboard.press('Backspace');
      await new Promise(resolve => setTimeout(resolve, humanDelay()));
      
      // Saisir directement l'URL demandée
      for (const char of url) {
        await page.keyboard.type(char);
        const charDelay = Math.random() * 100 + 30;
        await new Promise(resolve => setTimeout(resolve, charDelay));
      }
      
      console.log(`✅ URL saisie: ${url}`);
      await new Promise(resolve => setTimeout(resolve, humanDelay()))
    } else {
      throw new Error('Champ URL non trouvé sur le site WAVE');
    }
    
    // Clic ultra-humain sur le bouton final
    console.log('🔍 Lancement de l\'analyse finale...');
    await randomMove();
    await new Promise(resolve => setTimeout(resolve, humanDelay()));
    
    const submitButtonFinal = await page.$('input[type="submit"], button[type="submit"], .submit-button');
    if (submitButtonFinal) {
      const buttonBox = await submitButtonFinal.boundingBox();
      if (buttonBox) {
        await page.mouse.move(
          buttonBox.x + buttonBox.width / 2 + Math.random() * 10 - 5,
          buttonBox.y + buttonBox.height / 2 + Math.random() * 6 - 3,
          { steps: Math.floor(Math.random() * 4) + 2 }
        );
        await new Promise(resolve => setTimeout(resolve, humanDelay()));
      }
      await submitButtonFinal.click();
    } else {
      await page.keyboard.press('Enter');
    }
    
    await new Promise(resolve => setTimeout(resolve, humanDelay()));

    // Attendre que l'analyse se termine (attendre les résultats)
    console.log('⏳ Attente des résultats d\'analyse...');
    try {
      // Attendre soit la page de résultats, soit les éléments de résultats
      await page.waitForSelector('.summary, #summary, .wave-summary, .results', { timeout: 180000 }); // 3 minutes
      console.log('✅ Résultats d\'analyse chargés!');
      } catch (error) {
      console.log('⚠️ Timeout atteint, tentative de récupération des résultats disponibles...');
    }

    // Attendre la disparition du spinner central (jusqu'à 3 minutes)
    let spinnerDisappeared = false;
    try {
      await page.waitForSelector('.fa-spinner, .spinner, .fa-spin', { hidden: true, timeout: 180000 });
      console.log('✅ Spinner disparu, analyse terminée !');
      spinnerDisappeared = true;
    } catch (e) {
      console.log('⚠️ Spinner toujours présent après 3 minutes, extraction des données disponibles...');
    }

    // Attendre un peu plus pour que tous les éléments se chargent
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Vérifier si l'analyse est vraiment terminée en cherchant des indicateurs
    console.log('🔍 Vérification que l\'analyse WAVE est terminée...');
    let analysisComplete = false;
    let retryCount = 0;
    const maxRetries = spinnerDisappeared ? 5 : 20; // Si spinner disparu, moins d'attente
    let hasFoundErrorMessage = false;
    
    while (!analysisComplete && retryCount < maxRetries) {
      const pageContent = await page.content();
      const pageText = await page.evaluate(() => document.body.textContent || '');
      
      // Vérifier qu'il n'y a pas de message d'erreur "Please provide a valid URL"
      const hasErrorMessage = pageText.includes('Please provide a valid URL') || 
                             (pageText.includes('Error') && pageText.includes('valid URL'));
      
      if (hasErrorMessage) {
        hasFoundErrorMessage = true;
      }
      
      // Vérifier plusieurs indicateurs que l'analyse est terminée
      const hasResults = (pageText.includes('error') || pageText.includes('alert') || 
                         pageText.includes('Error') || pageText.includes('Alert') ||
                         pageContent.includes('wave-') || pageContent.includes('icon') ||
                         pageText.includes('No errors') || pageText.includes('No alerts')) &&
                         !hasErrorMessage; // Mais pas de message d'erreur
      
      const hasDetailedResults = (pageContent.includes('Details') || 
                                 pageContent.includes('Reference') ||
                                 pageText.includes('Details') ||
                                 pageText.includes('Reference')) &&
                                 !hasErrorMessage;
      
      // L'URL a changé vers la page de résultats
      const currentUrl = page.url();
      const isResultsPage = currentUrl.includes('wave.webaim.org/report') || 
                           currentUrl !== 'https://wave.webaim.org/';
      
      console.log(`🔍 Vérification ${retryCount + 1}/${maxRetries}: URL=${currentUrl}, Résultats=${hasResults}, Détails=${hasDetailedResults}, Erreur=${hasErrorMessage}`);
      
      // Si le spinner a disparu ET qu'on est sur une page de résultats, considérer comme terminé
      if (spinnerDisappeared && isResultsPage) {
        analysisComplete = true;
        console.log('✅ Analyse WAVE confirmée comme terminée (spinner disparu) !');
        break;
      }
      
      if (isResultsPage && (hasResults || hasDetailedResults)) {
        analysisComplete = true;
        console.log('✅ Analyse WAVE confirmée comme terminée!');
    } else {
        const waitTime = spinnerDisappeared ? 3000 : 8000; // Attente plus courte si spinner disparu
        console.log(`⏳ Analyse en cours, attente de ${waitTime/1000} secondes...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retryCount++;
      }
    }
    
    // Seulement lever une erreur si on n'a jamais eu de résultats ET qu'on a trouvé une erreur ET que le spinner n'a pas disparu
    if (!analysisComplete && hasFoundErrorMessage && !spinnerDisappeared) {
      console.error('❌ WAVE a retourné une erreur persistante : URL invalide ou inaccessible');
      throw new Error('WAVE n\'a pas pu analyser cette URL. Vérifiez que l\'URL est correcte et accessible depuis internet.');
    }
    
    // Attendre plus longtemps pour s'assurer que tout est chargé et que l'analyse est vraiment complète
    await new Promise(resolve => setTimeout(resolve, 8000));

    // Extraire les résultats de la page WAVE
    const waveResults = await page.evaluate((): WaveResults => {
      const results: WaveResults = {
        errors: [],
        alerts: [],
        features: [],
        summary: {
          errors: 0,
          alerts: 0,
          features: 0
        },
        raw_data: {}
      };
      
      try {
        console.log('🔍 Extraction des données WAVE - Structure réelle WAVE...');
        
        // 1. Debug info
        const currentUrl = window.location.href;
        const pageTitle = document.title;
        console.log('URL actuelle:', currentUrl);
        console.log('Titre de la page:', pageTitle);
        
        // 2. WAVE utilise des icônes et structures spécifiques - cherchons les vraies classes et IDs
        let errorsCount = 0;
        let alertsCount = 0;
        let featuresCount = 0;
        let violationsDetails: Array<{
          type: string;
          description: string;
          selector: string;
          context: string;
          raw_text: string;
          severity: string;
        }> = [];
        
        // Méthode spécifique WAVE: les résultats sont dans des tableaux ou listes avec des icônes
        // Chercher les éléments qui contiennent les icônes WAVE (rouge, jaune, vert)
        const allElements = document.querySelectorAll('*');
        let fullPageText = document.body.textContent || '';
        
        console.log('Contenu de la page (premiers 500 caractères):', fullPageText.substring(0, 500));
        
        // Méthode robuste: parser tout le contenu de la page
        // WAVE affiche généralement les résultats sous forme de :
        // "X errors", "Y alerts", "Z features"
        const errorRegex = /(\d+)\s*error[s]?/gi;
        const alertRegex = /(\d+)\s*alert[s]?/gi;
        const featureRegex = /(\d+)\s*feature[s]?/gi;
        
        const errorMatches = [...fullPageText.matchAll(errorRegex)];
        const alertMatches = [...fullPageText.matchAll(alertRegex)];
        const featureMatches = [...fullPageText.matchAll(featureRegex)];
        
        // Prendre le plus grand nombre trouvé (généralement le résumé principal)
        if (errorMatches.length > 0) {
          errorsCount = Math.max(...errorMatches.map(match => parseInt(match[1])));
        }
        if (alertMatches.length > 0) {
          alertsCount = Math.max(...alertMatches.map(match => parseInt(match[1])));
        }
        if (featureMatches.length > 0) {
          featuresCount = Math.max(...featureMatches.map(match => parseInt(match[1])));
        }
        
        console.log(`Compteurs WAVE trouvés: ${errorsCount} erreurs, ${alertsCount} alertes, ${featuresCount} fonctionnalités`);
        
        // 3. Extraire les détails des violations en cherchant les descriptions réelles
        // WAVE affiche généralement les violations dans des tableaux ou des listes
        const possibleViolationElements = document.querySelectorAll('td, li, .violation, .error, .alert, [class*="wave"], [id*="wave"]');
        
        possibleViolationElements.forEach((element, index) => {
          const text = element.textContent?.trim() || '';
          const html = element.innerHTML || '';
          
          // Filtrer les textes qui ressemblent à des descriptions de violations
          if (text.length > 10 && text.length < 200 && 
              !text.includes('WAVE') && 
              !text.includes('©') &&
              !text.includes('WebAIM') &&
              !text.match(/^\d+$/) && // Pas juste un chiffre
              !text.includes('http')) { // Pas une URL
            
            // Vérifier si c'est probablement une violation d'accessibilité
            const violationKeywords = [
              'alt', 'label', 'heading', 'contrast', 'link', 'button', 
              'missing', 'empty', 'duplicate', 'invalid', 'color',
              'text', 'image', 'form', 'table', 'language', 'title',
              'focus', 'aria', 'role', 'landmark', 'skip', 'navigation'
            ];
            
            const hasViolationKeyword = violationKeywords.some(keyword => 
              text.toLowerCase().includes(keyword)
            );
            
            if (hasViolationKeyword) {
              // Déterminer le type en regardant le contexte parent
              const parentElement = element.parentElement;
              const parentClass = parentElement?.className || '';
              const parentText = parentElement?.textContent || '';
              
              let isError = false;
              let isAlert = false;
              
              // Chercher des indicateurs visuels (classes CSS, couleurs, icônes)
              if (parentClass.includes('error') || parentText.includes('error') || 
                  html.includes('red') || html.includes('error')) {
                isError = true;
              } else if (parentClass.includes('alert') || parentText.includes('alert') || 
                        html.includes('yellow') || html.includes('alert') || html.includes('warning')) {
                isAlert = true;
              } else {
                // Par défaut, considérer comme erreur si contient certains mots-clés critiques
                const criticalKeywords = ['missing', 'empty', 'duplicate', 'invalid'];
                isError = criticalKeywords.some(keyword => text.toLowerCase().includes(keyword));
                isAlert = !isError;
              }
              
              const violation = {
                type: text.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
                description: text,
                selector: element.tagName.toLowerCase() + (element.className ? '.' + element.className.split(' ')[0] : ''),
                context: html.substring(0, 200),
                raw_text: text,
                severity: isError ? 'error' : 'alert'
              };
              
              violationsDetails.push(violation);
            }
          }
        });
        
        // 4. Répartir les violations trouvées entre erreurs et alertes
        const foundErrors = violationsDetails.filter(v => v.severity === 'error');
        const foundAlerts = violationsDetails.filter(v => v.severity === 'alert');
        
        // Prendre les violations trouvées ou créer des génériques si on a les compteurs mais pas les détails
        results.errors = foundErrors.slice(0, errorsCount);
        results.alerts = foundAlerts.slice(0, alertsCount);
        
        // Si on a des compteurs mais pas assez de détails, compléter avec des violations génériques
        while (results.errors.length < errorsCount) {
          (results.errors as any[]).push({
            type: 'wave_accessibility_error',
            description: `Erreur d'accessibilité ${results.errors.length + 1} détectée par WAVE (voir rapport visuel pour détails)`,
            selector: `wave-error-${results.errors.length + 1}`,
            context: 'Analysé par WAVE - ouvrir Chrome pour voir les détails complets',
            raw_text: `Violation WAVE erreur #${results.errors.length + 1}`,
            severity: 'error'
          });
        }
        
        while (results.alerts.length < alertsCount) {
          (results.alerts as any[]).push({
            type: 'wave_accessibility_alert',
            description: `Alerte d'accessibilité ${results.alerts.length + 1} détectée par WAVE (voir rapport visuel pour détails)`,
            selector: `wave-alert-${results.alerts.length + 1}`,
            context: 'Analysé par WAVE - ouvrir Chrome pour voir les détails complets',
            raw_text: `Violation WAVE alerte #${results.alerts.length + 1}`,
            severity: 'alert'
          });
        }
        
        results.summary = {
          errors: errorsCount,
          alerts: alertsCount,
          features: featuresCount
        };
        
        // Informations de debug
        results.raw_data = {
          url: currentUrl,
          title: pageTitle,
          contentLength: fullPageText.length,
          violationsFound: violationsDetails.length,
          errorsExtracted: results.errors.length,
          alertsExtracted: results.alerts.length,
          sampleContent: fullPageText.substring(0, 200)
        };
        
        console.log(`✅ Extraction terminée: ${results.errors.length} erreurs, ${results.alerts.length} alertes extraites`);
        console.log(`📊 Détails trouvés: ${violationsDetails.length} violations avec descriptions`);
        
      } catch (error) {
        console.error('Erreur lors de l\'extraction des résultats WAVE:', error);
        results.raw_data = { error: error instanceof Error ? error.message : String(error) };
      }
      
      return results;
    });

    console.log(`🎉 Analyse WAVE terminée!`);
    const summary = waveResults.summary as any;
    const errors = waveResults.errors as any[];
    const alerts = waveResults.alerts as any[];
    
    console.log(`📊 Compteurs WAVE: ${summary?.errors || 0} erreurs, ${summary?.alerts || 0} alertes, ${summary?.features || 0} fonctionnalités`);
    console.log(`📋 Détails extraits: ${errors?.length || 0} erreurs détaillées, ${alerts?.length || 0} alertes détaillées`);
    console.log(`🔍 Total violations à remonter: ${(errors?.length || 0) + (alerts?.length || 0)}`);
    
    // Afficher un échantillon des violations trouvées
    if (errors && errors.length > 0) {
      console.log(`📝 Exemple d'erreur: "${errors[0].description?.substring(0, 100) || 'Description non disponible'}..."`);
    }
    if (alerts && alerts.length > 0) {
      console.log(`📝 Exemple d'alerte: "${alerts[0].description?.substring(0, 100) || 'Description non disponible'}..."`);
    }
    
    // Vérification de cohérence : si on n'a trouvé aucune violation mais que la page semble valide, 
    // essayer une dernière extraction
    const totalViolations = (summary?.errors || 0) + (summary?.alerts || 0);
    if (totalViolations === 0) {
      console.log('🔍 Aucune violation détectée - vérification si c\'est correct ou si extraction a échoué...');
      
      // Essayer une extraction simplifiée
      const fallbackResults = await page.evaluate(() => {
        const text = document.body.textContent || '';
        const hasErrorText = text.includes('error') || text.includes('Error');
        const hasAlertText = text.includes('alert') || text.includes('Alert') || text.includes('warning');
        
        return {
          pageText: text.substring(0, 1000),
          hasErrorIndicators: hasErrorText,
          hasAlertIndicators: hasAlertText,
          url: window.location.href
        };
      });
      
      console.log('🔍 Vérification fallback:', {
        hasErrors: fallbackResults.hasErrorIndicators,
        hasAlerts: fallbackResults.hasAlertIndicators,
        url: fallbackResults.url,
        textSample: fallbackResults.pageText.substring(0, 200)
      });
    }
    
    console.log(`🌐 Le rapport WAVE reste ouvert dans Chrome pour consultation manuelle.`);
    
    // Convertir les résultats WAVE en format RGAA
    const violations = parseWaveResults(JSON.stringify(waveResults));
    
    // Laisser l'onglet/navigateur ouvert pour consultation manuelle
    if (!isProduction) {
      console.log(`📋 ✨ Rapport WAVE visible dans la fenêtre Chrome ouverte pour consultation détaillée!`);
      console.log(`🔍 Vous pouvez maintenant consulter le rapport complet dans Chrome.`);
    } else {
      console.log(`📋 Rapport WAVE généré (mode production - pas d'interface visuelle).`);
    }
    
    return violations;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse WAVE:', error);
    console.log('⚠️ L\'analyse WAVE a échoué, mais l\'application continuera avec les autres moteurs d\'analyse');
    
    // Retourner un tableau vide au lieu de faire planter l'application
    // L'analyse comparative utilisera seulement Axe et RGAA
    return [];
  }
}

// Fonction pour lancer l'analyse Axe Core
async function launchAxeAnalysis(url: string): Promise<RGAAViolation[]> {
  console.log(`🔧 Lancement d'Axe Core pour l'URL: ${url}`);

  try {
    // Vérifier l'URL avant de commencer
    if (!url || !url.startsWith('http')) {
      throw new Error(`URL invalide: ${url}`);
    }

    // Import dynamique de Puppeteer-core et Chromium pour Axe Core
    const puppeteer = await import('puppeteer-core');
    const chromium = await import('@sparticuz/chromium-min');
    
    // Détecter l'environnement
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    const chromiumPack = "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";
    
    // Lancer directement une instance headless pour Axe Core
    console.log(`🚀 Lancement d'une instance Chrome headless pour Axe Core...`);
    
    let browser;
    if (isProduction) {
      // Configuration Vercel
      browser = await puppeteer.default.launch({
        args: chromium.default.args,
        executablePath: await chromium.default.executablePath(chromiumPack),
        headless: true,
        defaultViewport: { width: 1920, height: 1080 }
      });
    } else {
      // Configuration locale
      browser = await puppeteer.default.launch({
        headless: true, // Toujours headless pour Axe Core
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--allow-running-insecure-content',
          '--disable-features=VizDisplayCompositor',
          '--ignore-certificate-errors'
        ],
        ...(process.platform === 'darwin' ? { 
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' 
        } : {})
      });
    }
    console.log(`✅ Instance Chrome headless lancée pour Axe Core!`);

    const page = await browser.newPage();
    
    // Configurer la page pour éviter les blocages
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Cache-Control': 'no-cache'
    });

    // Variables pour diagnostics
    let pageLoaded = false;
    let axeInjected = false;
    let analysisCompleted = false;
    let finalUrl = '';
    let pageTitle = '';
    let errorDetails = '';

    try {
      // Naviguer vers l'URL cible avec timeout plus long
      console.log(`📄 Navigation vers: ${url}`);
      const response = await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 45000 // Timeout plus long
      });

      finalUrl = page.url();
      pageTitle = await page.title().catch(() => 'Titre non disponible');
      
      console.log(`📍 URL finale: ${finalUrl}`);
      console.log(`📝 Titre de la page: ${pageTitle}`);

      // Vérifier si la page s'est chargée correctement
      if (!response || !response.ok()) {
        const status = response?.status() || 'inconnu';
        throw new Error(`Échec de chargement de la page (HTTP ${status})`);
      }

      pageLoaded = true;
      console.log(`✅ Page chargée avec succès (${response.status()})`);

             // Attendre que la page soit entièrement rendue
       await new Promise(resolve => setTimeout(resolve, 2000));

      // Vérifier si la page contient du contenu analysable
      const bodyContent = await page.evaluate(() => {
        return document.body ? document.body.innerText.length : 0;
      });

      console.log(`📏 Contenu de la page: ${bodyContent} caractères`);

      if (bodyContent < 100) {
        console.log(`⚠️ Contenu limité détecté (${bodyContent} caractères)`);
      }

      // Injecter axe-core et exécuter l'analyse
      console.log(`🔍 Injection d'Axe Core et lancement de l'analyse...`);
      
      try {
        // Injecter Axe Core avec gestion d'erreur
        await page.addScriptTag({
          url: 'https://unpkg.com/axe-core@latest/axe.min.js'
        });
        axeInjected = true;
        console.log(`✅ Axe Core injecté avec succès`);
        
                 // Attendre un peu pour s'assurer qu'Axe est prêt
         await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (injectError) {
        console.log(`⚠️ Échec injection CDN, essai avec version locale...`);
        // Fallback : injecter le contenu d'axe-core directement
        await page.evaluate(() => {
          // Version simplifiée d'Axe pour les cas d'urgence
          (window as any).axe = {
            run: (callback: Function) => {
              // Analyse basique sans Axe Core complet
              const violations: any[] = [];
              
              // Vérifications basiques
              const images = document.querySelectorAll('img:not([alt])');
              images.forEach((img, index) => {
                violations.push({
                  id: 'image-alt',
                  impact: 'critical',
                  description: 'Image sans attribut alt',
                  help: 'Les images doivent avoir un attribut alt',
                  nodes: [{
                    target: [`img:nth-child(${index + 1})`],
                    html: img.outerHTML
                  }]
                });
              });

              const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
              inputs.forEach((input, index) => {
                const label = document.querySelector(`label[for="${(input as HTMLInputElement).id}"]`);
                if (!label) {
                  violations.push({
                    id: 'label',
                    impact: 'serious',
                    description: 'Champ de formulaire sans étiquette',
                    help: 'Les champs doivent avoir une étiquette',
                    nodes: [{
                      target: [`input:nth-child(${index + 1})`],
                      html: input.outerHTML
                    }]
                  });
                }
              });

              callback(null, { violations });
            }
          };
        });
        axeInjected = true;
        console.log(`✅ Fallback Axe injecté`);
      }

      // Exécuter l'analyse Axe avec timeout
      const results = await Promise.race([
        page.evaluate(() => {
          return new Promise((resolve) => {
            // @ts-ignore
            window.axe.run((err: any, results: any) => {
              if (err) {
                resolve({ violations: [], error: err.message, analysisError: true });
              } else {
                resolve(results);
              }
            });
          });
        }),
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ violations: [], error: 'Timeout de l\'analyse Axe', timeout: true });
          }, 30000); // Timeout de 30 secondes
        })
      ]);

      analysisCompleted = true;
      console.log(`🎉 Analyse Axe Core terminée!`);
      
      // Fermer le navigateur headless
      await browser.close();

      // Convertir les résultats Axe en format RGAA
      const violations = parseAxeResults(results);
      
      // Diagnostics détaillés
      console.log(`📊 Axe Core: ${violations.length} violations détectées`);
      console.log(`🔍 Diagnostics:`);
      console.log(`  - Page chargée: ${pageLoaded ? '✅' : '❌'}`);
      console.log(`  - Axe injecté: ${axeInjected ? '✅' : '❌'}`);
      console.log(`  - Analyse terminée: ${analysisCompleted ? '✅' : '❌'}`);
      console.log(`  - Contenu analysé: ${bodyContent} caractères`);
      console.log(`  - URL finale: ${finalUrl}`);
      
      // Si aucune violation mais analyse réussie, c'est probablement un site bien accessible
      if (violations.length === 0 && analysisCompleted && pageLoaded) {
        console.log(`✨ Site probablement bien optimisé pour l'accessibilité`);
      }
      
      return violations;

    } catch (navigationError) {
      errorDetails = navigationError instanceof Error ? navigationError.message : 'Erreur de navigation';
      console.log(`❌ Erreur de navigation: ${errorDetails}`);
      
      // Fermer le navigateur même en cas d'erreur
      await browser.close();
      
      // Retourner une violation d'information pour expliquer l'échec
      return [{
        ruleId: 'axe-analysis-failed',
        criterion: '1.1',
        level: 'AA' as const,
        impact: 'medium' as const,
        description: `Analyse Axe Core échouée: ${errorDetails}`,
        element: 'Page entière',
        recommendation: `L'analyse automatique a échoué. Raisons possibles: site protégé contre l'automatisation, contenu nécessitant JavaScript, ou restrictions d'accès.`,
        context: `URL: ${url}, Erreur: ${errorDetails}`
      }];
    }
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('❌ Erreur générale lors de l\'analyse Axe Core:', errorMsg);
    
    // Retourner une violation d'information pour expliquer l'échec technique
    return [{
      ruleId: 'axe-technical-error',
      criterion: '1.1',
      level: 'AA' as const,
      impact: 'medium' as const,
      description: `Erreur technique lors de l'analyse: ${errorMsg}`,
      element: 'Système d\'analyse',
      recommendation: `Une erreur technique a empêché l'analyse. Cela peut être dû à: problème réseau, site inaccessible, ou configuration système.`,
      context: `URL: ${url}, Erreur technique: ${errorMsg}`
    }];
  }
}

// Parser les résultats Axe Core vers le format RGAA
function parseAxeResults(axeResults: any): RGAAViolation[] {
  const violations: RGAAViolation[] = [];
  
  // Gérer les erreurs d'analyse
  if (!axeResults) {
    console.log('⚠️ Résultats Axe manquants');
    return violations;
  }

  // Gérer les timeouts et erreurs d'analyse
  if (axeResults.timeout) {
    console.log('⚠️ Timeout lors de l\'analyse Axe');
    return violations;
  }

  if (axeResults.analysisError || axeResults.error) {
    console.log('⚠️ Erreur durant l\'analyse Axe:', axeResults.error);
    return violations;
  }

  if (!axeResults.violations) {
    console.log('🔍 Aucune violation Axe détectée (résultats valides)');
    return violations;
  }

  // Parser les violations normalement
  axeResults.violations.forEach((violation: any, index: number) => {
    // Mapper chaque nœud de la violation
    violation.nodes?.forEach((node: any, nodeIndex: number) => {
      violations.push({
        ruleId: `axe-${violation.id}-${nodeIndex}`,
        criterion: mapAxeToRGAA(violation.id),
        level: mapAxeImpactToLevel(violation.impact),
        impact: mapAxeImpactToCustom(violation.impact),
        description: violation.description || violation.help || `Violation ${violation.id}`,
        element: node.target?.join(', ') || 'Élément non spécifié',
        recommendation: `${violation.help || 'Corriger cette violation d\'accessibilité'}. ${violation.helpUrl ? 'Plus d\'info: ' + violation.helpUrl : ''}`,
        context: node.html || '',
        htmlSnippet: node.html || ''
      });
    });
  });

  console.log(`✅ ${violations.length} violations Axe parsées avec succès`);
  return violations;
}

// Mapper les règles Axe vers les critères RGAA
function mapAxeToRGAA(axeRuleId: string): string {
  const mapping: Record<string, string> = {
    'image-alt': '1.1',
    'input-image-alt': '1.1',
    'label': '11.1',
    'aria-required-attr': '11.1',
    'color-contrast': '3.2',
    'link-name': '6.1',
    'button-name': '7.1',
    'html-has-lang': '8.3',
    'heading-order': '9.1',
    'page-has-heading-one': '9.1',
    'duplicate-id': '8.2',
    'landmark-one-main': '12.6',
    'region': '12.6',
    'skip-link': '12.7',
    'focus-order-semantics': '12.1',
  };
  return mapping[axeRuleId] || '1.1';
}

// Mapper l'impact Axe vers le niveau RGAA
function mapAxeImpactToLevel(impact: string): 'A' | 'AA' | 'AAA' {
  const mapping: Record<string, 'A' | 'AA' | 'AAA'> = {
    'critical': 'AA',
    'serious': 'AA',
    'moderate': 'A',
    'minor': 'A'
  };
  return mapping[impact] || 'AA';
}

// Mapper l'impact Axe vers notre format custom
function mapAxeImpactToCustom(impact: string): 'low' | 'medium' | 'high' | 'critical' {
  const mapping: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    'critical': 'critical',
    'serious': 'high',
    'moderate': 'medium',
    'minor': 'low'
  };
  return mapping[impact] || 'medium';
}

// Parser les résultats WAVE depuis les données extraites
function parseWaveResults(dataString: string): RGAAViolation[] {
  try {
    const waveData = JSON.parse(dataString);
    const violations: RGAAViolation[] = [];

    // Mapper les résultats WAVE vers le format RGAA
    if (waveData.errors) {
      waveData.errors.forEach((error: any, index: number) => {
        violations.push({
          ruleId: `wave-error-${index}`,
          criterion: mapWaveToRGAA(error.type),
          level: 'AA' as const,
          impact: determineImpact(error.type),
          description: error.description || error.type,
          element: error.selector || 'Élément non spécifié',
          recommendation: generateRecommendation(error.type),
          context: error.context || ''
        });
      });
    }

    if (waveData.alerts) {
      waveData.alerts.forEach((alert: any, index: number) => {
        violations.push({
          ruleId: `wave-alert-${index}`,
          criterion: mapWaveToRGAA(alert.type),
          level: 'A' as const,
          impact: 'medium' as const,
          description: alert.description || alert.type,
          element: alert.selector || 'Élément non spécifié',
          recommendation: generateRecommendation(alert.type),
          context: alert.context || ''
        });
      });
    }

    return violations;
  } catch (error) {
    console.error('❌ Erreur parsing JSON WAVE:', error);
    return [];
  }
}

// Mapper les types WAVE vers les critères RGAA
function mapWaveToRGAA(waveType: string): string {
  const mapping: Record<string, string> = {
    'alt_missing': '1.1',
    'label_missing': '11.1',
    'heading_skipped': '9.1',
    'contrast': '3.2',
    'link_empty': '6.1',
    'button_empty': '7.1',
    'language_missing': '8.3',
  };
  return mapping[waveType] || '1.1';
}

// Déterminer l'impact selon le type d'erreur WAVE
function determineImpact(waveType: string): 'low' | 'medium' | 'high' | 'critical' {
  const criticalTypes = ['alt_missing', 'label_missing'];
  const highTypes = ['heading_skipped', 'link_empty', 'language_missing'];
  
  if (criticalTypes.includes(waveType)) return 'critical';
  if (highTypes.includes(waveType)) return 'high';
  return 'medium';
}

// Générer une recommandation selon le type d'erreur
function generateRecommendation(waveType: string): string {
  const recommendations: Record<string, string> = {
    'alt_missing': 'Ajouter un attribut alt descriptif à l\'image',
    'label_missing': 'Associer une étiquette au champ de formulaire',
    'heading_skipped': 'Corriger la hiérarchie des titres',
    'contrast': 'Améliorer le contraste des couleurs',
    'link_empty': 'Ajouter un texte descriptif au lien',
    'button_empty': 'Ajouter un texte ou aria-label au bouton',
    'language_missing': 'Ajouter l\'attribut lang à l\'élément html',
  };
  return recommendations[waveType] || 'Corriger ce problème d\'accessibilité';
}

// Calculer le score basé sur les violations WAVE
function calculateScoreFromWave(violations: RGAAViolation[]): number {
  if (violations.length === 0) return 100;
  
  const impactWeights = { low: 1, medium: 2, high: 3, critical: 5 };
  const totalWeight = violations.reduce((sum, v) => {
    const weight = impactWeights[v.impact as keyof typeof impactWeights] || 2;
    return sum + weight;
  }, 0);
  const score = Math.max(0, 100 - Math.min(totalWeight * 2, 100));
  
  return Math.round(score);
}

// Calculer le score basé sur les violations Axe Core
function calculateScoreFromAxe(violations: RGAAViolation[]): number {
  if (violations.length === 0) return 100;
  
  const impactWeights = { low: 1, medium: 3, high: 5, critical: 8 };
  const totalWeight = violations.reduce((sum, v) => {
    const weight = impactWeights[v.impact as keyof typeof impactWeights] || 3;
    return sum + weight;
  }, 0);
  const score = Math.max(0, 100 - Math.min(totalWeight * 1.5, 100));
  
  return Math.round(score);
}

// Calculer le score basé sur les violations du moteur RGAA
function calculateScoreFromRGAA(violations: RGAAViolation[]): number {
  console.log('📊 Calcul du score RGAA selon la méthodologie officielle (conformité)...');
  
  // Total des critères RGAA 4.1 (106 critères)
  const totalCriteria = 106;
  
  // Identifier les critères uniques violés pour éviter les doublons
  const violatedCriteria = new Set<string>();
  
  violations.forEach(violation => {
    // Extraire le numéro de critère (ex: "1.1", "8.2", "11.1")
    if (violation.criterion) {
      violatedCriteria.add(violation.criterion);
    }
  });
  
  // Calculer le pourcentage de conformité
  const violatedCount = violatedCriteria.size;
  const conformeCriteria = totalCriteria - violatedCount;
  const conformityPercentage = (conformeCriteria / totalCriteria) * 100;
  
  console.log(`  📋 Critères violés uniques: ${violatedCount}/${totalCriteria}`);
  console.log(`  📊 Critères conformes: ${conformeCriteria}/${totalCriteria}`);
  console.log(`  ✅ Pourcentage de conformité: ${conformityPercentage.toFixed(1)}%`);
  
  // Le score est directement le pourcentage de conformité
  return Math.round(conformityPercentage);
}

// Grouper par impact
function groupByImpact(violations: RGAAViolation[]): { low: number; medium: number; high: number; critical: number } {
  const groups = { low: 0, medium: 0, high: 0, critical: 0 };
  violations.forEach(v => {
    if (v.impact in groups) {
      groups[v.impact as keyof typeof groups]++;
    }
  });
  return groups;
}

// Grouper par niveau RGAA
function groupByLevel(violations: RGAAViolation[]): { A: number; AA: number; AAA: number } {
  const groups = { A: 0, AA: 0, AAA: 0 };
  violations.forEach(v => {
    if (v.level in groups) {
      groups[v.level as keyof typeof groups]++;
    }
  });
  return groups;
}

// Générer le résumé
function generateSummary(violations: RGAAViolation[], engine: string = 'wave'): string {
  const engineName = engine === 'axe' ? 'Axe Core' : 
                    engine === 'rgaa' ? 'RGAA Engine' : 'WAVE';
  
  if (violations.length === 0) {
    return `Excellente nouvelle ! Aucun problème d'accessibilité majeur détecté par ${engineName}.`;
  }
  
  const critical = violations.filter(v => v.impact === 'critical').length;
  const high = violations.filter(v => v.impact === 'high').length;
  
  let summary = `${violations.length} problème${violations.length > 1 ? 's' : ''} d'accessibilité détecté${violations.length > 1 ? 's' : ''} par ${engineName}.`;
  
  if (critical > 0) {
    summary += ` ${critical} critique${critical > 1 ? 's' : ''} à corriger en priorité.`;
  }
  
  if (high > 0) {
    summary += ` ${high} important${high > 1 ? 's' : ''} nécessitant attention.`;
  }
  
  return summary;
}

async function launchRGAAAnalysis(url: string): Promise<RGAAViolation[]> {
  console.log(`🔧 Lancement du moteur RGAA pour l'URL: ${url}`);

  try {
    // Vérifier l'URL avant de commencer
    if (!url || !url.startsWith('http')) {
      throw new Error(`URL invalide: ${url}`);
    }

    // Import dynamique de Puppeteer-core et Chromium pour RGAA
    const puppeteer = await import('puppeteer-core');
    const chromium = await import('@sparticuz/chromium-min');
    
    // Détecter l'environnement
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    const chromiumPack = "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";
    
    // Lancer une instance headless pour le moteur RGAA
    console.log(`🚀 Lancement d'une instance Chrome headless pour le moteur RGAA...`);
    
    let browser;
    if (isProduction) {
      // Configuration Vercel
      browser = await puppeteer.default.launch({
        args: chromium.default.args,
        executablePath: await chromium.default.executablePath(chromiumPack),
        headless: true,
        defaultViewport: { width: 1920, height: 1080 }
      });
    } else {
      // Configuration locale
      browser = await puppeteer.default.launch({
        headless: true, // Mode headless strict
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--hide-scrollbars',
          '--mute-audio'
        ],
        timeout: 45000,
        ...(process.platform === 'darwin' ? { 
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' 
        } : {})
      });
    }

    console.log(`✅ Instance Chrome headless lancée pour le moteur RGAA!`);

    const page = await browser.newPage();
    
    // Configuration de la page
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 RGAAEngine/1.0');

    try {
      // Variables de tracking
      let pageLoaded = false;
      let analysisCompleted = false;

      // Navigation vers la page
      console.log(`📄 Navigation vers: ${url}`);
      const response = await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 45000 
      });

      if (!response) {
        throw new Error('Impossible de charger la page');
      }

      const status = response.status();
      console.log(`📍 URL finale: ${page.url()}`);
      console.log(`✅ Page chargée avec succès (${status})`);

      if (status >= 400) {
        throw new Error(`Erreur HTTP ${status}: Impossible d'accéder à la page`);
      }

      pageLoaded = true;

      // Obtenir le titre et la taille du contenu
      const pageTitle = await page.title();
      const bodyHTML = await page.evaluate(() => document.body.innerHTML);
      console.log(`📝 Titre de la page: ${pageTitle}`);
      console.log(`📏 Contenu de la page: ${bodyHTML.length} caractères`);

      // Attendre que la page soit entièrement rendue
      await new Promise(resolve => setTimeout(resolve, 2000));

              // Injection et exécution du moteur RGAA
      console.log(`🔍 Injection du moteur RGAA et lancement de l'analyse...`);
      
      const rgaaResults = await page.evaluate(() => {
        // Définition du moteur RGAA dans le contexte de la page
        class RGAAEngine {
          constructor(document) {
            this.document = document;
            this.violations = [];
            this.checkedCriteria = [];
          }

          analyze() {
            this.violations = [];
            this.checkedCriteria = [];

            // Analyses principales
            this.checkImages();
            this.checkFrames();
            this.checkMandatoryElements();
            this.checkStructure();
            this.checkForms();
            this.checkLinks();
            this.checkTables();

            return {
              violations: this.violations,
              checkedCriteria: this.checkedCriteria,
              pageMetrics: this.getPageMetrics()
            };
          }

          // Images
          checkImages() {
            this.checkedCriteria.push('1.1', '1.2', '1.3');
            
            const images = this.document.querySelectorAll('img');
            images.forEach((img, index) => {
              const alt = img.getAttribute('alt');
              const src = img.src;
              const selector = this.generateSelector(img, 'img', index);

              // Images sans attribut alt
              if (alt === null) {
                this.addViolation({
                  ruleId: 'rgaa-1.1.1',
                  criterion: '1.1',
                  level: 'A',
                  impact: 'critical',
                  description: 'Image sans attribut alt',
                  element: selector,
                  recommendation: 'Ajouter un attribut alt décrivant le contenu informatif de l\'image ou alt="" si l\'image est décorative.',
                  context: img.outerHTML,
                  htmlSnippet: img.outerHTML
                });
              }
              // Alt trop générique
              else if (alt && this.isGenericAlt(alt)) {
                this.addViolation({
                  ruleId: 'rgaa-1.1.3',
                  criterion: '1.1',
                  level: 'AA',
                  impact: 'medium',
                  description: `Texte alternatif trop générique: "${alt}"`,
                  element: selector,
                  recommendation: 'Rédiger un texte alternatif plus spécifique décrivant précisément le contenu de l\'image.',
                  context: img.outerHTML,
                  htmlSnippet: img.outerHTML
                });
              }
            });
          }

          // Cadres
          checkFrames() {
            this.checkedCriteria.push('2.1');
            
            const frames = this.document.querySelectorAll('iframe, frame');
            frames.forEach((frame, index) => {
              const title = frame.getAttribute('title');
              const selector = this.generateSelector(frame, frame.tagName.toLowerCase(), index);

              if (!title) {
                this.addViolation({
                  ruleId: 'rgaa-2.1.1',
                  criterion: '2.1',
                  level: 'A',
                  impact: 'high',
                  description: 'Cadre sans titre',
                  element: selector,
                  recommendation: 'Ajouter un attribut title décrivant le contenu du cadre.',
                  context: frame.outerHTML,
                  htmlSnippet: frame.outerHTML
                });
              }
            });
          }

          // Éléments obligatoires
          checkMandatoryElements() {
            this.checkedCriteria.push('8.1', '8.2', '8.3', '8.5');
            
            // DOCTYPE
            if (!this.document.doctype) {
              this.addViolation({
                ruleId: 'rgaa-8.1.1',
                criterion: '8.1',
                level: 'A',
                impact: 'medium',
                description: 'DOCTYPE manquant',
                element: 'document',
                recommendation: 'Ajouter une déclaration DOCTYPE valide au début du document.',
                context: 'Document HTML',
                htmlSnippet: ''
              });
            }

            // Langue
            const html = this.document.documentElement;
            const lang = html.getAttribute('lang');
            if (!lang) {
              this.addViolation({
                ruleId: 'rgaa-8.3.1',
                criterion: '8.3',
                level: 'A',
                impact: 'high',
                description: 'Langue principale non définie',
                element: 'html',
                recommendation: 'Ajouter un attribut lang à l\'élément html (ex: lang="fr").',
                context: '<html>',
                htmlSnippet: '<html>'
              });
            }

            // Titre
            const title = this.document.querySelector('title');
            if (!title || !title.textContent || title.textContent.trim() === '') {
              this.addViolation({
                ruleId: 'rgaa-8.5.1',
                criterion: '8.5',
                level: 'A',
                impact: 'critical',
                description: 'Titre de page manquant ou vide',
                element: 'title',
                recommendation: 'Renseigner un titre de page descriptif et unique.',
                context: title ? title.outerHTML : '<head>',
                htmlSnippet: title ? title.outerHTML : ''
              });
            }

            // IDs dupliqués
            const elementsWithId = this.document.querySelectorAll('[id]');
            const ids = new Set();
            const duplicatedIds = new Set();
            
            elementsWithId.forEach(element => {
              const id = element.getAttribute('id');
              if (id) {
                if (ids.has(id)) {
                  duplicatedIds.add(id);
                }
                ids.add(id);
              }
            });
            
            duplicatedIds.forEach(id => {
              const elements = this.document.querySelectorAll(`[id="${id}"]`);
              elements.forEach((element, index) => {
                const selector = this.generateSelector(element, `[id="${id}"]`, index);
                
                this.addViolation({
                  ruleId: 'rgaa-8.2.1',
                  criterion: '8.2',
                  level: 'A',
                  impact: 'high',
                  description: `ID dupliqué: "${id}"`,
                  element: selector,
                  recommendation: 'Utiliser des IDs uniques dans le document.',
                  context: element.outerHTML,
                  htmlSnippet: element.outerHTML
                });
              });
            });
          }

          // Structure des titres
          checkStructure() {
            this.checkedCriteria.push('9.1');
            
            const headings = this.document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const h1Count = this.document.querySelectorAll('h1').length;
            
            // Vérifier la présence d'un h1
            if (h1Count === 0) {
              this.addViolation({
                ruleId: 'rgaa-9.1.1',
                criterion: '9.1',
                level: 'A',
                impact: 'high',
                description: 'Aucun titre principal (h1) trouvé',
                element: 'document',
                recommendation: 'Ajouter un titre principal h1 unique décrivant le contenu de la page.',
                context: 'Structure des titres',
                htmlSnippet: ''
              });
            } else if (h1Count > 1) {
              this.document.querySelectorAll('h1').forEach((h1, index) => {
                const selector = this.generateSelector(h1, 'h1', index);
                
                this.addViolation({
                  ruleId: 'rgaa-9.1.2',
                  criterion: '9.1',
                  level: 'A',
                  impact: 'medium',
                  description: `Titre h1 multiple (${h1Count} h1 trouvés)`,
                  element: selector,
                  recommendation: 'N\'utiliser qu\'un seul titre h1 par page.',
                  context: h1.outerHTML,
                  htmlSnippet: h1.outerHTML
                });
              });
            }

            // Hiérarchie des titres
            const headingLevels = [];
            headings.forEach((heading, index) => {
              const level = parseInt(heading.tagName.charAt(1));
              headingLevels.push(level);
              
              if (index > 0) {
                const previousLevel = headingLevels[index - 1];
                const jump = level - previousLevel;
                
                if (jump > 1) {
                  const selector = this.generateSelector(heading, heading.tagName.toLowerCase(), index);
                  
                  this.addViolation({
                    ruleId: 'rgaa-9.1.3',
                    criterion: '9.1',
                    level: 'A',
                    impact: 'medium',
                    description: `Saut de niveau de titre: h${previousLevel} vers h${level}`,
                    element: selector,
                    recommendation: 'Respecter la hiérarchie des titres sans saut de niveau.',
                    context: heading.outerHTML,
                    htmlSnippet: heading.outerHTML
                  });
                }
              }

              // Titres vides
              if (!heading.textContent || heading.textContent.trim() === '') {
                const selector = this.generateSelector(heading, heading.tagName.toLowerCase(), index);
                
                this.addViolation({
                  ruleId: 'rgaa-9.1.4',
                  criterion: '9.1',
                  level: 'A',
                  impact: 'high',
                  description: `Titre ${heading.tagName.toLowerCase()} vide`,
                  element: selector,
                  recommendation: 'Renseigner le contenu du titre.',
                  context: heading.outerHTML,
                  htmlSnippet: heading.outerHTML
                });
              }
            });
          }

          // Formulaires
          checkForms() {
            this.checkedCriteria.push('11.1', '11.2');
            
            const formElements = this.document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select');
            
            formElements.forEach((element, index) => {
              const hasLabel = this.hasLabel(element);
              
              if (!hasLabel) {
                const selector = this.generateSelector(element, element.tagName.toLowerCase(), index);
                
                this.addViolation({
                  ruleId: 'rgaa-11.1.1',
                  criterion: '11.1',
                  level: 'A',
                  impact: 'critical',
                  description: 'Champ de formulaire sans étiquette',
                  element: selector,
                  recommendation: 'Associer le champ à une étiquette via un élément label ou les attributs aria-label/aria-labelledby.',
                  context: element.outerHTML,
                  htmlSnippet: element.outerHTML
                });
              }
            });
          }

          // Liens
          checkLinks() {
            this.checkedCriteria.push('6.1');
            
            const links = this.document.querySelectorAll('a[href]');
            
            links.forEach((link, index) => {
              const hasAccessibleName = this.hasAccessibleName(link);
              
              if (!hasAccessibleName) {
                const selector = this.generateSelector(link, 'a', index);
                
                this.addViolation({
                  ruleId: 'rgaa-6.1.1',
                  criterion: '6.1',
                  level: 'A',
                  impact: 'critical',
                  description: 'Lien sans intitulé accessible',
                  element: selector,
                  recommendation: 'Ajouter un texte visible, un attribut title, aria-label, ou aria-labelledby au lien.',
                  context: link.outerHTML,
                  htmlSnippet: link.outerHTML
                });
              }
            });
          }

          // Tableaux
          checkTables() {
            this.checkedCriteria.push('5.6');
            
            const tables = this.document.querySelectorAll('table');
            tables.forEach((table, index) => {
              const hasHeaders = table.querySelector('th') || table.querySelector('[scope]');
              const hasMultipleRows = table.querySelectorAll('tr').length > 1;
              const hasMultipleCols = table.querySelector('tr')?.querySelectorAll('td, th').length > 1;
              
              if (hasMultipleRows && hasMultipleCols && !hasHeaders) {
                const selector = this.generateSelector(table, 'table', index);
                
                this.addViolation({
                  ruleId: 'rgaa-5.6.1',
                  criterion: '5.6',
                  level: 'A',
                  impact: 'high',
                  description: 'Tableau de données sans en-têtes',
                  element: selector,
                  recommendation: 'Ajouter des en-têtes de colonnes et/ou de lignes avec l\'élément th.',
                  context: table.outerHTML.substring(0, 200),
                  htmlSnippet: table.outerHTML
                });
              }
            });
          }

          // Méthodes utilitaires
          addViolation(violation) {
            this.violations.push(violation);
          }

          generateSelector(element, baseSelector, index) {
            if (element.id) {
              return `#${element.id}`;
            }
            
            if (element.className) {
              const classes = element.className.split(' ').filter(c => c.trim()).slice(0, 2);
              if (classes.length > 0) {
                return `${baseSelector}.${classes.join('.')}`;
              }
            }
            
            return `${baseSelector}:nth-of-type(${index + 1})`;
          }

          isGenericAlt(alt) {
            const genericTerms = ['image', 'photo', 'picture', 'logo', 'icon', 'graphic'];
            const altLower = alt.toLowerCase().trim();
            return genericTerms.includes(altLower) || altLower.length < 3;
          }

          hasLabel(element) {
            // Vérifier label associé
            if (element.id) {
              const label = this.document.querySelector(`label[for="${element.id}"]`);
              if (label) return true;
            }
            
            // Vérifier label parent
            if (element.closest('label')) return true;
            
            // Vérifier attributs ARIA
            if (element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')) {
              return true;
            }
            
            // Vérifier title
            if (element.hasAttribute('title') && element.title.trim() !== '') {
              return true;
            }
            
            return false;
          }

          hasAccessibleName(element) {
            const text = element.textContent?.trim();
            const ariaLabel = element.getAttribute('aria-label');
            const title = element.getAttribute('title');
            
            return !!(text || ariaLabel || title);
          }

          getPageMetrics() {
            return {
              totalElements: this.document.querySelectorAll('*').length,
              imagesCount: this.document.querySelectorAll('img').length,
              linksCount: this.document.querySelectorAll('a[href]').length,
              formsCount: this.document.querySelectorAll('form').length,
              headingsCount: this.document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
              tablesCount: this.document.querySelectorAll('table').length,
              scriptsCount: this.document.querySelectorAll('script').length,
              iframesCount: this.document.querySelectorAll('iframe, frame').length
            };
          }
        }

        // Lancer l'analyse
        const engine = new RGAAEngine(document);
        return engine.analyze();
      });

      analysisCompleted = true;
      console.log(`🎉 Analyse du moteur RGAA terminée!`);
      console.log(`📊 Moteur RGAA: ${rgaaResults.violations.length} violations détectées`);

      // Diagnostics
      console.log(`🔍 Diagnostics:`);
      console.log(`  - Page chargée: ${pageLoaded ? '✅' : '❌'}`);
      console.log(`  - Analyse terminée: ${analysisCompleted ? '✅' : '❌'}`);
      console.log(`  - Critères vérifiés: ${rgaaResults.checkedCriteria.join(', ')}`);
      console.log(`  - Métriques de page: ${JSON.stringify(rgaaResults.pageMetrics)}`);

      await browser.close();
      return rgaaResults.violations;

    } catch (error) {
      console.error(`❌ Erreur lors de l'analyse du moteur RGAA:`, error);
      await browser.close();
      throw error;
    }

  } catch (error) {
    console.error(`💥 Erreur fatale du moteur RGAA:`, error);
    throw error;
  }
} 

// Fonction pour capturer les positions des éléments avec violations
async function captureViolationPositions(page: any, violations: RGAAViolation[]): Promise<RGAAViolation[]> {
  try {
    console.log('📍 Capture des positions des violations...');
    
    const violationsWithPositions = await page.evaluate((violationsData: any[]) => {
      const results: any[] = [];
      
      violationsData.forEach((violation, index) => {
        const enhanced = { ...violation };
        
        try {
          // Essayer de trouver l'élément correspondant à la violation
          let element = null;
          
          // Méthode 1: Utiliser le selector si disponible
          if (violation.element) {
            try {
              element = document.querySelector(violation.element);
            } catch (e) {
              // Selector invalide, continuer avec d'autres méthodes
            }
          }
          
          // Méthode 2: Chercher par contenu HTML si disponible
          if (!element && violation.htmlSnippet) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              if (el.outerHTML.includes(violation.htmlSnippet.substring(0, 50))) {
                element = el;
                break;
              }
            }
          }
          
          // Méthode 3: Chercher par type de violation (images sans alt, liens vides, etc.)
          if (!element) {
            switch (violation.criterion) {
              case '1.1': // Images sans alternative textuelle
                const images = document.querySelectorAll('img:not([alt]), img[alt=""]');
                element = images[index % images.length];
                break;
              case '6.1': // Liens sans intitulé
                const links = document.querySelectorAll('a:empty, a:not([aria-label]):not([title])');
                element = links[index % links.length];
                break;
              case '9.1': // Informations structurées via des titres
                const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                element = headings[index % headings.length];
                break;
              case '11.1': // Champs de formulaire avec étiquette
                const inputs = document.querySelectorAll('input:not([id]), input:not([aria-label]):not([title])');
                element = inputs[index % inputs.length];
                break;
            }
          }
          
          // Si on a trouvé un élément, capturer sa position
          if (element && element.getBoundingClientRect) {
            const rect = element.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(element);
            
            // Vérifier que l'élément est visible
            if (rect.width > 0 && rect.height > 0 && computedStyle.visibility !== 'hidden' && computedStyle.display !== 'none') {
              enhanced.position = {
                x: Math.round(rect.left + window.scrollX),
                y: Math.round(rect.top + window.scrollY),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                selector: element.tagName.toLowerCase() + 
                         (element.id ? `#${element.id}` : '') +
                         (element.className ? `.${element.className.split(' ')[0]}` : '') +
                         `:nth-of-type(${Array.from(element.parentNode?.children || []).indexOf(element) + 1})`
              };
            }
          }
        } catch (error) {
          // Si erreur pour cet élément, continuer sans position
          console.warn('Erreur capture position pour violation:', error);
        }
        
        results.push(enhanced);
      });
      
      return results;
    }, violations);
    
    const positionsFound = violationsWithPositions.filter(v => v.position).length;
    console.log(`📍 Positions capturées: ${positionsFound}/${violations.length} violations`);
    
    return violationsWithPositions;
  } catch (error) {
    console.error('❌ Erreur lors de la capture des positions:', error);
    return violations; // Retourner les violations originales en cas d'erreur
  }
}