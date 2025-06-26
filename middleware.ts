import { NextRequest, NextResponse } from 'next/server';

// Configuration de la bêta fermée
const BETA_PASSWORD = process.env.BETA_PASSWORD || 'rgaa2025beta';
const BETA_COOKIE_NAME = 'rgaa-beta-access';
const BETA_COOKIE_VALUE = 'authenticated';

// Pages qui ne nécessitent pas d'authentification (page de connexion, assets, API publiques)
const PUBLIC_PATHS = [
  '/api/auth/beta',
  '/favicon.ico',
  '/_next',
  '/static',
  '/images',
  '/login'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si c'est une page publique
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Vérifier le cookie d'authentification
  const betaCookie = request.cookies.get(BETA_COOKIE_NAME);
  const isAuthenticated = betaCookie?.value === BETA_COOKIE_VALUE;

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion bêta
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Appliquer le middleware sur toutes les routes sauf les exclusions
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 