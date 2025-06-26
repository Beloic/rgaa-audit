// Module pour gérer Puppeteer de manière compatible Vercel

export interface PuppeteerManager {
  launch(): Promise<any>;
  isProduction: boolean;
}

class VercelPuppeteerManager implements PuppeteerManager {
  public isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL_ENV);
  }

  async launch(): Promise<any> {
    if (this.isProduction) {
      // Configuration pour production Vercel
      const puppeteer = await import('puppeteer-core');
      const chromium = await import('@sparticuz/chromium');
      
      const executablePath = await chromium.default.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
      );

      return await puppeteer.default.launch({
        executablePath,
        args: [
          ...chromium.default.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--single-process',
          '--no-zygote'
        ],
        headless: true,
        defaultViewport: { width: 1280, height: 720 },
        timeout: 30000
      });
    } else {
      // Configuration pour développement local
      const puppeteer = await import('puppeteer');
      const isMacOS = process.platform === 'darwin';
      
      const launchConfig: any = {
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-blink-features=AutomationControlled',
          '--exclude-switches=enable-automation'
        ],
        defaultViewport: null,
        ignoreDefaultArgs: ['--enable-automation', '--enable-blink-features=AutomationControlled'],
        timeout: 30000
      };

      // Chemin explicite pour macOS en local
      if (isMacOS) {
        launchConfig.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
      }

      try {
        return await puppeteer.default.launch(launchConfig);
      } catch (error) {
        // Fallback sans chemin explicite
        delete launchConfig.executablePath;
        return await puppeteer.default.launch(launchConfig);
      }
    }
  }
}

// Fonction utilitaire pour l'analyse WAVE simplifiée pour Vercel
export async function analyzeWithWaveServerless(url: string): Promise<any[]> {
  const puppeteerManager = new VercelPuppeteerManager();
  
  console.log(`🌊 Analyse WAVE ${puppeteerManager.isProduction ? 'serverless' : 'locale'} pour: ${url}`);
  
  let browser: any = null;
  
  try {
    browser = await puppeteerManager.launch();
    console.log(`✅ Navigateur lancé avec succès`);
    
    const page = await browser.newPage();
    
    // Configurer la page
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    if (!puppeteerManager.isProduction) {
      // Anti-détection seulement en local
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
          configurable: true
        });
      });
    }
    
    // Navigation vers WAVE avec timeout approprié
    const timeout = puppeteerManager.isProduction ? 15000 : 30000;
    
    try {
      await page.goto('https://wave.webaim.org/', { 
        waitUntil: 'domcontentloaded',
        timeout 
      });
      console.log(`✅ Site WAVE chargé`);
    } catch (navError) {
      console.log(`⚠️ Timeout WAVE, analyse directe de l'URL...`);
      
      // En cas d'échec WAVE, analyser directement l'URL avec checks basiques
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
      
      const basicChecks = await page.evaluate(() => {
        const violations: any[] = [];
        
        // Images sans alt
        const imagesNoAlt = document.querySelectorAll('img:not([alt]), img[alt=""]');
        imagesNoAlt.forEach((img, index) => {
          violations.push({
            type: 'error',
            description: 'Image sans texte alternatif',
            selector: img.tagName.toLowerCase(),
            context: img.outerHTML.substring(0, 100) + '...',
            impact: 'critical',
            help: 'Ajouter un attribut alt descriptif'
          });
        });
        
        // Headings vides
        const emptyHeadings = document.querySelectorAll('h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty');
        emptyHeadings.forEach((heading) => {
          violations.push({
            type: 'error',
            description: 'Titre vide',
            selector: heading.tagName.toLowerCase(),
            context: heading.outerHTML,
            impact: 'serious',
            help: 'Supprimer ou ajouter du contenu au titre'
          });
        });
        
        // Links sans texte
        const emptyLinks = document.querySelectorAll('a:empty, a[aria-label=""], a[title=""]');
        emptyLinks.forEach((link) => {
          if (!link.querySelector('img[alt]')) {
            violations.push({
              type: 'error',
              description: 'Lien sans texte accessible',
              selector: 'a',
              context: link.outerHTML.substring(0, 100) + '...',
              impact: 'serious',
              help: 'Ajouter du texte ou un attribut aria-label'
            });
          }
        });
        
        return violations;
      });
      
      console.log(`✅ Analyse basique terminée: ${basicChecks.length} violations`);
      return basicChecks;
    }
    
    // Si WAVE fonctionne, continuer avec l'analyse WAVE normale mais simplifiée
    const urlInput = await page.$('input[name="url"], input#url, input[type="url"]');
    if (urlInput) {
      await urlInput.click();
      await urlInput.type(url);
      
      // Soumettre le formulaire
      const submitButton = await page.$('input[type="submit"], button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
      } else {
        await page.keyboard.press('Enter');
      }
      
      // Attendre les résultats avec timeout réduit
      try {
        await page.waitForSelector('.summary, #summary, .wave-summary', { timeout: puppeteerManager.isProduction ? 30000 : 60000 });
        
        // Extraire les résultats
        const results = await page.evaluate(() => {
          const violations: any[] = [];
          const text = document.body.textContent || '';
          
          // Parser les compteurs WAVE
          const errorMatches = text.match(/(\d+)\s*error[s]?/gi);
          const alertMatches = text.match(/(\d+)\s*alert[s]?/gi);
          
          const errorCount = errorMatches ? Math.max(...errorMatches.map(m => parseInt(m.match(/\d+/)?.[0] || '0'))) : 0;
          const alertCount = alertMatches ? Math.max(...alertMatches.map(m => parseInt(m.match(/\d+/)?.[0] || '0'))) : 0;
          
          // Créer des violations génériques basées sur les compteurs
          for (let i = 0; i < errorCount; i++) {
            violations.push({
              type: 'error',
              description: `Erreur d'accessibilité détectée par WAVE`,
              selector: 'unknown',
              context: 'Détails disponibles dans le rapport WAVE',
              impact: 'serious',
              help: 'Consulter le rapport WAVE détaillé'
            });
          }
          
          for (let i = 0; i < alertCount; i++) {
            violations.push({
              type: 'alert', 
              description: `Alerte d'accessibilité détectée par WAVE`,
              selector: 'unknown',
              context: 'Détails disponibles dans le rapport WAVE',
              impact: 'moderate',
              help: 'Consulter le rapport WAVE détaillé'
            });
          }
          
          return violations;
        });
        
        console.log(`✅ Analyse WAVE terminée: ${results.length} violations`);
        return results;
        
      } catch (timeoutError) {
        console.log(`⚠️ Timeout lors de l'attente des résultats WAVE`);
        return [];
      }
    }
    
    return [];
    
  } catch (error) {
    console.error('❌ Erreur analyse WAVE serverless:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export default VercelPuppeteerManager; 