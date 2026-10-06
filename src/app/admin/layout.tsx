"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  TicketPercent,
  Star,
  Truck,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { User } from "@/lib/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Admin auth check error:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  const navItems = [
    { href: "/admin", label: "Dashboard Ringkasan", icon: LayoutDashboard },
    { href: "/admin/products", label: "Daftar Produk", icon: Package },
    { href: "/admin/products/create", label: "Tambah Produk", icon: PlusCircle },
    { href: "/admin/categories", label: "Kategori Produk", icon: FolderTree },
    { href: "/admin/orders", label: "Pesanan Masuk", icon: ShoppingBag },
    { href: "/admin/shipments", label: "Pengiriman & Ekspedisi", icon: Truck },
    { href: "/admin/customers", label: "Data Pelanggan", icon: Users },
    { href: "/admin/coupons", label: "Voucher Promo", icon: TicketPercent },
    { href: "/admin/reviews", label: "Ulasan Produk", icon: Star },
    { href: "/admin/settings", label: "Pengaturan Toko", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#002244] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-0 max-lg:-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-[#001830]">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white">
                <Image src="/images/logo.png" alt="RZ Store" fill className="object-contain" />
              </div>
              <div>
                <span className="font-bold font-heading text-sm text-white tracking-wide block">
                  RZ STORE ADMIN
                </span>
                <span className="text-[10px] text-yellow-400 font-medium">
                  Portal Operasional
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2 mt-2">
              Menu Utama
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#FFDB58] text-[#002244] shadow-md font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Storefront Link */}
        <div className="p-4 border-t border-white/10 bg-[#001830]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs text-slate-200 transition mb-3"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#FFDB58]" />
              Lihat Toko Publik
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#FFDB58] text-[#003366] flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || "Admin RZ"}</p>
                <p className="text-[10px] text-slate-400 truncate">Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-[#003366] rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#64748B]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PT RZ E-Commerce Group Management Console</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Online
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
