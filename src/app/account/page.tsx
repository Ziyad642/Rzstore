"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  Heart,
  ArrowRight,
  ExternalLink,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { Order, User, Address } from "@/lib/types";

export default function AccountOverviewPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, ordersRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/orders"),
        ]);
        const meData = await meRes.json();
        const ordersData = await ordersRes.json();

        if (meData.authenticated) setUser(meData.user);
        if (ordersData.success) setOrders(ordersData.orders || []);
      } catch (err) {
        console.error("Gagal memuat overview akun:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingCount = orders.filter((o) => o.status === "PENDING_PAYMENT").length;
  const processingCount = orders.filter((o) => o.status === "PROCESSING" || o.status === "PAID" || o.status === "PACKED").length;
  const shippedCount = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#64748B]">
            Selamat Datang Kembali
          </span>
          <h1 className="text-2xl font-bold font-heading text-[#172033] mt-1">
            Halo, {user?.name || "Pelanggan RZ Store"}!
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Kelola pesanan, alamat pengiriman, dan nikmati promo terbaik setiap hari.
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition shadow self-start sm:self-auto"
        >
          Belanja Sekarang
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/account/orders?status=PENDING_PAYMENT"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold font-heading text-[#172033] block">
            {pendingCount}
          </span>
          <span className="text-xs text-[#64748B]">Menunggu Bayar</span>
        </Link>

        <Link
          href="/account/orders?status=PROCESSING"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold font-heading text-[#172033] block">
            {processingCount}
          </span>
          <span className="text-xs text-[#64748B]">Sedang Diproses</span>
        </Link>

        <Link
          href="/account/orders?status=SHIPPED"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold font-heading text-[#172033] block">
            {shippedCount}
          </span>
          <span className="text-xs text-[#64748B]">Dalam Pengiriman</span>
        </Link>

        <Link
          href="/account/orders?status=DELIVERED"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold font-heading text-[#172033] block">
            {deliveredCount}
          </span>
          <span className="text-xs text-[#64748B]">Pesanan Selesai</span>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h2 className="font-bold font-heading text-lg text-[#172033]">
            Pesanan Terakhir
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-bold text-[#003366] hover:underline flex items-center gap-1"
          >
            Lihat Semua Pesanan
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#172033]">Belum ada riwayat pesanan</p>
            <p className="text-xs text-[#64748B] mt-1 mb-4">
              Mulai checkout barang impianmu hari ini dan nikmati garansi resmi.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#003366] text-white text-xs font-bold rounded-lg hover:bg-[#002244]"
            >
              Mulai Berbelanja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs text-[#003366]">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-[#64748B]">
                      • {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <p className="text-xs text-[#172033] font-medium">
                    {order.items.map((i) => i.title).join(", ")}
                  </p>
                  <p className="text-xs font-bold text-[#003366] mt-1">
                    Rp {order.totalAmount.toLocaleString("id-ID")} ({order.courierName})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/order/${order.orderNumber}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-[#172033] text-xs font-bold rounded-lg hover:bg-slate-50 transition"
                  >
                    Detail
                  </Link>
                  <Link
                    href={`/track-order?q=${order.trackingNumber || order.orderNumber}`}
                    className="px-3 py-1.5 bg-[#003366] text-white text-xs font-bold rounded-lg hover:bg-[#002244] transition flex items-center gap-1"
                  >
                    Lacak
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Utilities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/wishlist"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172033]">Wishlist Saya</h3>
              <p className="text-xs text-[#64748B]">Lihat produk yang Anda simpan sebelumnya</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#64748B]" />
        </Link>

        <Link
          href="/track-order"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center group-hover:scale-110 transition">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172033]">Lacak Paket & Resi</h3>
              <p className="text-xs text-[#64748B]">Cek posisi kurir secara realtime</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#64748B]" />
        </Link>
      </div>
    </div>
  );
}
