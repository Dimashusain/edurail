"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Card from "@/components/Card";
import Link from "next/link";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSemboyan: 0,
    totalKereta: 0,
    totalArtikel: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [semboyanRes, keretaRes, artikelRes] = await Promise.all([
        api.get("/semboyan"),
        api.get("/kereta"),
        api.get("/artikel"),
      ]);

      let semboyanCount = 0;
      if (Array.isArray(semboyanRes.data)) {
        semboyanCount = semboyanRes.data.length;
      } else if (Array.isArray(semboyanRes.data?.data)) {
        semboyanCount = semboyanRes.data.data.length;
      }

      setStats({
        totalSemboyan: semboyanCount,
        totalKereta: Array.isArray(keretaRes.data) ? keretaRes.data.length : 0,
        totalArtikel: Array.isArray(artikelRes.data) ? artikelRes.data.length : 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="text-sm">Memuat Dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Semboyan",
      count: stats.totalSemboyan,
      color: "border-blue-500/20 text-blue-400 bg-blue-500/5",
      link: "/admin/semboyan",
      label: "Kelola Semboyan",
      icon: "🚥",
    },
    {
      title: "Total Kereta",
      count: stats.totalKereta,
      color: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
      link: "/admin/kereta",
      label: "Kelola Kereta",
      icon: "🚂",
    },
    {
      title: "Total Artikel",
      count: stats.totalArtikel,
      color: "border-purple-500/20 text-purple-400 bg-purple-500/5",
      link: "/admin/artikel",
      label: "Kelola Artikel",
      icon: "📝",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Dashboard Edurail</h1>
        <p className="text-gray-400 text-xs mt-1">
          Ringkasan data edukasi perkeretaapian terpusat
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <Card key={idx} className="border border-white/5 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <h2 className="text-4xl font-extrabold text-white mt-1">
                  {card.count}
                </h2>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>

            <div className="pt-2 border-t border-white/5">
              <Link
                href={card.link}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
              >
                {card.label} &rarr;
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Admin Quick Tips Card */}
      <Card className="border border-white/5 bg-white/2 p-6 md:p-8 space-y-3">
        <h3 className="text-lg font-bold text-white">Selamat Datang di Management Engine!</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Sebagai administrator Edurail, Anda dapat melakukan pembaharuan data edukasi secara real-time. Gunakan menu sidebar untuk menambahkan semboyan baru, memperbarui spesifikasi lokomotif/sarana kereta api, atau menulis artikel kampanye keselamatan perlintasan sebidang.
        </p>
      </Card>
    </div>
  );
}