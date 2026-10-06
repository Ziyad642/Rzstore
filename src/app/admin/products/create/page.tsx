"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Plus,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { Category } from "@/lib/types";

export default function AdminCreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    price: "",
    originalPrice: "",
    stock: "50",
    description: "",
    specifications: "",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    isFeatured: false,
    isFlashSale: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.categories) {
          setCategories(d.categories);
          if (d.categories.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: d.categories[0].id }));
          }
        }
      })
      .catch((e) => console.error("Error loading categories:", e))
      .finally(() => setLoadingCats(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.categoryId) {
      setError("Nama produk, kategori, dan harga wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title: formData.title,
        categoryId: formData.categoryId,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock || 0),
        description: formData.description,
        specifications: formData.specifications,
        isFeatured: formData.isFeatured,
        isFlashSale: formData.isFlashSale,
        images: [formData.imageUrl],
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/products");
      } else {
        setError(data.message || "Gagal membuat produk baru.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033]">
            Tambah Produk Baru
          </h1>
          <p className="text-xs text-[#64748B]">
            Masukkan data detail produk baru untuk katalog RZ Store
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Nama Produk *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Sony WH-1000XM5 Wireless Noise Cancelling Headphones"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003366]"
            />
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#172033] block mb-1">
                Kategori Produk *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003366]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172033] block mb-1">
                Jumlah Stok Awal *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003366]"
              />
            </div>
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#172033] block mb-1">
                Harga Jual (Rp) *
              </label>
              <input
                type="number"
                required
                min={1000}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Contoh: 1499000"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003366]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172033] block mb-1">
                Harga Sebelum Diskon (Opsional)
              </label>
              <input
                type="number"
                min={0}
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="Contoh: 1999000"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003366]"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              URL Foto Produk (Utama) *
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#003366]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Deskripsi Produk
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan fitur utama, bahan, kelebihan produk..."
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003366]"
            />
          </div>

          {/* Specifications */}
          <div>
            <label className="text-xs font-semibold text-[#172033] block mb-1">
              Spesifikasi Teknis
            </label>
            <textarea
              rows={3}
              value={formData.specifications}
              onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
              placeholder="Konektivitas: Bluetooth 5.2 | Berat: 250g | Daya Tahan Baterai: 30 Jam"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#003366]"
            />
          </div>

          {/* Featured & Flash Sale Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-[#003366] rounded"
              />
              <span className="text-xs font-semibold text-[#172033]">
                Tampilkan di Pilihan Editor (Featured)
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFlashSale}
                onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                className="w-4 h-4 text-[#003366] rounded"
              />
              <span className="text-xs font-semibold text-[#172033]">
                Ikutkan Flash Sale Homepage
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/admin/products"
              className="px-5 py-2.5 border rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-2.5 bg-[#003366] text-white rounded-xl text-xs font-bold hover:bg-[#002244] disabled:opacity-50 flex items-center gap-2 shadow"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Publikasikan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
