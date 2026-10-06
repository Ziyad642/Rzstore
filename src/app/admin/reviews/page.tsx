"use client";

import React, { useState } from "react";
import { Star, Trash2, CheckCircle2, MessageSquare } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: "rev_1",
      productTitle: "Sony WH-1000XM5 Wireless Headphones",
      userName: "Rian Prasetyo",
      rating: 5,
      comment: "Kualitas audio luar biasa, noise cancelling hening total. Pengiriman cepat!",
      date: "2026-10-06T12:00:00.000Z",
    },
    {
      id: "rev_2",
      productTitle: "Ergonomic Office Chair Mesh Pro",
      userName: "Anita Wijaya",
      rating: 5,
      comment: "Sangat nyaman untuk WFH seharian. Punggung tidak pegal sama sekali.",
      date: "2026-10-05T09:30:00.000Z",
    },
    {
      id: "rev_3",
      productTitle: "Nike Air Zoom Pegasus 40",
      userName: "Bambang Pamungkas",
      rating: 4,
      comment: "Sepatu empuk dan ringan. Ukuran pas sesuai panduan chart.",
      date: "2026-10-04T15:45:00.000Z",
    },
    {
      id: "rev_4",
      productTitle: "Skintific 5X Ceramide Barrier Moisture Gel",
      userName: "Clarissa Putri",
      rating: 5,
      comment: "Skin barrier membaik setelah seminggu pemakaian rutin. Original 100%.",
      date: "2026-10-03T18:20:00.000Z",
    },
  ]);

  const handleDelete = (id: string) => {
    if (confirm("Hapus ulasan ini?")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033]">
          Ulasan & Penilaian Produk
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Pantau feedback kepuasan pelanggan terhadap produk yang dibeli
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#003366] bg-blue-50 px-2 py-0.5 rounded">
                  {rev.productTitle}
                </span>
                <span className="text-xs text-[#64748B]">
                  oleh <span className="font-semibold text-[#172033]">{rev.userName}</span>
                </span>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating
                        ? "text-[#FFDB58] fill-[#FFDB58]"
                        : "text-slate-200 fill-slate-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-[#172033] mt-1">&ldquo;{rev.comment}&rdquo;</p>
              <span className="text-[10px] text-[#64748B] block">
                {new Date(rev.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <button
              onClick={() => handleDelete(rev.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition self-end sm:self-center"
              title="Hapus Ulasan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
