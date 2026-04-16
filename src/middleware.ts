import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

const protectedPaths = ["/dashboard"];
const authPaths = ["/auth/signin", "/auth/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  const token = request.cookies.get("session")?.value;
  const session = token ? await verifySession(token) : null;

  if (isProtected && !session) {
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
