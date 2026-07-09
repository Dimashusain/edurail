"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages, login, or register
  if (
    pathname?.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <footer className="border-t border-white/5 bg-[#101415]/80 backdrop-blur-md py-8 text-center text-sm text-gray-400 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-wider text-white">
              Edu<span className="text-blue-500">Rail</span>
            </span>
            <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xxs font-semibold tracking-wider text-blue-400 uppercase">
              Academy
            </span>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Edurail. Centralized Railway Education Indonesia.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Meningkatkan Keselamatan & Pengetahuan Perkeretaapian</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
