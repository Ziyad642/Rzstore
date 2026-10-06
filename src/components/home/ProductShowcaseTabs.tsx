"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles, Award } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";

interface ProductShowcaseTabsProps {
  popularProducts: Product[];
  newestProducts: Product[];
  featuredProducts: Product[];
}

export default function ProductShowcaseTabs({
  popularProducts,
  newestProducts,
  featuredProducts,
}: ProductShowcaseTabsProps) {
  const [activeTab, setActiveTab] = useState<"popular" | "newest" | "featured">("popular");

  const tabs = [
    { id: "popular" as const, label: "Terlaris", icon: Flame },
    { id: "newest" as const, label: "Produk Baru", icon: Sparkles },
    { id: "featured" as const, label: "Pilihan Editor", icon: Award },
  ];

  const currentProducts =
    activeTab === "popular"
      ? popularProducts
      : activeTab === "newest"
      ? newestProducts
      : featuredProducts;

  return (
    <section className="my-12">
      {/* Header and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#172033] font-['Montserrat'] tracking-tight">
            Koleksi Unggulan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pilihan produk terbaik dengan ulasan tertinggi dan kualitas teruji
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#003366] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#003366] hover:bg-white/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#FFDB58]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {currentProducts.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <Link
          href={`/shop?sortBy=${activeTab === "popular" ? "popular" : activeTab === "newest" ? "newest" : "rating"}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-[#003366] text-[#003366] hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 group"
        >
          <span>Lihat Seluruh Koleksi {tabs.find((t) => t.id === activeTab)?.label}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
