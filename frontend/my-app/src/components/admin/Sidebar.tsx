"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {

  const pathname =
    usePathname();

  const menus = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      name: "Semboyan",
      href: "/admin/semboyan",
    },
    {
      name: "Kereta",
      href: "/admin/kereta",
    },
    {
      name: "Artikel",
      href: "/admin/artikel",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-2xl font-bold">
          EduRail
        </h1>

        <p className="text-sm text-gray-400">
          Admin Panel
        </p>

      </div>

      <nav className="p-4">

        {menus.map((menu) => (

          <Link
            key={menu.href}
            href={menu.href}
            className={`
              block px-4 py-3 rounded mb-2
              ${
                pathname === menu.href
                  ? "bg-blue-600"
                  : "hover:bg-slate-700"
              }
            `}
          >
            {menu.name}
          </Link>

        ))}

      </nav>

    </aside>
  );
}