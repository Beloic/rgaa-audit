import { NextRequest, NextResponse } from 'next/server';
import { saveAuditToDatabase } from '@/lib/audit-history';

export async function POST(request: NextRequest) {
  console.log('🧪 Test endpoint pour sauvegarde d\'historique...');
  
  try {
    // Résultat d'audit test
    const testResult = {
      url: 'https://example.com',
      timestamp: new Date(),
      totalViolations: 2,
      score: 92,
      violations: [
        {
          rule: 'test-rule',
          description: 'Test violation',
          element: 'body',
          context: 'Test context',
          impact: 'medium' as 'medium',
          level: 'AA' as 'AA',
          criterion: 'test-criterion',
          recommendation: 'Test recommendation',
          severity: 'medium' as 'medium'
        }
      ],
      summary: 'Test audit summary',
      violationsByImpact: { low: 0, medium: 1, high: 1, critical: 0 },
      violationsByLevel: { A: 0, AA: 2, AAA: 0 },
      engine: 'wave' as 'wave'
    };

    console.log('📧 Test de sauvegarde pour lauregagnonn@gmail.com...');
    console.log('🔍 Variables d\'environnement:', {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
    
    const result = await saveAuditToDatabase(testResult, 'wave', 'lauregagnonn@gmail.com');
    
    if (result) {
      console.log('✅ Sauvegarde réussie !', result.id);
      return NextResponse.json({ 
        success: true, 
        message: 'Sauvegarde réussie',
        auditId: result.id 
      });
    } else {
      console.log('❌ Sauvegarde échouée - résultat null');
      return NextResponse.json({ 
        success: false, 
        message: 'Sauvegarde échouée - résultat null',
        env: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Défini' : 'Non défini',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Défini' : 'Non défini'
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test de sauvegarde:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      details: error
    }, { status: 500 });
  }
} 