"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ArrowRight, Flame } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";

interface FlashSaleSectionProps {
  products: Product[];
}

export default function FlashSaleSection({ products }: FlashSaleSectionProps) {
  // 12 hours countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  if (!products || products.length === 0) return null;

  return (
    <section className="my-12 p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-[#003366] text-white shadow-xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#FFDB58]/20 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white text-red-600 shadow-md">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-red-600 animate-bounce" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-['Montserrat'] tracking-tight flex items-center gap-2">
                FLASH SALE
                <Flame className="w-5 h-5 fill-[#FFDB58] text-[#FFDB58]" />
              </h2>
              <p className="text-xs text-white/80">Diskon kilat dengan kuota terbatas!</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <span className="text-xs text-white/90 mr-1 uppercase tracking-wider font-semibold">
              Berakhir Dalam:
            </span>
            <div className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-sm font-black text-[#FFDB58]">
              {formatNumber(timeLeft.hours)}
            </div>
            <span className="text-white font-bold">:</span>
            <div className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-sm font-black text-[#FFDB58]">
              {formatNumber(timeLeft.minutes)}
            </div>
            <span className="text-white font-bold">:</span>
            <div className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-sm font-black text-[#FFDB58]">
              {formatNumber(timeLeft.seconds)}
            </div>
          </div>
        </div>

        <Link
          href="/shop?flashSale=true"
          className="text-xs sm:text-sm font-bold text-[#FFDB58] hover:text-white flex items-center gap-1 self-start md:self-auto group"
        >
          <span>Lihat Semua Flash Sale</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Product Cards Grid with Progress Bars */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.slice(0, 4).map((product, idx) => {
          const soldPercentage = [82, 65, 91, 74][idx % 4];

          return (
            <div key={product.id} className="flex flex-col">
              <ProductCard product={product} />

              {/* Progress Bar under card */}
              <div className="mt-2 bg-black/20 backdrop-blur-sm p-2 rounded-xl">
                <div className="flex items-center justify-between text-[10px] text-white/90 font-semibold mb-1">
                  <span>Terjual {soldPercentage}%</span>
                  <span className="text-[#FFDB58] font-bold">Segera Habis!</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FFDB58] to-amber-400 transition-all duration-500"
                    style={{ width: `${soldPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
