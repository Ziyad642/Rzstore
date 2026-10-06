"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Building,
  User,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";

interface TrackingCheckpoint {
  id: string;
  status: string;
  description: string;
  location?: string | null;
  timestamp: string;
}

interface TrackingData {
  found: boolean;
  orderNumber?: string | null;
  orderStatus?: string;
  courier: string;
  courierService?: string;
  trackingNumber: string;
  shippingStatus: string;
  recipientName?: string;
  recipientAddress?: string;
  shippedAt?: string | null;
  estimatedDelivery?: string | null;
  deliveredAt?: string | null;
  timeline: TrackingCheckpoint[];
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackingData | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchTracking = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/tracking?q=${encodeURIComponent(searchVal.trim())}`);
      const result = await res.json();

      if (res.ok && result.found) {
        setData(result);
      } else {
        setError(result.message || "Data pelacakan tidak ditemukan. Pastikan nomor pesanan atau nomor resi benar.");
        setData(null);
      }
    } catch {
      setError("Terjadi kesalahan jaringan saat melacak pesanan.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(query);
  };

  const handleCopyResi = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 7-Stage Core Milestone Evaluation
  const milestones = [
    { key: "CREATED", label: "Pesanan Dibuat", desc: "Pesanan masuk ke sistem RZ Store" },
    { key: "PAID", label: "Pembayaran Dikonfirmasi", desc: "Verifikasi dana berhasil" },
    { key: "PROCESSING", label: "Pesanan Diproses", desc: "QC & pengepakan di gudang" },
    { key: "PICKED_UP", label: "Diserahkan ke Kurir", desc: "Paket dijemput oleh ekspedisi" },
    { key: "IN_TRANSIT", label: "Dalam Perjalanan", desc: "Paket menuju kota tujuan" },
    { key: "OUT_FOR_DELIVERY", label: "Tiba di Tujuan", desc: "Dibawa kurir pengantar" },
    { key: "DELIVERED", label: "Paket Diterima", desc: "Telah diterima pemesan" },
  ];

  const getCurrentStepIndex = () => {
    if (!data) return 0;
    const status = (data.shippingStatus || data.orderStatus || "").toUpperCase();

    if (status === "DELIVERED") return 6;
    if (status === "OUT_FOR_DELIVERY") return 5;
    if (status === "IN_TRANSIT") return 4;
    if (status === "PICKED_UP" || status === "SHIPPED") return 3;
    if (status === "PROCESSING" || status === "PACKED") return 2;
    if (status === "PAID") return 1;
    return 0;
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-[#64748B]">
          <Link href="/" className="hover:text-[#003366] transition">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-semibold text-[#172033]">Lacak Pesanan & Resi</span>
        </nav>

        {/* Hero Section & Search Bar */}
        <div className="bg-[#003366] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <span className="inline-block px-3 py-1 bg-white/10 text-[#FFDB58] rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Real-time Shipping Tracking
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-heading mb-3 leading-tight">
              Lacak Pengiriman Pesananmu
            </h1>
            <p className="text-blue-100/80 text-sm sm:text-base mb-6">
              Masukkan Nomor Pesanan RZ Store atau Nomor Resi Kurir (JNE, J&T, SiCepat, Ninja, Pos Indonesia) untuk melihat posisi paket secara akurat.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Contoh: RZ-20261007-00125 atau JNE982736411029"
                  className="w-full pl-12 pr-4 py-3.5 bg-white text-[#172033] text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFDB58] shadow-md"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-8 py-3.5 bg-[#FFDB58] text-[#003366] font-bold text-sm rounded-xl hover:bg-[#FFE37A] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lacak Paket"}
              </button>
            </form>

            {/* Quick Demo Pre-filled Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-blue-200">Coba nomor demo:</span>
              <button
                type="button"
                onClick={() => {
                  setQuery("RZ-20261007-00125");
                  fetchTracking("RZ-20261007-00125");
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-blue-100 transition font-mono"
              >
                RZ-20261007-00125
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery("JNE982736411029");
                  fetchTracking("JNE982736411029");
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-blue-100 transition font-mono"
              >
                JNE982736411029
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-700 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-rose-600" />
            <div>
              <h3 className="font-bold text-sm">Pesanan Tidak Ditemukan</h3>
              <p className="text-xs text-rose-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Tracking Details View */}
        {data && (
          <div className="space-y-6">
            {/* Header Status Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs text-[#64748B] block mb-1">Nomor Pesanan</span>
                  <p className="font-bold font-mono text-[#003366] text-base">
                    {data.orderNumber || "Ekspedisi Langsung"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#64748B] block mb-1">Jasa Kurir</span>
                  <p className="font-bold text-[#172033] text-base">
                    {data.courier} {data.courierService && `(${data.courierService})`}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#64748B] block mb-1">Nomor Resi (AWB)</span>
                  <div className="flex items-center gap-2">
                    <p className="font-bold font-mono text-[#172033] text-base">
                      {data.trackingNumber}
                    </p>
                    <button
                      onClick={() => handleCopyResi(data.trackingNumber)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500"
                      title="Salin Resi"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-[#64748B] block mb-1">Status Terkini</span>
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                    {data.shippingStatus.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Destination & Recipient */}
              {data.recipientName && (
                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl mt-4">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-[#003366] mt-0.5" />
                    <div>
                      <span className="text-xs text-[#64748B] block">Penerima</span>
                      <p className="font-semibold text-[#172033]">{data.recipientName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#003366] mt-0.5" />
                    <div>
                      <span className="text-xs text-[#64748B] block">Alamat Tujuan</span>
                      <p className="text-xs text-[#172033] leading-relaxed">
                        {data.recipientAddress}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 7-Step Milestone Visualizer */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="font-bold font-heading text-lg text-[#172033] mb-6">
                Tahapan Pengiriman Paket
              </h2>

              <div className="relative">
                {/* Desktop Horizontal Milestone */}
                <div className="hidden lg:grid grid-cols-7 gap-2 relative">
                  {/* Connecting Bar */}
                  <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0">
                    <div
                      className="h-full bg-[#003366] transition-all duration-700"
                      style={{
                        width: `${(currentStep / (milestones.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {milestones.map((m, idx) => {
                    const isPassed = idx < currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={m.key} className="flex flex-col items-center text-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isPassed
                              ? "bg-[#003366] text-white"
                              : isCurrent
                              ? "bg-[#FFDB58] text-[#003366] ring-4 ring-yellow-100 shadow-md scale-110"
                              : "bg-white border-2 border-slate-300 text-slate-400"
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : isCurrent ? (
                            <Truck className="w-5 h-5 text-[#003366]" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span
                          className={`text-xs mt-3 font-semibold ${
                            isCurrent
                              ? "text-[#003366] font-bold"
                              : isPassed
                              ? "text-[#172033]"
                              : "text-slate-400"
                          }`}
                        >
                          {m.label}
                        </span>
                        <span className="text-[10px] text-[#64748B] mt-1 max-w-[100px] leading-tight">
                          {m.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Vertical Milestone */}
                <div className="lg:hidden space-y-6 relative pl-6 border-l-2 border-slate-200 ml-3">
                  {milestones.map((m, idx) => {
                    const isPassed = idx < currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={m.key} className="relative">
                        <div
                          className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isPassed
                              ? "bg-[#003366] text-white"
                              : isCurrent
                              ? "bg-[#FFDB58] text-[#003366] ring-4 ring-yellow-100 shadow-md"
                              : "bg-white border-2 border-slate-300 text-slate-400"
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : isCurrent ? (
                            <Truck className="w-4 h-4 text-[#003366]" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div>
                          <h4
                            className={`text-sm font-semibold ${
                              isCurrent ? "text-[#003366] font-bold" : "text-[#172033]"
                            }`}
                          >
                            {m.label}
                          </h4>
                          <p className="text-xs text-[#64748B] mt-0.5">{m.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Checkpoint Timeline Logs */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="font-bold font-heading text-lg text-[#172033] mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#003366]" />
                Riwayat Perjalanan Paket (Live Provider Log)
              </h2>

              <div className="relative pl-6 border-l-2 border-blue-200 ml-4 space-y-6">
                {data.timeline.map((point, index) => {
                  const isLatest = index === 0;

                  return (
                    <div key={point.id || index} className="relative">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                          isLatest ? "bg-[#003366] ring-4 ring-blue-100" : "bg-slate-300"
                        }`}
                      />

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <p
                            className={`text-sm font-semibold ${
                              isLatest ? "text-[#003366] font-bold" : "text-[#172033]"
                            }`}
                          >
                            {point.description}
                          </p>
                          <span className="text-xs text-[#64748B] font-mono">
                            {new Date(point.timestamp).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {point.location && (
                          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>Lokasi: {point.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F5] py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
