const puppeteer = require('puppeteer');

async function launchWaveAnalysis(url) {
  if (!url) {
    console.error('❌ URL manquante');
    process.exit(1);
  }

  console.log(`🌊 Lancement de WAVE via le site web avec l'URL: ${url}`);

  try {
    // Lancer Chrome
    const browser = await puppeteer.launch({
      headless: false, // Mode visible pour voir l'analyse en cours
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--allow-running-insecure-content',
        '--no-first-run',
        '--disable-default-apps',
        '--disable-popup-blocking'
      ]
    });

    const page = await browser.newPage();
    
    // Naviguer vers le site WAVE
    console.log(`📄 Ouverture du site WAVE...`);
    await page.goto('https://wave.webaim.org/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    console.log('✅ Site WAVE chargé. Saisie de l\'URL...');
    
    // Attendre que le formulaire soit visible
    await page.waitForSelector('input[name="url"], input#url, input[type="url"]', { timeout: 10000 });
    
    // Saisir l'URL dans le champ de formulaire
    const urlInput = await page.$('input[name="url"], input#url, input[type="url"]');
    if (urlInput) {
      await urlInput.click();
      await urlInput.evaluate(input => input.value = ''); // Vider le champ
      await urlInput.type(url);
      console.log(`✅ URL saisie: ${url}`);
    } else {
      throw new Error('Champ URL non trouvé sur le site WAVE');
    }
    
    // Cliquer sur le bouton d'analyse
    console.log('🔍 Lancement de l\'analyse...');
    const submitButton = await page.$('input[type="submit"], button[type="submit"], .submit-button');
    if (submitButton) {
      await submitButton.click();
    } else {
      // Essayer d'appuyer sur Entrée
      await page.keyboard.press('Enter');
    }
    
    // Attendre que l'analyse se termine (attendre les résultats)
    console.log('⏳ Attente des résultats d\'analyse...');
    try {
      // Attendre soit la page de résultats, soit les éléments de résultats
      await page.waitForSelector('.summary, #summary, .wave-summary, .results', { timeout: 60000 });
      console.log('✅ Résultats d\'analyse chargés!');
    } catch (error) {
      console.log('⚠️ Timeout atteint, tentative de récupération des résultats disponibles...');
    }
    
    // Attendre un peu plus pour que tous les éléments se chargent
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extraire les résultats de la page WAVE
    const waveResults = await page.evaluate(() => {
      const results = {
        errors: [],
        alerts: [],
        features: [],
        summary: {}
      };
      
      try {
        // Chercher le résumé des résultats
        const summaryElement = document.querySelector('.summary, #summary, .wave-summary');
        if (summaryElement) {
          const summaryText = summaryElement.textContent || summaryElement.innerText;
          
          // Extraire les nombres du résumé
          const errorMatch = summaryText.match(/(\d+)\s*error/i);
          const alertMatch = summaryText.match(/(\d+)\s*alert/i);
          const featureMatch = summaryText.match(/(\d+)\s*feature/i);
          
          results.summary = {
            errors: errorMatch ? parseInt(errorMatch[1]) : 0,
            alerts: alertMatch ? parseInt(alertMatch[1]) : 0,
            features: featureMatch ? parseInt(featureMatch[1]) : 0
          };
        }
        
        // Chercher les détails des erreurs
        const errorElements = document.querySelectorAll('.error, .wave-error, [class*="error"]');
        errorElements.forEach((element, index) => {
          const description = element.textContent || element.title || element.getAttribute('aria-label') || 'Erreur d\'accessibilité détectée';
          
          // Déterminer le type d'erreur basé sur le contenu
          let type = 'accessibility_error';
          if (description.toLowerCase().includes('alt')) type = 'alt_missing';
          else if (description.toLowerCase().includes('label')) type = 'label_missing';
          else if (description.toLowerCase().includes('heading')) type = 'heading_skipped';
          else if (description.toLowerCase().includes('contrast')) type = 'contrast';
          else if (description.toLowerCase().includes('link')) type = 'link_empty';
          else if (description.toLowerCase().includes('button')) type = 'button_empty';
          else if (description.toLowerCase().includes('language')) type = 'language_missing';
          
          results.errors.push({
            type: type,
            description: description.trim(),
            selector: `error-${index + 1}`,
            context: element.outerHTML ? element.outerHTML.substring(0, 200) : ''
          });
        });
        
        // Chercher les alertes
        const alertElements = document.querySelectorAll('.alert, .wave-alert, [class*="alert"]:not([class*="error"])');
        alertElements.forEach((element, index) => {
          const description = element.textContent || element.title || element.getAttribute('aria-label') || 'Alerte d\'accessibilité';
          
          let type = 'accessibility_alert';
          if (description.toLowerCase().includes('heading')) type = 'heading_possible';
          else if (description.toLowerCase().includes('link')) type = 'link_redundant';
          else if (description.toLowerCase().includes('image')) type = 'image_alt_suspicious';
          
          results.alerts.push({
            type: type,
            description: description.trim(),
            selector: `alert-${index + 1}`,
            context: element.outerHTML ? element.outerHTML.substring(0, 200) : ''
          });
        });
        
        // Si aucun résultat spécifique trouvé, essayer de chercher dans le contenu général
        if (results.errors.length === 0 && results.alerts.length === 0) {
          const bodyText = document.body.textContent || document.body.innerText;
          
          // Chercher des indicateurs de problèmes dans le texte
          if (bodyText.includes('error') || bodyText.includes('Error')) {
            const errorCount = (bodyText.match(/\d+\s*error/gi) || []).length;
            if (errorCount > 0) {
              results.errors.push({
                type: 'general_error',
                description: `${errorCount} erreur(s) d'accessibilité détectée(s)`,
                selector: 'page',
                context: 'Analyse générale WAVE'
              });
            }
          }
          
          if (bodyText.includes('alert') || bodyText.includes('Alert')) {
            const alertCount = (bodyText.match(/\d+\s*alert/gi) || []).length;
            if (alertCount > 0) {
              results.alerts.push({
                type: 'general_alert',
                description: `${alertCount} alerte(s) d'accessibilité détectée(s)`,
                selector: 'page',
                context: 'Analyse générale WAVE'
              });
            }
          }
        }
        
      } catch (error) {
        console.error('Erreur lors de l\'extraction des résultats:', error);
      }
      
      return results;
    });

    // Afficher les résultats pour le parsing par l'API
    console.log('WAVE_RESULTS_START:' + JSON.stringify(waveResults) + ':WAVE_RESULTS_END');
    
    console.log(`🎉 Analyse WAVE terminée! ${waveResults.errors.length} erreurs, ${waveResults.alerts.length} alertes détectées.`);
    
    // Fermer le navigateur après un délai pour permettre la visualisation
    setTimeout(async () => {
      await browser.close();
      process.exit(0);
    }, 5000);

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse WAVE:', error);
    
    // Retourner des résultats vides en cas d'erreur
    console.log('WAVE_RESULTS_START:{"errors":[],"alerts":[],"summary":{"errors":0,"alerts":0,"features":0}}:WAVE_RESULTS_END');
    
    process.exit(1);
  }
}

// Récupération de l'URL depuis les arguments
const url = process.argv[2];
if (!url) {
  console.error('❌ Usage: node wave-puppeteer.js <URL>');
  process.exit(1);
}

// Validation de l'URL
try {
  new URL(url);
} catch (error) {
  console.error('❌ URL invalide:', url);
  process.exit(1);
}

// Lancer l'analyse
launchWaveAnalysis(url); 