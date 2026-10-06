import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbRepository from "@/lib/db";

const GUEST_ID = "guest_user_session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user ? user.id : GUEST_ID;
    const wishlist = dbRepository.wishlist.getWishlist(userId);

    return NextResponse.json({ success: true, wishlist });
  } catch (err) {
    console.error("Wishlist GET error:", err);
    return NextResponse.json({ message: "Gagal memuat wishlist." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const userId = user ? user.id : GUEST_ID;
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: "ID produk diperlukan." }, { status: 400 });
    }

    const result = dbRepository.wishlist.toggleItem(userId, productId);
    return NextResponse.json({
      success: true,
      isInWishlist: result.isInWishlist,
      count: result.count,
      message: result.isInWishlist
        ? "Produk ditambahkan ke Wishlist Anda!"
        : "Produk dihapus dari Wishlist.",
    });
  } catch (err) {
    console.error("Wishlist POST error:", err);
    return NextResponse.json({ message: "Gagal mengubah wishlist." }, { status: 500 });
  }
}
