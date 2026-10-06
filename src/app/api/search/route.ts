import { NextResponse } from "next/server";
import dbRepository from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const categorySlug = searchParams.get("category") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    const products = dbRepository.products.getAll({
      search: query,
      categorySlug,
    });

    const result = limit ? products.slice(0, limit) : products;

    return NextResponse.json({
      success: true,
      total: products.length,
      products: result,
    });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ message: "Gagal memproses pencarian." }, { status: 500 });
  }
}
