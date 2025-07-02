import { NextRequest, NextResponse } from 'next/server';
import { getUserAuditHistory, deleteAuditFromHistory, clearUserAuditHistory } from '@/lib/audit-history';

// GET - Récupérer l'historique des audits d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email utilisateur manquant' },
        { status: 400 }
      );
    }

    console.log(`📚 API: Récupération historique pour ${userEmail}...`);

    const audits = await getUserAuditHistory(userEmail, limit);

    return NextResponse.json({
      success: true,
      audits,
      total: audits.length
    });

  } catch (error) {
    console.error('❌ Erreur API audit-history GET:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération de l\'historique',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un audit ou tout l'historique
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const auditId = searchParams.get('auditId');
    const clearAll = searchParams.get('clearAll') === 'true';

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email utilisateur manquant' },
        { status: 400 }
      );
    }

    let success = false;

    if (clearAll) {
      console.log(`🧹 API: Suppression complète historique pour ${userEmail}...`);
      success = await clearUserAuditHistory(userEmail);
    } else if (auditId) {
      console.log(`🗑️ API: Suppression audit ${auditId} pour ${userEmail}...`);
      success = await deleteAuditFromHistory(auditId, userEmail);
    } else {
      return NextResponse.json(
        { error: 'auditId ou clearAll requis' },
        { status: 400 }
      );
    }

    if (success) {
      return NextResponse.json({
        success: true,
        message: clearAll ? 'Historique supprimé' : 'Audit supprimé'
      });
    } else {
      return NextResponse.json(
        { error: 'Échec de la suppression' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Erreur API audit-history DELETE:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la suppression',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// OPTIONS - CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 