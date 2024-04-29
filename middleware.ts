import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = await verifyToken();
    if (token) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/api")) {
    const condition =
      pathname.includes("/login") ||
      pathname.includes("/balance") ||
      pathname.includes("/register");

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
  matcher: ["/admin/:path*", "/api/:path*"],
};
