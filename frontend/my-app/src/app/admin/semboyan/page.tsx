"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Card from "@/components/Card";
import { useModal } from "@/context/ModalContext";

interface Semboyan {
  id: number;
  nama: string;
  arti: string;
  warna: string;
  deskripsi: string;
  gambar: string;
}

export default function AdminSemboyanPage() {
  const { showAlert, showConfirm } = useModal();
  const [data, setData] = useState<Semboyan[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nama, setNama] = useState("");
  const [arti, setArti] = useState("");
  const [warna, setWarna] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNama("");
    setArti("");
    setWarna("");
    setDeskripsi("");
    setGambar(null);
    setPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !arti) {
      showAlert("Nama semboyan dan arti wajib diisi.", { variant: "warning" });
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("arti", arti);
      formData.append("warna", warna);
      formData.append("deskripsi", deskripsi);
      if (gambar) {
        formData.append("gambar", gambar);
      }

      if (editingId) {
        await api.put(`/semboyan/${editingId}`, formData);
        showAlert("Data semboyan berhasil diperbarui.", { variant: "success", title: "Berhasil" });
      } else {
        await api.post("/semboyan", formData);
        showAlert("Data semboyan berhasil ditambahkan.", { variant: "success", title: "Berhasil" });
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
      showAlert("Gagal menyimpan data semboyan.", { variant: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: Semboyan) => {
    setEditingId(item.id);
    setNama(item.nama);
    setArti(item.arti);
    setWarna(item.warna || "");
    setDeskripsi(item.deskripsi || "");
    setPreview(item.gambar || "");
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = await showConfirm("Apakah Anda yakin ingin menghapus data semboyan ini?", {
      variant: "danger",
      confirmText: "Hapus Semboyan",
      title: "Konfirmasi Hapus"
    });
    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/semboyan/${id}`);
      fetchData();
      showAlert("Data semboyan berhasil dihapus.", { variant: "success", title: "Berhasil" });
    } catch (error) {
      console.error(error);
      showAlert("Gagal menghapus data.", { variant: "danger" });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Kelola Semboyan</h1>
        <p className="text-gray-400 text-xs mt-1">
          Manajemen katalog isyarat persinyalan kereta api
        </p>
      </div>

      {/* CRUD FORM CARD */}
      <Card className="border border-white/5 space-y-6">
        <h3 className="text-lg font-bold text-white">
          {editingId ? "📝 Edit Semboyan" : "➕ Tambah Semboyan Baru"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Nama Semboyan *</label>
              <input
                type="text"
                placeholder="Contoh: Semboyan 35"
                className="glass-input w-full text-sm"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Makna / Arti Singkat *</label>
              <input
                type="text"
                placeholder="Contoh: Pemberitahuan masinis membunyikan suling lokomotif"
                className="glass-input w-full text-sm"
                value={arti}
                onChange={(e) => setArti(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Warna Kategori (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: Merah, Hijau, Kuning"
                className="glass-input w-full text-sm"
                value={warna}
                onChange={(e) => setWarna(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Ilustrasi Gambar</label>
              <input
                type="file"
                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setGambar(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>

          {preview && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Preview Gambar</label>
              <div className="w-48 h-32 relative bg-black/40 rounded-xl overflow-hidden border border-white/10">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400">Deskripsi Lengkap / Aturan Regulasi</label>
            <textarea
              placeholder="Jelaskan detail operasional semboyan ini..."
              rows={4}
              className="glass-input w-full text-sm"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              {submitting ? "Menyimpan..." : editingId ? "Perbarui Semboyan" : "Simpan Semboyan"}
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
          <h3 className="text-lg font-bold text-white">📋 Daftar Katalog Semboyan</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/2 text-gray-400 text-xs uppercase font-semibold border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Gambar</th>
                <th className="px-6 py-4">Nama Semboyan</th>
                <th className="px-6 py-4">Arti / Makna</th>
                <th className="px-6 py-4">Warna</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    <div className="inline-block animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                    Memuat data semboyan...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Belum ada data semboyan. Silakan tambahkan baru di atas.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-white/1 transition-colors">
                    <td className="px-6 py-4">
                      {item.gambar ? (
                        <div className="w-16 h-12 rounded-lg bg-black/40 border border-white/10 overflow-hidden">
                          <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-gray-600 text-xs">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{item.nama}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{item.arti}</td>
                    <td className="px-6 py-4">
                      {item.warna ? (
                        <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-xs text-gray-400">
                          {item.warna}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
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