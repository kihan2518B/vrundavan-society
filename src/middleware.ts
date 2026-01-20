import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  const { pathname } = req.nextUrl;

  // If user is on login page and has a valid token, redirect to admin
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }
  // If user is trying to access admin page, check for valid token
  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!manifest.json|sw.js|icons|api|_next/static|_next/image|favicon.ico).*)'],
};
