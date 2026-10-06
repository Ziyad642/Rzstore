"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, Search, ExternalLink, Package, Clock, CheckCircle2 } from "lucide-react";
import { Order } from "@/lib/types";

export default function AdminShipmentsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => {
        if (d.orders) setOrders(d.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  const shipments = orders.filter((o) => o.trackingNumber || o.shipment);

  const filtered = shipments.filter(
    (s) =>
      s.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.trackingNumber && s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.shippingAddress.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033]">
          Manajemen Pengiriman & Ekspedisi
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Integrasi resi kurir real-time (JNE, J&T, SiCepat, Ninja, Pos Indonesia)
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor resi kurir atau nomor pesanan..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#003366]"
          />
        </div>
        <span className="text-xs text-[#64748B]">
          {filtered.length} paket dalam pantauan ekspedisi
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#64748B] uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">No. Pesanan</th>
                <th className="py-3.5 px-4">Jasa Ekspedisi</th>
                <th className="py-3.5 px-4">Nomor Resi (AWB)</th>
                <th className="py-3.5 px-4">Penerima & Kota Tujuan</th>
                <th className="py-3.5 px-4">Status Pengiriman</th>
                <th className="py-3.5 px-4 text-right">Lacak Realtime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#003366]">
                    {item.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#172033]">
                    {item.courierName} ({item.courierService})
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#172033]">
                    {item.trackingNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#172033] block">
                      {item.shippingAddress.recipientName}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      {item.shippingAddress.city}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/track-order?q=${item.trackingNumber || item.orderNumber}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#003366] text-white rounded-lg text-xs font-semibold hover:bg-[#002244] transition"
                    >
                      Buka Timeline
                      <ExternalLink className="w-3 h-3" />
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
