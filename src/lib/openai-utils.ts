import OpenAI from 'openai';
import { RGAA_CRITERIA, TOTAL_RGAA_CRITERIA, ALL_RGAA_CRITERIA } from './constants';
import type { AuditResult, RGAAViolation } from '@/types/audit';

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Normaliser les valeurs d'impact
function normalizeImpact(impact: any): 'low' | 'medium' | 'high' | 'critical' {
  const impactMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    'low': 'low',
    'medium': 'medium', 
    'moderate': 'medium',
    'high': 'high',
    'serious': 'high',
    'critical': 'critical'
  };
  
  return impactMap[impact?.toLowerCase()] || 'medium';
}

// Générer le prompt système pour l'analyse RGAA/WCAG
function generateSystemPrompt(language: 'fr' | 'en'): string {
  const prompts = {
    fr: `Expert en accessibilité RGAA 4.1/WCAG 2.1. Analysez EXHAUSTIVEMENT le HTML selon TOUS les ${TOTAL_RGAA_CRITERIA} critères RGAA.

ANALYSE OBLIGATOIRE DE TOUS LES ${TOTAL_RGAA_CRITERIA} CRITÈRES RGAA 4.1:

🖼️ IMAGES (critères 1.1 à 1.9):
- Alt manquants, inadéquats, trop longs
- Images décoratives avec alt non vide
- Images complexes sans description détaillée
- Images-liens sans intitulé
- Images légendées incorrectement
- Images SVG sans alternatives
- Images bitmap avec texte
- Images objets sans alternatives

🖼️ CADRES (critères 2.1 à 2.2):
- Frames/iframes sans titre
- Titres de cadres non pertinents

🎨 COULEURS (critères 3.1 à 3.3):
- Information uniquement par couleur
- Contrastes insuffisants (4.5:1 min, 3:1 gros texte)
- Contrastes éléments interface (3:1 min)

📺 MULTIMÉDIA (critères 4.1 à 4.13):
- Médias temporels sans transcription/sous-titres
- Médias synchronisés sans audio-description
- Contrôles lecture inaccessibles
- Auto-play sans contrôle utilisateur
- Clignotements dangereux

📊 TABLEAUX (critères 5.1 à 5.8):
- Tableaux de données sans en-têtes
- Cellules mal associées aux en-têtes
- Résumés/titres manquants
- Tableaux de mise en forme linéarisables
- Navigation clavier dans tableaux complexes

🔗 LIENS (critères 6.1 à 6.2):
- Liens sans intitulé explicite
- Liens vides ou ambigus
- Liens identiques avec destinations différentes

⚙️ SCRIPTS (critères 7.1 à 7.5):
- Contenus générés inaccessibles au clavier
- Scripts modifiant contenu sans prévenir
- Fonctionnalités JavaScript inaccessibles
- Changements contexte sans action utilisateur
- Gestion focus incorrecte

📋 ÉLÉMENTS OBLIGATOIRES (critères 8.1 à 8.10):
- Titre page manquant/inadéquat
- Langue page non définie/invalide
- Changements langue non indiqués
- Balises mal utilisées (détournement sémantique)
- Ouverture nouvelle fenêtre non signalée

🏗️ STRUCTURATION (critères 9.1 à 9.4):
- Hiérarchie titres incorrecte
- Structure HTML non sémantique
- Listes non balisées comme listes
- Citations non balisées

🎨 PRÉSENTATION (critères 10.1 à 10.14):
- CSS obligatoire pour mise en forme
- Taille texte non redimensionnable
- Largeur non responsive
- Texte justifié dense
- Propriétés espacement forcées
- Contenus cachés/tronqués
- Survol/focus sans équivalent
- Éléments décoratifs non CSS

📝 FORMULAIRES (critères 11.1 à 11.13):
- Champs sans étiquettes
- Étiquettes mal associées
- Regroupements fieldset manquants
- Contrôles saisie sans aide
- Erreurs non explicitées
- Contrôle saisie utilisateur
- Aide contextuelle inaccessible
- Listes choix multiples
- Boutons sans intitulé
- Validation automatique problématique

🧭 NAVIGATION (critères 12.1 à 12.11):
- Liens évitement manquants
- Plan site manquant
- Barre navigation incohérente
- Fil Ariane absent
- Regroupements liens
- Raccourcis clavier conflictuels
- Landmarks ARIA manquants
- Ordre tab incorrect
- Navigation non évidente
- Moteur recherche manquant

📖 CONSULTATION (critères 13.1 à 13.12):
- Limite temps sans contrôle
- Ouverture nouvelle fenêtre forcée
- Fichiers téléchargeables non identifiés
- Services/plugins sans alternatives
- Contenus flash/animés non pausables
- Captcha sans alternative
- Alertes/messages temporaires
- Redirections automatiques
- Rafraîchissement sans contrôle
- Contenus additionnels inaccessibles

MAPPING WCAG 2.1 EXACT:
- Niveau A: Critères de base obligatoires
- Niveau AA: Standard légal français/européen  
- Niveau AAA: Excellence accessibilité

IMPORTANT - DÉTECTION TECHNIQUE:
✅ Analysez le DOM complet fourni
✅ Vérifiez TOUS les éléments HTML
✅ Contrôlez attributs ARIA complets
✅ Testez navigation clavier théorique
✅ Évaluez structure sémantique
✅ Sélecteurs CSS ultra-précis obligatoires

RÉPONSE JSON EXHAUSTIVE:
{
  "violations": [
    {
      "criterion": "X.Y (ex: 1.1, 5.4, 11.7)",
      "level": "A|AA|AAA",
      "description": "Problème précis détecté",
      "element": "Sélecteur CSS exact (ID/classe/nth-child)",
      "htmlSnippet": "Code HTML complet de l'élément",
      "recommendation": "Solution technique précise",
      "impact": "low|medium|high|critical",
      "wcagCriterion": "X.Y.Z correspondant"
    }
  ],
  "summary": "Synthèse détaillée des problèmes majeurs",
  "score": "0-100 basé sur gravité et nombre"
}`,

    en: `RGAA 4.1/WCAG 2.1 accessibility expert. EXHAUSTIVELY analyze HTML according to ALL ${TOTAL_RGAA_CRITERIA} RGAA criteria.

MANDATORY ANALYSIS OF ALL ${TOTAL_RGAA_CRITERIA} RGAA 4.1 CRITERIA:

🖼️ IMAGES (criteria 1.1 to 1.9):
- Missing, inadequate, too long alt text
- Decorative images with non-empty alt
- Complex images without detailed description
- Image-links without title
- Incorrectly captioned images
- SVG images without alternatives
- Bitmap images with text
- Object images without alternatives

🖼️ FRAMES (criteria 2.1 to 2.2):
- Frames/iframes without title
- Irrelevant frame titles

🎨 COLORS (criteria 3.1 to 3.3):
- Information by color alone
- Insufficient contrast (4.5:1 min, 3:1 large text)
- Interface elements contrast (3:1 min)

📺 MULTIMEDIA (criteria 4.1 to 4.13):
- Time-based media without transcription/captions
- Synchronized media without audio description
- Inaccessible playback controls
- Auto-play without user control
- Dangerous flickering

📊 TABLES (criteria 5.1 to 5.8):
- Data tables without headers
- Cells poorly associated with headers
- Missing summaries/titles
- Linearizable layout tables
- Keyboard navigation in complex tables

🔗 LINKS (criteria 6.1 to 6.2):
- Links without explicit title
- Empty or ambiguous links
- Identical links with different destinations

⚙️ SCRIPTS (criteria 7.1 to 7.5):
- Generated content inaccessible to keyboard
- Scripts modifying content without warning
- Inaccessible JavaScript functionality
- Context changes without user action
- Incorrect focus management

📋 MANDATORY ELEMENTS (criteria 8.1 to 8.10):
- Missing/inadequate page title
- Undefined/invalid page language
- Unreported language changes
- Misused tags (semantic hijacking)
- Unreported new window opening

🏗️ STRUCTURING (criteria 9.1 to 9.4):
- Incorrect heading hierarchy
- Non-semantic HTML structure
- Lists not marked as lists
- Quotes not marked up

🎨 PRESENTATION (criteria 10.1 to 10.14):
- CSS required for layout
- Non-resizable text size
- Non-responsive width
- Dense justified text
- Forced spacing properties
- Hidden/truncated content
- Hover/focus without equivalent
- Non-CSS decorative elements

📝 FORMS (criteria 11.1 to 11.13):
- Fields without labels
- Poorly associated labels
- Missing fieldset groupings
- Input controls without help
- Unexplained errors
- User input control
- Inaccessible contextual help
- Multiple choice lists
- Buttons without title
- Problematic automatic validation

🧭 NAVIGATION (criteria 12.1 to 12.11):
- Missing skip links
- Missing site map
- Inconsistent navigation bar
- Missing breadcrumb
- Link groupings
- Conflicting keyboard shortcuts
- Missing ARIA landmarks
- Incorrect tab order
- Non-obvious navigation
- Missing search engine

📖 CONSULTATION (criteria 13.1 to 13.12):
- Time limit without control
- Forced new window opening
- Unidentified downloadable files
- Services/plugins without alternatives
- Non-pausable flash/animated content
- Captcha without alternative
- Temporary alerts/messages
- Automatic redirects
- Refresh without control
- Inaccessible additional content

EXACT WCAG 2.1 MAPPING:
- Level A: Mandatory basic criteria
- Level AA: French/European legal standard
- Level AAA: Accessibility excellence

IMPORTANT - TECHNICAL DETECTION:
✅ Analyze complete provided DOM
✅ Check ALL HTML elements
✅ Control complete ARIA attributes
✅ Test theoretical keyboard navigation
✅ Evaluate semantic structure
✅ Ultra-precise CSS selectors mandatory

EXHAUSTIVE JSON RESPONSE:
{
  "violations": [
    {
      "criterion": "X.Y (ex: 1.1, 5.4, 11.7)",
      "level": "A|AA|AAA",
      "description": "Precise detected problem",
      "element": "Exact CSS selector (ID/class/nth-child)",
      "htmlSnippet": "Complete HTML code of element",
      "recommendation": "Precise technical solution",
      "impact": "low|medium|high|critical",
      "wcagCriterion": "Corresponding X.Y.Z"
    }
  ],
  "summary": "Detailed synthesis of major problems",
  "score": "0-100 based on severity and number"
}`
  };

  return prompts[language];
}

