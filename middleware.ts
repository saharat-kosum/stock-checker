import { NextRequest, NextResponse } from "next/server";
import { hasAccessToken, verifyToken } from "./utils/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const hasToken = hasAccessToken();
    if (hasToken) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/api")) {
    const condition =
      pathname.includes("/login") ||
      pathname.includes("/balance") ||
      pathname.includes("/register") ||
      pathname.includes("/refresh");

    if (condition) {
      return NextResponse.next();
    }

    const token = await verifyToken();
    if (token) {
      return NextResponse.next();
    } else {
      return Response.json(
        {
          message: "authentication failed",
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
