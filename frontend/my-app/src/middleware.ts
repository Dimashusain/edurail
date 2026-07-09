import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Token disimpan sebagai httpOnly cookie sehingga tidak bisa dibaca dari
 * sisi klien (lihat backend `authController.login`). Middleware ini menjaga
 * halaman admin secara SERVER-SIDE lebih awal — bukan passthrough — dengan
 * memeriksa keberadaan & expiry cookie `token` SEBELUM halaman dirender.
 *
 * Catatan: middleware berjalan di Edge Runtime. Pengecekan di sini hanya
 * memvalidasi KEADAAN cookie (ada + belum kedaluwarsa), bukan tanda tangan
 * JWT. Verifikasi kriptografi penuh tetap dilakukan backend di setiap
 * request API terproteksi melalui `authMiddleware`.
 */
function isTokenInvalid(token: string | undefined): boolean {
  if (!token) return true;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    // base64url → base64, lalu decode payload JWT.
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    if (typeof payload.exp !== "number") return true;
    // exp dalam detik, Date.now() dalam milidetik.
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin") && isTokenInvalid(token)) {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    // Bersihkan cookie kedaluwarsa agar tidak terus-menerus diteruskan.
    if (token) {
      response.cookies.delete("token");
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
