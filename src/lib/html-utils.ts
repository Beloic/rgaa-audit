import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import axios from 'axios';
import { API_LIMITS } from './constants';

// Sécuriser le HTML avec DOMPurify
export function sanitizeHtml(html: string): string {
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window as any);
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['html', 'head', 'body', 'title', 'meta', 'link', 'style', 'script',
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
      'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody',
      'form', 'input', 'textarea', 'button', 'select', 'option', 'label',
      'section', 'article', 'header', 'footer', 'nav', 'main', 'aside',
      'strong', 'em', 'br', 'hr', 'iframe', 'video', 'audio', 'source'],
    ALLOWED_ATTR: ['id', 'class', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby',
      'alt', 'src', 'href', 'title', 'lang', 'type', 'name', 'value', 'placeholder',
      'for', 'headers', 'scope', 'colspan', 'rowspan', 'tabindex', 'disabled',
      'aria-hidden', 'aria-expanded', 'aria-live', 'aria-atomic']
  });
}

// Récupérer le HTML d'une URL
export async function fetchHtmlFromUrl(url: string): Promise<string> {
  try {
    // Valider l'URL
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('URL must use HTTP or HTTPS protocol');
    }

    const response = await axios.get(url, {
      timeout: API_LIMITS.TIMEOUT,
      maxContentLength: API_LIMITS.MAX_HTML_SIZE,
      headers: {
        'User-Agent': 'RGAA-Audit-Bot/1.0 (Accessibility Analysis)',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - the page took too long to load');
      }
      if (error.response?.status === 404) {
        throw new Error('Page not found (404)');
      }
      if (error.response?.status === 403) {
        throw new Error('Access forbidden (403)');
      }
    }
    throw new Error(`Failed to fetch URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Parser le DOM et extraire des informations pour l'analyse
export function parseHtmlForAudit(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const analysis = {
    // Informations générales
    title: document.title || '',
    lang: document.documentElement.lang || '',
    
    // Images
    images: Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      hasAlt: img.hasAttribute('alt'),
      isDecorative: img.alt === '' && img.hasAttribute('alt'),
      ariaHidden: img.getAttribute('aria-hidden') === 'true'
    })),

    // Liens
    links: Array.from(document.querySelectorAll('a[href]')).map(link => ({
      href: link.getAttribute('href'),
      text: link.textContent?.trim() || '',
      title: (link as HTMLAnchorElement).title,
      ariaLabel: link.getAttribute('aria-label'),
      hasVisibleText: (link.textContent?.trim().length || 0) > 0
    })),

    // Headings structure
    headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(heading => ({
      level: parseInt(heading.tagName.slice(1)),
      text: heading.textContent?.trim() || '',
      id: heading.id
    })),

    // Formulaires
    forms: Array.from(document.querySelectorAll('form')).map(form => ({
      inputs: Array.from(form.querySelectorAll('input, textarea, select')).map(input => ({
        type: input.getAttribute('type') || 'text',
        name: input.getAttribute('name'),
        id: input.id,
        hasLabel: !!document.querySelector(`label[for="${input.id}"]`) || 
                  !!input.closest('label') ||
                  !!input.getAttribute('aria-label') ||
                  !!input.getAttribute('aria-labelledby'),
        ariaLabel: input.getAttribute('aria-label'),
        placeholder: input.getAttribute('placeholder'),
        required: input.hasAttribute('required')
      }))
    })),

    // Tableaux
    tables: Array.from(document.querySelectorAll('table')).map(table => ({
      hasCaption: !!table.querySelector('caption'),
      hasHeaders: table.querySelectorAll('th').length > 0,
      hasScope: Array.from(table.querySelectorAll('th')).some(th => th.hasAttribute('scope')),
      rowCount: table.querySelectorAll('tr').length,
      colCount: table.querySelector('tr')?.querySelectorAll('td, th').length || 0
    })),

    // Contrastes et couleurs (éléments avec des styles)
    colorElements: Array.from(document.querySelectorAll('*')).filter(el => {
      const computed = dom.window.getComputedStyle(el);
      return computed.color !== 'rgb(0, 0, 0)' || computed.backgroundColor !== 'rgba(0, 0, 0, 0)';
    }).slice(0, 50), // Limiter pour éviter trop de données

    // Structure sémantique
    landmarks: {
      main: document.querySelectorAll('main, [role="main"]').length,
      nav: document.querySelectorAll('nav, [role="navigation"]').length,
      header: document.querySelectorAll('header, [role="banner"]').length,
      footer: document.querySelectorAll('footer, [role="contentinfo"]').length,
      aside: document.querySelectorAll('aside, [role="complementary"]').length
    },

    // Médias
    media: {
      videos: Array.from(document.querySelectorAll('video')).map(video => ({
        hasControls: video.hasAttribute('controls'),
        hasAutoplay: video.hasAttribute('autoplay'),
        hasCaptions: video.querySelectorAll('track[kind="captions"], track[kind="subtitles"]').length > 0
      })),
      audios: Array.from(document.querySelectorAll('audio')).map(audio => ({
        hasControls: audio.hasAttribute('controls'),
        hasAutoplay: audio.hasAttribute('autoplay')
      }))
    },

    // Focus et navigation
    focusableElements: document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    ).length,

    // Scripts et interactions
    hasJavascript: document.querySelectorAll('script').length > 0,
    
    // Métadonnées
    meta: {
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
      charset: document.querySelector('meta[charset]')?.getAttribute('charset') || 
               document.querySelector('meta[http-equiv="Content-Type"]')?.getAttribute('content') || ''
    },

    // Statistiques générales
    stats: {
      totalElements: document.querySelectorAll('*').length,
      textLength: document.body?.textContent?.length || 0,
      hasSkipLinks: !!document.querySelector('a[href^="#"]:first-child, .skip-link, #skip-link')
    }
  };

  return analysis;
}

// Valider la taille du contenu HTML
export function validateHtmlSize(html: string): boolean {
  return new Blob([html]).size <= API_LIMITS.MAX_HTML_SIZE;
}

// Nettoyer et préparer le HTML pour l'analyse
export function prepareHtmlForAnalysis(html: string): string {
  // Supprimer les commentaires HTML
  let cleaned = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // Supprimer les scripts externes et les styles volumineux
  cleaned = cleaned.replace(/<script[^>]*src[^>]*><\/script>/gi, '');
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Garder seulement les 10 premiers scripts inline pour l'analyse
  const scriptMatches = cleaned.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];
  if (scriptMatches.length > 10) {
    scriptMatches.slice(10).forEach(script => {
      cleaned = cleaned.replace(script, '');
    });
  }

  return cleaned;
} 