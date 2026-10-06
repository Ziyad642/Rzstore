"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  Share2,
  Check,
} from "lucide-react";
import { Product, ProductVariant } from "@/lib/types";
import ProductCard, { formatRupiah } from "@/components/ui/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { slug } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Variant & Quantity state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState<"deskripsi" | "spesifikasi" | "ulasan">("deskripsi");

  // Interaction feedback
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);
  const [isCopiedShare, setIsCopiedShare] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?limit=100`);
        const data = await res.json();
        if (data.products) {
          const found = data.products.find((p: Product) => p.slug === slug);
          if (found) {
            setProduct(found);
            setSelectedImage(found.images?.[0]?.url || "");
            if (found.variants && found.variants.length > 0) {
              setSelectedVariant(found.variants[0]);
            }
            // Similar products from same category
            const similar = data.products.filter(
              (p: Product) => p.categoryId === found.categoryId && p.id !== found.id
            );
            setSimilarProducts(similar);
          }
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;
    setIsAddingToCart(true);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          variantId: selectedVariant?.id || null,
        }),
      });

      if (res.ok) {
        setIsAddedSuccess(true);
        window.dispatchEvent(new Event("cart-updated"));
        setTimeout(() => setIsAddedSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    await handleAddToCart();
    router.push("/checkout");
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    setIsWishlisted(!isWishlisted);
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopiedShare(true);
      setTimeout(() => setIsCopiedShare(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-slate-500 animate-pulse">
        Memuat detail produk...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mb-6">Produk yang Anda cari mungkin telah habis atau tidak aktif.</p>
        <Link href="/shop" className="px-5 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-[#003366]">Beranda</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#003366]">Katalog</Link>
        <span>/</span>
        <Link href={`/category/${product.category?.slug}`} className="hover:text-[#003366]">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Section: Gallery (Left) + Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs mb-12">
        {/* Left: Product Gallery */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Image */}
          <div className="relative w-full pt-[100%] rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 shadow-inner group">
            <Image
              src={selectedImage || product.images?.[0]?.url || "/images/logo.png"}
              alt={product.title}
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#FFDB58] text-[#172033] text-xs font-extrabold px-2.5 py-1 rounded-md shadow-md">
                HEMAT {product.discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img.url
                      ? "border-[#003366] ring-2 ring-[#003366]/20 scale-105"
                      : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Brand & Share / Wishlist */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#003366] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
                {product.brand?.name || product.category?.name || "Official Store"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  aria-label="Bagikan produk"
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors relative"
                >
                  {isCopiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  aria-label="Simpan ke wishlist"
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-black text-[#172033] font-['Montserrat'] tracking-tight leading-snug mb-3">
              {product.title}
            </h1>

            {/* Rating, Reviews, Sold */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span className="text-slate-600 underline cursor-pointer" onClick={() => setActiveTab("ulasan")}>
                {product.reviewCount} Ulasan Pembeli
              </span>
              <span>•</span>
              <span className="font-medium text-slate-700">
                Terjual {product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}rb+` : product.soldCount} barang
              </span>
            </div>

            {/* Price Area */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#003366] font-['Montserrat']">
                  {formatRupiah(currentPrice)}
                </div>
                {product.originalPrice && product.originalPrice > currentPrice && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="line-through">{formatRupiah(product.originalPrice)}</span>
                    <span className="bg-[#FFDB58] text-[#172033] text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Diskon {product.discountPercent}%
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Stok Tersedia ({product.stock})
                </span>
              </div>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-bold text-slate-700 mb-2.5">Pilih Varian:</div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-[#003366] bg-[#003366] text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <div className="text-xs font-bold text-slate-700 mb-2.5">Jumlah:</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-slate-50 text-slate-600 disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-[#172033]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2.5 hover:bg-slate-50 text-slate-600 disabled:opacity-40"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">Total: {formatRupiah(currentPrice * quantity)}</span>
              </div>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`w-full sm:flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 transition-all active:scale-95 ${
                  isAddedSuccess
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-[#003366] text-[#003366] hover:bg-[#003366]/5"
                }`}
              >
                {isAddedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Ditambahkan ke Keranjang!</span>
                  </>
                ) : isAddingToCart ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#003366] border-t-transparent rounded-full animate-spin" />
                    <span>Menambahkan...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>+ Masukkan Keranjang</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#003366] text-white hover:bg-[#002244] shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>Beli Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Marketplace Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Produk Asli</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#003366] flex-shrink-0" />
                <span>Garansi Resmi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#003366] flex-shrink-0" />
                <span>Pengiriman Cepat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Pembayaran Aman</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Deskripsi, Spesifikasi, Ulasan */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 mb-12">
        <div className="flex items-center gap-2 sm:gap-6 border-b border-slate-100 pb-4 mb-6 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab("deskripsi")}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === "deskripsi"
                ? "border-[#003366] text-[#003366]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Deskripsi Produk
          </button>
          <button
            onClick={() => setActiveTab("spesifikasi")}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === "spesifikasi"
                ? "border-[#003366] text-[#003366]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Spesifikasi Lengkap
          </button>
          <button
            onClick={() => setActiveTab("ulasan")}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === "ulasan"
                ? "border-[#003366] text-[#003366]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Ulasan Pembeli ({product.reviewCount})
          </button>
        </div>

        {/* Tab 1: Deskripsi */}
        {activeTab === "deskripsi" && (
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 whitespace-pre-line">
            {product.description}
          </div>
        )}

        {/* Tab 2: Spesifikasi */}
        {activeTab === "spesifikasi" && (
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {product.specifications ? (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 whitespace-pre-line font-mono text-xs">
                {product.specifications}
              </div>
            ) : (
              <p className="text-slate-400 italic">Spesifikasi detail tidak tersedia untuk item ini.</p>
            )}
          </div>
        )}

        {/* Tab 3: Ulasan */}
        {activeTab === "ulasan" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-100 mb-6">
              <div className="text-3xl font-black text-amber-500 font-['Montserrat']">
                {product.rating.toFixed(1)}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Berdasarkan {product.reviewCount} ulasan pembeli terverifikasi
                </div>
              </div>
            </div>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#003366] text-white flex items-center justify-center text-xs font-bold">
                          {rev.userName ? rev.userName.charAt(0) : "U"}
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {rev.isAnonymous ? "Pengguna Terverifikasi" : rev.userName || "Pelanggan RZ Store"}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(rev.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Belum ada ulasan untuk produk ini.</p>
            )}
          </div>
        )}
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#172033] font-['Montserrat'] tracking-tight">
              Produk Serupa
            </h2>
            <Link
              href={`/category/${product.category?.slug}`}
              className="text-xs font-bold text-[#003366] hover:underline"
            >
              Lihat di kategori ini →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similarProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
