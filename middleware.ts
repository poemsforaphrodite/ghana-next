import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't need authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/api/login',
  '/api/signup',
  '/favicon.ico'
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check if the current path is a public route
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get the session cookie
  const sessionCookie = req.cookies.get('session');
  console.log('Session cookie:', sessionCookie); // Debug log

  if (!sessionCookie?.value) {
    console.log('No session cookie found'); // Debug log
    
    // Handle API routes
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { message: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Redirect to login for non-API routes
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Parse and validate session data
    const session = JSON.parse(sessionCookie.value);
    console.log('Parsed session:', session); // Debug log

    if (!session.userId || !session.role) {
      throw new Error('Invalid session data');
    }

    // Check admin routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (session.role !== 'admin') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { message: 'Unauthorized: Admin access required' },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Clone the request headers and add user info
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', session.userId);
    requestHeaders.set('x-user-role', session.role);

    // Return response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Session validation error:', error); // Debug log
    
    // Handle API routes
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Redirect to login for non-API routes
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};