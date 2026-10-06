"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  ExternalLink,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import { Order } from "@/lib/types";

function CustomerOrdersContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("status") || "ALL";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Gagal memuat pesanan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const tabs = [
    { key: "ALL", label: "Semua" },
    { key: "PENDING_PAYMENT", label: "Menunggu Bayar" },
    { key: "PROCESSING", label: "Diproses" },
    { key: "SHIPPED", label: "Dikirim" },
    { key: "DELIVERED", label: "Selesai" },
    { key: "CANCELLED", label: "Dibatalkan" },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchStatus =
      activeTab === "ALL"
        ? true
        : activeTab === "PROCESSING"
        ? order.status === "PROCESSING" || order.status === "PAID" || order.status === "PACKED"
        : order.status === activeTab;

    const matchSearch =
      searchTerm === "" ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((i) => i.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return { bg: "bg-amber-50 text-amber-700 border-amber-200", text: "Menunggu Pembayaran", icon: Clock };
      case "PAID":
      case "PROCESSING":
      case "PACKED":
        return { bg: "bg-blue-50 text-blue-700 border-blue-200", text: "Sedang Diproses", icon: Package };
      case "SHIPPED":
        return { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", text: "Dalam Pengiriman", icon: Truck };
      case "DELIVERED":
        return { bg: "bg-teal-50 text-teal-700 border-teal-200", text: "Pesanan Selesai", icon: CheckCircle2 };
      case "CANCELLED":
        return { bg: "bg-rose-50 text-rose-700 border-rose-200", text: "Dibatalkan", icon: XCircle };
      default:
        return { bg: "bg-slate-50 text-slate-700 border-slate-200", text: status, icon: Package };
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033] mb-4">
          Daftar Pesanan Saya
        </h1>

        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor pesanan atau nama produk..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#003366]"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 border-t border-slate-100 mt-5 pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? "bg-[#003366] text-white shadow-sm"
                    : "bg-slate-50 text-[#64748B] hover:bg-slate-100 hover:text-[#172033]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-[#172033] text-base mb-1">Tidak Ada Pesanan Ditemukan</h3>
          <p className="text-xs text-[#64748B] mb-6">
            Tidak ada riwayat pesanan yang cocok dengan kriteria filter saat ini.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4"
              >
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#003366]">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-[#64748B]">
                      • {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold self-start sm:self-auto ${badge.bg}`}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{badge.text}</span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#172033] line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#64748B]">
                          {item.quantity} barang x Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer bar: Total & actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-[#64748B] block">Total Pembayaran:</span>
                    <span className="text-base font-bold font-heading text-[#003366]">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/order/${order.orderNumber}`}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-[#172033] text-xs font-bold rounded-xl border border-slate-200 transition"
                    >
                      Lihat Rincian
                    </Link>

                    <Link
                      href={`/track-order?q=${order.trackingNumber || order.orderNumber}`}
                      className="px-4 py-2 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition flex items-center gap-1.5 shadow-sm"
                    >
                      Lacak Paket
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CustomerOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
        </div>
      }
    >
      <CustomerOrdersContent />
    </Suspense>
  );
}
