import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  let client: Client | null = null;
  
  try {
    // Test de connexion directe PostgreSQL
    client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();
    
    // Test simple
    const result = await client.query('SELECT NOW() as current_time');
    
    return NextResponse.json({
      success: true,
      message: 'Connexion PostgreSQL directe réussie',
      timestamp: result.rows[0].current_time,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasDBUrl: !!process.env.DATABASE_URL,
        dbUrlPreview: process.env.DATABASE_URL?.substring(0, 30) + '...'
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasDBUrl: !!process.env.DATABASE_URL,
        dbUrlPreview: process.env.DATABASE_URL?.substring(0, 30) + '...'
      }
    }, { status: 500 });
    
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        console.error('Erreur fermeture connexion:', e);
      }
    }
  }
} 