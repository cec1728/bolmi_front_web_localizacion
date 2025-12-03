import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("bolmi_auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "")

  // If accessing protected route without token, redirect to login
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If on login page with token, redirect to dashboard
  if (token && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
