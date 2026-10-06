"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { Product, Category } from "@/lib/types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch(`/api/search?category=${slug}`),
        ]);
        const catsData = await catsRes.json();
        const prodsData = await prodsRes.json();

        if (catsData.categories) {
          const found = catsData.categories.find(
            (c: Category) => c.slug.toLowerCase() === slug.toLowerCase()
          );
          if (found) setCategory(found);
          else {
            setCategory({
              id: slug,
              name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
              slug,
              description: `Koleksi produk pilihan dalam kategori ${slug}`,
              isFeatured: true,
              createdAt: "",
              updatedAt: "",
            });
          }
        }

        if (prodsData.products) {
          setProducts(prodsData.products);
        }
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-[#003366]">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/shop" className="hover:text-[#003366]">Kategori</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#003366] font-bold">{category?.name || slug}</span>
      </nav>

      {/* Category Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#002244] to-[#003366] text-white mb-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FFDB58] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Kategori Pilihan RZ Store
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-['Montserrat'] tracking-tight mb-2">
            {category?.name || slug}
          </h1>
          {category?.description && (
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#172033] font-['Montserrat']">
          Daftar Produk ({products.length})
        </h2>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-sm text-slate-500 mb-4">
            Belum ada produk aktif di kategori ini.
          </p>
          <Link
            href="/shop"
            className="px-5 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold"
          >
            Kembali ke Katalog
          </Link>
        </div>
      )}
    </div>
  );
}
