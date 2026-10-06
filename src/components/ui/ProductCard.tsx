"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Heart, Check } from "lucide-react";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onAddedToCart?: () => void;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductCard({ product, onAddedToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);

    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;

    setIsAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          variantId: product.variants?.[0]?.id || null,
        }),
      });

      if (res.ok) {
        setIsAdded(true);
        window.dispatchEvent(new Event("cart-updated"));
        if (onAddedToCart) onAddedToCart();
        setTimeout(() => setIsAdded(false), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
      {/* Badge Top Left */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {product.discountPercent && product.discountPercent > 0 ? (
          <span className="bg-[#FFDB58] text-[#172033] text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
            {product.discountPercent}% OFF
          </span>
        ) : null}
        {product.isFlashSale && (
          <span className="bg-red-600 text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase shadow-sm">
            Flash Sale
          </span>
        )}
      </div>

      {/* Wishlist Button Top Right */}
      <button
        onClick={toggleWishlist}
        aria-label="Tambah ke wishlist"
        className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-500 hover:text-red-500 hover:bg-white shadow-sm transition-all duration-200 active:scale-90"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isWishlisted ? "fill-red-500 text-red-500" : ""
          }`}
        />
      </button>

      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative w-full pt-[90%] bg-slate-50 overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </Link>

      {/* Product Content */}
      <div className="p-3.5 flex flex-col flex-grow justify-between">
        <div>
          {/* Category / Brand */}
          <div className="text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
            <span>{product.brand?.name || product.category?.name || "RZ Store"}</span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-[#172033] line-clamp-2 hover:text-[#003366] transition-colors leading-snug mb-2 font-['Montserrat']">
              {product.title}
            </h3>
          </Link>
        </div>

        <div>
          {/* Price */}
          <div className="mb-2">
            <div className="text-base font-bold text-[#003366]">
              {formatRupiah(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="line-through">{formatRupiah(product.originalPrice)}</span>
              </div>
            )}
          </div>

          {/* Rating & Sold */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
            <span>Terjual {product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}rb+` : product.soldCount}</span>
          </div>

          {/* Quick Add To Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : isAdding
                ? "bg-[#002244] text-white opacity-90 cursor-wait"
                : "bg-[#003366] text-white hover:bg-[#002244]"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Berhasil Ditambah!</span>
              </>
            ) : isAdding ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menambahkan...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>+ Keranjang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
