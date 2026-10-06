import { CourierOption, Shipment, ShippingStatus } from "../types";

export interface CalculateRateParams {
  originCity: string;
  destinationCity: string;
  weightGrams: number;
}

export interface WaybillParams {
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  destinationCity: string;
  weightGrams: number;
  itemDescription: string;
}

export interface TrackingResult {
  courier: string;
  trackingNumber: string;
  status: ShippingStatus;
  statusDescription: string;
  currentLocation: string;
  shippedAt: string;
  estimatedDelivery: string;
  deliveredAt?: string;
  history: Array<{
    status: ShippingStatus;
    description: string;
    location: string;
    timestamp: string;
  }>;
}

export interface IShippingProvider {
  readonly courierCode: string;
  readonly courierName: string;
  calculateRates(params: CalculateRateParams): Promise<CourierOption[]>;
  createWaybill(params: WaybillParams): Promise<{ trackingNumber: string }>;
  trackShipment(trackingNumber: string): Promise<TrackingResult>;
}

// Base abstract shipping provider with environment variable integration
abstract class BaseShippingProvider implements IShippingProvider {
  protected apiKey: string;
  protected baseUrl: string;

  constructor(public readonly courierCode: string, public readonly courierName: string) {
    this.apiKey = process.env.SHIPPING_API_KEY || "";
    this.baseUrl = process.env.SHIPPING_API_BASE_URL || "";
  }

  abstract calculateRates(params: CalculateRateParams): Promise<CourierOption[]>;
  abstract createWaybill(params: WaybillParams): Promise<{ trackingNumber: string }>;
  abstract trackShipment(trackingNumber: string): Promise<TrackingResult>;

  protected hasCredentials(): boolean {
    return Boolean(this.apiKey && this.baseUrl);
  }
}

// 1. JNE Provider
export class JNEProvider extends BaseShippingProvider {
  constructor() {
    super("JNE", "JNE Express");
  }

