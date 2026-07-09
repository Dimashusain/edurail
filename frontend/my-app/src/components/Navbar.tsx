"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reset modal state on path change
  useEffect(() => {
    setIsModalOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleModalChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen: boolean }>;
      setIsModalOpen(!!customEvent.detail?.isOpen);
    };

    window.addEventListener("modal-state-change", handleModalChange);
    return () => {
      window.removeEventListener("modal-state-change", handleModalChange);
    };
  }, []);

  // Hide top navbar on admin pages, login, register, or when a card details modal is open
  if (
    pathname?.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register" ||
    isModalOpen
  ) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/semboyan", label: "Semboyan" },
    { href: "/kereta", label: "Jenis Kereta" },
    { href: "/artikel", label: "Artikel" },
    { href: "/safety", label: "Safety" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#101415]/80 backdrop-blur-md">
      <div className="container mx-auto relative flex h-20 items-center px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-wider text-white">
            Edu<span className="text-blue-500">rail</span>
          </span>

          <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-blue-400 uppercase">
            Central
          </span>
        </Link>

        {/* Navigation */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-medium transition-colors duration-200 hover:text-blue-400 ${isActive
                  ? "text-blue-500 font-bold"
                  : "text-gray-300"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}