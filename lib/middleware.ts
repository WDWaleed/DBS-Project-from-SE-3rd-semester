import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "./utils/auth";

export function middleware(req: NextRequest) {
  const token = getToken();

  const isAuth = !!token;
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/dashboard") && !isAuth) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
