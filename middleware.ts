import { NextRequest, NextResponse } from 'next/server';

// Configuration de la bêta fermée
const BETA_PASSWORD = process.env.BETA_PASSWORD || 'rgaa2025beta';
const BETA_COOKIE_NAME = 'rgaa-beta-access';
const BETA_COOKIE_VALUE = 'authenticated';

// Pages qui ne nécessitent pas d'authentification
const PUBLIC_PATHS = [
  '/api',
  '/favicon.ico',
  '/_next',
  '/static',
  '/images',
  '/login'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`🔍 Middleware - Path: ${pathname}`);
  
  // Vérifier si c'est une page publique
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
  
  if (isPublicPath) {
    console.log(`✅ Public path, allowing: ${pathname}`);
    return NextResponse.next();
  }

  // Vérifier le cookie d'authentification
  const betaCookie = request.cookies.get(BETA_COOKIE_NAME);
  const isAuthenticated = betaCookie?.value === BETA_COOKIE_VALUE;
  
  console.log(`🔐 Auth check - Cookie: ${betaCookie?.value}, Authenticated: ${isAuthenticated}`);

  if (!isAuthenticated) {
    console.log(`🚫 Not authenticated, redirecting to login from: ${pathname}`);
    // Rediriger vers la page de connexion bêta
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  console.log(`✅ Authenticated, allowing access to: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  // Matcher simplifié pour intercepter toutes les pages principales
  matcher: [
    '/',
    '/blog/:path*',
    '/quiz/:path*',
    '/politique-confidentialite',
    '/mentions-legales'
  ],
}; 