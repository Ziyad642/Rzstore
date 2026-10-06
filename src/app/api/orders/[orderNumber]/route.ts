import { NextResponse } from "next/server";
import dbRepository from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const order = dbRepository.orders.getByOrderNumber(orderNumber);

    if (!order) {
      return NextResponse.json({ message: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Order detail GET error:", err);
    return NextResponse.json({ message: "Gagal memuat rincian pesanan." }, { status: 500 });
  }
}
