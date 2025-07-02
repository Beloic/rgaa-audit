import { getUserByEmail, saveUser } from '@/lib/supabase-auth';

// Types pour les plans de tarification
interface PlanLimits {
  auditsPerDay: number | 'unlimited';
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
    auditsPerDay: 3,
    auditsPerMonth: 'unlimited',
    teamMembers: 1,
    storage: 1,
    apiAccess: false,
    prioritySupport: false,
    customReports: false,
    whiteLabel: false
  },
  pro: {
    auditsPerDay: 'unlimited',
    auditsPerMonth: 50,
    teamMembers: 5,
    storage: 10,
    apiAccess: true,
    prioritySupport: true,
    customReports: true,
    whiteLabel: false
  },
  enterprise: {
    auditsPerDay: 'unlimited',
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

// Fonction d'incrémentation directe (sans HTTP)
export async function incrementUserAuditCount(userData: any): Promise<any> {
  try {
    console.log(`🔄 Incrémentation directe des audits pour ${userData.email}...`);

    // Vérifier si c'est un utilisateur bêta (pas de limite)
    const isBetaUser = userData.betaAccess?.granted && !userData.betaAccess?.hasQuit;
    
    if (isBetaUser) {
      console.log(`👤 Utilisateur bêta ${userData.email} - Accès illimité ✅`);
      return userData;
    }

    // Récupérer les limites du plan
    const planLimits = getPlanLimits(userData.subscription?.plan || 'free');
    console.log(`📊 Limites du plan ${userData.subscription?.plan || 'free'}:`, planLimits);
    
    let updatedUserData;

    // Vérifier la limite quotidienne
    if (planLimits.auditsPerDay !== 'unlimited') {
      const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
      const lastAuditDate = userData.usage.lastAuditDate ? new Date(userData.usage.lastAuditDate).toISOString().split('T')[0] : null;
      
      console.log(`📅 Vérification date:`, { today, lastAuditDate });
      
      // Si c'est un nouveau jour, réinitialiser le compteur quotidien
      const auditsToday = lastAuditDate === today ? (userData.usage.auditsToday || 0) + 1 : 1;
      
      console.log(`📈 Calcul audits aujourd'hui:`, {
        isNewDay: lastAuditDate !== today,
        currentAuditsToday: userData.usage.auditsToday || 0,
        newAuditsToday: auditsToday,
        limit: planLimits.auditsPerDay
      });
      
      // Mettre à jour les données utilisateur
      updatedUserData = {
        ...userData,
        usage: {
          ...userData.usage,
          auditsToday,
          auditsThisMonth: (userData.usage.auditsThisMonth || 0) + 1,
          auditsTotal: (userData.usage.auditsTotal || 0) + 1,
          lastAuditDate: new Date().toISOString()
        }
      };
      
      console.log(`✅ Audit comptabilisé pour ${userData.email}: ${auditsToday}/${planLimits.auditsPerDay} audits aujourd'hui`);
    } else {
      console.log(`♾️ Plan illimité pour ${userData.email}`);
      // Plan illimité - juste incrémenter les compteurs
      updatedUserData = {
        ...userData,
        usage: {
          ...userData.usage,
          auditsThisMonth: (userData.usage.auditsThisMonth || 0) + 1,
          auditsTotal: (userData.usage.auditsTotal || 0) + 1,
          lastAuditDate: new Date().toISOString()
        }
      };
    }

    // Sauvegarder dans la base de données
    try {
      await saveUser(updatedUserData);
      console.log(`💾 Données utilisateur sauvegardées en base pour ${userData.email}`);
      
      // Vérification immédiate après sauvegarde
      const verifiedUser = await getUserByEmail(userData.email);
      if (verifiedUser) {
        console.log(`✅ Vérification post-sauvegarde - auditsToday en base: ${verifiedUser.usage?.auditsToday}, auditsTotal: ${verifiedUser.usage?.auditsTotal}`);
        // Retourner les données vérifiées de la base
        return verifiedUser;
      }
      
      return updatedUserData;
    } catch (error) {
      console.error(`❌ ERREUR CRITIQUE sauvegarde pour ${userData.email}:`, error);
      console.error(`   Message d'erreur complet:`, error instanceof Error ? error.message : String(error));
      throw error;
    }

  } catch (error) {
    console.error('❌ Erreur dans l\'incrémentation directe:', error);
    throw error;
  }
} 