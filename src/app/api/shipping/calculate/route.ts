import { NextResponse } from "next/server";
import {
  JNEProvider,
  JNTProvider,
  SiCepatProvider,
  NinjaProvider,
  PosIndonesiaProvider,
} from "@/lib/shipping/shipping-provider";
import { CourierOption } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { destinationCity = "Jakarta Selatan", weightGrams = 1000 } = await req.json();

    const params = {
      originCity: "Jakarta Pusat",
      destinationCity,
      weightGrams: Number(weightGrams),
    };

    const providers = [
      new SiCepatProvider(),
      new JNEProvider(),
      new JNTProvider(),
      new NinjaProvider(),
      new PosIndonesiaProvider(),
    ];

    const results = await Promise.allSettled(providers.map((p) => p.calculateRates(params)));

    const allRates: CourierOption[] = [];
    results.forEach((res) => {
      if (res.status === "fulfilled") {
        allRates.push(...res.value);
      }
    });

    return NextResponse.json({
      success: true,
      origin: params.originCity,
      destination: params.destinationCity,
      rates: allRates,
    });
  } catch (err) {
    console.error("Shipping calculate error:", err);
    return NextResponse.json({ message: "Gagal menghitung tarif ongkos kirim." }, { status: 500 });
  }
}
