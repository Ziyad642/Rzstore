import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbRepository from "@/lib/db";

export async function GET() {
  try {
    const coupons = dbRepository.coupons.getAll();
    return NextResponse.json({ success: true, coupons });
  } catch (err) {
    console.error("Admin coupons GET error:", err);
    return NextResponse.json({ message: "Gagal memuat voucher." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Akses ditolak: Khusus Admin." }, { status: 403 });
    }

    const { code, description, discountType, discountValue, minPurchase, maxDiscount, quota, daysValid = 30 } = await req.json();

    if (!code || !discountValue) {
      return NextResponse.json({ message: "Kode voucher dan nilai diskon wajib diisi." }, { status: 400 });
    }

    const coupon = dbRepository.coupons.create({
      code: code.trim().toUpperCase(),
      description: description || null,
      discountType: discountType || "PERCENT",
      discountValue: Number(discountValue),
      minPurchase: Number(minPurchase || 0),
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      quota: Number(quota || 100),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + Number(daysValid) * 86400000).toISOString(),
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: "Voucher promo berhasil dibuat.",
      coupon,
    });
  } catch (err) {
    console.error("Admin coupon create error:", err);
    return NextResponse.json({ message: "Gagal membuat voucher." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Akses ditolak: Khusus Admin." }, { status: 403 });
    }

    const { id, ...updates } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "ID voucher wajib disertakan." }, { status: 400 });
    }

    const updated = dbRepository.coupons.update(id, updates);
    return NextResponse.json({
      success: true,
      message: "Status voucher berhasil diperbarui.",
      coupon: updated,
    });
  } catch (err) {
    console.error("Admin coupon update error:", err);
    return NextResponse.json({ message: "Gagal memperbarui voucher." }, { status: 500 });
  }
}
