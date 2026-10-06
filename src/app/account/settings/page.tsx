"use client";

import React, { useState } from "react";
import { Lock, Bell, Shield, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function CustomerSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const [emailPromo, setEmailPromo] = useState(true);
  const [waUpdates, setWaUpdates] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordErr("Semua kolom kata sandi wajib diisi.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErr("Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErr("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setSavingPassword(true);
    setPasswordErr("");
    setPasswordMsg("");

    setTimeout(() => {
      setSavingPassword(false);
      setPasswordMsg("Kata sandi Anda berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg(""), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-[#172033] text-base">Ganti Kata Sandi</h2>
            <p className="text-xs text-[#64748B]">
              Perbarui kata sandi secara berkala demi keamanan akunmu
            </p>
          </div>
        </div>

        {passwordMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{passwordMsg}</span>
          </div>
        )}

        {passwordErr && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{passwordErr}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Kata Sandi Saat Ini
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003366]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Kata Sandi Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003366]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003366]"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="px-6 py-2.5 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition shadow flex items-center gap-2 disabled:opacity-50"
          >
            {savingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Perbarui Kata Sandi
          </button>
        </form>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-[#172033] text-base">Notifikasi & Komunikasi</h2>
            <p className="text-xs text-[#64748B]">
              Atur pemberitahuan pesanan dan info promosi diskon
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-lg">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer">
            <div>
              <p className="text-xs font-bold text-[#172033]">Update Pesanan via WhatsApp</p>
              <p className="text-[11px] text-[#64748B]">
                Terima update nomor resi dan kedatangan kurir langsung di WA
              </p>
            </div>
            <input
              type="checkbox"
              checked={waUpdates}
              onChange={(e) => setWaUpdates(e.target.checked)}
              className="w-4 h-4 text-[#003366] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer">
            <div>
              <p className="text-xs font-bold text-[#172033]">Email Promo & Flash Sale</p>
              <p className="text-[11px] text-[#64748B]">
                Dapatkan voucher eksklusif dan diskon hingga 50% setiap minggu
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailPromo}
              onChange={(e) => setEmailPromo(e.target.checked)}
              className="w-4 h-4 text-[#003366] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer">
            <div>
              <p className="text-xs font-bold text-[#172033]">Newsletter Artikel & Tren</p>
              <p className="text-[11px] text-[#64748B]">
                Rekomendasi gadget dan fashion terkini pilihan kurator
              </p>
            </div>
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="w-4 h-4 text-[#003366] rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
