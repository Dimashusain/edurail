"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Artikel } from "@/types/artikel";
import Card from "@/components/Card";

export default function ArtikelPage() {
  const [data, setData] = useState<Artikel[]>([]);
  const [filteredData, setFilteredData] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Artikel | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data);
    } else {
      const search = searchTerm.toLowerCase();
      const filtered = data.filter(
        (item) =>
          item.judul.toLowerCase().includes(search) ||
          (item.isi && item.isi.toLowerCase().includes(search))
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/artikel");
      setData(Array.isArray(res.data) ? res.data : []);
      setFilteredData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateStr).toLocaleDateString("id-ID", options);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 relative">
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl space-y-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Pusat Informasi</div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Artikel & Wawasan</h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Kumpulan artikel edukatif, panduan operasional perkeretaapian, regulasi keselamatan, dan wawasan menarik seputar sejarah kereta api.
            </p>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Cari judul atau isi artikel..."
              className="glass-input w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p>Memuat Daftar Artikel...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20 bg-white/2 border border-white/5 rounded-2xl text-gray-400">
            🔍 Tidak ada artikel yang ditemukan.
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredData.map((item) => (
              <Card
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="border border-white/5 hover:border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer p-8 group"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-blue-400">
                      Edukasi
                    </span>
                    <span>•</span>
                    <span>{formatDate(item.tanggal)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {item.judul}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed max-w-3xl">
                    {item.isi}
                  </p>
                </div>

                <div className="text-xs text-blue-400 font-semibold flex items-center gap-1 shrink-0 group-hover:translate-x-1 transition-transform">
                  Baca Artikel Lengkap &rarr;
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Article Reading Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 md:p-10 space-y-6 max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl p-2 cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded border border-blue-500/20">
                    Artikel Edukasi
                  </span>
                  <span>•</span>
                  <span>{formatDate(selectedItem.tanggal)}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                  {selectedItem.judul}
                </h2>
              </div>

              <div className="border-t border-white/5 pt-6">
                <div className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {selectedItem.isi}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <span className="text-xs text-gray-500">Materi Edukasi Edurail Academy</span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Tutup Bacaan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}