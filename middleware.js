import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
  publicRoutes: [
    "/",
    "/signin",
    "/signup",
    "/admin/signin",
    "/admin/signup",
    "/api/user/login",
    "/api/user/register",
    "/products(.*)",
    "/categories(.*)",
    "/about",
  ],
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
