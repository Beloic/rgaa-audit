import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Vérifier les variables d'environnement
    const apiKey = process.env.MAILJET_API_KEY;
    const secretKey = process.env.MAILJET_SECRET_KEY;
    const fromEmail = process.env.MAILJET_FROM_EMAIL;
    
    return NextResponse.json({
      success: true,
      debug: {
        apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : '❌ Manquante',
        secretKey: secretKey ? `${secretKey.substring(0, 8)}...` : '❌ Manquante',
        fromEmail: fromEmail || '❌ Manquante',
        apiKeyLength: apiKey?.length || 0,
        secretKeyLength: secretKey?.length || 0,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}
