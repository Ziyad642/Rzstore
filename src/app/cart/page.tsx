"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Cart, CartItem } from "@/lib/types";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error("Gagal memuat keranjang:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    setUpdatingId(itemId);
    // Optimistic immediate UI update
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.id === itemId ? { ...i, quantity: newQty } : i
        ),
      };
    });

    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        fetchCart();
      }
    } catch (err) {
      console.error("Gagal mengupdate quantity:", err);
      fetchCart();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleSelect = async (itemId: string, currentSelected: boolean) => {
    setUpdatingId(itemId);
    // Optimistic immediate UI update
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.id === itemId ? { ...i, isSelected: !currentSelected } : i
        ),
      };
    });

    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSelected: !currentSelected }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      } else {
        fetchCart();
      }
    } catch (err) {
      console.error("Gagal mengubah seleksi:", err);
      fetchCart();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSelectAll = async (allSelected: boolean) => {
    try {
      const res = await fetch("/api/cart/select-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected: !allSelected }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error("Gagal mengubah semua seleksi:", err);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (err) {
      console.error("Gagal menghapus item:", err);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    setCouponError("");

    try {
      const selectedSubtotal = cart?.items
        .filter((i) => i.isSelected)
        .reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0;

      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal: selectedSubtotal,
        }),
      });

      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discountAmount: data.discountAmount,
          message: data.message,
        });
        setCouponError("");
      } else {
        setCouponError(data.message || "Kode voucher tidak valid.");
      }
    } catch (err) {
      setCouponError("Terjadi kesalahan saat memeriksa voucher.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-20 bg-white rounded-xl shadow-sm"></div>
                <div className="h-36 bg-white rounded-xl shadow-sm"></div>
                <div className="h-36 bg-white rounded-xl shadow-sm"></div>
              </div>
              <div className="h-72 bg-white rounded-xl shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const selectedItems = items.filter((i) => i.isSelected);
  const allSelected = items.length > 0 && items.every((i) => i.isSelected);

  const selectedSubtotal = selectedItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const estimatedShipping = selectedSubtotal >= 200000 || selectedItems.length === 0 ? 0 : 15000;
  const grandTotal = Math.max(0, selectedSubtotal - discountAmount + estimatedShipping);

  const freeShippingThreshold = 200000;
  const freeShippingProgress = Math.min(100, (selectedSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-[#64748B] mb-6">
          <Link href="/" className="hover:text-[#003366] transition">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-semibold text-[#172033]">Keranjang Belanja</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#172033] mb-8">
          Keranjang Belanja ({items.length} Barang)
        </h1>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-lg mx-auto">
            <div className="w-24 h-24 bg-blue-50 text-[#003366] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#172033] mb-2">
              Keranjang Belanjamu Masih Kosong
            </h2>
            <p className="text-[#64748B] text-sm mb-6">
              Yuk jelajahi ribuan produk pilihan dengan penawaran harga terbaik setiap hari!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#003366] text-white font-semibold rounded-xl hover:bg-[#002244] transition shadow-md hover:shadow-lg"
            >
              Mulai Belanja Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Items List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free Shipping Progress Card */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2 font-medium text-[#172033]">
                    <Truck className="w-4 h-4 text-[#003366]" />
                    {selectedSubtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-600 font-semibold">
                        Selamat! Kamu mendapatkan Gratis Ongkir!
                      </span>
                    ) : (
                      <span>
                        Belanja Rp {(freeShippingThreshold - selectedSubtotal).toLocaleString("id-ID")} lagi untuk Gratis Ongkir
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#003366]">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#003366] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Select All Bar */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => handleSelectAll(allSelected)}
                    className="w-5 h-5 rounded border-slate-300 text-[#003366] focus:ring-[#003366]"
                  />
                  <span className="text-sm font-semibold text-[#172033]">
                    Pilih Semua ({items.length} Produk)
                  </span>
                </label>
                <span className="text-xs text-[#64748B]">
                  {selectedItems.length} produk terpilih
                </span>
              </div>

              {/* Cart Items */}
              <div className="space-y-3">
                {items.map((item) => {
                  const img = item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
                  const isBusy = updatingId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100 transition ${
                        item.isSelected ? "border-blue-200" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <div className="pt-2">
                          <input
                            type="checkbox"
                            checked={item.isSelected}
                            onChange={() => handleToggleSelect(item.id, item.isSelected)}
                            disabled={isBusy}
                            className="w-5 h-5 rounded border-slate-300 text-[#003366] focus:ring-[#003366] cursor-pointer"
                          />
                        </div>

                        {/* Product Image */}
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100"
                        >
                          <Image
                            src={img}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="text-sm sm:text-base font-semibold text-[#172033] hover:text-[#003366] line-clamp-2 transition"
                          >
                            {item.product.title}
                          </Link>

                          {item.variant && (
                            <p className="text-xs text-[#64748B] mt-1 bg-slate-50 inline-block px-2 py-0.5 rounded border border-slate-100">
                              Varian: {item.variant.name}
                            </p>
                          )}

                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="font-bold text-[#003366] text-base sm:text-lg">
                              Rp {item.product.price.toLocaleString("id-ID")}
                            </span>
                            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                              <span className="text-xs text-slate-400 line-through">
                                Rp {item.product.originalPrice.toLocaleString("id-ID")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Item Bottom Bar: Actions & Counter */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-xs sm:text-sm text-rose-500 hover:text-rose-700 flex items-center gap-1.5 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Hapus</span>
                        </button>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#64748B] hidden sm:inline">Jumlah:</span>
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isBusy}
                              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition disabled:opacity-40"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center font-semibold text-sm text-[#172033]">
                              {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-[#003366]" /> : item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock || isBusy}
                              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition disabled:opacity-40"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="space-y-6">
              {/* Coupon Box */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-sm text-[#172033] flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-[#003366]" />
                  Gunakan Voucher Toko
                </h3>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: RZHEMAT50"
                    className="flex-1 text-sm uppercase px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#003366]"
                  />
                  <button
                    type="submit"
                    disabled={applyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-[#003366] text-white text-sm font-semibold rounded-lg hover:bg-[#002244] transition disabled:opacity-50 flex items-center justify-center"
                  >
                    {applyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pakai"}
                  </button>
                </form>

                {couponError && (
                  <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {couponError}
                  </p>
                )}

                {appliedCoupon && (
                  <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start justify-between">
                    <div className="text-xs text-emerald-800">
                      <p className="font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {appliedCoupon.code} Diterapkan
                      </p>
                      <p className="mt-0.5">{appliedCoupon.message}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Batal
                    </button>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-[#64748B]">Kode demo:</span>
                  <button
                    type="button"
                    onClick={() => setCouponCode("RZHEMAT50")}
                    className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-mono text-[#003366]"
                  >
                    RZHEMAT50
                  </button>
                  <button
                    type="button"
                    onClick={() => setCouponCode("GRATISONGKIR")}
                    className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-mono text-[#003366]"
                  >
                    GRATISONGKIR
                  </button>
                </div>
              </div>

              {/* Cost Summary Box */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-bold font-heading text-base text-[#172033] pb-3 border-b border-slate-100">
                  Ringkasan Belanja
                </h3>

                <div className="space-y-2.5 text-sm text-[#64748B]">
                  <div className="flex justify-between">
                    <span>Total Harga ({selectedItems.length} barang)</span>
                    <span className="text-[#172033] font-medium">
                      Rp {selectedSubtotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Diskon Voucher</span>
                      <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimasi Ongkir</span>
                    <span className="text-[#172033] font-medium">
                      {estimatedShipping === 0 ? (
                        <span className="text-emerald-600 font-semibold">GRATIS</span>
                      ) : (
                        `Rp ${estimatedShipping.toLocaleString("id-ID")}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-semibold text-[#172033] block">
                      Total Pembayaran
                    </span>
                    <span className="text-xs text-[#64748B]">Termasuk PPN & Biaya Layanan</span>
                  </div>
                  <span className="text-xl font-bold font-heading text-[#003366]">
                    Rp {grandTotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  disabled={selectedItems.length === 0}
                  className="w-full py-3.5 bg-[#003366] text-white font-bold rounded-xl hover:bg-[#002244] transition shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                >
                  Lanjut ke Checkout ({selectedItems.length})
                  <ArrowRight className="w-5 h-5" />
                </button>

                {selectedItems.length === 0 && (
                  <p className="text-xs text-center text-[#64748B]">
                    Pilih minimal 1 produk untuk melanjutkan checkout.
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs text-[#64748B]">
                <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#003366] flex-shrink-0" />
                  <span>Transaksi 100% Aman & Terpercaya</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#003366] flex-shrink-0" />
                  <span>Garansi Retur 7 Hari Produk Resmi</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
