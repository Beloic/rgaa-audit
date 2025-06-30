import jsPDF from 'jspdf';
import { AuditResult, RGAAViolation } from '@/types/audit';
import { RGAA_CRITERIA } from './constants';

interface ReportConfig {
  serviceName: string;
  auditorName: string;
  auditDate: string;
  rgaaVersion: string;
  technologies: string[];
  tools: string[];
  testEnvironment: string[];
  samplePages: Array<{
    name: string;
    url: string;
    comments?: string;
  }>;
}

export class RGAAReportGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageWidth: number;
  private pageHeight: number;
  private leftMargin: number = 20;
  private rightMargin: number = 20;
  private lineHeight: number = 6;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  generateReport(result: AuditResult, config: ReportConfig): Blob {
    this.addHeader();
    this.addTableOfContents();
    this.addIntroduction(config);
    this.addAccessibilityOverview(result);
    this.addErrorDescriptions(result);
    this.addConclusion(result);
    
    return new Blob([this.doc.output('blob')], { type: 'application/pdf' });
  }

  private addHeader() {
    // En-tête officiel
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Accessibilité numérique', this.leftMargin, this.currentY);
    
    this.currentY += 10;
    this.doc.setFontSize(18);
    this.doc.text('Modèle de rapport d\'audit RGAA', this.leftMargin, this.currentY);
    
    this.currentY += 20;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    
    // Informations du document
    const fields = [
      'Nom du service numérique : _________________________',
      'Date de l\'audit : _____________________',
      'Audit réalisé par : _____________________'
    ];
    
    fields.forEach(field => {
      this.doc.text(field, this.leftMargin, this.currentY);
      this.currentY += 8;
    });
    
    this.addPageBreak();
  }

  private addTableOfContents() {
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Table des matières', this.leftMargin, this.currentY);
    
    this.currentY += 15;
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    const toc = [
      'Introduction ............................................. 3',
      'Contexte ................................................ 3',
      'Accessibilité du site .................................. 4',
      'Description des erreurs d\'accessibilité ................ 5',
      '  Images ................................................ 5',
      '  Cadres ................................................ 5',
      '  Couleurs .............................................. 5',
      '  Multimédia ............................................ 6',
      '  Tableaux .............................................. 6',
      '  Liens ................................................. 6',
      '  Scripts ............................................... 6',
      '  Éléments obligatoires ................................. 6',
      '  Structuration de l\'information ........................ 7',
      '  Présentation de l\'information ......................... 7',
      '  Formulaires ........................................... 7',
      '  Navigation ............................................ 7',
      '  Consultation .......................................... 8',
      'Conclusion .............................................. 9',
      'Avis de l\'inspecteur .................................... 9',
      'Priorisation des corrections ........................... 9'
    ];
    
    toc.forEach(item => {
      this.doc.text(item, this.leftMargin, this.currentY);
      this.currentY += 6;
    });
    
    this.addPageBreak();
  }

  private addIntroduction(config: ReportConfig) {
    this.addSectionTitle('Introduction');
    
    this.addSubsectionTitle('Contexte');
    
    const introText = `
Un rapport d'audit doit permettre au responsable du site internet, intranet ou extranet :

1) de comprendre les erreurs d'accessibilité présentes sur son site ;
2) d'estimer la faisabilité des corrections, leur coût et les délais nécessaires à leur mise en œuvre.

Pour faciliter l'appropriation d'un document qui peut rapidement se révéler très technique, il est nécessaire de le structurer. Il est proposé de réaliser un découpage en 3 parties : une introduction, une partie comportant les explications pour chacune des erreurs d'accessibilité et une conclusion.

L'introduction et la conclusion doivent être écrites de manière à pouvoir être comprises par des non-techniciens. Les explications détaillées des non-conformités peuvent être plus techniques, afin que les concepteurs et développeurs du site puissent comprendre où se situe l'erreur et effectuer les corrections.`;

    this.addParagraph(introText);
    
    this.currentY += 10;
    this.addParagraph(`La version utilisée pour réaliser les tests est la version ${config.rgaaVersion} du RGAA.`);
    
    this.currentY += 10;
    this.addParagraph('Les technologies utilisées sur le site sont les suivantes :');
    config.technologies.forEach(tech => {
      this.addBulletPoint(tech);
    });
    
    this.currentY += 10;
    this.addParagraph('Les outils suivants ont été utilisés pour vérifier l\'accessibilité :');
    config.tools.forEach(tool => {
      this.addBulletPoint(tool);
    });
    
    this.currentY += 10;
    this.addParagraph('La restitution des contenus avec les technologies d\'assistance a été testée conformément à l\'environnement de test décrit dans le RGAA 4 :');
    config.testEnvironment.forEach(env => {
      this.addBulletPoint(env);
    });
    
    this.addPageBreak();
  }

  private addAccessibilityOverview(result: AuditResult) {
    this.addSectionTitle('Accessibilité du site');
    
    const score = result.score || 0;
    const totalViolations = result.totalViolations || 0;
    const totalCriteria = 106; // Total RGAA criteria
    const conformCriteria = totalCriteria - Object.keys(this.groupViolationsByCriterion(result.violations)).length;
    const conformanceRate = Math.round((conformCriteria / totalCriteria) * 100);
    
    this.addParagraph(`Le site présente un taux moyen d'accessibilité de ${score}%.`);
    this.addParagraph(`Le pourcentage de critères respectés est de ${conformanceRate}% (${conformCriteria} critères sur ${totalCriteria}).`);
    
    if (totalViolations > 0) {
      const criticalCount = result.violations.filter(v => v.impact === 'critical' || v.impact === 'serious').length;
      const highCount = result.violations.filter(v => v.impact === 'high').length;
      
      this.addParagraph(`L'audit a révélé ${totalViolations} non-conformités, dont ${criticalCount} critiques nécessitant une attention immédiate et ${highCount} importantes à corriger en priorité.`);
      
      if (score < 50) {
        this.addParagraph('Le niveau d\'accessibilité actuel du site nécessite des améliorations importantes pour garantir un accès équitable à tous les utilisateurs, notamment les personnes en situation de handicap.');
      } else if (score < 80) {
        this.addParagraph('Le site présente un niveau d\'accessibilité moyen. Des améliorations ciblées permettraient d\'atteindre un niveau de conformité satisfaisant.');
      } else {
        this.addParagraph('Le site présente un bon niveau d\'accessibilité avec quelques points d\'amélioration à apporter.');
      }
    } else {
      this.addParagraph('Excellente nouvelle ! L\'audit automatisé n\'a détecté aucune non-conformité majeure. Le site respecte les critères RGAA analysés automatiquement.');
      this.addParagraph('Note : Un audit manuel complémentaire est recommandé pour vérifier l\'ensemble des critères RGAA.');
    }
    
    this.addPageBreak();
  }

  private addErrorDescriptions(result: AuditResult) {
    this.addSectionTitle('Description des erreurs d\'accessibilité');
    
    this.addParagraph(`Sont détaillées ici les critères non conformes relevés lors de l'audit. Chaque critère non conforme est présenté de manière succincte avec une description du problème et une recommandation technique.`);
    
    this.addParagraph(`L'audit a été réalisé en gardant à l'esprit la notion d'aménagement raisonnable. La première attente des utilisateurs est de pouvoir accéder aux contenus et fonctionnalités des sites publics. Mettre en place des alternatives peut être un compromis acceptable à condition qu'elles fournissent le même niveau d'information et des fonctionnalités équivalentes.`);
    
    // Grouper les violations par thème RGAA
    const violationsByTheme = this.groupViolationsByTheme(result.violations);
    
    Object.entries(violationsByTheme).forEach(([theme, violations]) => {
      if (violations.length > 0) {
        this.addThemeSection(theme, violations);
      }
    });
    
    this.addPageBreak();
  }

  private addThemeSection(theme: string, violations: RGAAViolation[]) {
    const themeInfo = this.getThemeInfo(theme);
    
    this.addSubsectionTitle(themeInfo.title);
    this.addParagraph(themeInfo.description);
    
    this.currentY += 5;
    
    // Grouper par critère
    const violationsByCriterion = this.groupViolationsByCriterion(violations);
    
    Object.entries(violationsByCriterion).forEach(([criterion, criterionViolations]) => {
      this.addCriterionSection(criterion, criterionViolations);
    });
  }

  private addCriterionSection(criterion: string, violations: RGAAViolation[]) {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.text(`Critère ${criterion}`, this.leftMargin, this.currentY);
    this.currentY += 6;
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    
    // Prendre la première violation comme exemple représentatif
    const mainViolation = violations[0];
    const count = violations.length;
    
    // Description du problème
    this.addParagraph(`Problème détecté : ${mainViolation.description}`);
    if (count > 1) {
      this.addParagraph(`Nombre d'occurrences : ${count}`);
    }
    
    // Élément concerné
    if (mainViolation.element) {
      this.addParagraph(`Élément concerné : ${mainViolation.element}`);
    }
    
    // Code HTML si disponible
    if (mainViolation.htmlSnippet) {
      this.addParagraph(`Extrait de code :`);
      this.addCodeBlock(mainViolation.htmlSnippet);
    }
    
    // Recommandation
    this.addParagraph(`Recommandation technique : ${mainViolation.recommendation}`);
    
    this.currentY += 8;
  }

  private addConclusion(result: AuditResult) {
    this.addSectionTitle('Conclusion');
    
    this.addSubsectionTitle('Avis général');
    
    const score = result.score || 0;
    const totalViolations = result.totalViolations || 0;
    
    if (score >= 80) {
      this.addParagraph('Le site présente un bon niveau d\'accessibilité global. Les équipes de développement ont fait des efforts significatifs pour respecter les standards d\'accessibilité. Les quelques non-conformités détectées sont généralement mineures et peuvent être corrigées facilement.');
    } else if (score >= 60) {
      this.addParagraph('Le site présente un niveau d\'accessibilité moyen. Les bases de l\'accessibilité sont en place, mais des améliorations importantes sont nécessaires pour garantir une expérience utilisateur optimale pour tous. Les équipes techniques semblent sensibilisées aux questions d\'accessibilité.');
    } else if (score >= 30) {
      this.addParagraph('Le site présente un niveau d\'accessibilité faible qui nécessite des améliorations importantes. De nombreuses barrières empêchent l\'accès aux contenus et fonctionnalités pour les personnes en situation de handicap. Un plan d\'action prioritaire est nécessaire.');
    } else {
      this.addParagraph('Le site présente de graves lacunes en matière d\'accessibilité. L\'accès aux contenus et fonctionnalités est très difficile voire impossible pour les utilisateurs de technologies d\'assistance. Une refonte importante est recommandée avec une approche accessibilité dès la conception.');
    }
    
    this.addSubsectionTitle('Priorisation des corrections');
    
    this.addParagraph('L\'audit RGAA consiste à relever les non-conformités trouvées sur les pages auditées. Lorsque ces non-conformités sont nombreuses, il est important de donner des éléments pour aider le responsable du site à prioriser les corrections.');
    
    this.addParagraph('Les corrections peuvent être priorisées selon 3 axes :');
    
    this.addBulletPoint('Selon les fonctionnalités et contenus essentiels du site : prioriser les corrections qui permettent l\'accès aux fonctionnalités principales');
    this.addBulletPoint('Selon une sélection de critères prioritaires qui bloquent l\'accès à certains contenus et certaines fonctionnalités');
    this.addBulletPoint('Selon la facilité de mise en œuvre : certaines corrections sont simples et peu coûteuses, permettant des victoires rapides et motivantes');
    
    if (totalViolations > 0) {
      const criticalViolations = result.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
      const highViolations = result.violations.filter(v => v.impact === 'high');
      
      this.addParagraph('Recommandations de priorisation pour ce site :');
      
      if (criticalViolations.length > 0) {
        this.addBulletPoint(`Priorité 1 (Critique) : ${criticalViolations.length} problèmes bloquant l'accès aux contenus - À corriger immédiatement`);
      }
      
      if (highViolations.length > 0) {
        this.addBulletPoint(`Priorité 2 (Importante) : ${highViolations.length} problèmes impactant significativement l'expérience utilisateur - À corriger dans le mois`);
      }
      
      const otherViolations = result.violations.filter(v => !['critical', 'serious', 'high'].includes(v.impact));
      if (otherViolations.length > 0) {
        this.addBulletPoint(`Priorité 3 (Modérée) : ${otherViolations.length} problèmes d'amélioration de l'expérience - À corriger dans le trimestre`);
      }
    }
    
    this.addParagraph('Il est important dans tous les cas de garder en tête que les corrections doivent permettre un meilleur accès aux contenus et services par les personnes potentiellement exclues en raison des erreurs d\'accessibilité.');
  }

  private getThemeInfo(theme: string): { title: string; description: string } {
    const themeMapping: Record<string, { title: string; description: string }> = {
      'images': {
        title: 'Images',
        description: 'Donner à chaque image porteuse d\'information une alternative textuelle pertinente et une description détaillée si nécessaire. Lier les légendes à leurs images. Remplacer les images textes par du texte stylé lorsque c\'est possible.'
      },
      'frames': {
        title: 'Cadres',
        description: 'Donner à chaque cadre un titre pertinent.'
      },
      'colors': {
        title: 'Couleurs',
        description: 'Ne pas donner l\'information uniquement par la couleur et utiliser des contrastes de couleurs suffisamment élevés pour les textes, les composants d\'interface ou les éléments porteurs d\'informations.'
      },
      'multimedia': {
        title: 'Multimédia',
        description: 'Donner à chaque média temporel audio et/ou vidéo une transcription textuelle, des sous-titres ou une audio-description pertinents lorsque cela est nécessaire. Donner à chaque contenu graphique ou interactif une alternative textuelle pertinente.'
      },
      'tables': {
        title: 'Tableaux',
        description: 'Associer correctement les tableaux de données à leur titre, donner à chaque tableau de données complexe un résumé, identifier clairement les cellules d\'en-tête, utiliser un mécanisme pertinent pour lier les cellules de données aux cellules d\'en-tête.'
      },
      'links': {
        title: 'Liens',
        description: 'Utiliser des intitulés de liens explicites, grâce à des informations de contexte notamment.'
      },
      'scripts': {
        title: 'Scripts',
        description: 'Donner si nécessaire à chaque script une alternative pertinente. Avertir ou permettre le contrôle des scripts qui initient un changement de contexte. Rendre possible le contrôle de chaque code script au moins par le clavier et par tout dispositif de pointage.'
      },
      'mandatory_elements': {
        title: 'Éléments obligatoires',
        description: 'Vérifier que dans chaque page Web, le code source généré respecte les règles d\'écriture correspondant au type de document, que le titre est pertinent et la langue par défaut, indiquée.'
      },
      'structure': {
        title: 'Structuration de l\'information',
        description: 'Utiliser des titres, des listes, et des citations pour structurer l\'information. S\'assurer que la structure du document est cohérente.'
      },
      'presentation': {
        title: 'Présentation de l\'information',
        description: 'Utiliser des feuilles de styles pour présenter de l\'information. S\'assurer que l\'information reste compréhensible lorsque les feuilles de styles sont désactivées. Vérifier l\'effet de l\'agrandissement à 200% de la taille des caractères.'
      },
      'forms': {
        title: 'Formulaires',
        description: 'Pour chaque formulaire, associer chacun de ses champs à son étiquette, grouper les champs de même nature et leur donner une légende, structurer les listes de choix de manière pertinente, donner à chaque bouton un intitulé explicite.'
      },
      'navigation': {
        title: 'Navigation',
        description: 'Proposer au moins deux systèmes de navigation différents dans un ensemble de pages. Donner la possibilité d\'éviter ou d\'atteindre les principaux regroupements de contenus en particulier la zone de contenu principale.'
      },
      'consultation': {
        title: 'Consultation',
        description: 'S\'assurer que l\'utilisateur a le contrôle des actions imposées après un certain délai notamment les procédés de rafraîchissement. Donner la possibilité de contrôler les changements brusques de luminosité, les ouvertures de nouvelles fenêtres et les contenus en mouvement ou clignotants.'
      }
    };
    
    return themeMapping[theme] || { title: theme, description: 'Description non disponible.' };
  }

  private groupViolationsByTheme(violations: RGAAViolation[]): Record<string, RGAAViolation[]> {
    const themes: Record<string, RGAAViolation[]> = {};
    
    violations.forEach(violation => {
      const theme = this.getCriterionTheme(violation.criterion);
      if (!themes[theme]) {
        themes[theme] = [];
      }
      themes[theme].push(violation);
    });
    
    return themes;
  }

  private groupViolationsByCriterion(violations: RGAAViolation[]): Record<string, RGAAViolation[]> {
    const criteria: Record<string, RGAAViolation[]> = {};
    
    violations.forEach(violation => {
      const criterion = violation.criterion;
      if (!criteria[criterion]) {
        criteria[criterion] = [];
      }
      criteria[criterion].push(violation);
    });
    
    return criteria;
  }

  private getCriterionTheme(criterion: string): string {
    const criterionNum = parseFloat(criterion);
    
    if (criterionNum >= 1 && criterionNum < 2) return 'images';
    if (criterionNum >= 2 && criterionNum < 3) return 'frames';
    if (criterionNum >= 3 && criterionNum < 4) return 'colors';
    if (criterionNum >= 4 && criterionNum < 5) return 'multimedia';
    if (criterionNum >= 5 && criterionNum < 6) return 'tables';
    if (criterionNum >= 6 && criterionNum < 7) return 'links';
    if (criterionNum >= 7 && criterionNum < 8) return 'scripts';
    if (criterionNum >= 8 && criterionNum < 9) return 'mandatory_elements';
    if (criterionNum >= 9 && criterionNum < 10) return 'structure';
    if (criterionNum >= 10 && criterionNum < 11) return 'presentation';
    if (criterionNum >= 11 && criterionNum < 12) return 'forms';
    if (criterionNum >= 12 && criterionNum < 13) return 'navigation';
    if (criterionNum >= 13 && criterionNum < 14) return 'consultation';
    
    return 'other';
  }

  private addSectionTitle(title: string) {
    this.checkPageBreak(15);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.leftMargin, this.currentY);
    this.currentY += 10;
  }

  private addSubsectionTitle(title: string) {
    this.checkPageBreak(10);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.leftMargin, this.currentY);
    this.currentY += 8;
  }

  private addParagraph(text: string) {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const maxWidth = this.pageWidth - this.leftMargin - this.rightMargin;
    const lines = this.doc.splitTextToSize(text, maxWidth);
    
    this.checkPageBreak(lines.length * this.lineHeight);
    
    lines.forEach((line: string) => {
      this.doc.text(line, this.leftMargin, this.currentY);
      this.currentY += this.lineHeight;
    });
    
    this.currentY += 3; // Espacement après paragraphe
  }

  private addBulletPoint(text: string) {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const maxWidth = this.pageWidth - this.leftMargin - this.rightMargin - 10;
    const lines = this.doc.splitTextToSize(text, maxWidth);
    
    this.checkPageBreak(lines.length * this.lineHeight);
    
    // Premier ligne avec puce
    this.doc.text('•', this.leftMargin + 5, this.currentY);
    this.doc.text(lines[0], this.leftMargin + 10, this.currentY);
    this.currentY += this.lineHeight;
    
    // Lignes suivantes indentées
    for (let i = 1; i < lines.length; i++) {
      this.doc.text(lines[i], this.leftMargin + 10, this.currentY);
      this.currentY += this.lineHeight;
    }
    
    this.currentY += 2; // Espacement après puce
  }

  private addCodeBlock(code: string) {
    this.doc.setFontSize(8);
    this.doc.setFont('courier', 'normal');
    
    const maxWidth = this.pageWidth - this.leftMargin - this.rightMargin - 10;
    const lines = this.doc.splitTextToSize(code, maxWidth);
    
    this.checkPageBreak(lines.length * 5 + 6);
    
    // Fond gris pour le code
    this.doc.setFillColor(245, 245, 245);
    this.doc.rect(this.leftMargin + 5, this.currentY - 3, maxWidth, lines.length * 5 + 6, 'F');
    
    lines.forEach((line: string) => {
      this.doc.text(line, this.leftMargin + 8, this.currentY);
      this.currentY += 5;
    });
    
    this.currentY += 6;
    this.doc.setFont('helvetica', 'normal');
  }

  private checkPageBreak(neededSpace: number) {
    if (this.currentY + neededSpace > this.pageHeight - 20) {
      this.addPageBreak();
    }
  }

  private addPageBreak() {
    this.doc.addPage();
    this.currentY = 20;
  }
}

// Fonction utilitaire pour générer le rapport
export async function generateRGAAReport(
  result: AuditResult, 
  config: Partial<ReportConfig> = {}
): Promise<Blob> {
  const defaultConfig: ReportConfig = {
    serviceName: result.url || 'Site web analysé',
    auditorName: 'Système d\'audit automatisé RGAA',
    auditDate: new Date().toLocaleDateString('fr-FR'),
    rgaaVersion: '4.1',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    tools: [
      'Analyseur RGAA automatisé',
      'Puppeteer pour le rendu de page',
      'Calculs de contraste de couleurs automatiques',
      'Tests de responsive design multi-écrans'
    ],
    testEnvironment: [
      'Chrome 120+ avec technologies d\'assistance simulées',
      'Tests de navigation clavier automatisés',
      'Vérification des zones tactiles 44x44px',
      'Tests de zoom jusqu\'à 200%'
    ],
    samplePages: [
      {
        name: 'Page analysée',
        url: result.url || 'Contenu HTML fourni',
        comments: 'Analyse automatisée complète'
      }
    ],
    ...config
  };
  
  const generator = new RGAAReportGenerator();
  return generator.generateReport(result, defaultConfig);
} 