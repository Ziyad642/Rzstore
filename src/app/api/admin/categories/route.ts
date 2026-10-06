import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbRepository from "@/lib/db";

export async function GET() {
  try {
    const categories = dbRepository.categories.getAll();
    return NextResponse.json({ success: true, categories });
  } catch (err) {
    console.error("Categories GET error:", err);
    return NextResponse.json({ message: "Gagal memuat kategori." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Akses ditolak: Khusus Admin." }, { status: 403 });
    }

    const { name, description, image, icon, isFeatured } = await req.json();
    if (!name) {
      return NextResponse.json({ message: "Nama kategori wajib diisi." }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newCat = dbRepository.categories.create({
      name,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description: description || null,
      image: image || null,
      icon: icon || "Tag",
      isFeatured: Boolean(isFeatured),
    });

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil dibuat.",
      category: newCat,
    });
  } catch (err) {
    console.error("Admin category create error:", err);
    return NextResponse.json({ message: "Gagal membuat kategori baru." }, { status: 500 });
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
      return NextResponse.json({ message: "ID kategori wajib disertakan." }, { status: 400 });
    }

    const updated = dbRepository.categories.update(id, updates);
    return NextResponse.json({
      success: true,
      message: "Kategori berhasil diperbarui.",
      category: updated,
    });
  } catch (err) {
    console.error("Admin category update error:", err);
    return NextResponse.json({ message: "Gagal memperbarui kategori." }, { status: 500 });
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
      return NextResponse.json({ message: "ID kategori wajib disertakan." }, { status: 400 });
    }

    const ok = dbRepository.categories.delete(id);
    return NextResponse.json({
      success: ok,
      message: ok ? "Kategori berhasil dihapus." : "Kategori tidak ditemukan.",
    });
  } catch (err) {
    console.error("Admin category delete error:", err);
    return NextResponse.json({ message: "Gagal menghapus kategori." }, { status: 500 });
  }
}
