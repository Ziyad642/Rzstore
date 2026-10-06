"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function SocialFeedGrid() {
  const posts = [
    {
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      likes: "1.2k",
      comments: "48",
      caption: "Unboxing iPhone 15 Pro Titanium",
    },
    {
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      likes: "940",
      comments: "32",
      caption: "Signature Oversized Heavyweight Tee",
    },
    {
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      likes: "2.5k",
      comments: "115",
      caption: "Nike Pegasus 40 Ready to Run",
    },
    {
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      likes: "810",
      comments: "29",
      caption: "Morning brew with Aceh Gayo Specialty",
    },
    {
      image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
      likes: "1.8k",
      comments: "84",
      caption: "Healthy cooking with Philips Air Fryer",
    },
    {
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      likes: "3.1k",
      comments: "190",
      caption: "Glow up with Somethinc Barrier Serum",
    },
  ];

  return (
    <section className="my-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-wider mb-1">
            <InstagramIcon className="w-4 h-4" />
            <span>@rzstore.official</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#172033] font-['Montserrat'] tracking-tight">
            Ikuti Tren Kami di Media Sosial
          </h2>
        </div>
        <Link
          href="https://instagram.com"
          target="_blank"
          className="text-xs sm:text-sm font-bold text-[#003366] hover:text-[#002244] self-start sm:self-auto"
        >
          Follow di Instagram →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {posts.map((post, idx) => (
          <div
            key={idx}
            className="group relative pt-[100%] rounded-2xl overflow-hidden bg-slate-100 shadow-xs cursor-pointer"
          >
            <Image
              src={post.image}
              alt={post.caption}
              fill
              sizes="(max-width: 768px) 50vw, 16vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Hover overlay with likes & comments */}
            <div className="absolute inset-0 bg-[#002244]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white p-3 text-center">
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  {post.comments}
                </span>
              </div>
              <p className="text-[10px] text-slate-200 line-clamp-2 leading-tight">
                {post.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
