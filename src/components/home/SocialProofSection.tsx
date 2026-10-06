"use client";

import React from "react";
import { Star, CheckCircle, Quote } from "lucide-react";

export default function SocialProofSection() {
  const testimonials = [
    {
      name: "Dian Permatasari",
      city: "Surabaya",
      role: "Verified Buyer",
      rating: 5,
      product: "Apple iPhone 15 Pro 128GB",
      comment:
        "Pelayanan RZ Store luar biasa cepat! Pesan pagi, langsung diproses dan no resi JNE update real-time. Barang original 100% segel green peel iBox, garansi aktif. Pasti langganan!",
    },
    {
      name: "Rizky Firmansyah",
      city: "Bandung",
      role: "Verified Buyer",
      rating: 5,
      product: "Sony WH-1000XM5 Wireless Headphones",
      comment:
        "Kualitas suaranya luar biasa! Packaging rapi berlapis bubble wrap tebal dan kardus pelindung ganda. Fitur lacak pesanannya sangat membantu memantau kurir. Recommended seller!",
    },
    {
      name: "Siti Rahmawati",
      city: "Jakarta Barat",
      role: "Verified Buyer",
      rating: 5,
      product: "Philips Air Fryer Digital HD9252",
      comment:
        "Dapat promo flash sale plus voucher RZHEMAT50 jadi hemat banget. Sangat puas dengan kecepatan pengiriman dan kemudahan pembayaran via QRIS instan.",
    },
  ];

  return (
    <section className="my-16 bg-slate-50 py-12 px-4 rounded-3xl border border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#003366] text-xs font-bold mb-3">
            <Star className="w-3.5 h-3.5 fill-[#FFDB58] text-[#FFDB58]" />
            <span>Kepuasan Terbukti 4.8 / 5.0 dari 15.000+ Pelanggan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#172033] font-['Montserrat'] tracking-tight">
            Apa Kata Pelanggan Kami?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ulasan nyata dari ribuan pembeli yang telah mempercayakan kebutuhan mereka pada RZ Store
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testi, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-200" />
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-4">
                  &ldquo;{testi.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#172033] font-['Montserrat']">
                    {testi.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {testi.city} • <span className="text-[#003366] font-medium">{testi.product}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  <span>Terverifikasi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
