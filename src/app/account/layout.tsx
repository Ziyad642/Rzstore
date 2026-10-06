"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  User,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { User as UserType } from "@/lib/types";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
        }
      } catch {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/auth/login");
    } catch (err) {
      console.error("Gagal keluar:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
      </div>
    );
  }

  const navLinks = [
    { href: "/account", label: "Ringkasan Akun", icon: LayoutDashboard },
    { href: "/account/orders", label: "Pesanan Saya", icon: ShoppingBag },
    { href: "/account/addresses", label: "Daftar Alamat", icon: MapPin },
    { href: "/account/profile", label: "Profil Akun", icon: User },
    { href: "/account/settings", label: "Pengaturan & Keamanan", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-[#64748B]">
          <Link href="/" className="hover:text-[#003366] transition">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-semibold text-[#172033]">Akun Saya</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Account Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#003366] text-white flex items-center justify-center font-bold text-xl font-heading shadow-md">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-[#172033] text-sm truncate">{user?.name}</h3>
                <p className="text-xs text-[#64748B] truncate">{user?.email}</p>
                <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#003366] text-[10px] font-bold rounded mt-1">
                  {user?.role === "ADMIN" ? "Administrator" : "Customer Terverifikasi"}
                </span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#003366] text-white shadow-sm"
                        : "text-[#64748B] hover:text-[#003366] hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </div>

            {/* Customer Security Box */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-xs text-[#64748B] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#172033]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Akun Terlindungi</span>
              </div>
              <p className="leading-relaxed">
                Seluruh transaksi dan data pribadi Anda dienkripsi demi keamanan belanja Anda di RZ Store.
              </p>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
