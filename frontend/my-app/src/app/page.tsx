"use client";

import Link from "next/link";
import { useState } from "react";
import Card from "@/components/Card";

export default function HomePage() {
  // Checklist state for the interactive safety perimeter widget
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Menjaga jarak aman minimal 4,5 meter (15 kaki) dari jalur rel aktif.", checked: false },
    { id: 2, text: "Berhenti, Tengok Kanan-Kiri, Dengar (BTKD) sebelum menyeberang perlintasan sebidang.", checked: false },
    { id: 3, text: "Tidak memotret, bermain, atau beraktivitas di ruang manfaat jalan kereta api.", checked: false },
    { id: 4, text: "Mematuhi isyarat palang pintu, lampu semboyan, dan bunyi sirine perlintasan.", checked: false },
  ]);

  const [safetyCertified, setSafetyCertified] = useState(false);

  const toggleCheck = (id: number) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    setSafetyCertified(updated.every((item) => item.checked));
  };

  return (
    <div className="relative overflow-hidden min-h-screen py-12 px-6">
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10 space-y-16">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 max-w-3xl mx-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Sentra Edukasi Perkeretaapian
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Edukasi Terpusat Perkeretaapian <span className="text-blue-500 bg-clip-text">Indonesia</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Menjembatani kesenjangan pemahaman keselamatan dan standar operasional teknis bagi masyarakat umum, pencinta kereta api, serta calon profesional perkeretaapian.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/semboyan"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              Jelajahi Semboyan
            </Link>
            <Link
              href="/safety"
              className="bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl border border-white/10 transition-all duration-200"
            >
              Protokol Keselamatan
            </Link>
          </div>
        </section>

        {/* PILLARS GRID */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Pilar Utama Edukasi</h2>
            <p className="text-gray-500 text-sm mt-1">Materi pembelajaran terstruktur untuk memahami ekosistem perkeretaapian</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="text-3xl">🚥</div>
                <h3 className="text-xl font-bold text-white">Semboyan & Isyarat</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Pelajari katalog lengkap semboyan perkeretaapian, mulai dari isyarat tangan petugas, semboyan lampu persinyalan, hingga tanda batas kecepatan/papan marka.
                </p>
              </div>
              <Link href="/semboyan" className="text-blue-400 hover:text-blue-300 font-semibold text-sm inline-flex items-center gap-1 mt-6">
                Buka Katalog Semboyan &rarr;
              </Link>
            </Card>

            <Card className="flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="text-3xl">🚂</div>
                <h3 className="text-xl font-bold text-white">Jenis & Sarana Kereta</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Telusuri galeri teknis armada kereta api Indonesia. Pahami perbedaan lokomotif diesel elektrik, diesel hidrolik, kereta rel listrik (KRL), hingga sarana kereta penumpang.
                </p>
              </div>
              <Link href="/kereta" className="text-blue-400 hover:text-blue-300 font-semibold text-sm inline-flex items-center gap-1 mt-6">
                Buka Galeri Sarana &rarr;
              </Link>
            </Card>

            <Card className="flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="text-3xl">📚</div>
                <h3 className="text-xl font-bold text-white">Artikel & Safety Hub</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Kumpulan artikel edukatif, panduan keselamatan perlintasan sebidang, regulasi ruang manfaat jalur rel, serta tips mendokumentasikan kereta api dengan aman.
                </p>
              </div>
              <Link href="/artikel" className="text-blue-400 hover:text-blue-300 font-semibold text-sm inline-flex items-center gap-1 mt-6">
                Baca Artikel Edukasi &rarr;
              </Link>
            </Card>
          </div>
        </section>

        {/* EMERGENCY ADVISORY PINNED BANNER */}
        <section className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-red-500/10 p-4 rounded-xl text-red-500 text-3xl font-bold flex items-center justify-center">
            ⚠️
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="text-xl font-bold text-red-400">PANDUAN DARURAT: Kendaraan Mogok di Perlintasan Sebidang!</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Jika kendaraan Anda mogok di tengah perlintasan kereta api aktif dan alarm/sirine sudah berbunyi, ikuti protokol penyelamatan darurat berikut ini secara cepat:
            </p>
            <ol className="list-decimal list-inside text-gray-300 text-sm space-y-1">
              <li><strong>Keluar Segera:</strong> Perintahkan seluruh penumpang untuk segera turun meninggalkan kendaraan.</li>
              <li><strong>Lari Berlawanan Arah Kereta:</strong> Berlarilah ke arah datangnya kereta dengan sudut serong menjauhi rel agar terhindar dari serpihan tabrakan kendaraan.</li>
              <li><strong>Hubungi Petugas:</strong> Beritahu petugas penjaga perlintasan terdekat atau gunakan nomor darurat jika kereta belum terlihat.</li>
            </ol>
          </div>
        </section>

        {/* INTERACTIVE WIDGET: SAFETY CHECKLIST */}
        <section className="bg-white/5 border border-white/5 rounded-3xl p-8 max-w-3xl mx-auto space-y-6">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold text-white">Perimeter Keselamatan Rel (15-Foot Perimeter)</h3>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              Uji pemahaman Anda tentang batas keselamatan dasar perkeretaapian. Centang seluruh protokol untuk memverifikasi kesiapan keselamatan Anda:
            </p>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${item.checked
                  ? "bg-blue-500/5 border-blue-500/40 text-white"
                  : "bg-white/2 border-white/5 text-gray-400 hover:bg-white/5"
                  }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all ${item.checked ? "bg-blue-500 border-blue-500 text-white" : "border-gray-600"
                  }`}>
                  {item.checked && "✓"}
                </div>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          {safetyCertified ? (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center text-blue-400 font-bold text-sm animate-pulse">
              🎉 Anda Telah Memahami Protokol Keselamatan Kereta Api! Mari budayakan keselamatan bersama Edurail.
            </div>
          ) : (
            <div className="text-center text-xs text-gray-500">
              * Centang semua poin di atas untuk memverifikasi pengetahuan Anda.
            </div>
          )}
        </section>

        {/* ADMIN QUICK ACCESS SECTION */}
        <section className="flex flex-col items-center justify-center pt-8 border-t border-white/5 text-center space-y-3">
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            APAKAH ANDA PETUGAS ATAU ADMINISTRATOR?
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 text-xs shadow-sm shadow-black/20 cursor-pointer"
          >
            🔑 Login Administrator
          </Link>
        </section>
      </div>
    </div>
  );
}