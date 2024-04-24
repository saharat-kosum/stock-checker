import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLoggedIn = true;
    if (isLoggedIn) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/api")) {
    if (pathname.includes("/login")) {
      return NextResponse.next();
    }

    const token = true;
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
