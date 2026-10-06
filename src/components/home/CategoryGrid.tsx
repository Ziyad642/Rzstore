"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Shirt,
  Smartphone,
  Home,
  Sparkles,
  Activity,
  Baby,
  Laptop,
  Coffee,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { Category } from "@/lib/types";

interface CategoryGridProps {
  categories: Category[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Shirt,
  Smartphone,
  Home,
  Sparkles,
  Activity,
  Baby,
  Laptop,
  Coffee,
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#172033] font-['Montserrat'] tracking-tight">
            Kategori Pilihan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Jelajahi produk berkualitas tinggi berdasarkan kategori favoritmu
          </p>
        </div>
        <Link
          href="/shop"
          className="text-xs sm:text-sm font-bold text-[#003366] hover:text-[#002244] flex items-center gap-1 group"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const IconComp = (cat.icon && ICON_MAP[cat.icon]) || Sparkles;

          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-[#003366]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden mb-2.5 bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <IconComp className="w-7 h-7 text-[#003366]" />
                )}
                <div className="absolute inset-0 bg-[#003366]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <span className="text-xs font-bold text-[#172033] group-hover:text-[#003366] transition-colors leading-tight font-['Montserrat'] line-clamp-2">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
