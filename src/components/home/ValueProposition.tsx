"use client";

import React from "react";
import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

export default function ValueProposition() {
  const items = [
    {
      icon: Truck,
      title: "Gratis Ongkir",
      subtitle: "Min. belanja Rp200.000 ke seluruh Indonesia",
    },
    {
      icon: ShieldCheck,
      title: "Garansi Original",
      subtitle: "100% jaminan keaslian uang kembali",
    },
    {
      icon: CreditCard,
      title: "Pembayaran Lengkap",
      subtitle: "QRIS, Transfer Bank, E-Wallet, & COD",
    },
    {
      icon: Headphones,
      title: "CS 24/7 Siap Membantu",
      subtitle: "Layanan pelanggan responsif setiap hari",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-8">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#003366]/20 transition-all duration-200"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-[#003366]">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#172033] font-['Montserrat'] leading-tight">
                {item.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug line-clamp-1">
                {item.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
