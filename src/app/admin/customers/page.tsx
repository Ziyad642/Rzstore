"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, ShieldCheck, UserCheck, UserX, Loader2 } from "lucide-react";
import { User } from "@/lib/types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([
    {
      id: "usr_cust_001",
      name: "Budi Santoso",
      email: "customer@rzstore.com",
      phone: "081388887777",
      role: "CUSTOMER",
      isActive: true,
      createdAt: "2026-05-10T10:00:00.000Z",
      updatedAt: "2026-05-10T10:00:00.000Z",
    },
    {
      id: "usr_cust_002",
      name: "Siti Rahmawati",
      email: "siti.rahma@gmail.com",
      phone: "081299887766",
      role: "CUSTOMER",
      isActive: true,
      createdAt: "2026-06-14T08:30:00.000Z",
      updatedAt: "2026-06-14T08:30:00.000Z",
    },
    {
      id: "usr_cust_003",
      name: "Ahmad Fauzi",
      email: "ahmad.fauzi@yahoo.com",
      phone: "081577665544",
      role: "CUSTOMER",
      isActive: true,
      createdAt: "2026-07-20T14:15:00.000Z",
      updatedAt: "2026-07-20T14:15:00.000Z",
    },
    {
      id: "usr_cust_004",
      name: "Dewi Lestari",
      email: "dewi.lestari@outlook.com",
      phone: "081822334455",
      role: "CUSTOMER",
      isActive: true,
      createdAt: "2026-08-01T11:20:00.000Z",
      updatedAt: "2026-08-01T11:20:00.000Z",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleBlock = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#172033]">
          Manajemen Data Pelanggan
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Daftar akun customer terdaftar di RZ Store
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, email, atau no handphone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#003366]"
          />
        </div>
        <span className="text-xs text-[#64748B]">{filtered.length} Pelanggan</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#64748B] uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Nama Pelanggan</th>
                <th className="py-3.5 px-4">Kontak Email & HP</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Tanggal Daftar</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#003366] flex items-center justify-center font-bold">
                        {cust.name.charAt(0)}
                      </div>
                      <span className="font-bold text-[#172033]">{cust.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[#172033] block">{cust.email}</span>
                    <span className="text-[11px] text-[#64748B] font-mono">{cust.phone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                      {cust.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B]">
                    {new Date(cust.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        cust.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {cust.isActive ? "Aktif" : "Diblokir"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleBlock(cust.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        cust.isActive
                          ? "text-rose-600 hover:bg-rose-50"
                          : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {cust.isActive ? "Blokir" : "Buka Blokir"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
