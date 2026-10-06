import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbRepository from "@/lib/db";

const GUEST_ID = "guest_user_session";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const userId = user ? user.id : GUEST_ID;
    const { selectAll } = await req.json();

    const cart = dbRepository.cart.toggleSelectAll(userId, Boolean(selectAll));
    return NextResponse.json({ success: true, cart });
  } catch (err) {
    console.error("Cart select all error:", err);
    return NextResponse.json({ message: "Gagal memilih item keranjang." }, { status: 500 });
  }
}
