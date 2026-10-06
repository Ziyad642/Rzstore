import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbRepository from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Akses ditolak: Khusus Admin." }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, price, originalPrice, categoryId, brandId, stock, images, specifications, isFlashSale, isFeatured } = body;

    if (!title || !price || !categoryId) {
      return NextResponse.json({ message: "Nama produk, harga, dan kategori wajib diisi." }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newProd = dbRepository.products.create({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description: description || "",
      specifications: specifications || "",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      discountPercent: originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      categoryId,
      brandId: brandId || null,
      stock: Number(stock || 0),
      soldCount: 0,
      rating: 5.0,
      reviewCount: 0,
      isFeatured: Boolean(isFeatured),
      isFlashSale: Boolean(isFlashSale),
      isActive: true,
      images: Array.isArray(images) && images.length > 0
        ? images.map((url: string, idx: number) => ({
            id: `img_${Date.now()}_${idx}`,
            productId: "",
            url,
            isPrimary: idx === 0,
            order: idx,
          }))
        : [
            {
              id: `img_${Date.now()}_0`,
              productId: "",
              url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
              isPrimary: true,
              order: 0,
            },
          ],
    });

    return NextResponse.json({
      success: true,
      message: "Produk baru berhasil ditambahkan!",
      product: newProd,
    });
  } catch (err) {
    console.error("Admin create product error:", err);
    return NextResponse.json({ message: "Gagal menambahkan produk baru." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Akses ditolak: Khusus Admin." }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ message: "ID produk wajib disertakan." }, { status: 400 });
    }

    const updated = dbRepository.products.update(id, updates);
    return NextResponse.json({
      success: true,
      message: "Produk berhasil diperbarui.",
      product: updated,
    });
  } catch (err) {
    console.error("Admin update product error:", err);
    return NextResponse.json({ message: "Gagal memperbarui produk." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Akses ditolak: Khusus Admin." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID produk wajib disertakan." }, { status: 400 });
    }

    const ok = dbRepository.products.delete(id);
    return NextResponse.json({
      success: ok,
      message: ok ? "Produk berhasil dihapus." : "Produk tidak ditemukan.",
    });
  } catch (err) {
    console.error("Admin delete product error:", err);
    return NextResponse.json({ message: "Gagal menghapus produk." }, { status: 500 });
  }
}
