"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Sparkles,
  Loader2,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/lib/types";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(q);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    setSearchInput(q);
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Gagal mencari produk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [q]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.soldCount - a.soldCount; // popular
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-[#64748B]">
          <Link href="/" className="hover:text-[#003366] transition">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-semibold text-[#172033]">Hasil Pencarian</span>
        </nav>

        {/* Search header & input */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari produk impianmu di RZ Store..."
              className="w-full pl-12 pr-28 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#003366] text-white text-xs font-bold rounded-lg hover:bg-[#002244] transition"
            >
              Cari
            </button>
          </form>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033]">
                {q ? (
                  <>
                    Hasil untuk: <span className="text-[#003366]">&ldquo;{q}&rdquo;</span>
                  </>
                ) : (
                  "Semua Hasil Pencarian"
                )}
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Menemukan {products.length} produk yang sesuai
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B] flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Urutkan:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-[#172033] focus:outline-none focus:border-[#003366]"
              >
                <option value="popular">Terpopuler</option>
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          /* Empty Search State */
          <div className="bg-white rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-5">
              <Search className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#172033] mb-2">
              Produk Tidak Ditemukan
            </h2>
            <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
              Kami tidak dapat menemukan produk yang sesuai dengan kata kunci &ldquo;{q}&rdquo;.
              Coba gunakan kata kunci lain atau pilih rekomendasi di bawah ini:
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["Headphone", "Jaket", "Air Fryer", "Sepatu", "Smartwatch", "Serum"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSearchInput(s);
                    router.push(`/search?q=${encodeURIComponent(s)}`);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-[#003366] text-xs font-medium rounded-lg text-[#172033] transition"
                >
                  {s}
                </button>
              ))}
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#003366] text-white font-bold rounded-xl hover:bg-[#002244] transition shadow text-sm"
            >
              Lihat Semua Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F5] py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
