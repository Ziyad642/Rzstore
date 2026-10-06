"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Truck,
  ShieldCheck,
  LogOut,
  Package,
  MapPin,
  Settings,
  Sparkles,
  Home,
  LayoutGrid,
} from "lucide-react";
import { User, Category, Product } from "@/lib/types";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "iPhone 15 Pro",
    "Sony WH-1000XM5",
    "Nike Air Jordan",
    "Air Fryer",
  ]);

  // Dropdowns & Mobile Menus
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);

  // Load User, Cart Count, Wishlist Count, Categories
  const fetchUserData = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (meData.authenticated) {
        setCurrentUser(meData.user);
      } else {
        setCurrentUser(null);
      }

      const cartRes = await fetch("/api/cart");
      const cartData = await cartRes.json();
      if (cartData.success) {
        const totalItems = cartData.cart.items.reduce(
          (acc: number, item: { quantity: number }) => acc + item.quantity,
          0
        );
        setCartCount(totalItems);
      }

      const wishRes = await fetch("/api/wishlist");
      const wishData = await wishRes.json();
      if (wishData.success) {
        setWishlistCount(wishData.wishlist.items.length);
      }
    } catch (err) {
      console.error("Error fetching user nav state:", err);
    }
  };

  useEffect(() => {
    fetchUserData();

    // Fetch categories for menu
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.categories) setCategories(d.categories);
      })
      .catch(() => {
        // Fallback default
        setCategories([
          { id: "1", name: "Fashion", slug: "fashion", isFeatured: true, createdAt: "", updatedAt: "" },
          { id: "2", name: "Elektronik & Gadget", slug: "elektronik-gadget", isFeatured: true, createdAt: "", updatedAt: "" },
          { id: "3", name: "Home & Living", slug: "home-living", isFeatured: true, createdAt: "", updatedAt: "" },
          { id: "4", name: "Kecantikan", slug: "kecantikan", isFeatured: true, createdAt: "", updatedAt: "" },
          { id: "5", name: "Olahraga & Outdoor", slug: "olahraga-outdoor", isFeatured: true, createdAt: "", updatedAt: "" },
          { id: "6", name: "Ibu & Bayi", slug: "ibu-bayi", isFeatured: true, createdAt: "", updatedAt: "" },
          { id: "7", name: "Komputer & Aksesoris", slug: "komputer-aksesoris", isFeatured: true, createdAt: "", updatedAt: "" },
          { id: "8", name: "Makanan & Minuman", slug: "makanan-minuman", isFeatured: true, createdAt: "", updatedAt: "" },
        ]);
      });

    // Listen to cart and wishlist updates
    const handleCartUpdate = () => fetchUserData();
    const handleWishlistUpdate = () => fetchUserData();
    window.addEventListener("cart-updated", handleCartUpdate);
    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);

  // Close search suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Live Autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=4`);
        const data = await res.json();
        if (data.products) {
          setSearchSuggestions(data.products);
        }
      } catch {
        // Fallback
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (!recentSearches.includes(searchQuery.trim())) {
      setRecentSearches([searchQuery.trim(), ...recentSearches.slice(0, 4)]);
    }

    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-200">
        {/* Top Announcement Bar */}
        <div className="bg-[#002244] text-white text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFDB58] animate-ping" />
              <span className="font-medium">
                Gratis Ongkir min. belanja Rp200.000 • Promo spesial untuk kamu
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-slate-300">
              <Link href="/track-order" className="hover:text-[#FFDB58] flex items-center gap-1 transition-colors">
                <Truck className="w-3.5 h-3.5" />
                <span>Lacak Pesanan</span>
              </Link>
              <Link href="/help" className="hover:text-[#FFDB58] transition-colors">
                Bantuan & FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="border-b border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-4 sm:gap-6">
            {/* Mobile Hamburger & Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 -ml-1.5 text-slate-700 hover:text-[#003366] rounded-md"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                  <Image
                    src="/images/logo.png"
                    alt="RZ Store Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#003366] font-['Montserrat'] leading-none">
                    RZ STORE
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
                    Your Everyday Needs
                  </span>
                </div>
              </Link>
            </div>

            {/* Search Bar Desktop */}
            <div className="hidden lg:block flex-1 max-w-2xl relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Cari produk impianmu (misal: iPhone 15, Sepatu Nike, Kopi)..."
                    className="w-full pl-4 pr-11 py-2 sm:py-2.5 rounded-full border border-slate-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/10 outline-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all bg-slate-50/50 focus:bg-white"
                  />
                  <button
                    type="submit"
                    aria-label="Cari"
                    className="absolute right-1 sm:right-1.5 p-1.5 sm:p-2 rounded-full bg-[#003366] text-white hover:bg-[#002244] transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Autocomplete & Suggestions Dropdown */}
              {isSearchOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 max-h-[80vh] overflow-y-auto">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && !searchQuery && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Pencarian Terpopuler
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((term, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSearchQuery(term);
                              router.push(`/search?q=${encodeURIComponent(term)}`);
                              setIsSearchOpen(false);
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-[#003366] hover:text-white text-slate-700 text-xs rounded-full transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Shortcuts */}
                  {!searchQuery && (
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Kategori Populer
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {categories.slice(0, 6).map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="p-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFDB58]" />
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Real-time Product Preview */}
                  {searchQuery && searchSuggestions.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Produk Terkait
                      </div>
                      <div className="divide-y divide-slate-100">
                        {searchSuggestions.map((prod) => (
                          <Link
                            key={prod.id}
                            href={`/product/${prod.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <div className="relative w-10 h-10 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                              <Image
                                src={prod.images[0]?.url || "/images/logo.png"}
                                alt={prod.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-800 truncate">
                                {prod.title}
                              </div>
                              <div className="text-xs font-bold text-[#003366]">
                                Rp {prod.price.toLocaleString("id-ID")}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full mt-3 py-2 text-xs font-semibold text-center text-[#003366] bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        Lihat semua hasil untuk &quot;{searchQuery}&quot; →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons: Wishlist, Cart, User */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-full text-slate-700 hover:text-[#003366] hover:bg-slate-100 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FFDB58] text-[#172033] font-bold text-[10px] flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full text-slate-700 hover:text-[#003366] hover:bg-slate-100 transition-colors"
                aria-label="Keranjang Belanja"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#003366] text-white font-bold text-[10px] flex items-center justify-center shadow-sm animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account or Auth Button */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1.5 pl-2 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-xs uppercase">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-[#172033] truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                        {currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN" ? (
                          <span className="inline-block mt-1 bg-[#FFDB58] text-[#172033] text-[10px] font-bold px-2 py-0.5 rounded">
                            {currentUser.role}
                          </span>
                        ) : null}
                      </div>

                      {/* Admin Link if Admin */}
                      {(currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN") && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#003366] bg-blue-50/50 hover:bg-blue-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#003366]" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        href="/account/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>Pesanan Saya</span>
                      </Link>

                      <Link
                        href="/account/addresses"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>Daftar Alamat</span>
                      </Link>

                      <Link
                        href="/account/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>Profil Saya</span>
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Keluar dari Akun</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="text-xs sm:text-sm font-semibold text-[#003366] hover:text-[#002244] px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/auth/register"
                    className="hidden sm:inline-flex text-xs sm:text-sm font-semibold bg-[#003366] text-white hover:bg-[#002244] px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Bar Row (Clean, responsive, full width) */}
          <div className="lg:hidden px-4 pb-2.5 pt-1 bg-white border-t border-slate-100/60">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk impianmu di RZ Store..."
                className="w-full pl-3.5 pr-10 py-2 rounded-full border border-slate-200 focus:border-[#003366] text-xs text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white outline-none transition-all shadow-xs"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#003366] text-white hover:bg-[#002244]"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Bar (Desktop) */}
        <nav className="hidden lg:block border-b border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1">
              {/* Category Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-2 py-3 px-3.5 bg-slate-50 hover:bg-slate-100 text-[#003366] font-bold rounded-t-md transition-colors"
                >
                  <Menu className="w-4 h-4" />
                  <span>Semua Kategori</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isCategoryOpen && (
                  <div className="absolute left-0 top-full w-64 bg-white rounded-b-xl shadow-xl border border-slate-100 py-2 z-50">
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/category/${c.slug}`}
                        onClick={() => setIsCategoryOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50/50 hover:text-[#003366] transition-colors"
                      >
                        <span>{c.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Nav Links */}
              <Link href="/" className="py-3 px-3.5 hover:text-[#003366] transition-colors">
                Beranda
              </Link>
              <Link href="/shop" className="py-3 px-3.5 hover:text-[#003366] transition-colors">
                Semua Produk
              </Link>
              <Link href="/shop?flashSale=true" className="py-3 px-3.5 text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors">
                <Sparkles className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                <span>Flash Sale</span>
              </Link>
              <Link href="/shop?sortBy=popular" className="py-3 px-3.5 hover:text-[#003366] transition-colors">
                Terlaris
              </Link>
              <Link href="/shop?sortBy=newest" className="py-3 px-3.5 hover:text-[#003366] transition-colors">
                Produk Baru
              </Link>
              <Link href="/shop?isFeatured=true" className="py-3 px-3.5 hover:text-[#003366] transition-colors">
                Pilihan Editor
              </Link>
            </div>

            {/* Quick Guarantees */}
            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Produk Original
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#003366]" />
                Pengiriman Seluruh Nusantara
              </span>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image src="/images/logo.png" alt="RZ Store" fill className="object-cover" />
                </div>
                <span className="font-bold text-base text-[#003366]">RZ STORE</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="p-4 flex flex-col gap-1 text-sm font-semibold text-slate-800">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg hover:bg-slate-50 text-[#003366]"
              >
                Beranda
              </Link>
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg hover:bg-slate-50"
              >
                Semua Produk
              </Link>
              <Link
                href="/shop?flashSale=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg hover:bg-slate-50 text-red-600 font-bold"
              >
                Flash Sale 🔥
              </Link>
              <Link
                href="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg hover:bg-slate-50 flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#003366]" />
                Lacak Pesanan
              </Link>

              <div className="pt-3 pb-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Kategori
              </div>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 pl-3 rounded-lg hover:bg-slate-50 text-slate-700 text-xs font-medium"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Footer in Drawer */}
            <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50">
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar dari Akun
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold text-[#003366] border border-[#003366] rounded-lg"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold bg-[#003366] text-white rounded-lg"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 flex items-center justify-around shadow-xl">
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            pathname === "/" ? "text-[#003366] font-bold" : "text-slate-500 hover:text-[#003366]"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Beranda</span>
        </Link>
        <Link
          href="/shop"
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            pathname.startsWith("/shop") || pathname.startsWith("/category")
              ? "text-[#003366] font-bold"
              : "text-slate-500 hover:text-[#003366]"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Kategori</span>
        </Link>
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            pathname.startsWith("/wishlist") ? "text-[#003366] font-bold" : "text-slate-500 hover:text-[#003366]"
          }`}
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute 0 right-1 w-3.5 h-3.5 bg-[#FFDB58] text-[#172033] rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Wishlist</span>
        </Link>
        <Link
          href="/cart"
          className={`relative flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            pathname.startsWith("/cart") ? "text-[#003366] font-bold" : "text-slate-500 hover:text-[#003366]"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute 0 right-1 w-3.5 h-3.5 bg-[#003366] text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Keranjang</span>
        </Link>
        <Link
          href={currentUser ? "/account" : "/auth/login"}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            pathname.startsWith("/account") || pathname.startsWith("/auth")
              ? "text-[#003366] font-bold"
              : "text-slate-500 hover:text-[#003366]"
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{currentUser ? "Akun" : "Masuk"}</span>
        </Link>
      </div>
    </>
  );
}
