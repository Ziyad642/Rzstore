import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import dbRepository from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const user = dbRepository.users.findByEmail(email);
    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "Akun Anda dinonaktifkan. Silakan hubungi Customer Care." },
        { status: 403 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set("rz_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // Return safe user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: "Berhasil masuk.",
      user: safeUser,
    });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { message: "Terjadi gangguan sistem saat proses masuk. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
