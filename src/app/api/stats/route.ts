import { NextRequest, NextResponse } from 'next/server';

// Types pour les statistiques
interface VisitorStat {
  timestamp: string;
  ip: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
}

interface StatsData {
  totalAttempts: number;
  successfulLogins: number;
  failedAttempts: number;
  uniqueVisitors: number;
  lastActivity: string;
  visitors: VisitorStat[];
}

// Stockage en mémoire temporaire pour Vercel
let memoryStats: StatsData = {
  totalAttempts: 0,
  successfulLogins: 0,
  failedAttempts: 0,
  uniqueVisitors: 0,
  lastActivity: new Date().toISOString(),
  visitors: []
};

// Fonction pour obtenir l'IP du client
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// POST - Enregistrer une tentative de connexion
export async function POST(request: NextRequest) {
  try {
    const { success, failureReason } = await request.json();
    
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const timestamp = new Date().toISOString();
    
    // Créer une nouvelle entrée visiteur
    const newVisitor: VisitorStat = {
      timestamp,
      ip,
      userAgent,
      success,
      failureReason
    };
    
    // Mettre à jour les statistiques en mémoire
    memoryStats.visitors.push(newVisitor);
    memoryStats.totalAttempts++;
    memoryStats.lastActivity = timestamp;
    
    if (success) {
      memoryStats.successfulLogins++;
    } else {
      memoryStats.failedAttempts++;
    }
    
    // Calculer les visiteurs uniques (basé sur IP)
    const uniqueIPs = new Set(memoryStats.visitors.map(v => v.ip));
    memoryStats.uniqueVisitors = uniqueIPs.size;
    
    // Garder seulement les 1000 dernières entrées pour éviter une surcharge mémoire
    if (memoryStats.visitors.length > 1000) {
      memoryStats.visitors = memoryStats.visitors.slice(-1000);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Statistique enregistrée' 
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des stats:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// GET - Récupérer les statistiques (protégé par mot de passe admin)
export async function GET(request: NextRequest) {
  try {
    // Vérifier le mot de passe admin dans les headers (support des deux formats)
    const adminPasswordHeader = request.headers.get('x-admin-password');
    const authorizationHeader = request.headers.get('authorization');
    const expectedPassword = process.env.ADMIN_STATS_PASSWORD || 'RGAAAudit2025Admin!Stats';
    
    const providedPassword = adminPasswordHeader || authorizationHeader;
    
    if (providedPassword !== expectedPassword) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      );
    }
    
    // Calculer des statistiques supplémentaires
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentVisitors = memoryStats.visitors.filter(
      v => new Date(v.timestamp) > last24h
    );
    
    const last7days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyVisitors = memoryStats.visitors.filter(
      v => new Date(v.timestamp) > last7days
    );
    
    // Grouper par jour pour les 7 derniers jours
    const dailyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayVisitors = memoryStats.visitors.filter(v => {
        const vDate = new Date(v.timestamp);
        return vDate >= dayStart && vDate <= dayEnd;
      });
      
      return {
        date: dayStart.toISOString().split('T')[0],
        attempts: dayVisitors.length,
        successful: dayVisitors.filter(v => v.success).length,
        failed: dayVisitors.filter(v => !v.success).length
      };
    }).reverse();
    
    const enhancedStats = {
      ...memoryStats,
      analytics: {
        last24hAttempts: recentVisitors.length,
        last24hSuccessful: recentVisitors.filter(v => v.success).length,
        last7daysAttempts: weeklyVisitors.length,
        last7daysSuccessful: weeklyVisitors.filter(v => v.success).length,
        successRate: memoryStats.totalAttempts > 0 
          ? Math.round((memoryStats.successfulLogins / memoryStats.totalAttempts) * 100) 
          : 0,
        dailyStats
      }
    };
    
    return NextResponse.json(enhancedStats);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 