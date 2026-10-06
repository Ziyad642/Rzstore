"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Banner } from "@/lib/types";

interface HeroCarouselProps {
  banners: Banner[];
}

export default function HeroCarousel({ banners }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const total = banners.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isHovered || total <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide, total]);

  if (!banners || banners.length === 0) return null;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-slate-900 shadow-lg group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-[280px] sm:h-[380px] md:h-[440px] lg:h-[480px]">
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              priority={idx === 0}
              className="object-cover object-center brightness-[0.70]"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#002244]/90 via-[#003366]/60 to-transparent" />

            {/* Text & Action */}
            <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl text-white">
              {banner.badgeText && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDB58] text-[#172033] font-extrabold text-xs tracking-wider uppercase mb-3 w-fit shadow-md">
                  <span>{banner.badgeText}</span>
                </div>
              )}

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-['Montserrat'] tracking-tight leading-tight mb-3 drop-shadow-sm">
                {banner.title}
              </h2>

              {banner.subtitle && (
                <p className="text-xs sm:text-base text-slate-200 leading-relaxed mb-6 max-w-xl font-normal drop-shadow">
                  {banner.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Link
                  href={banner.link || "/shop"}
                  className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-[#FFDB58] hover:bg-[#e6c547] text-[#172033] font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                >
                  <span>{banner.ctaText || "Jelajahi Sekarang"}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
                <Link
                  href="/shop?sortBy=popular"
                  className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs sm:text-sm transition-all duration-200"
                >
                  Produk Terlaris
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Slide Buttons */}
      <button
        onClick={prevSlide}
        aria-label="Slide sebelumnya"
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-[#003366] text-white backdrop-blur-md sm:opacity-0 sm:group-hover:opacity-100 opacity-90 transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide berikutnya"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-[#003366] text-white backdrop-blur-md sm:opacity-0 sm:group-hover:opacity-100 opacity-90 transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Ke slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? "w-8 h-2.5 bg-[#FFDB58]"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
