import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  console.log("Middleware called for path:", req.nextUrl.pathname);
  
  if (req.nextUrl.pathname.startsWith('/login') || 
      req.nextUrl.pathname.startsWith('/api/login') ||
      req.nextUrl.pathname === '/about') {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if (!token) {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    console.log("Attempting to verify token:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("Token verified successfully", decoded);
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("JWT Error:", error.message);
    }
    // Instead of redirecting, we'll pass the request through
    // return NextResponse.redirect(new URL('/login', req.url));
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};