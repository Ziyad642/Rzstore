"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Silakan masukkan email dan kata sandi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Broadcast auth change
        window.dispatchEvent(new Event("cart-updated"));
        if (data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN") {
          router.push("/admin");
        } else {
          router.push(returnUrl);
        }
      } else {
        setError(data.message || "Email atau kata sandi tidak cocok.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi saat login.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.dispatchEvent(new Event("cart-updated"));
        if (data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN") {
          router.push("/admin");
        } else {
          router.push(returnUrl);
        }
      } else {
        setError(data.message || "Gagal login otomatis.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <Link href="/" className="inline-block relative w-20 h-20">
            <Image
              src="/images/logo.png"
              alt="RZ Store Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-bold font-heading text-[#172033]">
          Masuk ke RZ Store
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-[#64748B]">
          Belum punya akun?{" "}
          <Link
            href="/auth/register"
            className="font-bold text-[#003366] hover:underline"
          >
            Daftar Sekarang Gratis
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-2xl border border-slate-100">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#172033]">
                  Kata Sandi
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Untuk akun demo, silakan gunakan tombol demo cepat di bawah ini.");
                  }}
                  className="text-xs text-[#003366] hover:underline"
                >
                  Lupa Sandi?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003366] focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#003366] text-white font-bold rounded-xl hover:bg-[#002244] transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk ke Akun
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block text-center mb-3">
              Akses Cepat Mode Demo
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("customer@rzstore.com", "user123")}
                className="p-2.5 bg-blue-50/50 hover:bg-blue-100/60 border border-blue-100 rounded-xl text-left transition flex flex-col"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-[#003366]">
                  <UserCheck className="w-3.5 h-3.5" />
                  Customer
                </div>
                <span className="text-[10px] text-[#64748B] mt-0.5 font-mono">
                  customer@rzstore.com
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("admin@rzstore.com", "admin123")}
                className="p-2.5 bg-yellow-50/50 hover:bg-yellow-100/60 border border-yellow-200 rounded-xl text-left transition flex flex-col"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-amber-800">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Admin
                </div>
                <span className="text-[10px] text-[#64748B] mt-0.5 font-mono">
                  admin@rzstore.com
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sesi aman terenkripsi JWT & HTTP-Only Cookie</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