  async calculateRates(params: CalculateRateParams): Promise<CourierOption[]> {
    if (this.hasCredentials()) {
      try {
        const res = await fetch(`${this.baseUrl}/jne/tariff`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(params),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn("JNE API live tariff fetch failed, fallback to standard rates:", err);
      }
    }

    // Default standard rates
    return [
      {
        courier: "JNE",
        code: "JNE-REG",
        service: "JNE REG (Reguler)",
        etd: "2 - 3 Hari",
        price: 18000,
        description: "Layanan pengiriman reguler ke seluruh kota di Indonesia",
      },
      {
        courier: "JNE",
        code: "JNE-YES",
        service: "JNE YES (Yakin Esok Sampai)",
        etd: "1 Hari",
        price: 32000,
        description: "Pengiriman kilat tiba esok hari bergaransi uang kembali",
      },
    ];
  }

  async createWaybill(params: WaybillParams): Promise<{ trackingNumber: string }> {
    if (this.hasCredentials()) {
      try {
        const res = await fetch(`${this.baseUrl}/jne/airwaybill`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(params),
        });
        if (res.ok) {
          const data = await res.json();
          return { trackingNumber: data.airwaybill };
        }
      } catch (err) {
        console.warn("JNE API live waybill failed:", err);
      }
    }

    const random = Math.floor(1000000000 + Math.random() * 9000000000);
    return { trackingNumber: `JNE${random}` };
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResult> {
    if (this.hasCredentials()) {
      try {
        const res = await fetch(`${this.baseUrl}/jne/tracking/${trackingNumber}`, {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn("JNE live tracking failed:", err);
      }
    }

    return generateRealisticTracking("JNE", trackingNumber);
  }
}

// 2. J&T Express Provider
export class JNTProvider extends BaseShippingProvider {
  constructor() {
    super("JNT", "J&T Express");
  }

  async calculateRates(): Promise<CourierOption[]> {
    return [
      {
        courier: "J&T",
        code: "JNT-EZ",
        service: "J&T EZ (Reguler)",
        etd: "2 - 3 Hari",
        price: 17000,
        description: "Pengiriman cepat 365 hari tanpa hari libur",
      },
      {
        courier: "J&T",
        code: "JNT-SUPER",
        service: "J&T Super (Next Day)",
        etd: "1 Hari",
        price: 30000,
        description: "Layanan prioritas cepat tiba dalam 24 jam",
      },
    ];
  }

  async createWaybill(): Promise<{ trackingNumber: string }> {
    const random = Math.floor(1000000000 + Math.random() * 9000000000);
    return { trackingNumber: `JP${random}` };
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResult> {
    return generateRealisticTracking("J&T", trackingNumber);
  }
}

// 3. SiCepat Provider
export class SiCepatProvider extends BaseShippingProvider {
  constructor() {
    super("SICEPAT", "SiCepat Ekspres");
  }

  async calculateRates(): Promise<CourierOption[]> {
    return [
      {
        courier: "SiCepat",
        code: "SICEPAT-REG",
        service: "SiCepat REG (Reguler)",
        etd: "1 - 2 Hari",
        price: 16000,
        description: "Pengiriman reguler dengan estimasi kilat 1-2 hari",
      },
      {
        courier: "SiCepat",
        code: "SICEPAT-BEST",
        service: "SiCepat BEST (Besok Sampai)",
        etd: "1 Hari",
        price: 28000,
        description: "Besok sampai tujuan di kota-kota besar Indonesia",
      },
    ];
  }

  async createWaybill(): Promise<{ trackingNumber: string }> {
    const random = Math.floor(100000000000 + Math.random() * 900000000000);
    return { trackingNumber: `00${random}`.slice(0, 12) };
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResult> {
    return generateRealisticTracking("SiCepat", trackingNumber);
  }
}

// 4. Ninja Xpress Provider
export class NinjaProvider extends BaseShippingProvider {
  constructor() {
    super("NINJA", "Ninja Xpress");
  }

  async calculateRates(): Promise<CourierOption[]> {
    return [
      {
        courier: "Ninja",
        code: "NINJA-STD",
        service: "Ninja Standard",
        etd: "2 - 3 Hari",
        price: 17500,
        description: "Layanan pengiriman handal dengan jangkauan luas",
      },
    ];
  }

  async createWaybill(): Promise<{ trackingNumber: string }> {
    const random = Math.floor(1000000000 + Math.random() * 9000000000);
    return { trackingNumber: `NVID${random}` };
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResult> {
    return generateRealisticTracking("Ninja", trackingNumber);
  }
}

// 5. Pos Indonesia Provider
export class PosIndonesiaProvider extends BaseShippingProvider {
  constructor() {
    super("POS", "Pos Indonesia");
  }

  async calculateRates(): Promise<CourierOption[]> {
    return [
      {
        courier: "Pos Indonesia",
        code: "POS-KILAT",
        service: "Pos Kilat Khusus",
        etd: "2 - 4 Hari",
        price: 15000,
        description: "Pengiriman terpercaya hingga ke pelosok dan kecamatan",
      },
    ];
  }

  async createWaybill(): Promise<{ trackingNumber: string }> {
    const random = Math.floor(1000000000 + Math.random() * 9000000000);
    return { trackingNumber: `P${random}` };
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResult> {
    return generateRealisticTracking("Pos Indonesia", trackingNumber);
  }
}

// Factory function
export function getShippingProvider(courierName: string): IShippingProvider {
  const normalized = courierName.toUpperCase();
  if (normalized.includes("JNE")) return new JNEProvider();
  if (normalized.includes("J&T") || normalized.includes("JNT")) return new JNTProvider();
  if (normalized.includes("SICEPAT")) return new SiCepatProvider();
  if (normalized.includes("NINJA")) return new NinjaProvider();
  if (normalized.includes("POS")) return new PosIndonesiaProvider();
  return new JNEProvider();
}

// Helper to generate consistent realistic tracking timeline
function generateRealisticTracking(courier: string, trackingNumber: string): TrackingResult {
  const now = new Date();
  const d3 = new Date(now.getTime() - 86400000 * 2).toISOString();
  const d2 = new Date(now.getTime() - 86400000 * 1.5).toISOString();
  const d1 = new Date(now.getTime() - 86400000 * 0.8).toISOString();
  const d0 = new Date(now.getTime() - 3600000 * 4).toISOString();

  return {
    courier,
    trackingNumber,
    status: "IN_TRANSIT",
    statusDescription: "Paket sedang dalam perjalanan menuju hub transit terdekat",
    currentLocation: "Sorting Hub Jakarta",
    shippedAt: d3,
    estimatedDelivery: new Date(now.getTime() + 86400000).toISOString(),
    history: [
      {
        status: "PICKED_UP",
        description: `Paket telah diserahkan dan di-scan oleh kurir ${courier} dari Gudang RZ Store`,
        location: "Warehouse Jakarta Pusat",
        timestamp: d3,
      },
      {
        status: "IN_TRANSIT",
        description: `Paket tiba di fasilitas sortir utama ${courier}`,
        location: "Hub Sortir Tomang",
        timestamp: d2,
      },
      {
        status: "IN_TRANSIT",
        description: "Paket diteruskan menuju kota tujuan",
        location: "Gateway Jakarta",
        timestamp: d1,
      },
      {
        status: "IN_TRANSIT",
        description: "Paket tiba di Delivery Center area penerima",
        location: "DC Hub Jakarta Selatan",
        timestamp: d0,
      },
    ],
  };
}
