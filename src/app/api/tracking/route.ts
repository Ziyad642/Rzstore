import { NextResponse } from "next/server";
import dbRepository from "@/lib/db";
import { getShippingProvider } from "@/lib/shipping/shipping-provider";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { message: "Masukkan nomor pesanan (contoh: RZ-20261007-00125) atau nomor resi kurir." },
        { status: 400 }
      );
    }

    const trimmed = query.trim();
    const result = dbRepository.shipments.getByTrackingOrOrder(trimmed);

    if (!result?.order) {
      // If not in database, attempt to query live courier API directly via provider abstraction
      const fallbackProvider = getShippingProvider("JNE");
      const liveTracking = await fallbackProvider.trackShipment(trimmed);

      return NextResponse.json({
        found: true,
        orderNumber: null,
        courier: liveTracking.courier,
        trackingNumber: liveTracking.trackingNumber,
        status: liveTracking.status,
        statusDescription: liveTracking.statusDescription,
        currentLocation: liveTracking.currentLocation,
        shippedAt: liveTracking.shippedAt,
        estimatedDelivery: liveTracking.estimatedDelivery,
        timeline: liveTracking.history,
      });
    }

    const order = result.order;
    const shipment = order.shipment;

    return NextResponse.json({
      found: true,
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      courier: order.courierName,
      courierService: order.courierService,
      trackingNumber: order.trackingNumber || shipment?.trackingNumber || "Menunggu Pengambilan Kurir",
      shippingStatus: shipment?.status || "PENDING",
      recipientName: order.shippingAddress.recipientName,
      recipientAddress: `${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.province}`,
      shippedAt: shipment?.shippedAt || order.createdAt,
      estimatedDelivery: shipment?.estimatedDelivery || null,
      deliveredAt: shipment?.deliveredAt || null,
      items: order.items,
      timeline: shipment?.trackings || [
        {
          id: "trk_0",
          status: "PENDING",
          description: "Pesanan berhasil dibuat. Sedang dipersiapkan di gudang.",
          location: "Warehouse Jakarta",
          timestamp: order.createdAt,
        },
      ],
    });
  } catch (err) {
    console.error("Tracking API error:", err);
    return NextResponse.json({ message: "Gagal melacak status pengiriman." }, { status: 500 });
  }
}
