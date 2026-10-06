import { PaymentMethodOption, PaymentStatus } from "../types";

export interface CreatePaymentParams {
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  paymentMethod: string;
}

export interface PaymentResult {
  transactionId: string;
  paymentMethod: string;
  amount: number;
  status: PaymentStatus;
  qrCodeUrl?: string;
  virtualAccountNumber?: string;
  bankName?: string;
  expiryTime: string;
  instructions: string[];
}

export interface IPaymentProvider {
  readonly code: string;
  readonly name: string;
  createPayment(params: CreatePaymentParams): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<{ isPaid: boolean; status: PaymentStatus }>;
}

abstract class BasePaymentProvider implements IPaymentProvider {
  protected serverKey: string;
  protected clientKey: string;
  protected baseUrl: string;

  constructor(public readonly code: string, public readonly name: string) {
    this.serverKey = process.env.PAYMENT_GATEWAY_SERVER_KEY || "";
    this.clientKey = process.env.PAYMENT_GATEWAY_CLIENT_KEY || "";
    this.baseUrl = process.env.PAYMENT_GATEWAY_BASE_URL || "https://api.sandbox.midtrans.com";
  }

  abstract createPayment(params: CreatePaymentParams): Promise<PaymentResult>;
  abstract verifyPayment(transactionId: string): Promise<{ isPaid: boolean; status: PaymentStatus }>;

  protected hasCredentials(): boolean {
    return Boolean(this.serverKey && this.baseUrl);
  }
}

// 1. QRIS Payment Provider
export class QRISProvider extends BasePaymentProvider {
  constructor() {
    super("QRIS", "QRIS Instant (GoPay, OVO, ShopeePay, Dana, BCA)");
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    const txId = `QRIS-${params.orderNumber}-${Date.now()}`;
    const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    return {
      transactionId: txId,
      paymentMethod: "QRIS",
      amount: params.amount,
      status: "PENDING",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226610016ID.CO.RZSTORE.WWW01189360000000000000005204581253033605802ID5912RZ%20STORE6007JAKARTA6304ABCD",
      expiryTime: expiry,
      instructions: [
        "Buka aplikasi perbankan atau e-wallet (BCA, Mandiri, GoPay, OVO, DANA, dll).",
        "Pilih menu 'Scan QR' atau 'Bayar dengan QRIS'.",
        "Scan kode QR yang tampil di layar Anda.",
        "Periksa nominal pembayaran dan nama merchant 'RZ STORE'.",
        "Masukkan PIN transaksi Anda untuk menyelesaikan pembayaran.",
      ],
    };
  }

  async verifyPayment(transactionId: string): Promise<{ isPaid: boolean; status: PaymentStatus }> {
    return { isPaid: true, status: "PAID" };
  }
}

// 2. Virtual Account Payment Provider
export class VirtualAccountProvider extends BasePaymentProvider {
  constructor(private bank: string = "BCA") {
    super(`VA_${bank}`, `${bank} Virtual Account`);
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    const txId = `VA-${this.bank}-${params.orderNumber}`;
    const vaNumber = `88099${Math.floor(10000000 + Math.random() * 90000000)}`;
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return {
      transactionId: txId,
      paymentMethod: `Virtual Account (${this.bank})`,
      amount: params.amount,
      status: "PENDING",
      virtualAccountNumber: vaNumber,
      bankName: this.bank,
      expiryTime: expiry,
      instructions: [
        `Masuk ke aplikasi mobile banking atau ATM ${this.bank}.`,
        "Pilih menu Transfer > Virtual Account.",
        `Masukkan nomor Virtual Account: ${vaNumber}.`,
        "Pastikan nama penerima tertulis 'RZ STORE - " + params.customerName + "'.",
        "Konfirmasi dan selesaikan transaksi pembayaran.",
      ],
    };
  }

  async verifyPayment(): Promise<{ isPaid: boolean; status: PaymentStatus }> {
    return { isPaid: true, status: "PAID" };
  }
}

// 3. Bank Transfer Manual Provider
export class BankTransferProvider extends BasePaymentProvider {
  constructor() {
    super("MANUAL_TRANSFER", "Bank Transfer (Konfirmasi Manual)");
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    const txId = `TRF-${params.orderNumber}-${Date.now()}`;
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return {
      transactionId: txId,
      paymentMethod: "Bank Transfer BCA",
      amount: params.amount,
      status: "PENDING",
      virtualAccountNumber: "522-039-4411 (BCA)",
      bankName: "Bank Central Asia (BCA) a.n PT RZ E-Commerce Group",
      expiryTime: expiry,
      instructions: [
        "Transfer nominal tepat hingga 3 digit terakhir ke rekening BCA 522-039-4411 a.n PT RZ E-Commerce Group.",
        "Simpan struk atau tangkapan layar bukti transfer Anda.",
        "Upload bukti transfer pada halaman detail pesanan atau konfirmasi via WhatsApp CS.",
      ],
    };
  }

  async verifyPayment(): Promise<{ isPaid: boolean; status: PaymentStatus }> {
    return { isPaid: true, status: "PAID" };
  }
}

