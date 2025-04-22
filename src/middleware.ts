import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup"];
const adminRoutes = ["/adminDashboard", "/volunteers", "/createMessage"];
const isPublicRoute = createRouteMatcher(publicRoutes);
const isAdminRoute = createRouteMatcher(adminRoutes);

export default clerkMiddleware((auth, req) => {
  const { userId, orgRole } = auth();
  const { pathname } = req.nextUrl;

  // Not logged in
  if (!userId) {
    if (isPublicRoute(req)) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged in so redirect public
  if (isPublicRoute(req)) {
    const redirectPath = orgRole === "org:admin" ? "/adminDashboard" : "/volunteerDashboard";
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // Admin-only route
  if (isAdminRoute(req) && orgRole !== "org:admin") {
    console.log("Admin-only route: ", pathname);
    console.log("Org role: ", orgRole);
    return NextResponse.redirect(new URL("/volunteerDashboard", req.url));
  }

  // Redirect "/" to dashboard
  if (pathname === "/") {
    const redirectPath = orgRole === "org:admin" ? "/adminDashboard" : "/volunteerDashboard";
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
