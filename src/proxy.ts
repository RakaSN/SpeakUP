import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy (Next.js 16 file convention).
 * Melakukan redirect ringan berbasis session token cookie.
 */
export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('authjs.session-token') || request.cookies.get('__Secure-authjs.session-token');
  const isLoggedIn = !!sessionToken;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login');

  // Cegah user yang sudah login mengakses halaman login
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Proteksi: Dashboard mewajibkan login
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/profile');
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
