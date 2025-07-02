import { createClient } from '@supabase/supabase-js';
import type { AuditResult, ComparativeResult } from '@/types/audit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface HistoricalAudit {
  id: string;
  user_email: string;
  url: string;
  timestamp: string;
  score: number;
  total_violations: number;
  engine: 'wave' | 'axe' | 'rgaa' | 'all';
  result: AuditResult | ComparativeResult;
  created_at: string;
  updated_at: string;
}

/**
 * Sauvegarde un audit dans l'historique côté serveur
 */
export async function saveAuditToDatabase(
  result: AuditResult | ComparativeResult, 
  engine: 'wave' | 'axe' | 'rgaa' | 'all', 
  userEmail: string
): Promise<HistoricalAudit | null> {
  try {
    console.log(`💾 Sauvegarde audit en base pour ${userEmail}:`, { url: result.url, engine });

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Déterminer le score et les violations selon le type de résultat
    let score: number;
    let totalViolations: number;

    if (engine === 'all' && 'summary' in result) {
      // Résultat comparatif
      const comparativeResult = result as ComparativeResult;
      if (comparativeResult.summary && comparativeResult.summary.bestScore !== undefined) {
        score = comparativeResult.summary.bestScore;
      } else if (comparativeResult.summary && comparativeResult.summary.averageScore !== undefined) {
        score = comparativeResult.summary.averageScore;
      } else {
        score = 0;
      }
      totalViolations = comparativeResult.totalUniqueViolations || 0;
    } else {
      // Résultat simple
      const auditResult = result as AuditResult;
      score = auditResult.score || 0;
      totalViolations = auditResult.totalViolations || 0;
    }

    // S'assurer que le score est un nombre entier
    score = Math.round(score);

    // Insérer en base
    console.log('🔍 Tentative d\'insertion avec les données:', {
      user_email: userEmail,
      url: result.url || 'URL inconnue',
      timestamp: result.timestamp || new Date().toISOString(),
      score: score,
      total_violations: totalViolations,
      engine: engine
    });

    const { data, error } = await supabase
      .from('audit_accessibility_history')
      .insert({
        user_email: userEmail,
        url: result.url || 'URL inconnue',
        timestamp: result.timestamp || new Date().toISOString(),
        score: score,
        total_violations: totalViolations,
        engine: engine,
        result: result
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la sauvegarde en base:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return null;
    }

    console.log('✅ Audit sauvegardé en base avec succès:', data.id);
    return data as HistoricalAudit;

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde de l\'audit:', error);
    return null;
  }
}

/**
 * Récupère l'historique des audits d'un utilisateur
 */
export async function getUserAuditHistory(userEmail: string, limit: number = 50): Promise<HistoricalAudit[]> {
  try {
    console.log(`📚 Récupération historique pour ${userEmail}...`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('audit_accessibility_history')
      .select('*')
      .eq('user_email', userEmail)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Erreur lors de la récupération de l\'historique:', error);
      return [];
    }

    console.log(`✅ ${data.length} audits récupérés pour ${userEmail}`);
    return data as HistoricalAudit[];

  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'historique:', error);
    return [];
  }
}

/**
 * Supprime un audit de l'historique
 */
export async function deleteAuditFromHistory(auditId: string, userEmail: string): Promise<boolean> {
  try {
    console.log(`🗑️ Suppression audit ${auditId} pour ${userEmail}...`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('audit_accessibility_history')
      .delete()
      .eq('id', auditId)
      .eq('user_email', userEmail); // Sécurité : s'assurer que l'utilisateur ne peut supprimer que ses propres audits

    if (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      return false;
    }

    console.log('✅ Audit supprimé avec succès');
    return true;

  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'audit:', error);
    return false;
  }
}

/**
 * Supprime tout l'historique d'un utilisateur
 */
export async function clearUserAuditHistory(userEmail: string): Promise<boolean> {
  try {
    console.log(`🧹 Suppression complète historique pour ${userEmail}...`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('audit_accessibility_history')
      .delete()
      .eq('user_email', userEmail);

    if (error) {
      console.error('❌ Erreur lors de la suppression complète:', error);
      return false;
    }

    console.log('✅ Historique supprimé avec succès');
    return true;

  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'historique:', error);
    return false;
  }
}

/**
 * Compte le nombre d'audits d'un utilisateur
 */
export async function countUserAudits(userEmail: string): Promise<number> {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { count, error } = await supabase
      .from('audit_accessibility_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_email', userEmail);

    if (error) {
      console.error('❌ Erreur lors du comptage:', error);
      return 0;
    }

    return count || 0;

  } catch (error) {
    console.error('❌ Erreur lors du comptage des audits:', error);
    return 0;
  }
} 