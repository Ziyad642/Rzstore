"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ChevronRight,
  Star,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { WishlistItem } from "@/lib/types";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (data.success && data.wishlist) {
        setItems(data.wishlist.items);
      }
    } catch (err) {
      console.error("Gagal memuat wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
        window.dispatchEvent(new Event("wishlist-updated"));
      }
    } catch (err) {
      console.error("Gagal menghapus dari wishlist:", err);
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    setAddingToCart(item.productId);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.productId, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event("cart-updated"));
        setToastMessage(`"${item.product.title}" berhasil dipindahkan ke keranjang!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error("Gagal menambahkan ke keranjang:", err);
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-[#64748B] mb-6">
          <Link href="/" className="hover:text-[#003366] transition">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-semibold text-[#172033]">Wishlist Saya</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#172033]">
              Wishlist Saya
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              Simpan produk impianmu dan checkout kapan saja saat kamu siap.
            </p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-[#003366] text-xs font-bold rounded-full">
            {items.length} Produk Tersimpan
          </span>
        </div>

        {/* Toast feedback */}
        {toastMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-white rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#172033] mb-2">
              Wishlist Masih Kosong
            </h2>
            <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
              Belum ada produk favorit yang kamu simpan. Tekan ikon hati di produk yang kamu sukai saat menjelajah katalog RZ Store.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#003366] text-white font-bold rounded-xl hover:bg-[#002244] transition shadow"
            >
              Jelajahi Produk
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => {
              const img =
                item.product.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
              const isBusy = addingToCart === item.productId;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div className="relative">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="block relative aspect-square bg-slate-50 overflow-hidden"
                    >
                      <Image
                        src={img}
                        alt={item.product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </Link>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow hover:bg-rose-50 hover:text-rose-600 text-slate-400 flex items-center justify-center transition"
                      title="Hapus dari wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-[#64748B] mb-1">
                        <Star className="w-3.5 h-3.5 text-[#FFDB58] fill-[#FFDB58]" />
                        <span className="font-bold text-[#172033]">{item.product.rating}</span>
                        <span>({item.product.soldCount} terjual)</span>
                      </div>

                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-semibold text-sm text-[#172033] hover:text-[#003366] line-clamp-2 transition mb-2"
                      >
                        {item.product.title}
                      </Link>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-2">
                      <div className="font-bold text-base text-[#003366] mb-3">
                        Rp {item.product.price.toLocaleString("id-ID")}
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={isBusy}
                        className="w-full py-2.5 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition flex items-center justify-center gap-2 shadow disabled:opacity-50"
                      >
                        {isBusy ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            + Keranjang
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
