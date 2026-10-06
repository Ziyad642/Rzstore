import { NextResponse } from "next/server";
import dbRepository from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ message: "Silakan masukkan kode voucher." }, { status: 400 });
    }

    const result = dbRepository.coupons.validate(code, Number(subtotal || 0));

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: result.message,
      discountAmount: result.discountAmount,
      coupon: result.coupon,
    });
  } catch (err) {
    console.error("Coupon validation error:", err);
    return NextResponse.json({ message: "Gagal memvalidasi voucher." }, { status: 500 });
  }
}
