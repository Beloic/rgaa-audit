import { NextRequest, NextResponse } from 'next/server';
import { RGAAViolation } from '@/types/audit';

export async function POST(request: NextRequest) {
  try {
    const { url, violation } = await request.json();

    if (!url || !violation) {
      return NextResponse.json({ error: 'URL et violation requis' }, { status: 400 });
    }

    // Import dynamique de Puppeteer-core et Chromium
    const puppeteer = await import('puppeteer-core');
    const chromium = await import('@sparticuz/chromium-min');
    
    // Détecter l'environnement
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    const chromiumPack = "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";
    
    let browser;
    if (isProduction) {
      browser = await puppeteer.default.launch({
        args: chromium.default.args,
        executablePath: await chromium.default.executablePath(chromiumPack),
        headless: true,
        defaultViewport: { width: 1920, height: 1080 }
      });
    } else {
      browser = await puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1920, height: 1080 }
      });
    }

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Capturer la position de la violation spécifique
    const position = await page.evaluate((violationData: RGAAViolation) => {
      try {
        let element = null;
        
        // Méthode 1: Utiliser le selector si disponible
        if (violationData.element) {
          try {
            element = document.querySelector(violationData.element);
          } catch (e) {
            console.log('Erreur avec selector:', violationData.element);
          }
        }
        
        // Méthode 2: Rechercher par contenu HTML
        if (!element && violationData.htmlSnippet) {
          const allElements = document.querySelectorAll('*');
          for (const el of allElements) {
            if (el.outerHTML && el.outerHTML.includes(violationData.htmlSnippet.substring(0, 50))) {
              element = el;
              break;
            }
          }
        }
        
        // Méthode 3: Deviner l'élément selon le type de violation
        if (!element && violationData.description) {
          const desc = violationData.description.toLowerCase();
          if (desc.includes('image') || desc.includes('alt')) {
            element = document.querySelector('img:not([alt]), img[alt=""], img[alt*="image"]');
          } else if (desc.includes('heading') || desc.includes('titre')) {
            element = document.querySelector('h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty');
          } else if (desc.includes('link') || desc.includes('lien')) {
            element = document.querySelector('a:not([title]):not([aria-label])');
          } else if (desc.includes('form') || desc.includes('formulaire')) {
            element = document.querySelector('input:not([id]):not([aria-label]), select:not([id]):not([aria-label])');
          }
        }
        
        if (element) {
          const rect = element.getBoundingClientRect();
          const selector = element.tagName.toLowerCase() + 
                          (element.id ? '#' + element.id : '') +
                          (element.className ? '.' + element.className.split(' ')[0] : '');
          
          return {
            x: Math.round(rect.left + window.scrollX),
            y: Math.round(rect.top + window.scrollY),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            selector: selector
          };
        }
        
        return null;
      } catch (error) {
        console.error('Erreur lors de la capture de position:', error);
        return null;
      }
    }, violation);

    await browser.close();

    if (position) {
      return NextResponse.json({ 
        success: true, 
        position,
        violation: { ...violation, position }
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Impossible de localiser cet élément sur la page'
      });
    }

  } catch (error) {
    console.error('Erreur lors de la capture de position:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la capture de position' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 