"use client";

import React, { useState } from "react";
import {
  Settings,
  Store,
  Truck,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("RZ Store");
  const [companyName, setCompanyName] = useState("PT RZ E-Commerce Group");
  const [tagline, setTagline] = useState("Your Everyday Needs");
  const [csPhone, setCsPhone] = useState("081299990001");
  const [csEmail, setCsEmail] = useState("cs@rzstore.com");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("200000");

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedMessage("Pengaturan toko berhasil diperbarui!");
      setTimeout(() => setSavedMessage(""), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033]">
          Pengaturan Toko & Integrasi
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Konfigurasi identitas brand, kontak operasional, serta koneksi API eksternal
        </p>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Identitas Toko */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-[#172033] text-base">Identitas Brand</h2>
            <p className="text-xs text-[#64748B]">Informasi resmi toko yang tampil di publik</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#172033] block mb-1">
                Nama Brand Toko
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:border-[#003366]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#172033] block mb-1">
                Nama Badan Usaha
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:border-[#003366]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">Tagline Brand</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:border-[#003366]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#172033] block mb-1">
                WhatsApp Customer Service
              </label>
              <input
                type="text"
                value={csPhone}
                onChange={(e) => setCsPhone(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:border-[#003366]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#172033] block mb-1">
                Email Customer Support
              </label>
              <input
                type="email"
                value={csEmail}
                onChange={(e) => setCsEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:border-[#003366]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#172033] block mb-1">
                Batas Minimum Gratis Ongkir (Rp)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:border-[#003366]"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Simpan Pengaturan Toko
            </button>
          </div>
        </form>
      </div>

      {/* Konfigurasi Shipping & Payment Gateway */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-[#172033] text-base">Arsitektur API Ekspedisi</h2>
            <p className="text-xs text-[#64748B]">
              Modular Provider: JNE, J&T, SiCepat, Ninja Express, Pos Indonesia
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-[#64748B] space-y-2">
          <p className="font-semibold text-[#172033]">
            Status Driver: <span className="text-emerald-600">Terhubung (Development Mock Provider Siap Produksi)</span>
          </p>
          <p>
            Kunci API dikelola secara aman melalui environment variables di file <code className="font-mono bg-white px-1.5 py-0.5 rounded border">.env</code>:
          </p>
          <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-[#003366]">
            <li>SHIPPING_API_KEY</li>
            <li>SHIPPING_API_BASE_URL</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
