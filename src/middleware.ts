import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware ringan tanpa import NextAuth/Prisma/bcrypt.
 * Edge Runtime tidak mendukung modul Node.js native seperti node:util/types.
 * 
 * Middleware ini hanya melakukan redirect sederhana berdasarkan keberadaan session token.
 * Pengecekan autentikasi mendalam dilakukan di Server Components/Actions via auth().
 */
export function middleware(request: NextRequest) {
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
