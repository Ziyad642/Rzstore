import React from "react";
import type { Metadata } from "next";
import dbRepository from "@/lib/db";
import HeroCarousel from "@/components/home/HeroCarousel";
import ValueProposition from "@/components/home/ValueProposition";
import CategoryGrid from "@/components/home/CategoryGrid";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ProductShowcaseTabs from "@/components/home/ProductShowcaseTabs";
import SocialProofSection from "@/components/home/SocialProofSection";
import SocialFeedGrid from "@/components/home/SocialFeedGrid";
import NewsletterSection from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "RZ Store - Your Everyday Needs | Belanja Online Terpercaya",
  description:
    "RZ Store (PT RZ E-Commerce Group) menyediakan aneka produk fashion, gadget, elektronik, kebutuhan rumah tangga, dan kecantikan dengan garansi 100% original dan gratis ongkir se-Indonesia.",
};

export default function HomePage() {
  const banners = dbRepository.banners.getActive();
  const categories = dbRepository.categories.getAll();
  const flashSaleProducts = dbRepository.products.getAll({ isFlashSale: true });
  const popularProducts = dbRepository.products.getAll({ sortBy: "popular" });
  const newestProducts = dbRepository.products.getAll({ sortBy: "newest" });
  const featuredProducts = dbRepository.products.getAll({ isFeatured: true });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Hero Carousel */}
      <HeroCarousel banners={banners} />

      {/* 2. Value Proposition */}
      <ValueProposition />

      {/* 3. Category Grid */}
      <CategoryGrid categories={categories} />

      {/* 4. Flash Sale with Countdown */}
      <FlashSaleSection products={flashSaleProducts} />

      {/* 5. Product Showcase Tabs: Terlaris, Produk Baru, Pilihan Editor */}
      <ProductShowcaseTabs
        popularProducts={popularProducts}
        newestProducts={newestProducts}
        featuredProducts={featuredProducts}
      />

      {/* 6. Social Proof: Customer Testimonials */}
      <SocialProofSection />

      {/* 7. Instagram / Social Visual Grid */}
      <SocialFeedGrid />

      {/* 8. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
}
