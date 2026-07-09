"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Otorisasi dijaga oleh middleware server-side. Cookie token
    // httpOnly tidak bisa dibaca dari sisi klien, jadi cukup alihkan
    // ke dashboard (middleware akan blokir & arahkan ke /login bila
    // belum terotentikasi).
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#101415] flex items-center justify-center text-gray-400">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="text-xs">Mengalihkan halaman admin...</p>
      </div>
    </div>
  );
}