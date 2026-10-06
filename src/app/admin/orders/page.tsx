"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Filter,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Edit2,
  ExternalLink,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "ALL";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState("");

  // Update Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("PROCESSING");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [checkpointDesc, setCheckpointDesc] = useState("");
  const [checkpointLoc, setCheckpointLoc] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Gagal memuat pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenUpdate = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setCourierName(order.courierName || "JNE");
    setTrackingNumber(order.trackingNumber || "");
    setCheckpointDesc("");
    setCheckpointLoc(order.shippingAddress.city || "Jakarta");
    setUpdateMessage("");
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    setUpdateMessage("");

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.orderNumber}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          courierName,
          trackingNumber,
          checkpointDesc: checkpointDesc.trim() || undefined,
          checkpointLoc: checkpointLoc.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUpdateMessage("Pesanan dan log resi berhasil diperbarui!");
        fetchOrders();
        setTimeout(() => setSelectedOrder(null), 1200);
      } else {
        alert(data.message || "Gagal memperbarui pesanan.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setUpdating(false);
    }
  };

  const statusTabs = [
    { key: "ALL", label: "Semua Pesanan" },
    { key: "PENDING_PAYMENT", label: "Menunggu Bayar" },
    { key: "PROCESSING", label: "Diproses" },
    { key: "SHIPPED", label: "Dikirim" },
    { key: "DELIVERED", label: "Selesai" },
    { key: "CANCELLED", label: "Dibatalkan" },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchStatus =
      activeStatus === "ALL"
        ? true
        : activeStatus === "PROCESSING"
        ? order.status === "PROCESSING" || order.status === "PAID" || order.status === "PACKED"
        : order.status === activeStatus;

    const matchSearch =
      searchTerm === "" ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.recipientName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033]">
            Manajemen Pesanan Masuk
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Proses pesanan, konfirmasi pembayaran, dan input resi pengiriman
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nomor pesanan atau nama pembeli..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#003366]"
            />
          </div>
          <span className="text-xs text-[#64748B]">
            Ditemukan {filteredOrders.length} pesanan
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          {statusTabs.map((tab) => {
            const isActive = activeStatus === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveStatus(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? "bg-[#003366] text-white shadow-sm"
                    : "bg-slate-50 text-[#64748B] hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#172033]">Tidak ada pesanan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[#64748B] uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">No. Pesanan & Waktu</th>
                  <th className="py-3.5 px-4">Penerima & Alamat</th>
                  <th className="py-3.5 px-4">Barang</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Kurir & Resi</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#003366] block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#172033] block">
                        {order.shippingAddress.recipientName}
                      </span>
                      <span className="text-[11px] text-[#64748B] line-clamp-1 max-w-[150px]">
                        {order.shippingAddress.city}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="text-[#172033] line-clamp-1">
                        {order.items.map((i) => i.title).join(", ")}
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        ({order.items.reduce((s, i) => s + i.quantity, 0)} pcs)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#172033]">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#172033] block">
                        {order.courierName}
                      </span>
                      <span className="font-mono text-[11px] text-[#003366]">
                        {order.trackingNumber || "Belum ada resi"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#003366] border border-blue-200">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenUpdate(order)}
                          className="px-3 py-1.5 bg-[#003366] text-white hover:bg-[#002244] rounded-lg text-xs font-semibold transition"
                        >
                          Ubah Status
                        </button>
                        <Link
                          href={`/track-order?q=${order.trackingNumber || order.orderNumber}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-[#003366] rounded-lg"
                          title="Lacak Publik"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Order & Shipping Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold font-heading text-[#172033] mb-1">
              Kelola Status & Pengiriman
            </h2>
            <p className="text-xs text-[#64748B] mb-4 font-mono font-bold text-[#003366]">
              {selectedOrder.orderNumber}
            </p>

            {updateMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{updateMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#172033] block mb-1">
                  Status Pesanan
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full text-xs px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-[#003366]"
                >
                  <option value="PENDING_PAYMENT">PENDING_PAYMENT (Menunggu Bayar)</option>
                  <option value="PAID">PAID (Pembayaran Dikonfirmasi)</option>
                  <option value="PROCESSING">PROCESSING (Sedang Dikemas)</option>
                  <option value="PACKED">PACKED (Siap Diambil Kurir)</option>
                  <option value="SHIPPED">SHIPPED (Dalam Pengiriman)</option>
                  <option value="DELIVERED">DELIVERED (Paket Diterima)</option>
                  <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                  <option value="REFUNDED">REFUNDED (Dana Dikembalikan)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">
                    Jasa Kurir
                  </label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#172033] block mb-1">
                    Nomor Resi Pengiriman (AWB)
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Contoh: JNE982736411029"
                    className="w-full text-xs px-3.5 py-2.5 border rounded-xl font-mono focus:outline-none focus:border-[#003366]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-[#172033] block mb-2">
                  Tambahkan Titik Checkpoint Pelacakan Baru (Opsional)
                </span>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={checkpointDesc}
                    onChange={(e) => setCheckpointDesc(e.target.value)}
                    placeholder="Contoh: Paket telah tiba di Sorting Hub Cengkareng"
                    className="w-full text-xs px-3.5 py-2 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                  <input
                    type="text"
                    value={checkpointLoc}
                    onChange={(e) => setCheckpointLoc(e.target.value)}
                    placeholder="Lokasi: Jakarta Barat Hub"
                    className="w-full text-xs px-3.5 py-2 border rounded-xl focus:outline-none focus:border-[#003366]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-[#64748B]"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-[#003366] text-white rounded-xl text-xs font-bold hover:bg-[#002244] disabled:opacity-50 flex items-center gap-1.5"
                >
                  {updating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
