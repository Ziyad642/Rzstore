"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CreditCard,
  Copy,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  HelpCircle,
  MapPin,
  Check,
} from "lucide-react";
import { Order } from "@/lib/types";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${resolvedParams.orderNumber}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.message || "Pesanan tidak ditemukan.");
        }
      } catch {
        setError("Gagal memuat informasi pesanan.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [resolvedParams.orderNumber]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-white rounded-2xl"></div>
            <div className="h-72 bg-white rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-16 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <h2 className="text-xl font-bold font-heading text-[#172033] mb-2">
            Pesanan Tidak Ditemukan
          </h2>
          <p className="text-sm text-[#64748B] mb-6">
            {error || "Nomor pesanan yang Anda cari tidak terdaftar di sistem kami."}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#003366] text-white font-semibold rounded-xl hover:bg-[#002244] transition"
          >
            Lanjut Belanja
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          text: "Menunggu Pembayaran",
          icon: Clock,
        };
      case "PAID":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          text: "Pembayaran Dikonfirmasi",
          icon: CheckCircle2,
        };
      case "PROCESSING":
      case "PACKED":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          text: "Sedang Dikemas Gudang",
          icon: Package,
        };
      case "SHIPPED":
        return {
          bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
          text: "Dalam Pengiriman Kurir",
          icon: Truck,
        };
      case "DELIVERED":
        return {
          bg: "bg-teal-50 text-teal-700 border-teal-200",
          text: "Pesanan Telah Tiba",
          icon: CheckCircle2,
        };
      default:
        return {
          bg: "bg-slate-50 text-slate-700 border-slate-200",
          text: status,
          icon: Package,
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-[#64748B]">
          <Link href="/" className="hover:text-[#003366] transition">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/account/orders" className="hover:text-[#003366] transition">
            Pesanan Saya
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-semibold text-[#172033]">{order.orderNumber}</span>
        </nav>

        {/* Top Success Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold tracking-wider text-[#64748B]">
                  Nomor Pesanan
                </span>
                <span className="text-xs font-mono font-bold text-[#003366] bg-blue-50 px-2 py-0.5 rounded">
                  {order.orderNumber}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-heading text-[#172033]">
                Terima Kasih Atas Pesananmu!
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Dibuat pada:{" "}
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold self-start sm:self-auto ${statusInfo.bg}`}
            >
              <StatusIcon className="w-4 h-4" />
              <span>{statusInfo.text}</span>
            </div>
          </div>

          {/* Quick Tracking CTA */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#003366] flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#64748B] block">Jasa Ekspedisi</span>
                <p className="text-sm font-bold text-[#172033]">
                  {order.courierName} ({order.courierService})
                  {order.trackingNumber && (
                    <span className="font-mono text-xs text-[#003366] ml-2">
                      • {order.trackingNumber}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <Link
              href={`/track-order?q=${order.trackingNumber || order.orderNumber}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition shadow"
            >
              Lacak Pengiriman Realtime
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Payment Guide (if pending payment or VA/QRIS) */}
        {order.payment && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-[#172033] text-base">Instruksi Pembayaran</h2>
                <p className="text-xs text-[#64748B]">
                  Metode: <span className="font-semibold">{order.payment.paymentMethod.toUpperCase()}</span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#64748B] block">Total yang Harus Dibayar</span>
                <span className="text-xl font-bold font-heading text-[#003366]">
                  Rp {order.totalAmount.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(order.totalAmount.toString())}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-medium text-[#172033] rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Tersalin" : "Salin Jumlah"}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#64748B] mt-4 leading-relaxed">
              * Silakan selesaikan pembayaran sebelum batas waktu berakhir. Status pesanan akan otomatis terverifikasi begitu sistem mendeteksi mutasi dana.
            </p>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-[#172033] text-base pb-4 border-b border-slate-100 mb-4">
            Rincian Barang Belanja
          </h2>

          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#172033] line-clamp-1">{item.title}</p>
                  <p className="text-xs text-[#64748B] mt-1">
                    {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="text-right font-bold text-sm text-[#003366]">
                  Rp {item.subtotal.toLocaleString("id-ID")}
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-sm text-[#64748B]">
            <div className="flex justify-between">
              <span>Subtotal Produk</span>
              <span className="text-[#172033] font-medium">
                Rp {order.subtotal.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim ({order.courierName})</span>
              <span className="text-[#172033] font-medium">
                Rp {order.shippingCost.toLocaleString("id-ID")}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Diskon Voucher</span>
                <span>- Rp {order.discountAmount.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-base text-[#172033]">Total Pesanan</span>
              <span className="text-xl font-bold font-heading text-[#003366]">
                Rp {order.totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Address & Logistics Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-[#172033] text-base">Alamat Pengiriman</h2>
              <p className="text-xs text-[#64748B]">Data tujuan pengantaran paket</p>
            </div>
          </div>

          <div className="text-sm">
            <p className="font-bold text-[#172033]">
              {order.shippingAddress.recipientName}{" "}
              <span className="font-normal text-[#64748B]">({order.shippingAddress.phone})</span>
            </p>
            <p className="text-[#64748B] mt-1 leading-relaxed">
              {order.shippingAddress.addressLine}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.province} {order.shippingAddress.postalCode}
            </p>
            {order.notes && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-[#64748B] border border-slate-100">
                <span className="font-semibold text-[#172033]">Catatan: </span>
                {order.notes}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-[#172033] font-semibold rounded-xl hover:bg-slate-50 transition shadow-sm text-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#003366]" />
            Lanjut Belanja di RZ Store
          </Link>

          <a
            href="https://wa.me/6281299990001?text=Halo%20CS%20RZ%20Store,%20saya%20ingin%20menanyakan%20pesanan%20saya"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow text-sm"
          >
            <HelpCircle className="w-4 h-4" />
            Bantuan CS 24/7 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