// 4. E-Wallet Provider
export class EWalletProvider extends BasePaymentProvider {
  constructor(private walletType: string = "GOPAY") {
    super(`EWALLET_${walletType}`, walletType);
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    const txId = `EW-${this.walletType}-${params.orderNumber}`;
    const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return {
      transactionId: txId,
      paymentMethod: `E-Wallet (${this.walletType})`,
      amount: params.amount,
      status: "PENDING",
      expiryTime: expiry,
      instructions: [
        `Anda akan dialihkan ke aplikasi ${this.walletType} untuk konfirmasi pembayaran.`,
        "Periksa kembali total pembayaran sebesar Rp " + params.amount.toLocaleString("id-ID"),
        "Selesaikan pembayaran sebelum batas waktu berakhir.",
      ],
    };
  }

  async verifyPayment(): Promise<{ isPaid: boolean; status: PaymentStatus }> {
    return { isPaid: true, status: "PAID" };
  }
}

// 5. COD (Cash on Delivery) Provider
export class CODProvider extends BasePaymentProvider {
  constructor() {
    super("COD", "Bayar di Tempat (COD)");
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    const txId = `COD-${params.orderNumber}`;
    return {
      transactionId: txId,
      paymentMethod: "Bayar di Tempat (COD)",
      amount: params.amount,
      status: "PENDING",
      expiryTime: new Date(Date.now() + 7 * 86400000).toISOString(),
      instructions: [
        "Siapkan uang tunai pas saat kurir mengantarkan paket ke alamat Anda.",
        "Pastikan ada penerima di tempat saat kurir melakukan pengantaran.",
        "Periksa kondisi kemasan paket sebelum membayar kurir.",
      ],
    };
  }

  async verifyPayment(): Promise<{ isPaid: boolean; status: PaymentStatus }> {
    return { isPaid: false, status: "PENDING" };
  }
}

// Factory
export function getPaymentProvider(methodId: string): IPaymentProvider {
  const norm = methodId.toUpperCase();
  if (norm.includes("QRIS")) return new QRISProvider();
  if (norm.includes("BCA_VA") || norm.includes("VA")) return new VirtualAccountProvider("BCA");
  if (norm.includes("MANDIRI_VA")) return new VirtualAccountProvider("Mandiri");
  if (norm.includes("BRI_VA")) return new VirtualAccountProvider("BRI");
  if (norm.includes("BNI_VA")) return new VirtualAccountProvider("BNI");
  if (norm.includes("TRANSFER") || norm.includes("BANK")) return new BankTransferProvider();
  if (norm.includes("GOPAY")) return new EWalletProvider("GoPay");
  if (norm.includes("OVO")) return new EWalletProvider("OVO");
  if (norm.includes("DANA")) return new EWalletProvider("DANA");
  if (norm.includes("COD")) return new CODProvider();
  return new QRISProvider();
}

// Supported options list for UI
export const AVAILABLE_PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "qris",
    name: "QRIS (GoPay, OVO, Dana, ShopeePay, Mobile Banking)",
    category: "QRIS",
    icon: "QrCode",
    instructions: "Scan instan dengan aplikasi e-wallet atau mobile banking apa saja.",
  },
  {
    id: "bca_va",
    name: "BCA Virtual Account",
    category: "VIRTUAL_ACCOUNT",
    icon: "CreditCard",
    instructions: "Otomatis terverifikasi 24 jam nonstop.",
  },
  {
    id: "mandiri_va",
    name: "Mandiri Virtual Account",
    category: "VIRTUAL_ACCOUNT",
    icon: "CreditCard",
    instructions: "Otomatis terverifikasi 24 jam nonstop via Livin' by Mandiri.",
  },
  {
    id: "bni_va",
    name: "BNI Virtual Account",
    category: "VIRTUAL_ACCOUNT",
    icon: "CreditCard",
    instructions: "Otomatis terverifikasi via BNI Mobile Banking / ATM.",
  },
  {
    id: "bri_va",
    name: "BRI Virtual Account (BRIVA)",
    category: "VIRTUAL_ACCOUNT",
    icon: "CreditCard",
    instructions: "Otomatis terverifikasi via BRImo / ATM BRI.",
  },
  {
    id: "gopay",
    name: "GoPay",
    category: "E_WALLET",
    icon: "Smartphone",
    instructions: "Bayar cepat menggunakan saldo GoPay atau GoPay Coins.",
  },
  {
    id: "dana",
    name: "DANA",
    category: "E_WALLET",
    icon: "Smartphone",
    instructions: "Bayar instan dengan akun DANA Anda.",
  },
  {
    id: "bank_transfer",
    name: "Transfer Bank Manual (BCA)",
    category: "BANK_TRANSFER",
    icon: "Building2",
    instructions: "Transfer langsung ke rekening BCA PT RZ E-Commerce Group.",
    accountNumber: "522-039-4411",
    accountName: "PT RZ E-Commerce Group",
  },
  {
    id: "cod",
    name: "Bayar di Tempat (COD)",
    category: "COD",
    icon: "Truck",
    instructions: "Bayar tunai kepada kurir saat pesanan tiba di tangan Anda.",
  },
];
