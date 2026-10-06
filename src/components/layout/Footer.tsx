"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ShieldCheck, Clock, Headphones } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#002244] text-white border-t border-slate-800 pt-12 pb-24 lg:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#FFDB58]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-white font-['Montserrat']">Garansi 100% Original</div>
              <div className="text-xs text-slate-400 mt-0.5">Produk asli langsung dari official distributor</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#FFDB58]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-white font-['Montserrat']">Pengiriman Cepat</div>
              <div className="text-xs text-slate-400 mt-0.5">Diproses dan dikirim di hari yang sama</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#FFDB58]">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-white font-['Montserrat']">Bantuan CS 24/7</div>
              <div className="text-xs text-slate-400 mt-0.5">Layanan bantuan pelanggan sigap setiap saat</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#FFDB58]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-white font-['Montserrat']">Pembayaran Aman</div>
              <div className="text-xs text-slate-400 mt-0.5">Diverifikasi otomatis & terlindungi enkripsi</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md">
                <Image src="/images/logo.png" alt="RZ Store" fill className="object-cover" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white font-['Montserrat'] block">
                  RZ STORE
                </span>
                <span className="text-xs text-[#FFDB58] font-semibold tracking-wider uppercase">
                  PT RZ E-Commerce Group
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Platform e-commerce modern terpercaya untuk seluruh kebutuhan harian Anda. Dari fashion, elektronik, kebutuhan rumah tangga, hingga produk gaya hidup dengan jaminan keaslian dan pelayanan prima.
            </p>

            <div className="flex flex-col gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFDB58] flex-shrink-0" />
                <span>Jl. Cinyosog No.50, Burangkeng, Kec. Setu, Kabupaten Bekasi, Jawa Barat 17320</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFDB58] flex-shrink-0" />
                <span>(021) 5088-7799 / WhatsApp CS: 0896-8383-0901</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFDB58] flex-shrink-0" />
                <span>cs@rzstore.com / partnership@rzstore.com </span>
              </div>
            </div>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Montserrat']">
              Bantuan
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">Cara Belanja</Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">Pengiriman</Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">Retur & Refund</Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">FAQ (Tanya Jawab)</Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">Status Pesanan</Link>
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Montserrat']">
              Layanan
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">Lacak Pesanan</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Hubungi Kami</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
              </li>
              <li>
                <Link href="/seller" className="hover:text-white transition-colors">Mitra Penjual</Link>
              </li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-['Montserrat']">
              Perusahaan
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Kontak</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">Karier</Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white transition-colors">Siaran Pers</Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#FFDB58] hover:underline font-semibold">Portal Admin</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Partners: Payment & Couriers */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-800">
          {/* Payment Badges */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Metode Pembayaran Resmi
            </div>
            <div className="flex flex-wrap gap-2">
              {["QRIS", "BCA", "BNI", "BRI", "Mandiri", "OVO", "DANA", "GoPay", "COD"].map((pay) => (
                <span
                  key={pay}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-bold tracking-wide"
                >
                  {pay}
                </span>
              ))}
            </div>
          </div>

          {/* Courier Badges */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Partner Kurir Terpercaya
            </div>
            <div className="flex flex-wrap gap-2">
              {["JNE Express", "J&T Express", "SiCepat Ekspres", "Ninja Xpress", "AnterAja", "Pos Indonesia"].map(
                (cour) => (
                  <span
                    key={cour}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-semibold"
                  >
                    {cour}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © 2026 PT RZ E-Commerce Group. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Indonesia (IDR)</span>
            <span>Keamanan SSL Terenkripsi 256-Bit</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
