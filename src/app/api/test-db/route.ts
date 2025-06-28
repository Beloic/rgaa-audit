import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test 1: Variables d'environnement
    const hasDBUrl = !!process.env.DATABASE_URL;
    const hasDirectUrl = !!process.env.DIRECT_URL;
    const useAPI = process.env.NEXT_PUBLIC_USE_API;
    
    console.log('🔧 Variables env:', { hasDBUrl, hasDirectUrl, useAPI });
    
    // Test 2: Import Prisma
    let prismaImportOk = false;
    let prismaConnectionOk = false;
    let errorMessage = '';
    
    try {
      const { PrismaClient } = await import('@prisma/client');
      prismaImportOk = true;
      console.log('✅ Import Prisma OK');
      
      // Test 3: Connexion Prisma
      const prisma = new PrismaClient();
      await prisma.$connect();
      prismaConnectionOk = true;
      console.log('✅ Connexion Prisma OK');
      await prisma.$disconnect();
      
    } catch (error: any) {
      errorMessage = error.message;
      console.error('❌ Erreur Prisma:', error);
    }
    
    return NextResponse.json({
      success: true,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasDBUrl,
        hasDirectUrl,
        useAPI,
        platform: 'vercel'
      },
      prisma: {
        importOk: prismaImportOk,
        connectionOk: prismaConnectionOk,
        errorMessage
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Erreur test DB:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ message: "Utilisez GET pour le test" });
} 