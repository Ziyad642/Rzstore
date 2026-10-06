"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    icon: "Folder",
    isFeatured: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCats = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({
      name: "",
      description: "",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600",
      icon: "Folder",
      isFeatured: false,
    });
    setError("");
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      description: cat.description || "",
      image: cat.image || "",
      icon: cat.icon || "Folder",
      isFeatured: cat.isFeatured,
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Nama kategori wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const method = editingCat ? "PUT" : "POST";
      const payload = editingCat ? { id: editingCat.id, ...formData } : formData;

      const res = await fetch("/api/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setMessage(data.message);
        fetchCats();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message || "Gagal menyimpan kategori.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage(`Kategori "${name}" berhasil dihapus.`);
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      alert("Gagal menghapus kategori.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033]">
            Kategori Produk
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Kelola kategori belanja utama di website RZ Store
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition shadow self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition"
            >
              <div className="relative w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                <Image
                  src={
                    cat.image ||
                    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600"
                  }
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#172033] truncate">{cat.name}</h3>
                  {cat.isFeatured && (
                    <span className="px-2 py-0.5 bg-yellow-50 text-amber-800 border border-yellow-200 text-[10px] font-bold rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] line-clamp-1 mt-1">
                  {cat.description || "Kategori belanja RZ Store"}
                </p>
                <span className="text-[10px] font-mono text-[#003366] bg-blue-50 px-2 py-0.5 rounded mt-2 inline-block">
                  /{cat.slug}
                </span>

                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1 text-slate-500 hover:text-[#003366] rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
              {editingCat ? "Ubah Kategori" : "Tambah Kategori Baru"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#172033] block mb-1">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Fashion & Pakaian"
                  className="w-full text-xs px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-[#003366]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#172033] block mb-1">
                  Deskripsi Kategori
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Penjelasan produk dalam kategori ini"
                  className="w-full text-xs px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-[#003366]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#172033] block mb-1">
                  URL Gambar Kategori
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-[#003366]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-[#003366] rounded"
                />
                <span className="text-xs text-[#172033] font-semibold">
                  Tampilkan di grid kategori utama homepage
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-4">
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
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
