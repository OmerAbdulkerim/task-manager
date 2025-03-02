import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'access_secret',
);

// List of paths that require authentication
const protectedPaths = ['/dashboard'];

// Check if the path requires authentication
const isProtectedPath = (path: string) => {
  return protectedPaths.some((prefix) => path.startsWith(prefix));
};

// Middleware function to protect routes
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for non-protected paths and api routes
  if (!isProtectedPath(path) || path.startsWith('/api')) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;

  // If no token is found, redirect to login
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the token
    await jwtVerify(accessToken, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Define which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