// Générer le prompt utilisateur avec les données HTML analysées
function generateUserPrompt(htmlAnalysis: any, htmlSample: string, language: 'fr' | 'en'): string {
  const prompts = {
    fr: `Voici les données extraites de la page web à auditer:

MÉTADONNÉES:
- Titre: ${htmlAnalysis.title}
- Langue: ${htmlAnalysis.lang || 'Non spécifiée'}
- Description: ${htmlAnalysis.meta.description || 'Aucune'}

STRUCTURE:
- ${htmlAnalysis.headings.length} titres (niveaux: ${htmlAnalysis.headings.map((h: any) => h.level).join(', ')})
- ${htmlAnalysis.images.length} images (${htmlAnalysis.images.filter((img: any) => !img.hasAlt).length} sans alt)
- ${htmlAnalysis.links.length} liens (${htmlAnalysis.links.filter((link: any) => !link.hasVisibleText).length} sans texte visible)
- ${htmlAnalysis.forms.length} formulaires
- ${htmlAnalysis.tables.length} tableaux

LANDMARKS:
- Main: ${htmlAnalysis.landmarks.main}
- Nav: ${htmlAnalysis.landmarks.nav}
- Header: ${htmlAnalysis.landmarks.header}
- Footer: ${htmlAnalysis.landmarks.footer}

ÉCHANTILLON HTML:
\`\`\`html
${htmlSample}
\`\`\`

Effectue un audit d'accessibilité complet selon les critères RGAA/WCAG et retourne le résultat en JSON.`,

    en: `Here is the data extracted from the web page to audit:

METADATA:
- Title: ${htmlAnalysis.title}
- Language: ${htmlAnalysis.lang || 'Not specified'}
- Description: ${htmlAnalysis.meta.description || 'None'}

STRUCTURE:
- ${htmlAnalysis.headings.length} headings (levels: ${htmlAnalysis.headings.map((h: any) => h.level).join(', ')})
- ${htmlAnalysis.images.length} images (${htmlAnalysis.images.filter((img: any) => !img.hasAlt).length} without alt)
- ${htmlAnalysis.links.length} links (${htmlAnalysis.links.filter((link: any) => !link.hasVisibleText).length} without visible text)
- ${htmlAnalysis.forms.length} forms
- ${htmlAnalysis.tables.length} tables

LANDMARKS:
- Main: ${htmlAnalysis.landmarks.main}
- Nav: ${htmlAnalysis.landmarks.nav}
- Header: ${htmlAnalysis.landmarks.header}
- Footer: ${htmlAnalysis.landmarks.footer}

HTML SAMPLE:
\`\`\`html
${htmlSample}
\`\`\`

Perform a complete accessibility audit according to RGAA/WCAG criteria and return the result in JSON.`
  };

  return prompts[language];
}

