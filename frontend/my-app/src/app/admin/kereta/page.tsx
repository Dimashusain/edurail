"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Kereta } from "@/types/kereta";
import Card from "@/components/Card";
import { useModal } from "@/context/ModalContext";

export default function AdminKeretaPage() {
  const { showAlert, showConfirm } = useModal();
  const [data, setData] = useState<Kereta[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("");
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
      const res = await api.get("/kereta");
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
    setNama("");
    setJenis("");
    setDeskripsi("");
    setGambar(null);
    setPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !jenis) {
      showAlert("Nama kereta dan jenis kereta wajib diisi.", { variant: "warning" });
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("jenis", jenis);
      formData.append("deskripsi", deskripsi);

      if (gambar) {
        formData.append("gambar", gambar);
      }

      if (editingId) {
        await api.put(`/kereta/${editingId}`, formData);
        showAlert("Data kereta berhasil diperbarui.", { variant: "success", title: "Berhasil" });
      } else {
        await api.post("/kereta", formData);
        showAlert("Data kereta berhasil ditambahkan.", { variant: "success", title: "Berhasil" });
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
      showAlert("Gagal menyimpan data kereta.", { variant: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: Kereta) => {
    setEditingId(item.id);
    setNama(item.nama);
    setJenis(item.jenis);
    setDeskripsi(item.deskripsi || "");
    setPreview(item.gambar || "");
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = await showConfirm("Apakah Anda yakin ingin menghapus data kereta ini?", {
      variant: "danger",
      confirmText: "Hapus Kereta",
      title: "Konfirmasi Hapus"
    });
    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/kereta/${id}`);
      fetchData();
      showAlert("Data kereta berhasil dihapus.", { variant: "success", title: "Berhasil" });
    } catch (error) {
      console.error(error);
      showAlert("Gagal menghapus data.", { variant: "danger" });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Kelola Kereta</h1>
        <p className="text-gray-400 text-xs mt-1">
          Manajemen spesifikasi armada sarana kereta api
        </p>
      </div>

      {/* CRUD FORM CARD */}
      <Card className="border border-white/5 space-y-6">
        <h3 className="text-lg font-bold text-white">
          {editingId ? "📝 Edit Sarana Kereta" : "➕ Tambah Sarana Kereta Baru"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Nama Kereta / Tipe *</label>
              <input
                type="text"
                placeholder="Contoh: CC 206 / Argo Lawu"
                className="glass-input w-full text-sm"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Jenis Kereta *</label>
              <input
                type="text"
                placeholder="Contoh: Lokomotif Diesel Elektrik / Kereta Penumpang"
                className="glass-input w-full text-sm"
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400">Berkas Gambar Armada</label>
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

          {preview && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Preview Gambar</label>
              <div className="w-56 h-36 bg-black/40 rounded-xl overflow-hidden border border-white/10">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400">Deskripsi / Spesifikasi Teknis</label>
            <textarea
              placeholder="Jelaskan spesifikasi teknis mesin, berat, pabrikan, kecepatan maks, dll..."
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
              {submitting ? "Menyimpan..." : editingId ? "Perbarui Kereta" : "Simpan Kereta"}
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
          <h3 className="text-lg font-bold text-white">📋 Daftar Armada Kereta</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/2 text-gray-400 text-xs uppercase font-semibold border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Gambar</th>
                <th className="px-6 py-4">Nama Armada</th>
                <th className="px-6 py-4">Jenis</th>
                <th className="px-6 py-4">Spesifikasi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    <div className="inline-block animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                    Memuat data sarana...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Belum ada data armada kereta api.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-white/1 transition-colors">
                    <td className="px-6 py-4">
                      {item.gambar ? (
                        <div className="w-20 h-12 rounded-lg bg-black/40 border border-white/10 overflow-hidden">
                          <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-gray-600 text-xs">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{item.nama}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-xs text-blue-400">
                        {item.jenis}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">{item.deskripsi}</td>
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