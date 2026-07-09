"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Link from "next/link";
import Card from "@/components/Card";

export default function RegisterPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      setLoading(true);

      await api.post("/auth/register", {
        nama,
        email,
        password,
      });

      alert("Registrasi Admin berhasil! Silakan login.");
      router.push("/login");
    } catch (error: any) {
      setErrorMsg(
        error?.response?.data?.message ||
          "Gagal mendaftarkan administrator baru"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md border border-white/5 space-y-6 relative z-10 p-8 md:p-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 text-[10px] font-semibold uppercase tracking-wider">
            📝 Admin Registration
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Daftar <span className="text-blue-500">EduRail</span>
          </h1>
          <p className="text-gray-400 text-xs">
            Buat akun untuk mengelola konten edukasi perkeretaapian
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center text-xs text-red-400 font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Nama Administrator"
              className="glass-input w-full text-sm"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400">Email Address</label>
            <input
              type="email"
              placeholder="admin@edurail.com"
              className="glass-input w-full text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="glass-input w-full text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-500/25 mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Mendaftarkan..." : "Daftar Administrator"}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Sudah terdaftar?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Login di sini
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}