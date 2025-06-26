import { NextRequest, NextResponse } from 'next/server';

const BETA_COOKIE_NAME = 'rgaa-beta-access';
const BETA_COOKIE_VALUE = 'authenticated';

export async function GET(request: NextRequest) {
  try {
    // Vérifier le cookie d'authentification
    const betaCookie = request.cookies.get(BETA_COOKIE_NAME);
    const isAuthenticated = betaCookie?.value === BETA_COOKIE_VALUE;
    
    return NextResponse.json({ 
      authenticated: isAuthenticated 
    });
  } catch (error) {
    return NextResponse.json({ 
      authenticated: false 
    });
  }
} 