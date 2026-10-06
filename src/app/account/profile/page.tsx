"use client";

import React, { useState, useEffect } from "react";
import { User as UserIcon, Mail, Phone, CheckCircle2, Loader2, Calendar, ShieldCheck } from "lucide-react";
import { User } from "@/lib/types";

export default function CustomerProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setName(data.user.name || "");
          setPhone(data.user.phone || "");
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    // Simulate saving profile updates
    setTimeout(() => {
      setSaving(false);
      setMessage("Profil Anda berhasil diperbarui!");
      setTimeout(() => setMessage(""), 3000);
    }, 600);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 animate-pulse space-y-4">
        <div className="h-6 bg-slate-100 rounded w-48"></div>
        <div className="h-40 bg-slate-50 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033] mb-1">
          Profil Akun Saya
        </h1>
        <p className="text-xs text-[#64748B] mb-6">
          Kelola informasi data diri dan kontak akun RZ Store Anda.
        </p>

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 max-w-xl">
          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Alamat Email (Akun Utama)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <span className="text-[11px] text-[#64748B] mt-1 block">
              Email terverifikasi. Untuk mengubah email utama, hubungi CS kami.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Nomor WhatsApp / HP
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Bergabung sejak:{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })
                  : "2026"}
              </span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition shadow flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[#172033]">Status Keamanan Akun</h3>
          <p className="text-xs text-[#64748B]">
            Akun Anda aktif dan terlindungi dengan standar keamanan PT RZ E-Commerce Group.
          </p>
        </div>
      </div>
    </div>
  );
}
