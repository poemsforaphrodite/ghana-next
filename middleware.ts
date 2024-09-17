import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  // Exclude login and signup routes from authentication check
  if (req.nextUrl.pathname.startsWith('/api/login') || req.nextUrl.pathname.startsWith('/api/signup')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  // Simple authentication check
  if (!token) {
    // Determine if the request is to an API route
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Redirect to login for non-API routes
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Add additional authentication logic if necessary

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};