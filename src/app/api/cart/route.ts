import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbRepository from "@/lib/db";

// Fallback guest user ID for visitors not logged in yet
const GUEST_ID = "guest_user_session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user ? user.id : GUEST_ID;
    const cart = dbRepository.cart.getCart(userId);

    return NextResponse.json({ success: true, cart });
  } catch (err) {
    console.error("Cart GET error:", err);
    return NextResponse.json({ message: "Gagal memuat keranjang belanja." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const userId = user ? user.id : GUEST_ID;

    const { productId, quantity = 1, variantId = null } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: "ID Produk diperlukan." }, { status: 400 });
    }

    const cart = dbRepository.cart.addItem(userId, productId, Number(quantity), variantId);

    return NextResponse.json({
      success: true,
      message: "Produk berhasil ditambahkan ke keranjang belanja!",
      cart,
    });
  } catch (err: unknown) {
    console.error("Cart POST error:", err);
    const message = err instanceof Error ? err.message : "Gagal menambahkan produk ke keranjang belanja.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
