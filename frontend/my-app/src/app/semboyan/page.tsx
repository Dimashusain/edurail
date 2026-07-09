"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Semboyan } from "@/types/semboyan";
import Card from "@/components/Card";

export default function SemboyanPage() {
  const [data, setData] = useState<Semboyan[]>([]);
  const [filteredData, setFilteredData] = useState<Semboyan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Semboyan | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("modal-state-change", { detail: { isOpen: !!selectedItem } })
    );
    // Cleanup modal state when unmounting page
    return () => {
      window.dispatchEvent(
        new CustomEvent("modal-state-change", { detail: { isOpen: false } })
      );
    };
  }, [selectedItem]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data);
    } else {
      const search = searchTerm.toLowerCase();
      const filtered = data.filter(
        (item) =>
          item.nama.toLowerCase().includes(search) ||
          item.arti.toLowerCase().includes(search) ||
          (item.deskripsi && item.deskripsi.toLowerCase().includes(search)) ||
          (item.warna && item.warna.toLowerCase().includes(search))
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/semboyan");
      
      let result = [];
      if (Array.isArray(res.data)) {
        result = res.data;
      } else if (Array.isArray(res.data?.data)) {
        result = res.data.data;
      }
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error(error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 relative">
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl space-y-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Katalog Visual</div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Semboyan Perkeretaapian</h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Daftar isyarat tangan, lampu persinyalan, peluit/suara, dan papan marka penunjuk aturan operasional perjalanan kereta api di Indonesia.
            </p>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Cari semboyan (contoh: Semboyan 35)..."
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
            <p>Memuat Katalog Semboyan...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20 bg-white/2 border border-white/5 rounded-2xl text-gray-400">
            🔍 Tidak ada data semboyan yang cocok dengan pencarian Anda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <Card
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="flex flex-col h-full border border-white/5 hover:border-blue-500/30 group"
              >
                <div className="relative aspect-[4/3] bg-black/40 rounded-xl overflow-hidden mb-4 border border-white/5">
                  {item.gambar ? (
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                      Gambar Tidak Tersedia
                    </div>
                  )}
                  {item.warna && (
                    <span className="absolute top-3 right-3 text-[10px] font-semibold tracking-wider uppercase bg-black/60 text-blue-400 px-2 py-0.5 rounded border border-white/10">
                      🎨 {item.warna}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.nama}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {item.arti}
                  </p>
                </div>

                <div className="text-xs text-blue-400 font-semibold mt-4 flex items-center gap-1">
                  Lihat Detail Aturan &rarr;
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl p-2 cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-4">
                <div className="inline-flex gap-2">
                  <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                    Semboyan Perkeretaapian
                  </span>
                  {selectedItem.warna && (
                    <span className="text-xs font-semibold text-gray-300 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                      Warna: {selectedItem.warna}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedItem.nama}</h2>
              </div>

              {selectedItem.gambar && (
                <div className="aspect-[16/9] bg-black/50 rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={selectedItem.gambar}
                    alt={selectedItem.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Arti / Makna Singkat</h4>
                  <p className="text-white font-medium text-lg mt-1">{selectedItem.arti}</p>
                </div>
                {selectedItem.deskripsi && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Aturan Lengkap & Deskripsi</h4>
                    <p className="text-gray-300 text-sm mt-1 leading-relaxed whitespace-pre-line">
                      {selectedItem.deskripsi}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Tutup Panduan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}