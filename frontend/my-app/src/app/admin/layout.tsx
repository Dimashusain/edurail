"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  // Pengecekan otorisasi dilakukan server-side di src/middleware.ts
  // (cookie token httpOnly diverifikasi sebelum halaman dirender),
  // sehingga tidak perlu lagi cek localStorage di sini.

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post("/auth/logout");
    } catch {
      // Abaikan error; tetap arahkan ke login
    } finally {
      window.location.href = "/login";
    }
  };

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/semboyan", label: "Kelola Semboyan" },
    { href: "/admin/kereta", label: "Kelola Kereta" },
    { href: "/admin/artikel", label: "Kelola Artikel" },
  ];

  return (
    <div className="min-h-screen bg-[#101415] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#161e22]/90 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <span className="text-lg font-bold tracking-wider text-white">
              Edu<span className="text-blue-500">rail</span>
            </span>
            <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 uppercase">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            🚪 Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="container mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}