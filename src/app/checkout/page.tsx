"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Truck,
  CreditCard,
  Tag,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Edit3,
  Clock,
  QrCode,
  Building2,
  Wallet,
  HandCoins,
} from "lucide-react";
import { Cart, Address, CourierOption } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();

  // Cart & items
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  // Address
  const [address, setAddress] = useState<Address>({
    id: "addr_001",
    userId: "usr_cust_001",
    recipientName: "Budi Santoso",
    phone: "081388887777",
    addressLine: "Jl. Sudirman No. 45 Kav 2, Kel. Senayan, Kec. Kebayoran Baru",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postalCode: "12190",
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Couriers
  const [availableCouriers, setAvailableCouriers] = useState<CourierOption[]>([]);
  const [loadingCouriers, setLoadingCouriers] = useState(true);
  const [selectedCourier, setSelectedCourier] = useState<CourierOption | null>(null);

  // Payment
  const [selectedPayment, setSelectedPayment] = useState("qris");

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Notes
  const [notes, setNotes] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        if (data.success) {
          setCart(data.cart);
        }

        // Fetch shipping options
        const shipRes = await fetch("/api/shipping/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destinationCity: address.city, weightGrams: 1000 }),
        });
        const shipData = await shipRes.json();
        if (shipData.success && shipData.rates.length > 0) {
          setAvailableCouriers(shipData.rates);
          setSelectedCourier(shipData.rates[0]); // default to first option
        }
      } catch (err) {
        console.error("Gagal memuat checkout:", err);
      } finally {
        setLoading(false);
        setLoadingCouriers(false);
      }
    };
    init();
  }, [address.city]);

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
    } catch {
      setCouponError("Terjadi kesalahan saat memeriksa voucher.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedCourier) {
      setOrderError("Silakan pilih kurir pengiriman.");
      return;
    }

    setSubmittingOrder(true);
    setOrderError("");

    try {
      const payload = {
        shippingAddress: address,
        courierName: selectedCourier.courier,
        courierService: selectedCourier.service,
        shippingCost: selectedCourier.price,
        paymentMethod: selectedPayment,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        notes: notes.trim() || undefined,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        window.dispatchEvent(new Event("cart-updated"));
        router.push(`/order/${data.order.orderNumber}`);
      } else {
        setOrderError(data.message || "Gagal membuat pesanan.");
      }
    } catch {
      setOrderError("Terjadi kesalahan jaringan saat membuat pesanan.");
    } finally {
      setSubmittingOrder(false);
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
                <div className="h-44 bg-white rounded-xl"></div>
                <div className="h-44 bg-white rounded-xl"></div>
              </div>
              <div className="h-96 bg-white rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedItems = (cart?.items || []).filter((i) => i.isSelected);

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-16 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading text-[#172033] mb-2">
            Belum Ada Produk Dipilih
          </h2>
          <p className="text-sm text-[#64748B] mb-6">
            Pilih produk yang ingin kamu beli di halaman keranjang belanja terlebih dahulu.
          </p>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#003366] text-white font-semibold rounded-xl hover:bg-[#002244] transition"
          >
            Kembali ke Keranjang
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = selectedItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingCost = selectedCourier ? selectedCourier.price : 0;
  const grandTotal = Math.max(0, subtotal + shippingCost - discountAmount);

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-[#64748B] mb-6">
          <Link href="/cart" className="hover:text-[#003366] transition">
            Keranjang Belanja
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-semibold text-[#172033]">Checkout Pesanan</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#172033] mb-8">
          Checkout Pembelian
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form & Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Alamat Pengiriman */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#172033] text-base">Alamat Pengiriman</h2>
                    <p className="text-xs text-[#64748B]">Tujuan pengantaran paket pesananmu</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs font-semibold text-[#003366] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isEditingAddress ? "Simpan Alamat" : "Ubah Alamat"}
                </button>
              </div>

              {isEditingAddress ? (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#64748B] block mb-1">Nama Penerima</label>
                      <input
                        type="text"
                        value={address.recipientName}
                        onChange={(e) => setAddress({ ...address, recipientName: e.target.value })}
                        className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:border-[#003366]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#64748B] block mb-1">Nomor Telepon</label>
                      <input
                        type="text"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:border-[#003366]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Alamat Lengkap (Jalan, RT/RW, No)</label>
                    <textarea
                      rows={2}
                      value={address.addressLine}
                      onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                      className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:border-[#003366]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-[#64748B] block mb-1">Kota / Kabupaten</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:border-[#003366]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#64748B] block mb-1">Provinsi</label>
                      <input
                        type="text"
                        value={address.province}
                        onChange={(e) => setAddress({ ...address, province: e.target.value })}
                        className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:border-[#003366]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#64748B] block mb-1">Kode Pos</label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:border-[#003366]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#172033]">{address.recipientName}</span>
                    <span className="text-[#64748B]">({address.phone})</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-[#003366] text-[11px] font-semibold rounded">
                      Utama
                    </span>
                  </div>
                  <p className="text-[#64748B] leading-relaxed">
                    {address.addressLine}, {address.city}, {address.province} {address.postalCode}
                  </p>
                </div>
              )}
            </div>

            {/* 2. Ringkasan Produk Terpilih */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-bold text-[#172033] text-base pb-3 border-b border-slate-100 mb-4">
                Produk yang Dipesan ({selectedItems.length} Barang)
              </h2>

              <div className="divide-y divide-slate-100">
                {selectedItems.map((item) => {
                  const img = item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
                  return (
                    <div key={item.id} className="py-3.5 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                        <Image src={img} alt={item.product.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#172033] line-clamp-1">
                          {item.product.title}
                        </p>
                        {item.variant && (
                          <span className="text-xs text-[#64748B]">
                            Varian: {item.variant.name}
                          </span>
                        )}
                        <p className="text-xs text-[#64748B] mt-0.5">
                          {item.quantity} x Rp {item.product.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="text-right font-bold text-sm text-[#003366]">
                        Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Catatan Pembeli */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <label className="text-xs text-[#64748B] block mb-1">
                  Catatan untuk Penjual / Kurir (Opsional):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Titip di satpam / mohon bungkus bubble wrap tebal"
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#003366]"
                />
              </div>
            </div>

            {/* 3. Pilihan Jasa Ekspedisi / Kurir */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-[#172033] text-base">Pilihan Pengiriman</h2>
                  <p className="text-xs text-[#64748B]">Tarif otomatis terintegrasi API Ekspedisi</p>
                </div>
              </div>

              {loadingCouriers ? (
                <div className="flex items-center justify-center py-8 text-[#64748B] text-sm">
                  <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#003366]" />
                  Menghitung tarif ekspedisi terpercaya...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableCouriers.map((courier) => {
                    const isSelected =
                      selectedCourier?.courier === courier.courier &&
                      selectedCourier?.service === courier.service;

                    return (
                      <div
                        key={`${courier.courier}-${courier.service}`}
                        onClick={() => setSelectedCourier(courier)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? "border-[#003366] bg-blue-50/30 ring-1 ring-[#003366]"
                            : "border-slate-100 hover:border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-sm text-[#172033] block">
                              {courier.courier}
                            </span>
                            <span className="text-xs text-[#64748B] font-medium">
                              Layanan {courier.service}
                            </span>
                          </div>
                          <span className="font-bold text-sm text-[#003366]">
                            Rp {courier.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-3">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Estimasi tiba {courier.etd}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Metode Pembayaran */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-[#172033] text-base">Metode Pembayaran</h2>
                  <p className="text-xs text-[#64748B]">Pilih kanal transaksi aman & terverifikasi otomatis</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* QRIS */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition ${
                    selectedPayment === "qris"
                      ? "border-[#003366] bg-blue-50/20"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="qris"
                      checked={selectedPayment === "qris"}
                      onChange={() => setSelectedPayment("qris")}
                      className="w-4 h-4 text-[#003366]"
                    />
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#172033] block">
                        QRIS (Instan & Bebas Biaya)
                      </span>
                      <span className="text-xs text-[#64748B]">
                        Scan via BCA Mobile, Livin, GoPay, OVO, ShopeePay, DANA
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-[#FFDB58] text-[#172033] text-[10px] font-bold rounded">
                    TERCEPAT
                  </span>
                </label>

                {/* Virtual Account BCA */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition ${
                    selectedPayment === "bca_va"
                      ? "border-[#003366] bg-blue-50/20"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="bca_va"
                      checked={selectedPayment === "bca_va"}
                      onChange={() => setSelectedPayment("bca_va")}
                      className="w-4 h-4 text-[#003366]"
                    />
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#003366] flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#172033] block">
                        BCA Virtual Account
                      </span>
                      <span className="text-xs text-[#64748B]">Verifikasi otomatis 24 Jam</span>
                    </div>
                  </div>
                </label>

                {/* Virtual Account Mandiri */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition ${
                    selectedPayment === "mandiri_va"
                      ? "border-[#003366] bg-blue-50/20"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="mandiri_va"
                      checked={selectedPayment === "mandiri_va"}
                      onChange={() => setSelectedPayment("mandiri_va")}
                      className="w-4 h-4 text-[#003366]"
                    />
                    <div className="w-9 h-9 rounded-lg bg-yellow-50 text-amber-700 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#172033] block">
                        Mandiri Virtual Account
                      </span>
                      <span className="text-xs text-[#64748B]">Verifikasi otomatis tanpa bukti transfer</span>
                    </div>
                  </div>
                </label>

                {/* E-Wallet */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition ${
                    selectedPayment === "ewallet"
                      ? "border-[#003366] bg-blue-50/20"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="ewallet"
                      checked={selectedPayment === "ewallet"}
                      onChange={() => setSelectedPayment("ewallet")}
                      className="w-4 h-4 text-[#003366]"
                    />
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#172033] block">
                        E-Wallet (GoPay / OVO / DANA)
                      </span>
                      <span className="text-xs text-[#64748B]">Buka aplikasi e-wallet favoritmu</span>
                    </div>
                  </div>
                </label>

                {/* COD (Bayar di Tempat) */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition ${
                    selectedPayment === "cod"
                      ? "border-[#003366] bg-blue-50/20"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={selectedPayment === "cod"}
                      onChange={() => setSelectedPayment("cod")}
                      className="w-4 h-4 text-[#003366]"
                    />
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <HandCoins className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#172033] block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-xs text-[#64748B]">Bayar tunai ke kurir saat barang sampai</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Action */}
          <div className="space-y-6">
            {/* Voucher Box */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-sm text-[#172033] flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-[#003366]" />
                Voucher Potongan Belanja
              </h3>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Kode voucher"
                  className="flex-1 text-sm uppercase px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#003366]"
                />
                <button
                  type="submit"
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="px-4 py-2 bg-[#003366] text-white text-sm font-semibold rounded-lg hover:bg-[#002244] transition disabled:opacity-50"
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
                      {appliedCoupon.code} Terpasang
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
            </div>

            {/* Bill Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold font-heading text-lg text-[#172033] pb-3 border-b border-slate-100">
                Ringkasan Pembayaran
              </h3>

              <div className="space-y-3 text-sm text-[#64748B]">
                <div className="flex justify-between">
                  <span>Subtotal Produk</span>
                  <span className="text-[#172033] font-medium">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Biaya Ongkos Kirim</span>
                  <span className="text-[#172033] font-medium">
                    {shippingCost === 0 ? "GRATIS" : `Rp ${shippingCost.toLocaleString("id-ID")}`}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Diskon Voucher</span>
                    <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-slate-400">
                  <span>Biaya Layanan & Penanganan</span>
                  <span className="text-emerald-600 font-medium">Rp 0 (Promo)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-semibold text-[#172033] block">
                    Total Tagihan
                  </span>
                  <span className="text-xs text-[#64748B]">Termasuk semua pajak</span>
                </div>
                <span className="text-2xl font-bold font-heading text-[#003366]">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>

              {orderError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {orderError}
                </div>
              )}

              <button
                onClick={handleCreateOrder}
                disabled={submittingOrder || !selectedCourier}
                className="w-full py-4 bg-[#003366] text-white font-bold rounded-xl hover:bg-[#002244] transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
              >
                {submittingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses Pesanan...
                  </>
                ) : (
                  <>
                    Bayar Sekarang
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#64748B]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Transaksi dienkripsi dengan standar keamanan tinggi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
