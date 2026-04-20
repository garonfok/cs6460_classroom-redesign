import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const password = req.cookies.get('access_password')?.value;
  const fullName = req.cookies.get('full_name')?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard') && (password !== process.env.ACCESS_PASSWORD || !fullName)) {
    const response = NextResponse.redirect(new URL('/', req.url));
    response.cookies.delete('access_password');
    response.cookies.delete('full_name');
    return response;
  }

  if (pathname === '/' && password === process.env.ACCESS_PASSWORD && fullName) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: '/:path*',
};
