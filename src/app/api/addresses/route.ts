import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbRepository from "@/lib/db";

const DEFAULT_USER_ID = "usr_cust_001";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user ? user.id : DEFAULT_USER_ID;
    const addresses = dbRepository.addresses.getByUserId(userId);
    return NextResponse.json({ success: true, addresses });
  } catch (err) {
    console.error("Addresses GET error:", err);
    return NextResponse.json({ message: "Gagal memuat alamat." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const userId = user ? user.id : DEFAULT_USER_ID;
    const body = await req.json();

    const { recipientName, phone, addressLine, city, province, postalCode, isDefault = false } = body;

    if (!recipientName || !phone || !addressLine || !city) {
      return NextResponse.json({ message: "Data alamat tidak lengkap." }, { status: 400 });
    }

    const newAddress = dbRepository.addresses.create({
      userId,
      recipientName,
      phone,
      addressLine,
      city,
      province: province || "DKI Jakarta",
      postalCode: postalCode || "12000",
      isDefault: Boolean(isDefault),
    });

    return NextResponse.json({ success: true, address: newAddress, message: "Alamat berhasil ditambahkan!" });
  } catch (err) {
    console.error("Addresses POST error:", err);
    return NextResponse.json({ message: "Gagal menyimpan alamat baru." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ message: "ID alamat diperlukan." }, { status: 400 });
    }

    const updated = dbRepository.addresses.update(id, updates);
    if (!updated) {
      return NextResponse.json({ message: "Alamat tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, address: updated, message: "Alamat berhasil diperbarui!" });
  } catch (err) {
    console.error("Addresses PUT error:", err);
    return NextResponse.json({ message: "Gagal memperbarui alamat." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID alamat diperlukan." }, { status: 400 });
    }

    const success = dbRepository.addresses.delete(id);
    return NextResponse.json({ success, message: "Alamat berhasil dihapus." });
  } catch (err) {
    console.error("Addresses DELETE error:", err);
    return NextResponse.json({ message: "Gagal menghapus alamat." }, { status: 500 });
  }
}
