"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Kereta } from "@/types/kereta";
import Card from "@/components/Card";

export default function KeretaPage() {
  const [data, setData] = useState<Kereta[]>([]);
  const [filteredData, setFilteredData] = useState<Kereta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Kereta | null>(null);
  const [selectedJenis, setSelectedJenis] = useState("Semua");

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
    let result = data;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.nama.toLowerCase().includes(search) ||
          item.jenis.toLowerCase().includes(search) ||
          (item.deskripsi && item.deskripsi.toLowerCase().includes(search))
      );
    }

    // Filter by type
    if (selectedJenis !== "Semua") {
      result = result.filter((item) => item.jenis === selectedJenis);
    }

    setFilteredData(result);
  }, [searchTerm, selectedJenis, data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/kereta");
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

  // Extract unique categories (jenis)
  const types = ["Semua", ...Array.from(new Set(data.map((item) => item.jenis)))];

  return (
    <div className="min-h-screen py-12 px-6 relative">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-80 h-80 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl space-y-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Galeri Teknis</div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Jenis & Sarana Kereta</h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Katalog spesifikasi sarana perkeretaapian Indonesia. Pelajari detail teknis lokomotif, kereta penumpang, hingga kereta rel listrik (KRL).
            </p>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Cari armada (contoh: CC 206)..."
              className="glass-input w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories / Tabs */}
        {data.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedJenis(type)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  selectedJenis === type
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p>Memuat Galeri Sarana...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20 bg-white/2 border border-white/5 rounded-2xl text-gray-400">
            🔍 Tidak ada data armada kereta yang cocok.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <Card
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="flex flex-col h-full border border-white/5 hover:border-blue-500/30 group"
              >
                <div className="relative aspect-[16/10] bg-black/40 rounded-xl overflow-hidden mb-4 border border-white/5">
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
                  <span className="absolute bottom-3 left-3 text-[10px] font-semibold tracking-wider uppercase bg-blue-600/90 text-white px-2 py-0.5 rounded shadow">
                    {item.jenis}
                  </span>
                </div>

                <div className="flex-grow space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.nama}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="text-xs text-blue-400 font-semibold mt-4 flex items-center gap-1">
                  Detail Spesifikasi &rarr;
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
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
                <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                  {selectedItem.jenis}
                </span>
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

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Spesifikasi & Deskripsi</h4>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {selectedItem.deskripsi}
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Tutup Spesifikasi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}