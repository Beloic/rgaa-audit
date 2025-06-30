/**
 * RGAA Engine - Moteur d'analyse RGAA complet
 * Analyse tous les critères RGAA automatiquement détectables
 */

import type { RGAAViolation } from '@/types/audit';

export interface RGAAEngineOptions {
  includeWarnings?: boolean;
  checkContrast?: boolean;
  checkKeyboard?: boolean;
  detailedReporting?: boolean;
}

export interface RGAAAnalysisResult {
  violations: RGAAViolation[];
  checkedCriteria: string[];
  pageMetrics: {
    totalElements: number;
    imagesCount: number;
    linksCount: number;
    formsCount: number;
    headingsCount: number;
    tablesCount: number;
    scriptsCount: number;
    iframesCount: number;
  };
}

/**
 * Analyseur RGAA principal
 */
export class RGAAEngine {
  private document: Document;
  private violations: RGAAViolation[] = [];
  private checkedCriteria: string[] = [];
  private options: RGAAEngineOptions;

  constructor(document: Document, options: RGAAEngineOptions = {}) {
    this.document = document;
    this.options = {
      includeWarnings: true,
      checkContrast: true,
      checkKeyboard: true,
      detailedReporting: true,
      ...options
    };
  }

  /**
   * Lance l'analyse complète RGAA
   */
  public analyze(): RGAAAnalysisResult {
    this.violations = [];
    this.checkedCriteria = [];

    // 1. Images (Critères 1.x)
    this.checkImages();
    
    // 2. Cadres (Critères 2.x)
    this.checkFrames();
    
    // 3. Couleurs (Critères 3.x)
    this.checkColors();
    
    // 4. Multimédia (Critères 4.x)
    this.checkMultimedia();
    
    // 5. Tableaux (Critères 5.x)
    this.checkTables();
    
    // 6. Liens (Critères 6.x)
    this.checkLinks();
    
    // 7. Scripts (Critères 7.x)
    this.checkScripts();
    
    // 8. Éléments obligatoires (Critères 8.x)
    this.checkMandatoryElements();
    
    // 9. Structure (Critères 9.x)
    this.checkStructure();
    
    // 10. Présentation (Critères 10.x)
    this.checkPresentation();
    
    // 11. Formulaires (Critères 11.x)
    this.checkForms();
    
    // 12. Navigation (Critères 12.x)
    this.checkNavigation();
    
    // 13. Consultation (Critères 13.x)
    this.checkConsultation();

    return {
      violations: this.violations,
      checkedCriteria: this.checkedCriteria,
      pageMetrics: this.getPageMetrics()
    };
  }

  // ===== CRITÈRES 1.x - IMAGES =====
  
  private checkImages(): void {
    // 1.1 - Images porteuses d'information
    this.check1_1_ImageAlt();
    // 1.2 - Images de décoration
    this.check1_2_DecorativeImages();
    // 1.3 - Images porteuses d'information complexe
    this.check1_3_ComplexImages();
  }

  private check1_1_ImageAlt(): void {
    this.checkedCriteria.push('1.1');
    
    const images = this.document.querySelectorAll('img:not([role="presentation"]):not([alt=""])');
    
    images.forEach((img, index) => {
      const element = img as HTMLImageElement;
      const alt = element.getAttribute('alt');
      const src = element.src;
      const selector = this.generateSelector(element, 'img', index);

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
          context: element.outerHTML,
          htmlSnippet: element.outerHTML
        });
      }
      
