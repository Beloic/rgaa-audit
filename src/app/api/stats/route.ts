import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

// Chemin vers le fichier de statistiques
const STATS_FILE = path.join(process.cwd(), 'data', 'visitor-stats.json');

// Fonction pour s'assurer que le répertoire existe
function ensureDataDirectory() {
  const dataDir = path.dirname(STATS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Fonction pour lire les statistiques
function readStats(): StatsData {
  try {
    ensureDataDirectory();
    if (fs.existsSync(STATS_FILE)) {
      const data = fs.readFileSync(STATS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erreur lors de la lecture des stats:', error);
  }
  
  // Retourner des données par défaut
  return {
    totalAttempts: 0,
    successfulLogins: 0,
    failedAttempts: 0,
    uniqueVisitors: 0,
    lastActivity: new Date().toISOString(),
    visitors: []
  };
}

// Fonction pour écrire les statistiques
function writeStats(stats: StatsData) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Erreur lors de l\'écriture des stats:', error);
  }
}

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
    
    const stats = readStats();
    
    // Créer une nouvelle entrée visiteur
    const newVisitor: VisitorStat = {
      timestamp,
      ip,
      userAgent,
      success,
      failureReason
    };
    
    // Mettre à jour les statistiques
    stats.visitors.push(newVisitor);
    stats.totalAttempts++;
    stats.lastActivity = timestamp;
    
    if (success) {
      stats.successfulLogins++;
    } else {
      stats.failedAttempts++;
    }
    
    // Calculer les visiteurs uniques (basé sur IP)
    const uniqueIPs = new Set(stats.visitors.map(v => v.ip));
    stats.uniqueVisitors = uniqueIPs.size;
    
    // Garder seulement les 1000 dernières entrées pour éviter que le fichier devienne trop gros
    if (stats.visitors.length > 1000) {
      stats.visitors = stats.visitors.slice(-1000);
    }
    
    writeStats(stats);
    
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
    
    const stats = readStats();
    
    // Calculer des statistiques supplémentaires
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentVisitors = stats.visitors.filter(
      v => new Date(v.timestamp) > last24h
    );
    
    const last7days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyVisitors = stats.visitors.filter(
      v => new Date(v.timestamp) > last7days
    );
    
    // Grouper par jour pour les 7 derniers jours
    const dailyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayVisitors = stats.visitors.filter(v => {
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
      ...stats,
      analytics: {
        last24hAttempts: recentVisitors.length,
        last24hSuccessful: recentVisitors.filter(v => v.success).length,
        last7daysAttempts: weeklyVisitors.length,
        last7daysSuccessful: weeklyVisitors.filter(v => v.success).length,
        successRate: stats.totalAttempts > 0 
          ? Math.round((stats.successfulLogins / stats.totalAttempts) * 100) 
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