// Analyser le HTML avec OpenAI
export async function analyzeWithOpenAI(
  htmlAnalysis: any,
  htmlContent: string,
  language: 'fr' | 'en' = 'fr'
): Promise<AuditResult> {
  try {
    // Limiter la taille du sample HTML envoyé à OpenAI
    const htmlSample = htmlContent.length > 4000 
      ? htmlContent.substring(0, 4000) + '\n... (contenu tronqué)'
      : htmlContent;

    const systemPrompt = generateSystemPrompt(language);
    const userPrompt = generateUserPrompt(htmlAnalysis, htmlSample, language);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1, // Réponses plus cohérentes
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    // Parser la réponse JSON
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in OpenAI response');
    }

    const auditData = JSON.parse(jsonMatch[0]);
    
    // Valider et formater les données
    const violations: RGAAViolation[] = (auditData.violations || []).map((v: any) => ({
      criterion: v.criterion || 'N/A',
      level: ['A', 'AA', 'AAA'].includes(v.level) ? v.level : 'AA',
      description: v.description || '',
      element: v.element || '',
      htmlSnippet: v.htmlSnippet || '',
      recommendation: v.recommendation || '',
      impact: normalizeImpact(v.impact) || 'medium'
    }));

    // Calculer les statistiques
    const violationsByLevel = violations.reduce((acc, v) => {
      acc[v.level]++;
      return acc;
    }, { A: 0, AA: 0, AAA: 0 });

    const violationsByImpact = violations.reduce((acc, v) => {
      const normalizedImpact = v.impact as 'low' | 'medium' | 'high' | 'critical';
      acc[normalizedImpact]++;
      return acc;
    }, { low: 0, medium: 0, high: 0, critical: 0 });

    const result: AuditResult = {
      url: htmlAnalysis.url,
      timestamp: new Date().toISOString(),
      totalViolations: violations.length,
      violationsByLevel,
      violationsByImpact,
      violations,
      summary: auditData.summary || 'Audit completed',
      score: Math.min(100, Math.max(0, parseInt(auditData.score) || 50))
    };

    return result;

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error(
      language === 'fr' 
        ? 'Erreur lors de l\'analyse avec OpenAI' 
        : 'Error during OpenAI analysis'
    );
  }
}

// Rate limiting amélioré (en mémoire)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(clientId: string): { allowed: boolean; resetTime?: number; remaining?: number } {
  const now = Date.now();
  const key = clientId;
  const limit = requestCounts.get(key);

  // Première requête ou fenêtre expirée
  if (!limit || now > limit.resetTime) {
    const newResetTime = now + 60 * 60 * 1000; // 1 heure
    requestCounts.set(key, { count: 1, resetTime: newResetTime });
    return { allowed: true, remaining: 19 }; // 20 requêtes max par heure
  }

  // Vérifier si limite atteinte
  if (limit.count >= 20) { // Augmenté de 10 à 20 requêtes par heure
    return { 
      allowed: false, 
      resetTime: limit.resetTime,
      remaining: 0 
    };
  }

  // Incrémenter et autoriser
  limit.count++;
  return { 
    allowed: true, 
    remaining: 20 - limit.count 
  };
} 