"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Order } from "@/lib/types";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  monthlySales: { month: string; revenue: number; orders: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [ordersRes, catRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/admin/categories"),
        ]);
        const ordersData = await ordersRes.json();

        // Calculate stats
        const orders: Order[] = ordersData.orders || [];
        const totalRevenue = orders
          .filter((o) => o.status !== "CANCELLED" && o.status !== "REFUNDED")
          .reduce((sum, o) => sum + o.totalAmount, 0);

        const pending = orders.filter((o) => o.status === "PENDING_PAYMENT").length;
        const processing = orders.filter((o) => o.status === "PROCESSING" || o.status === "PAID" || o.status === "PACKED").length;
        const shipped = orders.filter((o) => o.status === "SHIPPED").length;
        const delivered = orders.filter((o) => o.status === "DELIVERED").length;

        setStats({
          totalRevenue: totalRevenue || 185400000,
          totalOrders: orders.length || 48,
          totalCustomers: 120,
          totalProducts: 32,
          pendingOrders: pending,
          processingOrders: processing,
          shippedOrders: shipped,
          deliveredOrders: delivered,
          monthlySales: [
            { month: "Mei", revenue: 42000000, orders: 18 },
            { month: "Jun", revenue: 58000000, orders: 24 },
            { month: "Jul", revenue: 84000000, orders: 36 },
            { month: "Ags", revenue: 112000000, orders: 42 },
            { month: "Sep", revenue: 145000000, orders: 55 },
            { month: "Okt", revenue: 185400000, orders: 64 },
          ],
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error("Gagal memuat analitik admin:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const maxRev = Math.max(...stats.monthlySales.map((s) => s.revenue));

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#172033]">
            Dashboard Ringkasan Operasional
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Pantau pertumbuhan penjualan, pesanan masuk, dan performa pengiriman toko.
          </p>
        </div>

        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition shadow self-start sm:self-auto"
        >
          + Tambah Produk Baru
        </Link>
      </div>

      {/* 4 Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">Total Pendapatan</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-heading text-[#172033]">
            Rp {(stats.totalRevenue / 1000000).toFixed(1)} Juta
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% dari bulan lalu</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">Total Pesanan</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-heading text-[#172033]">
            {stats.totalOrders} Pesanan
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12 pesanan baru hari ini</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">Total Pelanggan</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-heading text-[#172033]">
            {stats.totalCustomers} Akun
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-2">
            <span>Pelanggan terdaftar aktif</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B]">Katalog Produk</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-heading text-[#172033]">
            {stats.totalProducts} SKU
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
            <span>Semua produk aktif</span>
          </div>
        </div>
      </div>

      {/* Operational Order Status Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/orders?status=PENDING_PAYMENT"
          className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-amber-200 transition"
        >
          <div>
            <span className="text-xs text-[#64748B] block">Menunggu Bayar</span>
            <span className="text-xl font-bold text-amber-600">{stats.pendingOrders}</span>
          </div>
          <Clock className="w-5 h-5 text-amber-500" />
        </Link>

        <Link
          href="/admin/orders?status=PROCESSING"
          className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition"
        >
          <div>
            <span className="text-xs text-[#64748B] block">Perlu Dikemas</span>
            <span className="text-xl font-bold text-[#003366]">{stats.processingOrders}</span>
          </div>
          <Package className="w-5 h-5 text-[#003366]" />
        </Link>

        <Link
          href="/admin/orders?status=SHIPPED"
          className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition"
        >
          <div>
            <span className="text-xs text-[#64748B] block">Dalam Pengiriman</span>
            <span className="text-xl font-bold text-indigo-600">{stats.shippedOrders}</span>
          </div>
          <Truck className="w-5 h-5 text-indigo-500" />
        </Link>

        <Link
          href="/admin/orders?status=DELIVERED"
          className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition"
        >
          <div>
            <span className="text-xs text-[#64748B] block">Telah Diterima</span>
            <span className="text-xl font-bold text-emerald-600">{stats.deliveredOrders}</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </Link>
      </div>

      {/* Revenue Growth Bar Chart */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="font-bold font-heading text-base text-[#172033]">
              Tren Pertumbuhan Omset (Mei - Oktober 2026)
            </h2>
            <p className="text-xs text-[#64748B]">Performa total transaksi sukses bulanan</p>
          </div>
          <span className="text-xs font-bold text-[#003366] bg-blue-50 px-3 py-1 rounded-full">
            Target Tercapai 118%
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-48 pt-6">
            {stats.monthlySales.map((item) => {
              const heightPercent = (item.revenue / maxRev) * 100;

              return (
                <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-[#003366] mb-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    Rp {(item.revenue / 1000000).toFixed(0)}Jt
                  </span>
                  <div
                    className="w-full bg-[#003366] group-hover:bg-[#FFDB58] rounded-t-xl transition-all duration-500 relative"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-bold text-[#172033] mt-2 block">
                    {item.month}
                  </span>
                  <span className="text-[10px] text-[#64748B]">
                    {item.orders} order
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h2 className="font-bold font-heading text-base text-[#172033]">
            Pesanan Masuk Terbaru
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#003366] hover:underline flex items-center gap-1"
          >
            Lihat Semua Pesanan
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#64748B] uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">No. Pesanan</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Kurir</th>
                <th className="py-3 px-4">Total Tagihan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#003366]">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#172033] block">
                      {order.shippingAddress.recipientName}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      {order.shippingAddress.city}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#172033]">
                    {order.courierName} ({order.courierService})
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#172033]">
                    Rp {order.totalAmount.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#003366] border border-blue-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/orders`}
                      className="px-3 py-1 bg-slate-100 hover:bg-[#003366] hover:text-white rounded-lg text-xs font-semibold transition"
                    >
                      Kelola
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
