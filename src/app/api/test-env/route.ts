import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Vérifier les variables d'environnement Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const results = {
      url: {
        configured: !!supabaseUrl,
        value: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : null
      },
      key: {
        configured: !!supabaseKey,
        value: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : null
      }
    };
    
    // Test de connexion si les variables sont présentes
    let connectionTest = null;
    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Test simple avec timeout
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1);
        
        connectionTest = {
          success: !error,
          error: error?.message || null
        };
      } catch (error) {
        connectionTest = {
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }
    }
    
    return NextResponse.json({
      environment: process.env.NODE_ENV,
      variables: results,
      connectionTest,
      allConfigured: !!(supabaseUrl && supabaseKey)
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Erreur lors du test des variables',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 