import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/deck-builder',
  '/game',
  '/settings',
];

// Define routes that require admin role
const adminRoutes = [
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the route requires admin role
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // If it's not a protected route, allow the request
  if (!isProtectedRoute && !isAdminRoute) {
  return NextResponse.next();
}

  // Get the auth token from cookies
  const authToken = request.cookies.get('auth_token');
  
  // If there's no auth token, redirect to login
  if (!authToken?.value) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  
  // For admin routes, check if the user has admin role
  if (isAdminRoute) {
    try {
      const { role } = JSON.parse(authToken.value);
      
      if (role !== 'admin') {
        // Redirect non-admin users to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // If there's an error parsing the token, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all protected routes
    '/profile/:path*',
    '/deck-builder/:path*',
    '/game/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
};