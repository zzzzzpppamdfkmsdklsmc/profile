import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin* 보호 (로그인/로그아웃은 예외)
  const isAdminPath = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  if (isAdminPath) {
    const cookie = req.cookies.get("admin");
    if (!cookie || cookie.value !== "1") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // /admin 전체 보호
};
