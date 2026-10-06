import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbRepository from "@/lib/db";
import { getPaymentProvider } from "@/lib/payment/payment-provider";
import { getShippingProvider } from "@/lib/shipping/shipping-provider";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const orders = dbRepository.orders.getByUserId(user.id);
    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error("Orders GET error:", err);
    return NextResponse.json({ message: "Gagal memuat daftar pesanan." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const userId = user ? user.id : "usr_cust_001"; // Default demo customer if testing without login

    const body = await req.json();
    const {
      shippingAddress,
      courierName,
      courierService,
      shippingCost = 0,
      paymentMethod,
      couponCode,
      notes,
    } = body;

    if (!shippingAddress || !courierName || !paymentMethod) {
      return NextResponse.json(
        { message: "Alamat pengiriman, kurir, dan metode pembayaran wajib dipilih." },
        { status: 400 }
      );
    }

    const cart = dbRepository.cart.getCart(userId);
    const selectedItems = cart.items.filter((i) => i.isSelected);

    if (selectedItems.length === 0) {
      return NextResponse.json(
        { message: "Keranjang belanja kosong atau belum ada item yang dipilih." },
        { status: 400 }
      );
    }

    const subtotal = selectedItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

    let discountAmount = 0;
    if (couponCode) {
      const couponCheck = dbRepository.coupons.validate(couponCode, subtotal);
      if (couponCheck.valid) {
        discountAmount = couponCheck.discountAmount;
      }
    }

    const totalAmount = Math.max(0, subtotal + Number(shippingCost) - discountAmount);

    // 1. Prepare Order Items
    const orderItems = selectedItems.map((item) => ({
      id: `oi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderId: "", // Will be assigned by createOrder
      productId: item.productId,
      variantId: item.variantId || null,
      title: item.product.title + (item.variant ? ` (${item.variant.name})` : ""),
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
      image: item.product.images[0]?.url || "",
    }));

    // 2. Initialize Courier & Waybill
    const shippingProvider = getShippingProvider(courierName);
    const waybill = await shippingProvider.createWaybill({
      orderNumber: "TEMP",
      recipientName: shippingAddress.recipientName,
      recipientPhone: shippingAddress.phone,
      recipientAddress: shippingAddress.addressLine,
      destinationCity: shippingAddress.city,
      weightGrams: 1000,
      itemDescription: orderItems.map((i) => i.title).join(", "),
    });

    // 3. Create the Order
    const createdOrder = dbRepository.orders.createOrder({
      userId,
      user: {
        name: shippingAddress.recipientName,
        email: user?.email || "customer@rzstore.com",
        phone: shippingAddress.phone,
      },
      subtotal,
      shippingCost: Number(shippingCost),
      discountAmount,
      totalAmount,
      status: paymentMethod === "cod" ? "PROCESSING" : "PENDING_PAYMENT",
      notes: notes || null,
      shippingAddress,
      courierName,
      courierService: courierService || "Reguler",
      trackingNumber: waybill.trackingNumber,
      items: orderItems,
      couponCode: couponCode || null,
    });

    // 4. Initialize Payment
    const paymentProvider = getPaymentProvider(paymentMethod);
    const paymentResult = await paymentProvider.createPayment({
      orderNumber: createdOrder.orderNumber,
      amount: totalAmount,
      customerName: shippingAddress.recipientName,
      customerEmail: user?.email || "customer@rzstore.com",
      customerPhone: shippingAddress.phone,
      paymentMethod,
    });

    createdOrder.payment = {
      id: `pay_${Date.now()}`,
      orderId: createdOrder.id,
      paymentMethod: paymentResult.paymentMethod,
      paymentProvider: paymentProvider.name,
      amount: totalAmount,
      status: paymentResult.status,
      transactionId: paymentResult.transactionId,
      paidAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 5. Initialize Shipment
    createdOrder.shipment = {
      id: `shp_${Date.now()}`,
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      courier: courierName,
      service: courierService || "Reguler",
      trackingNumber: waybill.trackingNumber,
      status: "PENDING",
      recipientName: shippingAddress.recipientName,
      recipientPhone: shippingAddress.phone,
      recipientAddress: shippingAddress.addressLine,
      shippedAt: null,
      estimatedDelivery: new Date(Date.now() + 2 * 86400000).toISOString(),
      deliveredAt: null,
      trackings: [
        {
          id: `trk_${Date.now()}`,
          shipmentId: `shp_${Date.now()}`,
          status: "PENDING",
          description: "Pesanan berhasil dibuat. Menunggu konfirmasi pembayaran dan pengemasan gudang.",
          location: "Warehouse Jakarta",
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat!",
      order: createdOrder,
      paymentDetails: paymentResult,
    });
  } catch (err: unknown) {
    console.error("Create order error:", err);
    const message = err instanceof Error ? err.message : "Gagal memproses pembuatan pesanan.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
