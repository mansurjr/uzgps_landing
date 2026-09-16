import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n";

/**
 * Locale Proxy:
 * "/" → redirects to "/ru"
 * "/ru" and "/uz" → served directly
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url, 307);
  }

  const first = pathname.split("/")[1];
  if (!first || !isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|tiles|favicon.ico|brand|smpo|vehicles|platform|.*\\.[\\w]+$).*)"],
};
