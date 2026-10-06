"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#F5F5F5] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-sm border border-slate-100">
        <div className="w-20 h-20 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <span className="text-4xl font-extrabold font-heading text-[#003366] block mb-2">
          404
        </span>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033] mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mb-8 leading-relaxed">
          Mohon maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau alamat URL yang Anda masukkan tidak sesuai.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#003366] text-white text-xs font-bold rounded-xl hover:bg-[#002244] transition shadow flex items-center justify-center gap-2"
          >
            Kembali ke Beranda
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-[#172033] text-xs font-bold rounded-xl transition"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
