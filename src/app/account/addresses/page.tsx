"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { Address } from "@/lib/types";

export default function CustomerAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    isDefault: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses");
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error("Gagal memuat alamat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setFormData({
      recipientName: "",
      phone: "",
      addressLine: "",
      city: "",
      province: "",
      postalCode: "",
      isDefault: addresses.length === 0,
    });
    setError("");
    setShowModal(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      recipientName: addr.recipientName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      province: addr.province,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.phone || !formData.addressLine || !formData.city) {
      setError("Semua kolom bertanda * wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const method = editingAddress ? "PUT" : "POST";
      const payload = editingAddress ? { id: editingAddress.id, ...formData } : formData;

      const res = await fetch("/api/addresses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setSuccessMessage(data.message);
        fetchAddresses();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.message || "Gagal menyimpan alamat.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus alamat ini?")) return;
    try {
      const res = await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchAddresses();
      }
    } catch (err) {
      console.error("Gagal menghapus alamat:", err);
    }
  };

  const handleSetDefault = async (addr: Address) => {
    try {
      const res = await fetch("/api/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: addr.id, isDefault: true }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAddresses();
      }
    } catch (err) {
      console.error("Gagal mengatur alamat default:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033]">
            Daftar Alamat Pengiriman
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Atur alamat pengiriman untuk mempercepat proses checkout pesananmu.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition shadow self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Alamat Baru
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-[#172033] text-base mb-1">Belum Ada Alamat Tersimpan</h3>
          <p className="text-xs text-[#64748B] mb-6">
            Tambahkan alamat rumah, kantor, atau tujuan pengiriman paket Anda.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Alamat
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border transition ${
                addr.isDefault ? "border-blue-300 bg-blue-50/10" : "border-slate-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#172033] text-sm sm:text-base">
                      {addr.recipientName}
                    </h3>
                    <span className="text-xs text-[#64748B]">({addr.phone})</span>
                    {addr.isDefault && (
                      <span className="px-2.5 py-0.5 bg-[#003366] text-white text-[10px] font-bold rounded-full">
                        Alamat Utama
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[#172033] leading-relaxed">
                    {addr.addressLine}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {addr.city}, {addr.province} {addr.postalCode}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="px-3 py-1.5 text-xs text-[#003366] hover:bg-blue-50 rounded-lg font-semibold transition"
                    >
                      Jadikan Utama
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="p-2 text-slate-500 hover:text-[#003366] hover:bg-slate-100 rounded-lg transition"
                    title="Ubah"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold font-heading text-[#172033] mb-4">
              {editingAddress ? "Ubah Alamat Pengiriman" : "Tambah Alamat Baru"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">
                    Nama Penerima *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#172033] block mb-1">
                  Alamat Lengkap (Jalan, RT/RW, No. Rumah) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 border rounded-xl focus:outline-none focus:border-[#003366]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">
                    Kota / Kab *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-[#003366] rounded"
                />
                <span className="text-xs text-[#172033] font-medium">
                  Jadikan sebagai alamat pengiriman utama
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#003366] text-white rounded-xl text-xs font-bold hover:bg-[#002244] disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan Alamat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