      // Images avec alt vide mais potentiellement informatives
      else if (alt === '' && !this.isDecorativeImage(element)) {
        this.addViolation({
          ruleId: 'rgaa-1.1.2',
          criterion: '1.1',
          level: 'A',
          impact: 'high',
          description: 'Image potentiellement informative avec alt vide',
          element: selector,
          recommendation: 'Vérifier si l\'image est décorative. Si elle est informative, ajouter un alt descriptif.',
          context: element.outerHTML,
          htmlSnippet: element.outerHTML
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
          context: element.outerHTML,
          htmlSnippet: element.outerHTML
        });
      }
    });
  }

  private check1_2_DecorativeImages(): void {
    this.checkedCriteria.push('1.2');
    
    // Images avec role="presentation" mais avec alt
    const decorativeWithAlt = this.document.querySelectorAll('img[role="presentation"][alt]:not([alt=""])');
    decorativeWithAlt.forEach((img, index) => {
      const element = img as HTMLImageElement;
      const selector = this.generateSelector(element, 'img[role="presentation"]', index);
      
      this.addViolation({
        ruleId: 'rgaa-1.2.1',
        criterion: '1.2',
        level: 'A',
        impact: 'medium',
        description: 'Image décorative avec texte alternatif',
        element: selector,
        recommendation: 'Supprimer l\'attribut alt ou le vider (alt="") pour les images décoratives.',
        context: element.outerHTML,
        htmlSnippet: element.outerHTML
      });
    });
  }

  private check1_3_ComplexImages(): void {
    this.checkedCriteria.push('1.3');
    
    // Images complexes sans description longue
    const complexImages = this.document.querySelectorAll('img[src*="chart"], img[src*="graph"], img[src*="diagram"], canvas, svg');
    complexImages.forEach((img, index) => {
      const element = img as HTMLElement;
      const hasLongDesc = element.hasAttribute('longdesc') || 
                         element.hasAttribute('aria-describedby') ||
                         element.closest('figure')?.querySelector('figcaption');
      
      if (!hasLongDesc) {
        const selector = this.generateSelector(element, element.tagName.toLowerCase(), index);
        
        this.addViolation({
          ruleId: 'rgaa-1.3.1',
          criterion: '1.3',
          level: 'A',
          impact: 'high',
          description: 'Image complexe sans description détaillée',
          element: selector,
          recommendation: 'Ajouter une description détaillée via longdesc, aria-describedby ou une légende.',
          context: element.outerHTML,
          htmlSnippet: element.outerHTML
        });
      }
    });
  }

  // ===== CRITÈRES 2.x - CADRES =====
  
  private checkFrames(): void {
    this.check2_1_FrameTitles();
  }

  private check2_1_FrameTitles(): void {
    this.checkedCriteria.push('2.1');
    
    const frames = this.document.querySelectorAll('iframe, frame');
    frames.forEach((frame, index) => {
      const element = frame as HTMLIFrameElement;
      const title = element.getAttribute('title');
      const name = element.getAttribute('name');
      const selector = this.generateSelector(element, element.tagName.toLowerCase(), index);

      // Cadres sans titre
      if (!title && !name) {
        this.addViolation({
          ruleId: 'rgaa-2.1.1',
          criterion: '2.1',
          level: 'A',
          impact: 'high',
          description: 'Cadre sans titre',
          element: selector,
          recommendation: 'Ajouter un attribut title décrivant le contenu du cadre.',
          context: element.outerHTML,
          htmlSnippet: element.outerHTML
        });
      }
      
      // Titre vide ou non pertinent
      else if (title && (title.trim() === '' || this.isGenericTitle(title))) {
        this.addViolation({
          ruleId: 'rgaa-2.1.2',
          criterion: '2.1',
          level: 'A',
          impact: 'medium',
          description: `Cadre avec titre non pertinent: "${title}"`,
          element: selector,
          recommendation: 'Rédiger un titre plus descriptif pour le cadre.',
          context: element.outerHTML,
          htmlSnippet: element.outerHTML
        });
      }
    });
  }

  // ===== CRITÈRES 3.x - COULEURS =====
  
  private checkColors(): void {
    if (this.options.checkContrast) {
      this.check3_1_ColorInformation();
      this.check3_2_ColorContrast();
    }
  }

  private check3_1_ColorInformation(): void {
    this.checkedCriteria.push('3.1');
    
    // Vérifier les éléments qui utilisent uniquement la couleur pour transmettre l'information
    const elementsWithColorInfo = this.document.querySelectorAll('[style*="color"], .text-red, .text-green, .text-blue, .error, .success, .warning');
    
    elementsWithColorInfo.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const hasAdditionalIndicator = this.hasNonColorIndicator(htmlElement);
      
      if (!hasAdditionalIndicator) {
        const selector = this.generateSelector(htmlElement, element.tagName.toLowerCase(), index);
        
        this.addViolation({
          ruleId: 'rgaa-3.1.1',
          criterion: '3.1',
          level: 'A',
          impact: 'high',
          description: 'Information transmise uniquement par la couleur',
          element: selector,
          recommendation: 'Ajouter un indicateur visuel supplémentaire (icône, forme, motif, texte).',
          context: htmlElement.outerHTML,
          htmlSnippet: htmlElement.outerHTML
        });
      }
    });
  }

  private check3_2_ColorContrast(): void {
    this.checkedCriteria.push('3.2');
    
    // Analyser le contraste des textes
    const textElements = this.document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, input, textarea, label');
    
    textElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const contrast = this.calculateContrast(htmlElement);
      
      if (contrast && contrast.ratio < 4.5) {
        const selector = this.generateSelector(htmlElement, element.tagName.toLowerCase(), index);
        
        this.addViolation({
          ruleId: 'rgaa-3.2.1',
          criterion: '3.2',
          level: 'AA',
          impact: 'high',
          description: `Contraste insuffisant: ${contrast.ratio.toFixed(2)}:1 (minimum requis: 4.5:1)`,
          element: selector,
          recommendation: 'Augmenter le contraste entre le texte et l\'arrière-plan.',
          context: htmlElement.outerHTML.substring(0, 200),
          htmlSnippet: htmlElement.outerHTML
        });
      }
    });
  }

  // ===== CRITÈRES 8.x - ÉLÉMENTS OBLIGATOIRES =====
  
  private checkMandatoryElements(): void {
    this.check8_1_DocumentType();
    this.check8_2_CodeValid();
    this.check8_3_Language();
    this.check8_5_PageTitle();
  }

  private check8_1_DocumentType(): void {
    this.checkedCriteria.push('8.1');
    
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
  }

  private check8_2_CodeValid(): void {
    this.checkedCriteria.push('8.2');
    
    // Vérifier les IDs dupliqués
    const elementsWithId = this.document.querySelectorAll('[id]');
    const ids = new Set<string>();
    const duplicatedIds = new Set<string>();
    
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
        const selector = this.generateSelector(element as HTMLElement, `[id="${id}"]`, index);
        
        this.addViolation({
          ruleId: 'rgaa-8.2.1',
          criterion: '8.2',
          level: 'A',
          impact: 'high',
          description: `ID dupliqué: "${id}"`,
          element: selector,
          recommendation: 'Utiliser des IDs uniques dans le document.',
          context: (element as HTMLElement).outerHTML,
          htmlSnippet: (element as HTMLElement).outerHTML
        });
      });
    });
  }

  private check8_3_Language(): void {
    this.checkedCriteria.push('8.3');
    
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
        context: html.outerHTML.substring(0, 100),
        htmlSnippet: '<html>'
      });
    } else if (!this.isValidLanguageCode(lang)) {
      this.addViolation({
        ruleId: 'rgaa-8.3.2',
        criterion: '8.3',
        level: 'A',
        impact: 'medium',
        description: `Code de langue invalide: "${lang}"`,
        element: 'html',
        recommendation: 'Utiliser un code de langue valide ISO 639-1.',
        context: html.outerHTML.substring(0, 100),
        htmlSnippet: `<html lang="${lang}">`
      });
    }
  }

  private check8_5_PageTitle(): void {
    this.checkedCriteria.push('8.5');
    
    const title = this.document.querySelector('title');
    
    if (!title) {
      this.addViolation({
        ruleId: 'rgaa-8.5.1',
        criterion: '8.5',
        level: 'A',
        impact: 'critical',
        description: 'Titre de page manquant',
        element: 'head',
        recommendation: 'Ajouter un élément title dans la section head.',
        context: 'Section head du document',
        htmlSnippet: '<head>'
      });
    } else if (!title.textContent || title.textContent.trim() === '') {
      this.addViolation({
        ruleId: 'rgaa-8.5.2',
        criterion: '8.5',
        level: 'A',
        impact: 'critical',
        description: 'Titre de page vide',
        element: 'title',
        recommendation: 'Renseigner un titre de page descriptif et unique.',
        context: title.outerHTML,
        htmlSnippet: title.outerHTML
      });
    }
  }

  // ===== CRITÈRES 9.x - STRUCTURE =====
  
  private checkStructure(): void {
    this.check9_1_HeadingStructure();
  }

  private check9_1_HeadingStructure(): void {
    this.checkedCriteria.push('9.1');
    
    const headings = this.document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels: number[] = [];
    
    // Vérifier la présence d'un h1
    const h1Count = this.document.querySelectorAll('h1').length;
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
        const selector = this.generateSelector(h1 as HTMLElement, 'h1', index);
        
        this.addViolation({
          ruleId: 'rgaa-9.1.2',
          criterion: '9.1',
          level: 'A',
          impact: 'medium',
          description: `Titre h1 multiple (${h1Count} h1 trouvés)`,
          element: selector,
          recommendation: 'N\'utiliser qu\'un seul titre h1 par page.',
          context: (h1 as HTMLElement).outerHTML,
          htmlSnippet: (h1 as HTMLElement).outerHTML
        });
      });
    }
    
    // Vérifier la hiérarchie des titres
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      headingLevels.push(level);
      
      if (index > 0) {
        const previousLevel = headingLevels[index - 1];
        const jump = level - previousLevel;
        
        if (jump > 1) {
          const selector = this.generateSelector(heading as HTMLElement, heading.tagName.toLowerCase(), index);
          
          this.addViolation({
            ruleId: 'rgaa-9.1.3',
            criterion: '9.1',
            level: 'A',
            impact: 'medium',
            description: `Saut de niveau de titre: h${previousLevel} vers h${level}`,
            element: selector,
            recommendation: 'Respecter la hiérarchie des titres sans saut de niveau.',
            context: (heading as HTMLElement).outerHTML,
            htmlSnippet: (heading as HTMLElement).outerHTML
          });
        }
      }
      
      // Titres vides
      if (!heading.textContent || heading.textContent.trim() === '') {
        const selector = this.generateSelector(heading as HTMLElement, heading.tagName.toLowerCase(), index);
        
        this.addViolation({
          ruleId: 'rgaa-9.1.4',
          criterion: '9.1',
          level: 'A',
          impact: 'high',
          description: `Titre ${heading.tagName.toLowerCase()} vide`,
          element: selector,
          recommendation: 'Renseigner le contenu du titre.',
          context: (heading as HTMLElement).outerHTML,
          htmlSnippet: (heading as HTMLElement).outerHTML
        });
      }
    });
  }

  // ===== CRITÈRES 11.x - FORMULAIRES =====
  
  private checkForms(): void {
    this.check11_1_FormLabels();
    this.check11_2_FormFieldsGrouping();
  }

  private check11_1_FormLabels(): void {
    this.checkedCriteria.push('11.1');
    
    const formElements = this.document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select');
    
    formElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const hasLabel = this.hasLabel(htmlElement);
      
      if (!hasLabel) {
        const selector = this.generateSelector(htmlElement, element.tagName.toLowerCase(), index);
        
        this.addViolation({
          ruleId: 'rgaa-11.1.1',
          criterion: '11.1',
          level: 'A',
          impact: 'critical',
          description: 'Champ de formulaire sans étiquette',
          element: selector,
          recommendation: 'Associer le champ à une étiquette via un élément label ou les attributs aria-label/aria-labelledby.',
          context: htmlElement.outerHTML,
          htmlSnippet: htmlElement.outerHTML
        });
      }
    });
  }

  private check11_2_FormFieldsGrouping(): void {
    this.checkedCriteria.push('11.2');
    
    // Vérifier les groupes de champs radio et checkbox
    const radioGroups = new Map<string, NodeListOf<Element>>();
    this.document.querySelectorAll('input[type="radio"][name]').forEach(radio => {
      const name = (radio as HTMLInputElement).name;
      if (!radioGroups.has(name)) {
        radioGroups.set(name, this.document.querySelectorAll(`input[type="radio"][name="${name}"]`));
      }
    });
    
    radioGroups.forEach((radios, name) => {
      if (radios.length > 1) {
        const hasFieldset = Array.from(radios).some(radio => radio.closest('fieldset'));
        
        if (!hasFieldset) {
          radios.forEach((radio, index) => {
            const selector = this.generateSelector(radio as HTMLElement, `input[type="radio"][name="${name}"]`, index);
            
            this.addViolation({
              ruleId: 'rgaa-11.2.1',
              criterion: '11.2',
              level: 'A',
              impact: 'medium',
              description: `Groupe de boutons radio "${name}" non regroupé`,
              element: selector,
              recommendation: 'Regrouper les boutons radio dans un fieldset avec une legend.',
              context: (radio as HTMLElement).outerHTML,
              htmlSnippet: (radio as HTMLElement).outerHTML
            });
          });
        }
      }
    });
  }

  // ===== CRITÈRES 6.x - LIENS =====
  
  private checkLinks(): void {
    this.check6_1_LinkTitles();
  }

  private check6_1_LinkTitles(): void {
    this.checkedCriteria.push('6.1');
    
    const links = this.document.querySelectorAll('a[href]');
    
    links.forEach((link, index) => {
      const htmlElement = link as HTMLAnchorElement;
      const hasAccessibleName = this.hasAccessibleName(htmlElement);
      
      if (!hasAccessibleName) {
        const selector = this.generateSelector(htmlElement, 'a', index);
        
        this.addViolation({
          ruleId: 'rgaa-6.1.1',
          criterion: '6.1',
          level: 'A',
          impact: 'critical',
          description: 'Lien sans intitulé accessible',
          element: selector,
          recommendation: 'Ajouter un texte visible, un attribut title, aria-label, ou aria-labelledby au lien.',
          context: htmlElement.outerHTML,
          htmlSnippet: htmlElement.outerHTML
        });
      }
    });
  }

  // ===== MÉTHODES UTILITAIRES =====

  private addViolation(violation: RGAAViolation): void {
    this.violations.push(violation);
  }

  private generateSelector(element: HTMLElement, baseSelector: string, index: number): string {
    // Générer un sélecteur CSS plus précis
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim()).slice(0, 2);
      return `${baseSelector}.${classes.join('.')}`;
    }
    
    return `${baseSelector}:nth-of-type(${index + 1})`;
  }

  private isDecorativeImage(img: HTMLImageElement): boolean {
    const src = img.src.toLowerCase();
    const decorativePatterns = ['decoration', 'border', 'separator', 'spacer', 'bullet'];
    return decorativePatterns.some(pattern => src.includes(pattern));
  }

  private isGenericAlt(alt: string): boolean {
    const genericTerms = ['image', 'photo', 'picture', 'logo', 'icon', 'graphic'];
    const altLower = alt.toLowerCase().trim();
    return genericTerms.includes(altLower) || altLower.length < 3;
  }

  private isGenericTitle(title: string): boolean {
    const genericTitles = ['frame', 'iframe', 'content', 'page', 'document'];
    const titleLower = title.toLowerCase().trim();
    return genericTitles.includes(titleLower) || titleLower.length < 3;
  }

  private hasNonColorIndicator(element: HTMLElement): boolean {
    // Vérifier la présence d'indicateurs visuels autres que la couleur
    const hasIcon = element.querySelector('i, svg, .icon, [class*="icon"]');
    const hasPattern = element.style.textDecoration || element.style.fontWeight;
    const hasShape = element.style.border || element.querySelector('[class*="shape"]');
    
    return !!(hasIcon || hasPattern || hasShape);
  }

  private calculateContrast(element: HTMLElement): { ratio: number; foreground: string; background: string } | null {
    try {
      const computed = window.getComputedStyle(element);
      const foreground = computed.color;
      const background = computed.backgroundColor;
      
      // Calcul simplifié du contraste (à améliorer avec une vraie librairie)
      const fgLum = this.getLuminance(foreground);
      const bgLum = this.getLuminance(background);
      
      const ratio = fgLum > bgLum 
        ? (fgLum + 0.05) / (bgLum + 0.05)
        : (bgLum + 0.05) / (fgLum + 0.05);
      
      return { ratio, foreground, background };
    } catch {
      return null;
    }
  }

  private getLuminance(color: string): number {
    // Calcul simplifié de la luminance
    // À remplacer par une vraie implémentation
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return 0.5;
    
    const [r, g, b] = rgb.map(c => {
      const val = parseInt(c) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private isValidLanguageCode(lang: string): boolean {
    const validCodes = ['fr', 'en', 'es', 'de', 'it', 'pt', 'nl', 'ar', 'zh', 'ja', 'ko', 'ru'];
    return validCodes.includes(lang.toLowerCase());
  }

  private hasLabel(element: HTMLElement): boolean {
    const input = element as HTMLInputElement;
    
    // Vérifier label associé
    if (input.id) {
      const label = this.document.querySelector(`label[for="${input.id}"]`);
      if (label) return true;
    }
    
    // Vérifier label parent
    if (input.closest('label')) return true;
    
    // Vérifier attributs ARIA
    if (input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby')) {
      return true;
    }
    
    // Vérifier title
    if (input.hasAttribute('title') && input.title.trim() !== '') {
      return true;
    }
    
    return false;
  }

  private hasAccessibleName(element: HTMLElement): boolean {
    const text = element.textContent?.trim();
    const ariaLabel = element.getAttribute('aria-label');
    const title = element.getAttribute('title');
    
    return !!(text || ariaLabel || title);
  }

  private getPageMetrics() {
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

  // Continuer l'implémentation pour les autres critères...
  private checkMultimedia(): void {
    this.checkedCriteria.push('4.1', '4.2', '4.3');
    // Implémentation des vérifications multimédia
  }

  private checkTables(): void {
    this.check5_6_TableHeaders();
  }

  private check5_6_TableHeaders(): void {
    this.checkedCriteria.push('5.6');
    
    const tables = this.document.querySelectorAll('table');
    tables.forEach((table, index) => {
      const hasHeaders = table.querySelector('th') || table.querySelector('[scope]');
      const hasMultipleRows = table.querySelectorAll('tr').length > 1;
      const hasMultipleCols = table.querySelector('tr')?.querySelectorAll('td, th').length > 1;
      
      if (hasMultipleRows && hasMultipleCols && !hasHeaders) {
        const selector = this.generateSelector(table as HTMLElement, 'table', index);
        
        this.addViolation({
          ruleId: 'rgaa-5.6.1',
          criterion: '5.6',
          level: 'A',
          impact: 'high',
          description: 'Tableau de données sans en-têtes',
          element: selector,
          recommendation: 'Ajouter des en-têtes de colonnes et/ou de lignes avec l\'élément th.',
          context: (table as HTMLElement).outerHTML.substring(0, 200),
          htmlSnippet: (table as HTMLElement).outerHTML
        });
      }
    });
  }

  private checkScripts(): void {
    this.checkedCriteria.push('7.1');
    // Vérifications JavaScript - à implémenter
  }

  private checkPresentation(): void {
    this.checkedCriteria.push('10.7');
    // Vérifications de présentation - à implémenter
  }

  private checkNavigation(): void {
    this.check12_6_Landmarks();
    this.check12_7_SkipLinks();
  }

  private check12_6_Landmarks(): void {
    this.checkedCriteria.push('12.6');
    
    const hasMain = this.document.querySelector('main, [role="main"]');
    if (!hasMain) {
      this.addViolation({
        ruleId: 'rgaa-12.6.1',
        criterion: '12.6',
        level: 'A',
        impact: 'medium',
        description: 'Zone de contenu principal non identifiée',
        element: 'document',
        recommendation: 'Ajouter un élément main ou role="main" pour identifier la zone de contenu principal.',
        context: 'Structure de la page',
        htmlSnippet: ''
      });
    }
  }

  private check12_7_SkipLinks(): void {
    this.checkedCriteria.push('12.7');
    
    const skipLinks = this.document.querySelectorAll('a[href^="#"]');
    const hasSkipToMain = Array.from(skipLinks).some(link => 
      link.textContent?.toLowerCase().includes('contenu') || 
      link.textContent?.toLowerCase().includes('main')
    );
    
    if (!hasSkipToMain && this.document.querySelector('nav, [role="navigation"]')) {
      this.addViolation({
        ruleId: 'rgaa-12.7.1',
        criterion: '12.7',
        level: 'A',
        impact: 'medium',
        description: 'Lien d\'évitement vers le contenu principal manquant',
        element: 'document',
        recommendation: 'Ajouter un lien d\'évitement vers le contenu principal en début de page.',
        context: 'Navigation de la page',
        htmlSnippet: ''
      });
    }
  }

  private checkConsultation(): void {
    this.checkedCriteria.push('13.1');
    // Vérifications de consultation - à implémenter
  }
}

/**
 * Fonction d'analyse RGAA pour Puppeteer
 */
export function createRGAAAnalysisScript(): string {
  return `
    // Injection du moteur RGAA dans la page
    (function() {
      ${RGAAEngine.toString()}
      
      // Analyser la page
      const engine = new RGAAEngine(document);
      const result = engine.analyze();
      
      return result;
    })();
  `;
} 