import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import dbRepository from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, addressLine, city, province, postalCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nama lengkap, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Kata sandi minimal 6 karakter demi keamanan akun Anda." },
        { status: 400 }
      );
    }

    const existing = dbRepository.users.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { message: "Email ini sudah terdaftar. Silakan login atau gunakan email lain." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = dbRepository.users.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: "CUSTOMER",
      avatar: null,
      isActive: true,
    });

    // If address info provided, save it as default address
    if (addressLine && city) {
      dbRepository.addresses.create({
        userId: newUser.id,
        recipientName: name,
        phone: phone || "081200000000",
        addressLine,
        city: city || "Jakarta",
        province: province || "DKI Jakarta",
        postalCode: postalCode || "12000",
        isDefault: true,
      });
    }

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const cookieStore = await cookies();
    cookieStore.set("rz_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Selamat datang di RZ Store.",
      user: safeUser,
    });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { message: "Terjadi gangguan saat pendaftaran. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
