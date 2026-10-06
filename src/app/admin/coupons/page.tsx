"use client";

import React, { useState, useEffect } from "react";
import { TicketPercent, Plus, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { Coupon } from "@/lib/types";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENT",
    discountValue: "10",
    minPurchase: "100000",
    maxDiscount: "50000",
    quota: "100",
    daysValid: "30",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (err) {
      console.error("Gagal memuat voucher:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggle = async (c: Coupon) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, isActive: !c.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) =>
          prev.map((item) => (item.id === c.id ? { ...item, isActive: !item.isActive } : item))
        );
      }
    } catch {
      alert("Gagal memperbarui status voucher.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) {
      setError("Kode voucher dan nilai diskon wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setMessage("Voucher promo berhasil dibuat!");
        fetchCoupons();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message || "Gagal membuat voucher.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033]">
            Manajemen Voucher & Promo
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Buat kode diskon untuk meningkatkan konversi checkout pelanggan
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition shadow self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Buat Voucher Baru
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
          </div>
        ) : (
          coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-[#003366] bg-blue-50 px-2.5 py-1 rounded-lg">
                    {c.code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {c.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#172033] mt-2">
                  {c.discountType === "PERCENT"
                    ? `Diskon ${c.discountValue}% (Maks. Rp ${(c.maxDiscount || 0).toLocaleString("id-ID")})`
                    : `Potongan Langsung Rp ${c.discountValue.toLocaleString("id-ID")}`}
                </p>

                <p className="text-[11px] text-[#64748B] mt-1">
                  Min. Belanja: Rp {c.minPurchase.toLocaleString("id-ID")}
                </p>

                <p className="text-[11px] text-[#64748B]">
                  Kuota Terpakai: <span className="font-bold">{c.usedCount}</span> / {c.quota}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-[#64748B]">
                  Berlaku s/d {new Date(c.endDate).toLocaleDateString("id-ID")}
                </span>
                <button
                  onClick={() => handleToggle(c)}
                  className="text-xs text-[#003366] font-semibold hover:underline"
                >
                  {c.isActive ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold font-heading text-[#172033] mb-4">
              Buat Voucher Diskon Baru
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#172033] block mb-1">
                  Kode Kupon Voucher *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Contoh: FLASH50"
                  className="w-full text-xs uppercase px-3 py-2 border rounded-xl font-mono focus:outline-none focus:border-[#003366]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">
                    Tipe Diskon
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:border-[#003366]"
                  >
                    <option value="PERCENT">Persen (%)</option>
                    <option value="FIXED">Nominal Tetap (Rp)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">
                    Nilai Diskon *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">
                    Min. Belanja (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">
                    Maks. Diskon (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">
                    Kuota Penggunaan
                  </label>
                  <input
                    type="number"
                    value={formData.quota}
                    onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">
                    Masa Berlaku (Hari)
                  </label>
                  <input
                    type="number"
                    value={formData.daysValid}
                    onChange={(e) => setFormData({ ...formData, daysValid: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-[#64748B]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#003366] text-white rounded-xl text-xs font-bold hover:bg-[#002244] disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
