// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routeAccessMap } from "./lib/settings";

// Build matcher objects from your map
const matchers = Object.entries(routeAccessMap).map(
  ([pattern, allowedRoles]) => ({
    matcher: new RegExp(pattern),
    allowedRoles,
  })
);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Skip middleware for public routes
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return NextResponse.next();
  }

  // 2) Extract role from custom header or cookie
  const role = "admin";

  if (!role) {
    // Redirect unauthenticated users
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 3) Apply route-based guards
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher.test(pathname) && !allowedRoles.includes(role)) {
      // If signed in but unauthorized for this route
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 4) Allow through
  return NextResponse.next();
}

// Apply middleware only on non-static routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
