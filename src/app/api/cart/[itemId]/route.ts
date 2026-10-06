import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbRepository from "@/lib/db";

const GUEST_ID = "guest_user_session";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await getCurrentUser();
    const userId = user ? user.id : GUEST_ID;
    const { itemId } = await params;
    const body = await req.json();

    if (body.quantity !== undefined) {
      const cart = dbRepository.cart.updateQuantity(userId, itemId, Number(body.quantity));
      return NextResponse.json({ success: true, cart });
    }

    if (body.toggleSelect) {
      const cart = dbRepository.cart.toggleSelect(userId, itemId);
      return NextResponse.json({ success: true, cart });
    }

    return NextResponse.json({ message: "Aksi tidak dikenali." }, { status: 400 });
  } catch (err) {
    console.error("Cart item update error:", err);
    return NextResponse.json({ message: "Gagal memperbarui item keranjang." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await getCurrentUser();
    const userId = user ? user.id : GUEST_ID;
    const { itemId } = await params;

    const cart = dbRepository.cart.removeItem(userId, itemId);
    return NextResponse.json({
      success: true,
      message: "Item berhasil dihapus dari keranjang.",
      cart,
    });
  } catch (err) {
    console.error("Cart item delete error:", err);
    return NextResponse.json({ message: "Gagal menghapus item dari keranjang." }, { status: 500 });
  }
}
