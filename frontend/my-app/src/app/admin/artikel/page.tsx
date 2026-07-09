"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Artikel } from "@/types/artikel";
import Card from "@/components/Card";

export default function AdminArtikelPage() {
  const [data, setData] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/artikel");
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setJudul("");
    setIsi("");
    setTanggal("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !isi || !tanggal) {
      alert("Semua field formulir artikel wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        judul,
        isi,
        tanggal,
      };

      if (editingId) {
        await api.put(`/artikel/${editingId}`, payload);
      } else {
        await api.post("/artikel", payload);
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan artikel.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: Artikel) => {
    setEditingId(item.id);
    setJudul(item.judul);
    setIsi(item.isi);
    setTanggal(item.tanggal);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      return;
    }

    try {
      await api.delete(`/artikel/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus artikel.");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Kelola Artikel</h1>
        <p className="text-gray-400 text-xs mt-1">
          Manajemen artikel edukasi dan panduan keselamatan
        </p>
      </div>

      {/* CRUD FORM CARD */}
      <Card className="border border-white/5 space-y-6">
        <h3 className="text-lg font-bold text-white">
          {editingId ? "📝 Edit Artikel" : "➕ Tambah Artikel Baru"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400">Judul Artikel *</label>
            <input
              type="text"
              placeholder="Contoh: Mengapa Dilarang Berdiri di Dekat Lintasan Aktif?"
              className="glass-input w-full text-sm"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Tanggal Rilis / Publikasi *</label>
              <input
                type="date"
                className="glass-input w-full text-sm text-gray-300"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </div>
            {/* Informational column */}
            <div className="bg-black/20 border border-white/5 rounded-xl p-3 flex items-center justify-center text-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                ℹ️ Gunakan markdown atau pemisah paragraf agar mudah dibaca di halaman publik.
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400">Konten / Isi Artikel *</label>
            <textarea
              placeholder="Tuliskan isi artikel edukasi di sini..."
              rows={8}
              className="glass-input w-full text-sm font-sans leading-relaxed"
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              {submitting ? "Menyimpan..." : editingId ? "Perbarui Artikel" : "Simpan Artikel"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-white/5 hover:bg-white/10 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors border border-white/10 cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* TABLE DATA LIST CARD */}
      <Card className="border border-white/5 overflow-hidden p-0 rounded-2xl shadow-xl">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">📋 Daftar Artikel Publik</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/2 text-gray-400 text-xs uppercase font-semibold border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Judul Artikel</th>
                <th className="px-6 py-4">Tanggal Rilis</th>
                <th className="px-6 py-4">Isi (Potongan)</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    <div className="inline-block animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                    Memuat data artikel...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    Belum ada artikel yang dipublikasikan.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-white/1 transition-colors">
                    <td className="px-6 py-4 font-bold text-white max-w-xs truncate">{item.judul}</td>
                    <td className="px-6 py-4 text-gray-400">{formatDate(item.tanggal)}</td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-500">{item.isi}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 font-semibold px-3 py-1.5 rounded-lg border border-yellow-500/20 text-xs transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold px-3 py-1.5 rounded-lg border border-red-500/20 text-xs transition-colors cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}