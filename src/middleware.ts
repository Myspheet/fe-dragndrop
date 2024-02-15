import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { accessToken } from './constant';

const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
   const userToken = cookies().get(accessToken);
   const path = request.nextUrl.pathname;

   if(!userToken && !authRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
   }

   if(userToken && authRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/', request.nextUrl.origin));
   }
}

export const config = {
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
}