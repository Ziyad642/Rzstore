"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { Product, Category, Brand } from "@/lib/types";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialFlashSale = searchParams.get("flashSale") === "true";
  const initialFeatured = searchParams.get("isFeatured") === "true";
  const initialSort = (searchParams.get("sortBy") as "popular" | "newest" | "price-asc" | "price-desc" | "rating") || "popular";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyDiscount, setOnlyDiscount] = useState<boolean>(initialFlashSale);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price-asc" | "price-desc" | "rating">(initialSort);

  // Mobile Filter Drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch("/api/search");
        const data = await res.json();
        if (data.products) setProducts(data.products);

        const catRes = await fetch("/api/admin/categories");
        const catData = await catRes.json();
        if (catData.categories) setCategories(catData.categories);

        // Extract unique brands
        const brRes = await fetch("/api/admin/categories"); // or from products
        if (data.products) {
          const uniqueBrands: Brand[] = [];
          data.products.forEach((p: Product) => {
            if (p.brand && !uniqueBrands.some((b) => b.id === p.brand?.id)) {
              uniqueBrands.push(p.brand);
            }
          });
          setBrands(uniqueBrands);
        }
      } catch (err) {
        console.error("Shop page load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update selectedCategory if URL changes
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory) {
      list = list.filter((p) => p.category?.slug === selectedCategory);
    }

    if (selectedBrand) {
      list = list.filter((p) => p.brand?.slug === selectedBrand);
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      list = list.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      list = list.filter((p) => p.price <= Number(maxPrice));
    }

    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }

    if (onlyDiscount) {
      list = list.filter((p) => (p.discountPercent || 0) > 0 || p.isFlashSale);
    }

    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    if (initialFeatured) {
      list = list.filter((p) => p.isFeatured);
    }

    switch (sortBy) {
      case "popular":
        list.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
    }

    return list;
  }, [
    products,
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    minRating,
    onlyDiscount,
    inStockOnly,
    initialFeatured,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setOnlyDiscount(false);
    setInStockOnly(false);
    setSortBy("popular");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6 pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172033] font-['Montserrat'] tracking-tight">
            Katalog Produk RZ Store
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Menampilkan <span className="font-bold text-[#003366]">{filteredProducts.length}</span> produk original siap kirim
          </p>
        </div>

        {/* Mobile filter button & Desktop Sorting */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003366] text-white text-xs font-bold shadow-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "popular" | "newest" | "price-asc" | "price-desc" | "rating")}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold outline-none focus:border-[#003366]"
            >
              <option value="popular">Paling Populer</option>
              <option value="newest">Produk Terbaru</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="rating">Rating Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-[#003366] font-['Montserrat']">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter Produk</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Kategori
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-[#003366]">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === ""}
                  onChange={() => setSelectedCategory("")}
                  className="accent-[#003366]"
                />
                <span>Semua Kategori</span>
              </label>
              {categories.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-[#003366]"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === c.slug}
                    onChange={() => setSelectedCategory(c.slug)}
                    className="accent-[#003366]"
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rentang Harga */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Rentang Harga (Rp)
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#003366]"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#003366]"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Rating
            </h4>
            <div className="space-y-1.5 text-xs">
              {[4, 3].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === r}
                    onChange={() => setMinRating(minRating === r ? 0 : r)}
                    className="accent-[#003366]"
                  />
                  <span>★ {r} Bintang ke atas</span>
                </label>
              ))}
            </div>
          </div>

          {/* Promo & Stok */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyDiscount}
                onChange={(e) => setOnlyDiscount(e.target.checked)}
                className="accent-[#003366] rounded"
              />
              <span className="font-semibold text-rose-600">Sedang Diskon / Promo</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#003366] rounded"
              />
              <span>Stok Tersedia</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Content */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white p-4 rounded-xl border border-slate-200">
                  <div className="pt-[100%] bg-slate-200 rounded-lg mb-3" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#172033] font-['Montserrat'] mb-1">
                Tidak ada produk yang cocok dengan filter
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                Coba sesuaikan filter kategori, rentang harga, atau reset filter untuk melihat seluruh katalog produk kami.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-sm text-[#003366]">Filter Produk</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Kategori</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="radio"
                      name="m-cat"
                      checked={selectedCategory === ""}
                      onChange={() => setSelectedCategory("")}
                    />
                    Semua Kategori
                  </label>
                  {categories.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        name="m-cat"
                        checked={selectedCategory === c.slug}
                        onChange={() => setSelectedCategory(c.slug)}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Harga</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 p-2 border rounded text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 p-2 border rounded text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-white bg-[#003366] rounded-lg"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Memuat katalog produk...</div>}>
      <ShopContent />
    </Suspense>
  );
}
