import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  User,
  Address,
  Category,
  Brand,
  Product,
  Cart,
  CartItem,
  Wishlist,
  Order,
  OrderItem,
  Payment,
  Shipment,
  ShipmentTracking,
  Coupon,
  Review,
  Banner,
  Notification,
  OrderStatus,
  ShippingStatus,
  PaymentStatus,
} from "./types";

const DATA_FILE = path.join(process.cwd(), "prisma", "data.json");

interface DatabaseSchema {
  users: User[];
  addresses: Address[];
  categories: Category[];
  brands: Brand[];
  products: Product[];
  carts: Record<string, CartItem[]>; // userId -> items
  wishlists: Record<string, string[]>; // userId -> productIds
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  banners: Banner[];
  notifications: Notification[];
}

// Ensure database file exists with realistic seed data
function initDatabase(): DatabaseSchema {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content) as DatabaseSchema;
    } catch (err) {
      console.warn("Failed to read data.json, re-seeding default database:", err);
    }
  }

  // Create initial demo dataset
  const hashedAdminPassword = bcrypt.hashSync("admin123", 10);
  const hashedUserPassword = bcrypt.hashSync("user123", 10);

  const adminUser: User = {
    id: "usr_admin_001",
    name: "Admin Operasional RZ",
    email: "admin@rzstore.com",
    password: hashedAdminPassword,
    phone: "081299990001",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const customerUser: User = {
    id: "usr_cust_001",
    name: "Budi Santoso",
    email: "customer@rzstore.com",
    password: hashedUserPassword,
    phone: "081388887777",
    role: "CUSTOMER",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const customerAddress: Address = {
    id: "addr_001",
    userId: "usr_cust_001",
    recipientName: "Budi Santoso",
    phone: "081388887777",
    addressLine: "Jl. Sudirman No. 45 Kav 2, Kel. Senayan, Kec. Kebayoran Baru",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postalCode: "12190",
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const categories: Category[] = [
    {
      id: "cat_1",
      name: "Fashion",
      slug: "fashion",
      description: "Pakaian pria, wanita, sepatu, tas, dan aksesoris gaya modern",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80",
      icon: "Shirt",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat_2",
      name: "Elektronik & Gadget",
      slug: "elektronik-gadget",
      description: "Smartphone, tablet, audio, TV, smart devices, dan kamera",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      icon: "Smartphone",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat_3",
      name: "Home & Living",
      slug: "home-living",
      description: "Perabot rumah tangga, dekorasi estetik, dapur, dan perlengkapan tidur",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      icon: "Home",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat_4",
      name: "Kecantikan",
      slug: "kecantikan",
      description: "Skincare, kosmetik, perawatan rambut, dan wewangian original",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      icon: "Sparkles",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat_5",
      name: "Olahraga & Outdoor",
      slug: "olahraga-outdoor",
      description: "Peralatan gym, lari, bersepeda, camping, dan pakaian olahraga",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      icon: "Activity",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat_6",
      name: "Ibu & Bayi",
      slug: "ibu-bayi",
      description: "Perlengkapan bayi, popok, susu, pakaian anak, dan mainan edukasi",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80",
      icon: "Baby",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat_7",
      name: "Komputer & Aksesoris",
      slug: "komputer-aksesoris",
      description: "Laptop, PC desktop, monitor, keyboard mekanikal, dan peripheral",
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop&q=80",
      icon: "Laptop",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat_8",
      name: "Makanan & Minuman",
      slug: "makanan-minuman",
      description: "Snack premium, kopi spesialti, teh organik, dan bahan dapur sehat",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
      icon: "Coffee",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const brands: Brand[] = [
    { id: "br_1", name: "RZ Official", slug: "rz-official", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "br_2", name: "Apple", slug: "apple", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "br_3", name: "Samsung", slug: "samsung", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "br_4", name: "Sony", slug: "sony", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "br_5", name: "Nike", slug: "nike", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "br_6", name: "Eiger", slug: "eiger", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "br_7", name: "Philips", slug: "philips", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "br_8", name: "Somethinc", slug: "somethinc", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "br_9", name: "Logitech", slug: "logitech", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "br_10", name: "Nescafe", slug: "nescafe", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  const products: Product[] = [
    // 1
    {
      id: "prod_1",
      title: "Apple iPhone 15 Pro 128GB Garansi Resmi iBox",
      slug: "apple-iphone-15-pro-128gb",
      description: "iPhone 15 Pro dirancang dengan titanium sekelas dirgantara yang kuat dan ringan dengan tombol Tindakan yang dapat disesuaikan serta chip A17 Pro bertenaga luar biasa.",
      specifications: "Chipset: A17 Pro (3nm)\nRAM: 8GB\nLayar: 6.1 inci Super Retina XDR OLED 120Hz ProMotion\nKamera Utama: 48 MP Sony IMX803\nBaterai: 3274 mAh, USB-C 3.0",
      price: 18999000,
      originalPrice: 20999000,
      discountPercent: 10,
      categoryId: "cat_2",
      brandId: "br_2",
      stock: 45,
      soldCount: 320,
      rating: 4.9,
      reviewCount: 142,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_1_1", productId: "prod_1", url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
        { id: "img_1_2", productId: "prod_1", url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80", isPrimary: false, order: 1 },
      ],
      variants: [
        { id: "var_1_1", productId: "prod_1", name: "Natural Titanium 128GB", price: 18999000, stock: 20, sku: "IP15P-NT-128" },
        { id: "var_1_2", productId: "prod_1", name: "Black Titanium 128GB", price: 18999000, stock: 25, sku: "IP15P-BT-128" },
      ],
    },
    // 2
    {
      id: "prod_2",
      title: "Samsung Galaxy S24 Ultra 5G 12GB/256GB AI Phone",
      slug: "samsung-galaxy-s24-ultra-5g",
      description: "Era baru Galaxy AI hadir dengan Samsung Galaxy S24 Ultra. Dilengkapi bodi titanium, kamera 200MP revolusioner, dan S Pen terintegrasi.",
      specifications: "Chipset: Snapdragon 8 Gen 3 for Galaxy\nRAM: 12GB\nLayar: 6.8 inch Dynamic LTPO AMOLED 2X 120Hz 2600 nits\nKamera: 200MP + 50MP Periscope + 10MP Tele + 12MP UW\nBaterai: 5000 mAh 45W",
      price: 19499000,
      originalPrice: 21999000,
      discountPercent: 11,
      categoryId: "cat_2",
      brandId: "br_3",
      stock: 30,
      soldCount: 215,
      rating: 4.9,
      reviewCount: 98,
      isFeatured: true,
      isFlashSale: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_2_1", productId: "prod_2", url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 3
    {
      id: "prod_3",
      title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      slug: "sony-wh-1000xm5-wireless-headphones",
      description: "Headphone over-ear peredam bising terdepan di industri dengan dua prosesor dan delapan mikrofon untuk kualitas suara fidelitas tinggi yang tak tertandingi.",
      specifications: "Driver: 30mm Neodymium\nBattery Life: Up to 30 Jam ANC ON\nBluetooth: 5.2 dengan LDAC Hi-Res Audio\nBerat: 250 gram",
      price: 4999000,
      originalPrice: 5999000,
      discountPercent: 17,
      categoryId: "cat_2",
      brandId: "br_4",
      stock: 25,
      soldCount: 180,
      rating: 4.8,
      reviewCount: 88,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_3_1", productId: "prod_3", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 4
    {
      id: "prod_4",
      title: "Apple Watch Series 9 GPS 45mm Midnight Aluminium",
      slug: "apple-watch-series-9-gps-45mm",
      description: "Smarter, brighter, mightier. Apple Watch Series 9 dibekali chip S9 SiP yang bertenaga, gerakan ketuk dua kali magis, dan layar super cerah.",
      specifications: "Layar: Always-On Retina OLED 2000 nits\nProcessor: S9 SiP 64-bit dual core\nSensors: Blood Oxygen, ECG, Temperature sensing\nTahan Air: 50m water resistant",
      price: 6899000,
      originalPrice: 7999000,
      discountPercent: 14,
      categoryId: "cat_2",
      brandId: "br_2",
      stock: 40,
      soldCount: 150,
      rating: 4.8,
      reviewCount: 64,
      isFeatured: false,
      isFlashSale: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_4_1", productId: "prod_4", url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 5
    {
      id: "prod_5",
      title: "MacBook Air 15 Inch M3 Chip 16GB 512GB SSD",
      slug: "macbook-air-15-inch-m3-chip",
      description: "MacBook Air 15 inci sangat ramping dan cepat dengan chip M3, daya tahan baterai hingga 18 jam, dan layar Liquid Retina yang luas dan tajam.",
      specifications: "Chip: Apple M3 8-core CPU 10-core GPU\nMemori: 16GB Unified Memory\nPenyimpanan: 512GB SSD Superfast\nLayar: 15.3 inch Liquid Retina 500 nits",
      price: 23999000,
      originalPrice: 25999000,
      discountPercent: 8,
      categoryId: "cat_7",
      brandId: "br_2",
      stock: 20,
      soldCount: 95,
      rating: 5.0,
      reviewCount: 45,
      isFeatured: true,
      isFlashSale: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_5_1", productId: "prod_5", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 6
    {
      id: "prod_6",
      title: "Logitech MX Master 3S Wireless Performance Mouse",
      slug: "logitech-mx-master-3s-mouse",
      description: "Mouse performa ikonik yang diperbarui dengan Quiet Clicks dan sensor 8.000 DPI track-on-glass untuk presisi dan kenyamanan maksimal saat bekerja.",
      specifications: "DPI: 200 hingga 8000 DPI\nSensor: Darkfield high precision\nKonektivitas: Bluetooth Low Energy & Logi Bolt USB\nBaterai: Isi ulang Li-Po 500 mAh (hingga 70 hari)",
      price: 1499000,
      originalPrice: 1799000,
      discountPercent: 17,
      categoryId: "cat_7",
      brandId: "br_9",
      stock: 60,
      soldCount: 450,
      rating: 4.9,
      reviewCount: 210,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_6_1", productId: "prod_6", url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 7
    {
      id: "prod_7",
      title: "RZ Pro USB-C 8-in-1 Hub Multiport Aluminum Adapter 4K",
      slug: "rz-pro-usb-c-8-in-1-hub",
      description: "Adapter USB-C serbaguna resmi dari RZ Official dengan port HDMI 4K@60Hz, Gigabit Ethernet, 100W PD charging, 3x USB 3.0, dan SD/TF Card reader.",
      specifications: "Material: Premium Matte Aluminum\nOutput: HDMI 4K@60Hz, 3x USB-A 5Gbps, RJ45 1000Mbps, SD/TF, 100W PD Pass-through\nKompatibilitas: Mac, Windows, iPad, Steam Deck",
      price: 499000,
      originalPrice: 750000,
      discountPercent: 33,
      categoryId: "cat_7",
      brandId: "br_1",
      stock: 120,
      soldCount: 680,
      rating: 4.8,
      reviewCount: 290,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_7_1", productId: "prod_7", url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 8
    {
      id: "prod_8",
      title: "RZ Classic Heavyweight Oversized T-Shirt 24s Navy",
      slug: "rz-classic-heavyweight-oversized-tshirt",
      description: "Kaos oversized signature RZ Store dibuat dari 100% combed cotton premium 240 GSM. Potongan dropped-shoulder yang jatuh sempurna dan nyaman dipakai seharian.",
      specifications: "Bahan: 100% Cotton Combed 24s 240 GSM\nFitting: Modern Oversized Boxy Fit\nRib: 1x1 Heavy Cotton Collar anti melar\nWarna: Signature Deep Navy",
      price: 189000,
      originalPrice: 250000,
      discountPercent: 24,
      categoryId: "cat_1",
      brandId: "br_1",
      stock: 200,
      soldCount: 1250,
      rating: 4.9,
      reviewCount: 520,
      isFeatured: true,
      isFlashSale: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_8_1", productId: "prod_8", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
      variants: [
        { id: "var_8_1", productId: "prod_8", name: "Navy - M", price: 189000, stock: 50, sku: "RZ-TSH-M" },
        { id: "var_8_2", productId: "prod_8", name: "Navy - L", price: 189000, stock: 80, sku: "RZ-TSH-L" },
        { id: "var_8_3", productId: "prod_8", name: "Navy - XL", price: 189000, stock: 70, sku: "RZ-TSH-XL" },
      ],
    },
    // 9
    {
      id: "prod_9",
      title: "Nike Air Jordan 1 Low Retro OG Black White",
      slug: "nike-air-jordan-1-low-retro",
      description: "Sneaker legendaris dengan desain low-top serbaguna, material kulit premium, bantalan Air-Sole tersembunyi, dan outsole karet tahan lama.",
      specifications: "Upper: Premium Genuine Leather\nMidsole: Encapsulated Air-Sole Unit\nOutsole: Solid Rubber Cupsole\nKode: CZ0790-100",
      price: 2199000,
      originalPrice: 2499000,
      discountPercent: 12,
      categoryId: "cat_1",
      brandId: "br_5",
      stock: 35,
      soldCount: 310,
      rating: 4.8,
      reviewCount: 140,
      isFeatured: true,
      isFlashSale: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_9_1", productId: "prod_9", url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
      variants: [
        { id: "var_9_1", productId: "prod_9", name: "Size 41", price: 2199000, stock: 10, sku: "AJ1-41" },
        { id: "var_9_2", productId: "prod_9", name: "Size 42", price: 2199000, stock: 15, sku: "AJ1-42" },
        { id: "var_9_3", productId: "prod_9", name: "Size 43", price: 2199000, stock: 10, sku: "AJ1-43" },
      ],
    },
    // 10
    {
      id: "prod_10",
      title: "Nike Club Fleece Pullover Hoodie Full Navy",
      slug: "nike-club-fleece-pullover-hoodie",
      description: "Hoodie fleece favorit semua orang dengan kenyamanan ekstra, rajutan halus di bagian luar dan bagian dalam yang sangat lembut untuk cuaca dingin.",
      specifications: "Bahan: 80% Katun, 20% Poliester Fleece\nFit: Standard Fit kasual\nFitur: Kantong kanguru, tali serut tudung",
      price: 799000,
      originalPrice: 999000,
      discountPercent: 20,
      categoryId: "cat_1",
      brandId: "br_5",
      stock: 45,
      soldCount: 220,
      rating: 4.7,
      reviewCount: 95,
      isFeatured: false,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_10_1", productId: "prod_10", url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 11
    {
      id: "prod_11",
      title: "Philips Air Fryer Digital HD9252/90 Rapid Air 4.1L",
      slug: "philips-air-fryer-digital-hd9252",
      description: "Goreng makanan lezat dengan hingga 90% lebih sedikit lemak menggunakan teknologi Rapid Air eksklusif dari Philips. Dilengkapi layar sentuh dengan 7 preset memasak.",
      specifications: "Daya: 1400 Watt\nKapasitas: 4.1 Liter (0.8 kg kentang goreng)\nFitur: Touch screen digital, QuickClean basket, Auto shut-off\nGaransi: Resmi Philips 2 Tahun",
      price: 1299000,
      originalPrice: 1699000,
      discountPercent: 24,
      categoryId: "cat_3",
      brandId: "br_7",
      stock: 40,
      soldCount: 420,
      rating: 4.9,
      reviewCount: 185,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_11_1", productId: "prod_11", url: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 12
    {
      id: "prod_12",
      title: "RZ Minimalist Ergonomic Mesh Office Chair with Lumbar Support",
      slug: "rz-minimalist-ergonomic-office-chair",
      description: "Kursi kantor ergonomis dengan sandaran jaring breathable premium, penyangga punggung bawah lumbar dinamis, dan hidrolik kelas dunia untuk duduk sehat berjam-jam.",
      specifications: "Rangka: Heavy-duty nylon base kelas industri\nBantalan: High-density molded foam empuk\nFitur: Reclining 135 derajat, 3D Adjustable Armrest, Gaslift Class 4",
      price: 1450000,
      originalPrice: 1950000,
      discountPercent: 26,
      categoryId: "cat_3",
      brandId: "br_1",
      stock: 30,
      soldCount: 290,
      rating: 4.8,
      reviewCount: 110,
      isFeatured: true,
      isFlashSale: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_12_1", productId: "prod_12", url: "https://images.unsplash.com/photo-1580481077195-c328ad4f740a?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 13
    {
      id: "prod_13",
      title: "Somethinc Calm Down! Skinpair Barrier Serum 30ml",
      slug: "somethinc-calm-down-skinpair-barrier-serum",
      description: "Serum penenang kulit sensitif dan perbaikan skin barrier dengan formula paten CalmDown & Madagascar Centella Asiatica. Meredakan kemerahan dalam hitungan menit.",
      specifications: "Ukuran: 30 ml\nBahan Utama: CalmDown, Centella Asiatica, Panthenol\nCocok Untuk: Semua jenis kulit, terutama kulit berjerawat dan sensitif\nBPOM: NA18230101234",
      price: 119000,
      originalPrice: 149000,
      discountPercent: 20,
      categoryId: "cat_4",
      brandId: "br_8",
      stock: 150,
      soldCount: 2300,
      rating: 4.9,
      reviewCount: 890,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_13_1", productId: "prod_13", url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 14
    {
      id: "prod_14",
      title: "Nike Pegasus 40 Men's Road Running Shoes Navy",
      slug: "nike-pegasus-40-mens-running-shoes",
      description: "Sepatu lari andalan pelari dunia dengan teknologi busa Nike React responsif dan unit ganda Zoom Air untuk transisi langkah yang bertenaga dan stabil.",
      specifications: "Teknologi: Dual Zoom Air (forefoot & heel) + React Foam\nUpper: Engineered Mesh sejuk bersirkulasi tinggi\nBerat: 288g (Size 42)\nTipe Lari: Daily road running, marathon",
      price: 1699000,
      originalPrice: 2099000,
      discountPercent: 19,
      categoryId: "cat_5",
      brandId: "br_5",
      stock: 30,
      soldCount: 380,
      rating: 4.9,
      reviewCount: 145,
      isFeatured: true,
      isFlashSale: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_14_1", productId: "prod_14", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 15
    {
      id: "prod_15",
      title: "Stroller Bayi Lipat Cabin Size Otomatis One-Hand Fold",
      slug: "stroller-bayi-lipat-cabin-size",
      description: "Kereta dorong bayi pintar yang melipat otomatis dengan satu sentuhan. Ringan dan muat di bagasi kabin pesawat, dilengkapi suspensi 4 roda lembut.",
      specifications: "Usia: Newborn hingga 4 Tahun (Beban max 22 kg)\nBerat Stroller: Hanya 5.9 kg\nFitur: Sandaran rebah 175°, kanopi UV50+, rem satu pijakan",
      price: 1290000,
      originalPrice: 1750000,
      discountPercent: 26,
      categoryId: "cat_6",
      brandId: null,
      stock: 25,
      soldCount: 160,
      rating: 4.9,
      reviewCount: 68,
      isFeatured: true,
      isFlashSale: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_15_1", productId: "prod_15", url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
    },
    // 16
    {
      id: "prod_16",
      title: "Biji Kopi Arabika Gayo Aceh Specialty Roast 500gr",
      slug: "biji-kopi-arabika-gayo-aceh-500gr",
      description: "Kopi Arabika single origin dataran tinggi Gayo Aceh dengan proses wash halus. Karakter rasa kaya aroma buah, cokelat manis, dan tingkat keasaman seimbang.",
      specifications: "Origin: Takengon, Gayo, Aceh (1400-1600 mdpl)\nProses: Full Washed\nRoast Level: Medium Roast\nBerat: 500 gram kemasan one-way valve ziplock",
      price: 135000,
      originalPrice: 165000,
      discountPercent: 18,
      categoryId: "cat_8",
      brandId: null,
      stock: 120,
      soldCount: 1450,
      rating: 4.9,
      reviewCount: 620,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        { id: "img_16_1", productId: "prod_16", url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 },
      ],
      variants: [
        { id: "var_16_1", productId: "prod_16", name: "Biji Utuh (Whole Bean)", price: 135000, stock: 60, sku: "GAYO-WB" },
        { id: "var_16_2", productId: "prod_16", name: "Giling Sedang (Filter)", price: 135000, stock: 60, sku: "GAYO-GRD" },
      ],
    },
  ];

  // Fill in category and brand objects for products
  products.forEach((p) => {
    p.category = categories.find((c) => c.id === p.categoryId);
    p.brand = brands.find((b) => b.id === p.brandId) || null;
  });

  const coupons: Coupon[] = [
    {
      id: "cp_1",
      code: "RZHEMAT50",
      description: "Diskon 50% potongan maksimal Rp 50.000",
      discountType: "PERCENT",
      discountValue: 50,
      minPurchase: 100000,
      maxDiscount: 50000,
      quota: 500,
      usedCount: 42,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      isActive: true,
    },
    {
      id: "cp_2",
      code: "GRATISONGKIR",
      description: "Potongan ongkos kirim Rp 20.000 untuk belanja min Rp 200.000",
      discountType: "FIXED",
      discountValue: 20000,
      minPurchase: 200000,
      maxDiscount: 20000,
      quota: 1000,
      usedCount: 185,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      isActive: true,
    },
    {
      id: "cp_3",
      code: "WELCOME2026",
      description: "Voucher pengguna baru potongan Rp 25.000",
      discountType: "FIXED",
      discountValue: 25000,
      minPurchase: 50000,
      maxDiscount: 25000,
      quota: 300,
      usedCount: 12,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 60).toISOString(),
      isActive: true,
    },
  ];

  const banners: Banner[] = [
    {
      id: "bn_1",
      title: "Semua Kebutuhanmu Dalam Satu Tempat",
      subtitle: "Fashion, Elektronik, Home & Living, Kecantikan, dan banyak lagi.",
      badgeText: "Koleksi Terbaru 2026",
      ctaText: "Jelajahi Sekarang",
      link: "/shop",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80",
      isActive: true,
      order: 1,
    },
    {
      id: "bn_2",
      title: "Flash Sale Terbesar Pekan Ini",
      subtitle: "Dapatkan diskon hingga 70% untuk ratusan gadget dan apparel original.",
      badgeText: "Diskon s/d 70%",
      ctaText: "Serbu Promo",
      link: "/shop?flashSale=true",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80",
      isActive: true,
      order: 2,
    },
    {
      id: "bn_3",
      title: "Belanja Nyaman, Pengiriman Cepat",
      subtitle: "Gratis Ongkir ke seluruh wilayah Indonesia dengan kurir terpercaya.",
      badgeText: "Gratis Ongkir",
      ctaText: "Mulai Belanja",
      link: "/shop",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&auto=format&fit=crop&q=80",
      isActive: true,
      order: 3,
    },
  ];

  const seededOrder: Order = {
    id: "ord_001",
    orderNumber: "RZ-20261007-00125",
    userId: "usr_cust_001",
    user: { name: "Budi Santoso", email: "customer@rzstore.com", phone: "081388887777" },
    subtotal: 18999000,
    shippingCost: 0,
    discountAmount: 50000,
    totalAmount: 18949000,
    status: "SHIPPED",
    notes: "Mohon ditangani dengan hati-hati, paket barang bernilai tinggi.",
    shippingAddress: customerAddress,
    courierName: "JNE",
    courierService: "JNE YES (Yakin Esok Sampai)",
    trackingNumber: "JNE982736411029",
    couponCode: "RZHEMAT50",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    items: [
      {
        id: "item_001",
        orderId: "ord_001",
        productId: "prod_1",
        title: "Apple iPhone 15 Pro 128GB Garansi Resmi iBox",
        price: 18999000,
        quantity: 1,
        subtotal: 18999000,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      },
    ],
    payment: {
      id: "pay_001",
      orderId: "ord_001",
      paymentMethod: "Virtual Account (BCA)",
      paymentProvider: "BCA Virtual Account",
      amount: 18949000,
      status: "PAID",
      transactionId: "TX-BCA-88991244",
      paidAt: new Date(Date.now() - 3600000 * 23).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 23).toISOString(),
    },
    shipment: {
      id: "shp_001",
      orderId: "ord_001",
      orderNumber: "RZ-20261007-00125",
      courier: "JNE",
      service: "JNE YES",
      trackingNumber: "JNE982736411029",
      status: "IN_TRANSIT",
      recipientName: "Budi Santoso",
      recipientPhone: "081388887777",
      recipientAddress: "Jl. Sudirman No. 45 Kav 2, Jakarta Selatan",
      shippedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      estimatedDelivery: new Date(Date.now() + 3600000 * 12).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      trackings: [
        {
          id: "trk_001",
          shipmentId: "shp_001",
          status: "PICKED_UP",
          description: "Paket telah dijemput oleh kurir JNE dari Gudang Utama RZ Store Jakarta",
          location: "Gudang Utama Jakarta",
          timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        },
        {
          id: "trk_002",
          shipmentId: "shp_001",
          status: "IN_TRANSIT",
          description: "Paket tiba di sorting hub JNE Tomang dan diproses menuju hub tujuan",
          location: "Sorting Hub Tomang",
          timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
        },
        {
          id: "trk_003",
          shipmentId: "shp_001",
          status: "IN_TRANSIT",
          description: "Paket sedang dalam perjalanan menuju delivery center Jakarta Selatan",
          location: "Transit Hub Selatan",
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
      ],
    },
  };

  const initialData: DatabaseSchema = {
    users: [adminUser, customerUser],
    addresses: [customerAddress],
    categories,
    brands,
    products,
    carts: {
      usr_cust_001: [
        {
          id: "cart_item_001",
          cartId: "cart_001",
          productId: "prod_8",
          product: products.find((p) => p.id === "prod_8")!,
          quantity: 1,
          isSelected: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    wishlists: {
      usr_cust_001: ["prod_1", "prod_3"],
    },
    orders: [seededOrder],
    coupons,
    reviews: [
      {
        id: "rev_001",
        productId: "prod_1",
        userId: "usr_cust_001",
        userName: "Budi Santoso",
        rating: 5,
        comment: "Kualitas barang sangat bagus, original garansi iBox resmi. Pengiriman cepat dan packaging aman berlapis bubble wrap tebal!",
        isAnonymous: false,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    banners,
    notifications: [],
  };

  // Ensure prisma directory exists
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), "utf-8");
  return initialData;
}

// In-memory state with file persistence
let db = initDatabase();

function saveDatabase(): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist database file:", err);
  }
}

// -----------------------------------------------------------------------------
// Database Repository Methods
// -----------------------------------------------------------------------------

export const dbRepository = {
  // --- USERS ---
  users: {
    findByEmail: (email: string): User | undefined => {
      return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    },
    findById: (id: string): User | undefined => {
      return db.users.find((u) => u.id === id);
    },
    create: (user: Omit<User, "id" | "createdAt" | "updatedAt">): User => {
      const newUser: User = {
        ...user,
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.users.push(newUser);
      saveDatabase();
      return newUser;
    },
    update: (id: string, updates: Partial<User>): User | undefined => {
      const user = db.users.find((u) => u.id === id);
      if (!user) return undefined;
      Object.assign(user, updates, { updatedAt: new Date().toISOString() });
      saveDatabase();
      return user;
    },
    getAll: (): User[] => [...db.users],
  },

  // --- ADDRESSES ---
  addresses: {
    getByUserId: (userId: string): Address[] => {
      return db.addresses.filter((a) => a.userId === userId);
    },
    create: (addr: Omit<Address, "id" | "createdAt" | "updatedAt">): Address => {
      if (addr.isDefault) {
        db.addresses.filter((a) => a.userId === addr.userId).forEach((a) => (a.isDefault = false));
      }
      const newAddress: Address = {
        ...addr,
        id: `addr_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.addresses.push(newAddress);
      saveDatabase();
      return newAddress;
    },
    update: (id: string, updates: Partial<Address>): Address | undefined => {
      const addr = db.addresses.find((a) => a.id === id);
      if (!addr) return undefined;
      if (updates.isDefault) {
        db.addresses.filter((a) => a.userId === addr.userId).forEach((a) => (a.isDefault = false));
      }
      Object.assign(addr, updates, { updatedAt: new Date().toISOString() });
      saveDatabase();
      return addr;
    },
    delete: (id: string): boolean => {
      const initLen = db.addresses.length;
      db.addresses = db.addresses.filter((a) => a.id !== id);
      if (db.addresses.length !== initLen) {
        saveDatabase();
        return true;
      }
      return false;
    },
  },

  // --- CATEGORIES ---
  categories: {
    getAll: (): Category[] => [...db.categories],
    getBySlug: (slug: string): Category | undefined => {
      return db.categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
    },
    create: (cat: Omit<Category, "id" | "createdAt" | "updatedAt">): Category => {
      const newCat: Category = {
        ...cat,
        id: `cat_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.categories.push(newCat);
      saveDatabase();
      return newCat;
    },
    update: (id: string, updates: Partial<Category>): Category | undefined => {
      const cat = db.categories.find((c) => c.id === id);
      if (!cat) return undefined;
      Object.assign(cat, updates, { updatedAt: new Date().toISOString() });
      saveDatabase();
      return cat;
    },
    delete: (id: string): boolean => {
      const initLen = db.categories.length;
      db.categories = db.categories.filter((c) => c.id !== id);
      if (db.categories.length !== initLen) {
        saveDatabase();
        return true;
      }
      return false;
    },
  },

  // --- BRANDS ---
  brands: {
    getAll: (): Brand[] => [...db.brands],
  },

  // --- PRODUCTS ---
  products: {
    getAll: (options?: {
      categorySlug?: string;
      brandSlug?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: "popular" | "newest" | "price-asc" | "price-desc" | "rating";
      isFlashSale?: boolean;
      isFeatured?: boolean;
    }): Product[] => {
      let list = db.products.filter((p) => p.isActive);

      if (options?.categorySlug) {
        const cat = db.categories.find((c) => c.slug.toLowerCase() === options.categorySlug?.toLowerCase());
        if (cat) {
          list = list.filter((p) => p.categoryId === cat.id);
        }
      }

      if (options?.brandSlug) {
        const brand = db.brands.find((b) => b.slug.toLowerCase() === options.brandSlug?.toLowerCase());
        if (brand) {
          list = list.filter((p) => p.brandId === brand.id);
        }
      }

      if (options?.search) {
        const q = options.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category?.name.toLowerCase().includes(q) ||
            p.brand?.name.toLowerCase().includes(q)
        );
      }

      if (options?.minPrice !== undefined) {
        list = list.filter((p) => p.price >= options.minPrice!);
      }

      if (options?.maxPrice !== undefined) {
        list = list.filter((p) => p.price <= options.maxPrice!);
      }

      if (options?.isFlashSale !== undefined) {
        list = list.filter((p) => p.isFlashSale === options.isFlashSale);
      }

      if (options?.isFeatured !== undefined) {
        list = list.filter((p) => p.isFeatured === options.isFeatured);
      }

      if (options?.sortBy) {
        switch (options.sortBy) {
          case "popular":
            list.sort((a, b) => b.soldCount - a.soldCount);
            break;
          case "newest":
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case "price-asc":
            list.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            list.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            list.sort((a, b) => b.rating - a.rating);
            break;
        }
      }

      return list;
    },
    getBySlug: (slug: string): Product | undefined => {
      const prod = db.products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
      if (prod) {
        prod.category = db.categories.find((c) => c.id === prod.categoryId);
        prod.brand = db.brands.find((b) => b.id === prod.brandId) || null;
        prod.reviews = db.reviews.filter((r) => r.productId === prod.id);
      }
      return prod;
    },
    getById: (id: string): Product | undefined => {
      const prod = db.products.find((p) => p.id === id);
      if (prod) {
        prod.category = db.categories.find((c) => c.id === prod.categoryId);
        prod.brand = db.brands.find((b) => b.id === prod.brandId) || null;
        prod.reviews = db.reviews.filter((r) => r.productId === prod.id);
      }
      return prod;
    },
    create: (prodData: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => {
      const newProd: Product = {
        ...prodData,
        id: `prod_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        soldCount: 0,
        rating: 5.0,
        reviewCount: 0,
        category: db.categories.find((c) => c.id === prodData.categoryId),
        brand: db.brands.find((b) => b.id === prodData.brandId) || null,
      };
      db.products.push(newProd);
      saveDatabase();
      return newProd;
    },
    update: (id: string, updates: Partial<Product>): Product | undefined => {
      const prod = db.products.find((p) => p.id === id);
      if (!prod) return undefined;
      Object.assign(prod, updates, { updatedAt: new Date().toISOString() });
      if (updates.categoryId) {
        prod.category = db.categories.find((c) => c.id === prod.categoryId);
      }
      if (updates.brandId !== undefined) {
        prod.brand = db.brands.find((b) => b.id === prod.brandId) || null;
      }
      saveDatabase();
      return prod;
    },
    delete: (id: string): boolean => {
      const initial = db.products.length;
      db.products = db.products.filter((p) => p.id !== id);
      if (db.products.length !== initial) {
        saveDatabase();
        return true;
      }
      return false;
    },
    updateStock: (productId: string, qtyDelta: number): boolean => {
      const prod = db.products.find((p) => p.id === productId);
      if (!prod) return false;
      prod.stock = Math.max(0, prod.stock + qtyDelta);
      if (qtyDelta < 0) {
        prod.soldCount += Math.abs(qtyDelta);
      }
      saveDatabase();
      return true;
    },
  },

  // --- CART ---
  cart: {
    getCart: (userId: string): Cart => {
      const items = db.carts[userId] || [];
      const subtotal = items
        .filter((item) => item.isSelected)
        .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const selectedCount = items.filter((item) => item.isSelected).length;

      return {
        id: `cart_${userId}`,
        userId,
        items,
        subtotal,
        selectedCount,
      };
    },
    addItem: (userId: string, productId: string, quantity: number = 1, variantId?: string | null): Cart => {
      if (!db.carts[userId]) db.carts[userId] = [];
      const product = db.products.find((p) => p.id === productId);
      if (!product) throw new Error("Produk tidak ditemukan");

      const existingIndex = db.carts[userId].findIndex(
        (item) => item.productId === productId && (item.variantId || null) === (variantId || null)
      );

      if (existingIndex > -1) {
        db.carts[userId][existingIndex].quantity += quantity;
        db.carts[userId][existingIndex].updatedAt = new Date().toISOString();
      } else {
        const variant = product.variants?.find((v) => v.id === variantId) || null;
        db.carts[userId].push({
          id: `cart_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          cartId: `cart_${userId}`,
          productId,
          product,
          variantId,
          variant,
          quantity,
          isSelected: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      saveDatabase();
      return dbRepository.cart.getCart(userId);
    },
    updateQuantity: (userId: string, cartItemId: string, quantity: number): Cart => {
      if (!db.carts[userId]) return dbRepository.cart.getCart(userId);
      if (quantity <= 0) {
        db.carts[userId] = db.carts[userId].filter((i) => i.id !== cartItemId);
      } else {
        const item = db.carts[userId].find((i) => i.id === cartItemId);
        if (item) {
          item.quantity = quantity;
          item.updatedAt = new Date().toISOString();
        }
      }
      saveDatabase();
      return dbRepository.cart.getCart(userId);
    },
    removeItem: (userId: string, cartItemId: string): Cart => {
      if (!db.carts[userId]) return dbRepository.cart.getCart(userId);
      db.carts[userId] = db.carts[userId].filter((i) => i.id !== cartItemId);
      saveDatabase();
      return dbRepository.cart.getCart(userId);
    },
    toggleSelect: (userId: string, cartItemId: string): Cart => {
      if (!db.carts[userId]) return dbRepository.cart.getCart(userId);
      const item = db.carts[userId].find((i) => i.id === cartItemId);
      if (item) {
        item.isSelected = !item.isSelected;
        saveDatabase();
      }
      return dbRepository.cart.getCart(userId);
    },
    toggleSelectAll: (userId: string, selectAll: boolean): Cart => {
      if (!db.carts[userId]) return dbRepository.cart.getCart(userId);
      db.carts[userId].forEach((i) => (i.isSelected = selectAll));
      saveDatabase();
      return dbRepository.cart.getCart(userId);
    },
    clearCart: (userId: string): void => {
      db.carts[userId] = [];
      saveDatabase();
    },
  },

  // --- WISHLIST ---
  wishlist: {
    getWishlist: (userId: string): Wishlist => {
      const productIds = db.wishlists[userId] || [];
      const items = productIds
        .map((pid) => db.products.find((p) => p.id === pid))
        .filter(Boolean)
        .map((p) => ({
          id: `w_${p!.id}`,
          wishlistId: `wl_${userId}`,
          productId: p!.id,
          product: p!,
          createdAt: new Date().toISOString(),
        }));

      return {
        id: `wl_${userId}`,
        userId,
        items,
      };
    },
    toggleItem: (userId: string, productId: string): { isInWishlist: boolean; count: number } => {
      if (!db.wishlists[userId]) db.wishlists[userId] = [];
      const idx = db.wishlists[userId].indexOf(productId);
      let isInWishlist = false;

      if (idx > -1) {
        db.wishlists[userId].splice(idx, 1);
        isInWishlist = false;
      } else {
        db.wishlists[userId].push(productId);
        isInWishlist = true;
      }

      saveDatabase();
      return { isInWishlist, count: db.wishlists[userId].length };
    },
    isInWishlist: (userId: string, productId: string): boolean => {
      return (db.wishlists[userId] || []).includes(productId);
    },
  },

  // --- ORDERS ---
  orders: {
    createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Order => {
      const today = new Date();
      const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");
      const randomSeq = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `RZ-${datePart}-${randomSeq}`;

      const newOrder: Order = {
        ...orderData,
        id: `ord_${Date.now()}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Reduce inventory
      orderData.items.forEach((item) => {
        dbRepository.products.updateStock(item.productId, -item.quantity);
      });

      // Clear user's selected cart items
      if (db.carts[orderData.userId]) {
        db.carts[orderData.userId] = db.carts[orderData.userId].filter((i) => !i.isSelected);
      }

      db.orders.unshift(newOrder);
      saveDatabase();
      return newOrder;
    },
    getByOrderNumber: (orderNumber: string): Order | undefined => {
      return db.orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());
    },
    getByUserId: (userId: string): Order[] => {
      return db.orders.filter((o) => o.userId === userId);
    },
    getAllOrders: (): Order[] => {
      return [...db.orders];
    },
    updateOrderStatus: (orderNumber: string, status: OrderStatus): Order | undefined => {
      const order = db.orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());
      if (!order) return undefined;
      order.status = status;
      order.updatedAt = new Date().toISOString();

      if (order.shipment) {
        if (status === "SHIPPED") order.shipment.status = "IN_TRANSIT";
        if (status === "DELIVERED") {
          order.shipment.status = "DELIVERED";
          order.shipment.deliveredAt = new Date().toISOString();
        }
      }

      saveDatabase();
      return order;
    },
    updateShipmentInfo: (orderNumber: string, courierName: string, trackingNumber: string): Order | undefined => {
      const order = db.orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());
      if (!order) return undefined;

      order.courierName = courierName;
      order.trackingNumber = trackingNumber;
      order.status = "SHIPPED";
      order.updatedAt = new Date().toISOString();

      if (!order.shipment) {
        order.shipment = {
          id: `shp_${Date.now()}`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          courier: courierName,
          service: order.courierService || "Reguler",
          trackingNumber,
          status: "IN_TRANSIT",
          recipientName: order.shippingAddress.recipientName,
          recipientPhone: order.shippingAddress.phone,
          recipientAddress: order.shippingAddress.addressLine,
          shippedAt: new Date().toISOString(),
          trackings: [
            {
              id: `trk_${Date.now()}`,
              shipmentId: `shp_${Date.now()}`,
              status: "PICKED_UP",
              description: `Paket telah diserahkan ke ${courierName} dari Gudang RZ Store`,
              location: "Gudang Utama Jakarta",
              timestamp: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        order.shipment.courier = courierName;
        order.shipment.trackingNumber = trackingNumber;
        order.shipment.status = "IN_TRANSIT";
        order.shipment.trackings.push({
          id: `trk_${Date.now()}`,
          shipmentId: order.shipment.id,
          status: "IN_TRANSIT",
          description: `Nomor resi ${trackingNumber} telah terbit. Paket diserahkan ke ${courierName}`,
          location: "Warehouse Jakarta",
          timestamp: new Date().toISOString(),
        });
      }

      saveDatabase();
      return order;
    },
  },

  // --- SHIPMENT & TRACKING ---
  shipments: {
    getByTrackingOrOrder: (query: string): { order?: Order; shipment?: Shipment } | null => {
      const q = query.trim().toUpperCase();
      // Search by Order Number
      const order = db.orders.find((o) => o.orderNumber.toUpperCase() === q || o.trackingNumber?.toUpperCase() === q);
      if (order && order.shipment) {
        return { order, shipment: order.shipment };
      }
      return order ? { order } : null;
    },
    addTrackingCheckpoint: (orderNumber: string, status: ShippingStatus, description: string, location: string): boolean => {
      const order = db.orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());
      if (!order || !order.shipment) return false;

      order.shipment.status = status;
      order.shipment.trackings.push({
        id: `trk_${Date.now()}`,
        shipmentId: order.shipment.id,
        status,
        description,
        location,
        timestamp: new Date().toISOString(),
      });
      if (status === "DELIVERED") {
        order.shipment.deliveredAt = new Date().toISOString();
        order.status = "DELIVERED";
      }

      saveDatabase();
      return true;
    },
  },

  // --- COUPONS ---
  coupons: {
    getAll: (): Coupon[] => [...db.coupons],
    getByCode: (code: string): Coupon | undefined => {
      return db.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    },
    validate: (code: string, subtotal: number): { valid: boolean; discountAmount: number; message: string; coupon?: Coupon } => {
      const coupon = dbRepository.coupons.getByCode(code);
      if (!coupon || !coupon.isActive) {
        return { valid: false, discountAmount: 0, message: "Kode voucher tidak ditemukan atau sudah tidak aktif." };
      }

      if (coupon.usedCount >= coupon.quota) {
        return { valid: false, discountAmount: 0, message: "Kuota voucher telah habis." };
      }

      if (subtotal < coupon.minPurchase) {
        return {
          valid: false,
          discountAmount: 0,
          message: `Minimal belanja untuk voucher ini adalah Rp ${coupon.minPurchase.toLocaleString("id-ID")}`,
        };
      }

      let discount = 0;
      if (coupon.discountType === "PERCENT") {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }

      return {
        valid: true,
        discountAmount: discount,
        message: `Voucher ${coupon.code} berhasil dipasang! Potongan Rp ${discount.toLocaleString("id-ID")}`,
        coupon,
      };
    },
    create: (couponData: Omit<Coupon, "id" | "usedCount">): Coupon => {
      const newCoupon: Coupon = {
        ...couponData,
        id: `cp_${Date.now()}`,
        usedCount: 0,
      };
      db.coupons.push(newCoupon);
      saveDatabase();
      return newCoupon;
    },
    update: (id: string, updates: Partial<Coupon>): Coupon | undefined => {
      const coupon = db.coupons.find((c) => c.id === id);
      if (!coupon) return undefined;
      Object.assign(coupon, updates);
      saveDatabase();
      return coupon;
    },
  },

  // --- REVIEWS ---
  reviews: {
    getByProductId: (productId: string): Review[] => {
      return db.reviews.filter((r) => r.productId === productId);
    },
    create: (reviewData: Omit<Review, "id" | "createdAt">): Review => {
      const newReview: Review = {
        ...reviewData,
        id: `rev_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      db.reviews.unshift(newReview);

      // Recalculate product rating
      const prod = db.products.find((p) => p.id === reviewData.productId);
      if (prod) {
        const prodReviews = db.reviews.filter((r) => r.productId === prod.id);
        const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        prod.rating = parseFloat(avg.toFixed(1));
        prod.reviewCount = prodReviews.length;
      }

      saveDatabase();
      return newReview;
    },
  },

  // --- BANNERS ---
  banners: {
    getActive: (): Banner[] => {
      return db.banners.filter((b) => b.isActive).sort((a, b) => a.order - b.order);
    },
    getAll: (): Banner[] => [...db.banners],
  },

  // --- ADMIN ANALYTICS ---
  analytics: {
    getDashboardStats: () => {
      const totalRevenue = db.orders
        .filter((o) => o.status !== "CANCELLED" && o.status !== "REFUNDED")
        .reduce((sum, o) => sum + o.totalAmount, 0);

      const totalOrders = db.orders.length;
      const totalCustomers = db.users.filter((u) => u.role === "CUSTOMER").length;
      const totalProducts = db.products.length;

      const pendingOrders = db.orders.filter((o) => o.status === "PENDING_PAYMENT").length;
      const processingOrders = db.orders.filter((o) => o.status === "PROCESSING" || o.status === "PAID").length;
      const shippedOrders = db.orders.filter((o) => o.status === "SHIPPED").length;
      const deliveredOrders = db.orders.filter((o) => o.status === "DELIVERED").length;

      // Monthly sales mock
      const monthlySales = [
        { month: "Mei", revenue: 14200000, orders: 12 },
        { month: "Jun", revenue: 21800000, orders: 18 },
        { month: "Jul", revenue: 35400000, orders: 27 },
        { month: "Ags", revenue: 42900000, orders: 34 },
        { month: "Sep", revenue: 58600000, orders: 45 },
        { month: "Okt", revenue: totalRevenue, orders: totalOrders },
      ];

      return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        monthlySales,
      };
    },
  },
};

export default dbRepository;
