"use client";

import React, { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <section className="my-14 p-6 sm:p-10 rounded-3xl bg-[#003366] text-white relative overflow-hidden shadow-xl">
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#FFDB58] flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black font-['Montserrat'] tracking-tight mb-2">
          Jangan Lewatkan Promo Terbaik
        </h2>
        <p className="text-xs sm:text-sm text-slate-200 mb-6 leading-relaxed">
          Dapatkan voucher diskon hingga Rp 50.000, informasi flash sale eksklusif, dan penawaran spesial langsung di email Anda.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs sm:text-sm font-bold">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>Terima kasih! Voucher diskon pengguna baru telah dikirimkan.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan alamat email aktif Anda..."
              required
              className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-800 text-xs sm:text-sm outline-none placeholder-slate-400 focus:ring-2 focus:ring-[#FFDB58]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#FFDB58] hover:bg-[#e6c547] text-[#172033] font-bold text-xs sm:text-sm transition-colors active:scale-95 shadow-md flex-shrink-0"
            >
              Langganan Sekarang
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
