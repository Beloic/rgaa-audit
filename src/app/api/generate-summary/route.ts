import { NextResponse } from 'next/server';
import type { AuditResult, RGAAViolation } from '@/types/audit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Clé API OpenAI non configurée');
    }

    // Gérer les deux formats de données : nouveau format (violations + url) et ancien format (result + language)
    let auditData;
    let language = 'fr'; // défaut en français
    let violations: RGAAViolation[] = [];
    
    if (body.violations && body.url) {
      // Nouveau format depuis SummaryAdvicePage
      violations = body.violations;
      auditData = {
        url: body.url,
        score: violations.length > 0 ? Math.max(0, 100 - (violations.length * 5)) : 100,
        totalViolations: violations.length,
        violationsByLevel: violations.reduce((acc: any, v: RGAAViolation) => {
          acc[v.level] = (acc[v.level] || 0) + 1;
          return acc;
        }, {}),
        topViolations: violations.slice(0, 8), // Plus de violations pour l'analyse
        timestamp: new Date().toISOString()
      };
    } else if (body.result) {
      // Ancien format depuis AuditResults
      const result = body.result;
      language = body.language || 'fr';
      violations = result.violations || [];
      auditData = {
        url: result.url,
        score: result.score,
        totalViolations: result.totalViolations,
        violationsByLevel: result.violationsByLevel,
        topViolations: violations.slice(0, 8),
        timestamp: result.timestamp
      };
    } else {
      throw new Error('Format de données invalide');
    }

    // Enrichir les données d'analyse
    const analysisData = {
      ...auditData,
      // Analyser les patterns de violations
      violationsByImpact: violations.reduce((acc: any, v) => {
        acc[v.impact] = (acc[v.impact] || 0) + 1;
        return acc;
      }, {}),
      // Catégoriser les types de problèmes
      problemCategories: violations.reduce((acc: any, v) => {
        const category = categorizeViolation(v);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}),
      // Identifier les violations critiques
      criticalViolations: violations.filter(v => v.impact === 'critical' || v.impact === 'high'),
      // Analyser la complexité des corrections
      easyFixes: violations.filter(v => isEasyToFix(v)),
      // Estimer le temps de correction
      estimatedFixTime: estimateFixTime(violations)
    };

    // Fonction pour catégoriser les violations
    function categorizeViolation(violation: RGAAViolation): string {
      const desc = violation.description?.toLowerCase() || '';
      const rule = violation.ruleId?.toLowerCase() || '';
      
      if (desc.includes('image') || desc.includes('alt') || rule.includes('image')) return 'images';
      if (desc.includes('heading') || desc.includes('titre') || rule.includes('heading')) return 'structure';
      if (desc.includes('link') || desc.includes('lien') || rule.includes('link')) return 'navigation';
      if (desc.includes('form') || desc.includes('label') || desc.includes('input')) return 'formulaires';
      if (desc.includes('contrast') || desc.includes('contraste') || desc.includes('color')) return 'couleurs';
      if (desc.includes('button') || desc.includes('bouton')) return 'interactions';
      return 'autres';
    }

    // Fonction pour identifier les corrections faciles
    function isEasyToFix(violation: RGAAViolation): boolean {
      const desc = violation.description?.toLowerCase() || '';
      const rule = violation.ruleId?.toLowerCase() || '';
      
      // Corrections considérées comme faciles (< 30 min)
      return desc.includes('alt') || 
             desc.includes('title') || 
             desc.includes('label') ||
             rule.includes('missing-text') ||
             desc.includes('empty');
    }

    // Fonction pour estimer le temps de correction
    function estimateFixTime(violations: RGAAViolation[]): string {
      const easyCount = violations.filter(v => isEasyToFix(v)).length;
      const mediumCount = violations.filter(v => !isEasyToFix(v) && v.impact !== 'critical').length;
      const hardCount = violations.filter(v => v.impact === 'critical' && !isEasyToFix(v)).length;
      
      const totalHours = (easyCount * 0.5) + (mediumCount * 2) + (hardCount * 6);
      
      if (totalHours < 1) return "moins d'1 heure";
      if (totalHours < 8) return `${Math.ceil(totalHours)} heures`;
      if (totalHours < 40) return `${Math.ceil(totalHours / 8)} jours`;
      return `${Math.ceil(totalHours / 40)} semaines`;
    }

    // Construire le prompt enrichi selon la langue
    const prompt = language === 'fr' ? 
      `Tu es un consultant expert en accessibilité web RGAA/WCAG avec 10 ans d'expérience. Tu analyses un audit d'accessibilité et dois fournir un rapport personnalisé et actionnable.

**🔍 DONNÉES DE L'AUDIT :**
- **Site web :** ${analysisData.url}
- **Score d'accessibilité :** ${analysisData.score}/100
- **Total des violations :** ${analysisData.totalViolations}
- **Répartition par impact :** ${JSON.stringify(analysisData.violationsByImpact)}
- **Répartition par niveau RGAA :** ${JSON.stringify(analysisData.violationsByLevel)}
- **Catégories de problèmes :** ${JSON.stringify(analysisData.problemCategories)}
- **Corrections rapides possibles :** ${analysisData.easyFixes.length} sur ${analysisData.totalViolations}
- **Temps estimé de correction :** ${analysisData.estimatedFixTime}

**🚨 VIOLATIONS PRIORITAIRES :**
${analysisData.criticalViolations.slice(0, 5).map((v: RGAAViolation, i: number) => 
  `${i + 1}. **${v.ruleId || 'Règle non spécifiée'}** (${v.impact}) - ${v.description}`
).join('\n')}

**📋 INSTRUCTIONS :**
Génère un rapport d'audit personnalisé et professionnel en analysant ces données spécifiques. Le rapport doit être :
- **Personnalisé** aux problèmes détectés sur ce site précis
- **Actionnable** avec des étapes concrètes à suivre
- **Priorisé** par impact utilisateur et facilité de correction
- **Technique mais accessible** (évite le jargon excessif)

**📄 STRUCTURE OBLIGATOIRE :**

## 🎯 Diagnostic personnalisé

[Analyse spécifique de l'état d'accessibilité de ce site, en mentionnant le score, les principales catégories de problèmes détectées, et une évaluation du niveau de conformité RGAA]

## ⚡ Plan d'action prioritaire (fixes rapides)

[Liste 3-4 actions concrètes basées sur les violations détectées, en priorisant celles qui sont faciles à corriger ET qui ont un impact élevé. Donne des exemples précis tirés des violations identifiées]

## 🛠️ Corrections techniques détaillées

[Pour chaque catégorie de problèmes principale identifiée dans les données, explique comment corriger avec du code d'exemple si pertinent]

## 📈 Feuille de route recommandée

[Plan de correction en 3 phases basé sur l'estimation de temps fournie : Phase 1 (corrections rapides), Phase 2 (corrections moyennes), Phase 3 (refactoring majeur)]

## 🎉 Impact attendu

[Estimation concrète du nouveau score d'accessibilité après corrections et bénéfices utilisateurs spécifiques]

**IMPORTANT :** Base toutes tes recommandations sur les données réelles de l'audit. Ne donne pas de conseils génériques mais des actions spécifiques au contexte de ce site.` :

      `You are a senior accessibility consultant with 10 years of RGAA/WCAG experience. You're analyzing an accessibility audit and must provide a personalized, actionable report.

**🔍 AUDIT DATA:**
- **Website:** ${analysisData.url}
- **Accessibility Score:** ${analysisData.score}/100
- **Total Violations:** ${analysisData.totalViolations}
- **Distribution by Impact:** ${JSON.stringify(analysisData.violationsByImpact)}
- **Distribution by RGAA Level:** ${JSON.stringify(analysisData.violationsByLevel)}
- **Problem Categories:** ${JSON.stringify(analysisData.problemCategories)}
- **Quick Fixes Available:** ${analysisData.easyFixes.length} out of ${analysisData.totalViolations}
- **Estimated Fix Time:** ${analysisData.estimatedFixTime}

**🚨 PRIORITY VIOLATIONS:**
${analysisData.criticalViolations.slice(0, 5).map((v: RGAAViolation, i: number) => 
  `${i + 1}. **${v.ruleId || 'Unspecified Rule'}** (${v.impact}) - ${v.description}`
).join('\n')}

**📋 INSTRUCTIONS:**
Generate a personalized, professional audit report by analyzing this specific data. The report must be:
- **Personalized** to the problems detected on this specific site
- **Actionable** with concrete steps to follow
- **Prioritized** by user impact and ease of correction
- **Technical but accessible** (avoid excessive jargon)

**📄 REQUIRED STRUCTURE:**

## 🎯 Personalized Diagnosis

[Specific analysis of this site's accessibility status, mentioning the score, main problem categories detected, and RGAA compliance level assessment]

## ⚡ Priority Action Plan (quick fixes)

[List 3-4 concrete actions based on detected violations, prioritizing those that are easy to fix AND have high impact. Give specific examples from identified violations]

## 🛠️ Detailed Technical Corrections

[For each main problem category identified in the data, explain how to fix with code examples if relevant]

## 📈 Recommended Roadmap

[Correction plan in 3 phases based on provided time estimate: Phase 1 (quick fixes), Phase 2 (medium corrections), Phase 3 (major refactoring)]

## 🎉 Expected Impact

[Concrete estimation of new accessibility score after corrections and specific user benefits]

**IMPORTANT:** Base all your recommendations on the actual audit data. Don't give generic advice but specific actions for this site's context.`;

    // Appel à l'API OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: language === 'fr' ? 
              'Tu es un consultant senior en accessibilité web RGAA/WCAG avec 10 ans d\'expérience. Tu analyses des audits d\'accessibilité et fournis des rapports personnalisés, actionnables et techniques. Tu es reconnu pour tes diagnostics précis et tes plans d\'action concrets.' :
              'You are a senior web accessibility consultant with 10 years of RGAA/WCAG experience. You analyze accessibility audits and provide personalized, actionable, and technical reports. You are recognized for your precise diagnostics and concrete action plans.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2500,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content;

    if (!summary) {
      throw new Error('Aucune réponse générée par ChatGPT');
    }

    console.log('✅ Résumé généré avec succès');

    return NextResponse.json({ summary });

  } catch (error) {
    console.error('❌ Erreur lors de la génération du résumé:', error);
    
    // Résumé de fallback en français (par défaut)
    const fallbackSummary = `## Résumé de l'audit

**État d'accessibilité :** Score non disponible

**Conseils prioritaires :**
- Vérifiez les alternatives textuelles des images
- Assurez-vous que tous les liens ont un texte descriptif
- Contrôlez les contrastes de couleurs
- Testez la navigation au clavier
- Validez la structure des titres (H1, H2, etc.)

**Bonnes pratiques :**
- Utilisez les outils de développement pour tester l'accessibilité
- Impliquez des utilisateurs en situation de handicap dans vos tests
- Consultez les référentiels RGAA et WCAG 2.1 AA
- Formez votre équipe aux bonnes pratiques d'accessibilité

**Note :** Ce résumé générique a été fourni suite à une erreur technique. Pour un résumé personnalisé, veuillez réessayer.`;

    return NextResponse.json({ 
      summary: fallbackSummary,
      error: true
    });
  }
} 