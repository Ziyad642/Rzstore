const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database RZ STORE...");

  // Clean existing data
  await prisma.shipmentTracking.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
  const hashedPasswordUser = await bcrypt.hash("user123", 10);

  // 1. Users
  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin RZ",
      email: "superadmin@rzstore.com",
      password: hashedPasswordAdmin,
      phone: "081299990001",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin Operasional RZ",
      email: "admin@rzstore.com",
      password: hashedPasswordAdmin,
      phone: "081299990002",
      role: "ADMIN",
      isActive: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "customer@rzstore.com",
      password: hashedPasswordUser,
      phone: "081388887777",
      role: "CUSTOMER",
      isActive: true,
      addresses: {
        create: [
          {
            recipientName: "Budi Santoso",
            phone: "081388887777",
            addressLine: "Jl. Sudirman No. 45 Kav 2, Kel. Senayan, Kec. Kebayoran Baru",
            city: "Jakarta Selatan",
            province: "DKI Jakarta",
            postalCode: "12190",
            isDefault: true,
          },
          {
            recipientName: "Budi Santoso (Kantor)",
            phone: "081388887777",
            addressLine: "Gedung Cyber 2 Lantai 18, Jl. HR Rasuna Said",
            city: "Jakarta Selatan",
            province: "DKI Jakarta",
            postalCode: "12950",
            isDefault: false,
          },
        ],
      },
    },
  });

  console.log("Users created.");

  // 2. Categories
  const categoriesData = [
    {
      name: "Fashion",
      slug: "fashion",
      description: "Pakaian pria, wanita, sepatu, tas, dan aksesoris gaya modern",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80",
      icon: "Shirt",
      isFeatured: true,
    },
    {
      name: "Elektronik & Gadget",
      slug: "elektronik-gadget",
      description: "Smartphone, tablet, audio, TV, smart devices, dan kamera",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      icon: "Smartphone",
      isFeatured: true,
    },
    {
      name: "Home & Living",
      slug: "home-living",
      description: "Perabot rumah tangga, dekorasi estetik, dapur, dan perlengkapan tidur",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      icon: "Home",
      isFeatured: true,
    },
    {
      name: "Kecantikan",
      slug: "kecantikan",
      description: "Skincare, kosmetik, perawatan rambut, dan wewangian original",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      icon: "Sparkles",
      isFeatured: true,
    },
    {
      name: "Olahraga & Outdoor",
      slug: "olahraga-outdoor",
      description: "Peralatan gym, lari, bersepeda, camping, dan pakaian olahraga",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      icon: "Activity",
      isFeatured: true,
    },
    {
      name: "Ibu & Bayi",
      slug: "ibu-bayi",
      description: "Perlengkapan bayi, popok, susu, pakaian anak, dan mainan edukasi",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80",
      icon: "Baby",
      isFeatured: true,
    },
    {
      name: "Komputer & Aksesoris",
      slug: "komputer-aksesoris",
      description: "Laptop, PC desktop, monitor, keyboard mekanikal, dan peripheral",
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop&q=80",
      icon: "Laptop",
      isFeatured: true,
    },
    {
      name: "Makanan & Minuman",
      slug: "makanan-minuman",
      description: "Snack premium, kopi spesialti, teh organik, dan bahan dapur sehat",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
      icon: "Coffee",
      isFeatured: true,
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created;
  }
  console.log("Categories created:", Object.keys(categories).length);

  // 3. Brands
  const brandsData = [
    { name: "RZ Official", slug: "rz-official" },
    { name: "Apple", slug: "apple" },
    { name: "Samsung", slug: "samsung" },
    { name: "Sony", slug: "sony" },
    { name: "Nike", slug: "nike" },
    { name: "Eiger", slug: "eiger" },
    { name: "Philips", slug: "philips" },
    { name: "Somethinc", slug: "somethinc" },
    { name: "Logitech", slug: "logitech" },
    { name: "Nescafe", slug: "nescafe" },
  ];

  const brands = {};
  for (const b of brandsData) {
    const created = await prisma.brand.create({ data: b });
    brands[b.slug] = created;
  }
  console.log("Brands created:", Object.keys(brands).length);

  // 4. Products (32 Realistic Products)
  const productsData = [
    // --- Elektronik & Gadget ---
    {
      title: "Apple iPhone 15 Pro 128GB Garansi Resmi iBox",
      slug: "apple-iphone-15-pro-128gb",
      description: "iPhone 15 Pro dirancang dengan titanium sekelas dirgantara yang kuat dan ringan dengan tombol Tindakan yang dapat disesuaikan serta chip A17 Pro bertenaga luar biasa.",
      specifications: "Chipset: A17 Pro (3nm)\nRAM: 8GB\nLayar: 6.1 inci Super Retina XDR OLED 120Hz ProMotion\nKamera Utama: 48 MP Sony IMX803\nBaterai: 3274 mAh, USB-C 3.0",
      price: 18999000,
      originalPrice: 20999000,
      discountPercent: 10,
      categoryId: categories["elektronik-gadget"].id,
      brandId: brands["apple"].id,
      stock: 45,
      soldCount: 320,
      rating: 4.9,
      reviewCount: 142,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2),
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { name: "Natural Titanium 128GB", price: 18999000, stock: 20, sku: "IP15P-NT-128" },
        { name: "Black Titanium 128GB", price: 18999000, stock: 25, sku: "IP15P-BT-128" },
      ],
    },
    {
      title: "Samsung Galaxy S24 Ultra 5G 12GB/256GB AI Phone",
      slug: "samsung-galaxy-s24-ultra-5g",
      description: "Era baru Galaxy AI hadir dengan Samsung Galaxy S24 Ultra. Dilengkapi bodi titanium, kamera 200MP revolusioner, dan S Pen terintegrasi.",
      specifications: "Chipset: Snapdragon 8 Gen 3 for Galaxy\nRAM: 12GB\nLayar: 6.8 inch Dynamic LTPO AMOLED 2X 120Hz 2600 nits\nKamera: 200MP + 50MP Periscope + 10MP Tele + 12MP UW\nBaterai: 5000 mAh 45W",
      price: 19499000,
      originalPrice: 21999000,
      discountPercent: 11,
      categoryId: categories["elektronik-gadget"].id,
      brandId: brands["samsung"].id,
      stock: 30,
      soldCount: 215,
      rating: 4.9,
      reviewCount: 98,
      isFeatured: true,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { name: "Titanium Gray 256GB", price: 19499000, stock: 15, sku: "S24U-GRY-256" },
        { name: "Titanium Black 256GB", price: 19499000, stock: 15, sku: "S24U-BLK-256" },
      ],
    },
    {
      title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      slug: "sony-wh-1000xm5-wireless-headphones",
      description: "Headphone over-ear peredam bising terdepan di industri dengan dua prosesor dan delapan mikrofon untuk kualitas suara fidelitas tinggi yang tak tertandingi.",
      specifications: "Driver: 30mm Neodymium\nBattery Life: Up to 30 Jam ANC ON\nBluetooth: 5.2 dengan LDAC Hi-Res Audio\nBerat: 250 gram",
      price: 4999000,
      originalPrice: 5999000,
      discountPercent: 17,
      categoryId: categories["elektronik-gadget"].id,
      brandId: brands["sony"].id,
      stock: 25,
      soldCount: 180,
      rating: 4.8,
      reviewCount: 88,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2),
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { name: "Black", price: 4999000, stock: 15, sku: "SONY-XM5-BLK" },
        { name: "Silver", price: 4999000, stock: 10, sku: "SONY-XM5-SLV" },
      ],
    },
    {
      title: "Apple Watch Series 9 GPS 45mm Midnight Aluminium",
      slug: "apple-watch-series-9-gps-45mm",
      description: "Smarter, brighter, mightier. Apple Watch Series 9 dibekali chip S9 SiP yang bertenaga, gerakan ketuk dua kali magis, dan layar super cerah.",
      specifications: "Layar: Always-On Retina OLED 2000 nits\nProcessor: S9 SiP 64-bit dual core\nSensors: Blood Oxygen, ECG, Temperature sensing\nTahan Air: 50m water resistant",
      price: 6899000,
      originalPrice: 7999000,
      discountPercent: 14,
      categoryId: categories["elektronik-gadget"].id,
      brandId: brands["apple"].id,
      stock: 40,
      soldCount: 150,
      rating: 4.8,
      reviewCount: 64,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
      ],
    },

    // --- Komputer & Aksesoris ---
    {
      title: "MacBook Air 15 Inch M3 Chip 16GB 512GB SSD",
      slug: "macbook-air-15-inch-m3-chip",
      description: "MacBook Air 15 inci sangat ramping dan cepat dengan chip M3, daya tahan baterai hingga 18 jam, dan layar Liquid Retina yang luas dan tajam.",
      specifications: "Chip: Apple M3 8-core CPU 10-core GPU\nMemori: 16GB Unified Memory\nPenyimpanan: 512GB SSD Superfast\nLayar: 15.3 inch Liquid Retina 500 nits",
      price: 23999000,
      originalPrice: 25999000,
      discountPercent: 8,
      categoryId: categories["komputer-aksesoris"].id,
      brandId: brands["apple"].id,
      stock: 20,
      soldCount: 95,
      rating: 5.0,
      reviewCount: 45,
      isFeatured: true,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { name: "Space Gray", price: 23999000, stock: 10, sku: "MBA15-SG-512" },
        { name: "Midnight Blue", price: 23999000, stock: 10, sku: "MBA15-MD-512" },
      ],
    },
    {
      title: "Logitech MX Master 3S Wireless Performance Mouse",
      slug: "logitech-mx-master-3s-mouse",
      description: "Mouse performa ikonik yang diperbarui dengan Quiet Clicks dan sensor 8.000 DPI track-on-glass untuk presisi dan kenyamanan maksimal saat bekerja.",
      specifications: "DPI: 200 hingga 8000 DPI\nSensor: Darkfield high precision\nKonektivitas: Bluetooth Low Energy & Logi Bolt USB\nBaterai: Isi ulang Li-Po 500 mAh (hingga 70 hari)",
      price: 1499000,
      originalPrice: 1799000,
      discountPercent: 17,
      categoryId: categories["komputer-aksesoris"].id,
      brandId: brands["logitech"].id,
      stock: 60,
      soldCount: 450,
      rating: 4.9,
      reviewCount: 210,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2),
      images: [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { name: "Graphite", price: 1499000, stock: 35, sku: "LOGI-MX3S-GRP" },
        { name: "Pale Grey", price: 1499000, stock: 25, sku: "LOGI-MX3S-GRY" },
      ],
    },
    {
      title: "Logitech MX Mechanical Wireless Illuminated Keyboard",
      slug: "logitech-mx-mechanical-keyboard",
      description: "Keyboard mekanik berprofil rendah dengan tactile switch yang hening, pencahayaan pintar, dan konektivitas multi-device hingga 3 perangkat.",
      specifications: "Switch: Tactile Quiet Low-profile\nBacklit: Smart illumination dengan sensor proximity\nKoneksi: Logi Bolt & Bluetooth\nBaterai: Hingga 15 hari backlight aktif, 10 bulan backlight nonaktif",
      price: 2499000,
      originalPrice: 2899000,
      discountPercent: 14,
      categoryId: categories["komputer-aksesoris"].id,
      brandId: brands["logitech"].id,
      stock: 35,
      soldCount: 160,
      rating: 4.8,
      reviewCount: 75,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "RZ Pro USB-C 8-in-1 Hub Multiport Aluminum Adapter 4K",
      slug: "rz-pro-usb-c-8-in-1-hub",
      description: "Adapter USB-C serbaguna resmi dari RZ Official dengan port HDMI 4K@60Hz, Gigabit Ethernet, 100W PD charging, 3x USB 3.0, dan SD/TF Card reader.",
      specifications: "Material: Premium Matte Aluminum\nOutput: HDMI 4K@60Hz, 3x USB-A 5Gbps, RJ45 1000Mbps, SD/TF, 100W PD Pass-through\nKompatibilitas: Mac, Windows, iPad, Steam Deck",
      price: 499000,
      originalPrice: 750000,
      discountPercent: 33,
      categoryId: categories["komputer-aksesoris"].id,
      brandId: brands["rz-official"].id,
      stock: 120,
      soldCount: 680,
      rating: 4.8,
      reviewCount: 290,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2),
      images: [
        "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80",
      ],
    },

    // --- Fashion ---
    {
      title: "RZ Classic Heavyweight Oversized T-Shirt 24s Navy",
      slug: "rz-classic-heavyweight-oversized-tshirt",
      description: "Kaos oversized signature RZ Store dibuat dari 100% combed cotton premium 240 GSM. Potongan dropped-shoulder yang jatuh sempurna dan nyaman dipakai seharian.",
      specifications: "Bahan: 100% Cotton Combed 24s 240 GSM\nFitting: Modern Oversized Boxy Fit\nRib: 1x1 Heavy Cotton Collar anti melar\nWarna: Signature Deep Navy",
      price: 189000,
      originalPrice: 250000,
      discountPercent: 24,
      categoryId: categories["fashion"].id,
      brandId: brands["rz-official"].id,
      stock: 200,
      soldCount: 1250,
      rating: 4.9,
      reviewCount: 520,
      isFeatured: true,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { name: "Navy - M", price: 189000, stock: 50, sku: "RZ-TSH-NVY-M" },
        { name: "Navy - L", price: 189000, stock: 80, sku: "RZ-TSH-NVY-L" },
        { name: "Navy - XL", price: 189000, stock: 70, sku: "RZ-TSH-NVY-XL" },
      ],
    },
    {
      title: "Nike Air Jordan 1 Low Retro OG Black White",
      slug: "nike-air-jordan-1-low-retro",
      description: "Sneaker legendaris dengan desain low-top serbaguna, material kulit premium, bantalan Air-Sole tersembunyi, dan outsole karet tahan lama.",
      specifications: "Upper: Premium Genuine Leather\nMidsole: Encapsulated Air-Sole Unit\nOutsole: Solid Rubber Cupsole\nKode: CZ0790-100",
      price: 2199000,
      originalPrice: 2499000,
      discountPercent: 12,
      categoryId: categories["fashion"].id,
      brandId: brands["nike"].id,
      stock: 35,
      soldCount: 310,
      rating: 4.8,
      reviewCount: 140,
      isFeatured: true,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { name: "Size 41", price: 2199000, stock: 10, sku: "AJ1-LOW-41" },
        { name: "Size 42", price: 2199000, stock: 15, sku: "AJ1-LOW-42" },
        { name: "Size 43", price: 2199000, stock: 10, sku: "AJ1-LOW-43" },
      ],
    },
    {
      title: "Nike Club Fleece Pullover Hoodie Full Navy",
      slug: "nike-club-fleece-pullover-hoodie",
      description: "Hoodie fleece favorit semua orang dengan kenyamanan ekstra, rajutan halus di bagian luar dan bagian dalam yang sangat lembut untuk cuaca dingin.",
      specifications: "Bahan: 80% Katun, 20% Poliester Fleece\nFit: Standard Fit kasual\nFitur: Kantong kanguru, tali serut tudung",
      price: 799000,
      originalPrice: 999000,
      discountPercent: 20,
      categoryId: categories["fashion"].id,
      brandId: brands["nike"].id,
      stock: 45,
      soldCount: 220,
      rating: 4.7,
      reviewCount: 95,
      isFeatured: false,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2),
      images: [
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Eiger Diario Sender 25L Laptop Daypack Outdoor",
      slug: "eiger-diario-sender-25l-daypack",
      description: "Tas ransel harian serbaguna dengan kompartemen laptop 15 inci, saku organizer depan, material water repellent, dan bantalan punggung ergonomis.",
      specifications: "Kapasitas: 25 Liter\nBahan: Polyester 600D WR PU\nKompartemen: Main pocket, 15\" Laptop sleeve, side water bottle pocket\nDimensi: 30 x 18 x 47 cm",
      price: 479000,
      originalPrice: 549000,
      discountPercent: 13,
      categoryId: categories["fashion"].id,
      brandId: brands["eiger"].id,
      stock: 50,
      soldCount: 380,
      rating: 4.9,
      reviewCount: 165,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      ],
    },

    // --- Home & Living ---
    {
      title: "Philips Air Fryer Digital HD9252/90 Rapid Air 4.1L",
      slug: "philips-air-fryer-digital-hd9252",
      description: "Goreng makanan lezat dengan hingga 90% lebih sedikit lemak menggunakan teknologi Rapid Air eksklusif dari Philips. Dilengkapi layar sentuh dengan 7 preset memasak.",
      specifications: "Daya: 1400 Watt\nKapasitas: 4.1 Liter (0.8 kg kentang goreng)\nFitur: Touch screen digital, QuickClean basket, Auto shut-off\nGaransi: Resmi Philips 2 Tahun",
      price: 1299000,
      originalPrice: 1699000,
      discountPercent: 24,
      categoryId: categories["home-living"].id,
      brandId: brands["philips"].id,
      stock: 40,
      soldCount: 420,
      rating: 4.9,
      reviewCount: 185,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2),
      images: [
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "RZ Minimalist Ergonomic Mesh Office Chair with Lumbar Support",
      slug: "rz-minimalist-ergonomic-office-chair",
      description: "Kursi kantor ergonomis dengan sandaran jaring breathable premium, penyangga punggung bawah lumbar dinamis, dan hidrolik kelas dunia untuk duduk sehat berjam-jam.",
      specifications: "Rangka: Heavy-duty nylon base kelas industri\nBantalan: High-density molded foam empuk\nFitur: Reclining 135 derajat, 3D Adjustable Armrest, Gaslift Class 4",
      price: 1450000,
      originalPrice: 1950000,
      discountPercent: 26,
      categoryId: categories["home-living"].id,
      brandId: brands["rz-official"].id,
      stock: 30,
      soldCount: 290,
      rating: 4.8,
      reviewCount: 110,
      isFeatured: true,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1580481077195-c328ad4f740a?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Aroma Diffuser Ultrasonic Wood Grain 500ml + Remote Control",
      slug: "aroma-diffuser-ultrasonic-wood-grain",
      description: "Diffuser aromaterapi ultrasonik berkapasitas besar 500ml dengan lampu LED 7 warna, timer otomatis, dan uap hening yang menyegarkan ruangan dan melembapkan kulit.",
      specifications: "Kapasitas Tangki: 500 ml\nWaktu Kerja: Hingga 10-12 jam nonstop\nFitur: Timer 1H/3H/6H, Remote control, Auto-off saat air habis",
      price: 175000,
      originalPrice: 250000,
      discountPercent: 30,
      categoryId: categories["home-living"].id,
      brandId: null,
      stock: 80,
      soldCount: 650,
      rating: 4.7,
      reviewCount: 240,
      isFeatured: false,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2),
      images: [
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Set Sprei Tencel Jacquard 60s Hotel Grade King Size 180x200",
      slug: "set-sprei-tencel-jacquard-60s",
      description: "Set sprei serat alami Tencel 60s yang sejuk, halus bagai sutra, dan ramah lingkungan. Menghadirkan sensasi tidur mewah bintang lima di rumah sendiri.",
      specifications: "Bahan: 100% Lyocell Tencel 60s thread count tinggi\nIsi: 1 Sprei Fitted (180x200x40cm), 2 Sarung Bantal, 2 Sarung Guling\nWarna: Navy Blue Elegan",
      price: 689000,
      originalPrice: 899000,
      discountPercent: 23,
      categoryId: categories["home-living"].id,
      brandId: null,
      stock: 35,
      soldCount: 190,
      rating: 4.9,
      reviewCount: 82,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&auto=format&fit=crop&q=80",
      ],
    },

    // --- Kecantikan ---
    {
      title: "Somethinc Calm Down! Skinpair Barrier Serum 30ml",
      slug: "somethinc-calm-down-skinpair-barrier-serum",
      description: "Serum penenang kulit sensitif dan perbaikan skin barrier dengan formula paten CalmDown & Madagascar Centella Asiatica. Meredakan kemerahan dalam hitungan menit.",
      specifications: "Ukuran: 30 ml\nBahan Utama: CalmDown, Centella Asiatica, Panthenol\nCocok Untuk: Semua jenis kulit, terutama kulit berjerawat dan sensitif\nBPOM: NA18230101234",
      price: 119000,
      originalPrice: 149000,
      discountPercent: 20,
      categoryId: categories["kecantikan"].id,
      brandId: brands["somethinc"].id,
      stock: 150,
      soldCount: 2300,
      rating: 4.9,
      reviewCount: 890,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2),
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Somethinc Holyshield! UV Watery Sunscreen Gel SPF 50+ PA++++",
      slug: "somethinc-holyshield-uv-watery-sunscreen",
      description: "Tabir surya bertekstur gel air ringan tanpa white cast, tidak lengket, dan memberikan proteksi maksimal dari sinar UVA & UVB serta polusi blue light.",
      specifications: "Ukuran: 50 ml\nProteksi: SPF 50+ PA++++ Board Spectrum\nSensasi: Dingin menyegarkan, matte finish",
      price: 99000,
      originalPrice: 125000,
      discountPercent: 21,
      categoryId: categories["kecantikan"].id,
      brandId: brands["somethinc"].id,
      stock: 180,
      soldCount: 3100,
      rating: 4.8,
      reviewCount: 1120,
      isFeatured: true,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Luxury Amber & Vanilla Eau de Parfum 50ml Unisex",
      slug: "luxury-amber-vanilla-edp-50ml",
      description: "Parfum konsentrat tinggi dengan aroma amber hangat, sentuhan vanilla madagaskar lembut, dan musk mewah yang tahan hingga 12 jam.",
      specifications: "Konsentrasi: Eau de Parfum (EDP)\nUkuran: 50 ml Glass Spray Bottle\nKetahanan: 8-12 Jam di kulit, 24 jam di pakaian",
      price: 349000,
      originalPrice: 450000,
      discountPercent: 22,
      categoryId: categories["kecantikan"].id,
      brandId: null,
      stock: 45,
      soldCount: 420,
      rating: 4.8,
      reviewCount: 160,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Set Kuas Makeup Profesional 12 Pcs dengan Pouch Kulit",
      slug: "set-kuas-makeup-profesional-12-pcs",
      description: "Koleksi kuas rias wajah lengkap dengan bulu sintetis ultra-lembut berkualitas vegan, gagang kayu kokoh, dan tempat kuas kulit elegan.",
      specifications: "Isi: 12 jenis kuas (Foundation, Powder, Blush, Eye blending, dll)\nBulu: Bulu serat sintetis nano antimikroba\nFree: Travel leather pouch",
      price: 159000,
      originalPrice: 220000,
      discountPercent: 28,
      categoryId: categories["kecantikan"].id,
      brandId: null,
      stock: 70,
      soldCount: 510,
      rating: 4.7,
      reviewCount: 195,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80",
      ],
    },

    // --- Olahraga & Outdoor ---
    {
      title: "Nike Pegasus 40 Men's Road Running Shoes Navy",
      slug: "nike-pegasus-40-mens-running-shoes",
      description: "Sepatu lari andalan pelari dunia dengan teknologi busa Nike React responsif dan unit ganda Zoom Air untuk transisi langkah yang bertenaga dan stabil.",
      specifications: "Teknologi: Dual Zoom Air (forefoot & heel) + React Foam\nUpper: Engineered Mesh sejuk bersirkulasi tinggi\nBerat: 288g (Size 42)\nTipe Lari: Daily road running, marathon",
      price: 1699000,
      originalPrice: 2099000,
      discountPercent: 19,
      categoryId: categories["olahraga-outdoor"].id,
      brandId: brands["nike"].id,
      stock: 30,
      soldCount: 380,
      rating: 4.9,
      reviewCount: 145,
      isFeatured: true,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { name: "Size 41", price: 1699000, stock: 10, sku: "PEG40-41" },
        { name: "Size 42", price: 1699000, stock: 12, sku: "PEG40-42" },
        { name: "Size 43", price: 1699000, stock: 8, sku: "PEG40-43" },
      ],
    },
    {
      title: "Eiger Tenda Dome Shira 2P Waterproof Camping Tent",
      slug: "eiger-tenda-dome-shira-2p",
      description: "Tenda kemping kapasitas 2 orang berdesain dome aerodinamis dengan bahan polyester ripstop waterproof 3000mm dan frame alloy kokoh tahan angin.",
      specifications: "Kapasitas: 2 Orang\nMaterial Flysheet: Polyester 210T PU 3000mm seam taped\nFrame: 7001 T6 Aluminium Alloy\nDimensi: 210 x 140 x 110 cm\nBerat: 2.3 kg",
      price: 1199000,
      originalPrice: 1399000,
      discountPercent: 14,
      categoryId: categories["olahraga-outdoor"].id,
      brandId: brands["eiger"].id,
      stock: 25,
      soldCount: 140,
      rating: 4.8,
      reviewCount: 52,
      isFeatured: false,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2),
      images: [
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "RZ Smart Dumbbell Set 20KG Koper Multifungsi Barbell",
      slug: "rz-smart-dumbbell-set-20kg",
      description: "Set dumbel dan barbel portabel dalam koper kokoh. Plat besi lapis karet premium yang dapat disesuaikan bobotnya sesuai kebutuhan latihan di rumah.",
      specifications: "Total Berat: 20 KG\nKelengkapan: 2 Stick Dumbbell, 1 Connecting Rod (menjadi Barbell), 4 Nut pengunci, Hard case koper\nMaterial: Besi solid cor lapis pelindung",
      price: 529000,
      originalPrice: 750000,
      discountPercent: 29,
      categoryId: categories["olahraga-outdoor"].id,
      brandId: brands["rz-official"].id,
      stock: 40,
      soldCount: 320,
      rating: 4.8,
      reviewCount: 115,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Matras Yoga TPE Tebal 8mm Anti-Slip Eco-Friendly + Tali",
      slug: "matras-yoga-tpe-8mm-anti-slip",
      description: "Matras senam pilates dan yoga dengan ketebalan 8mm untuk proteksi sendi optimal. Tekstur anti-slip di kedua sisi dan bebas dari bahan kimia beracun.",
      specifications: "Material: Eco-friendly TPE High Density\nUkuran: 183 x 61 x 0.8 cm\nBonus: Tali pengikat selempang & sarung jaring",
      price: 139000,
      originalPrice: 199000,
      discountPercent: 30,
      categoryId: categories["olahraga-outdoor"].id,
      brandId: null,
      stock: 90,
      soldCount: 780,
      rating: 4.7,
      reviewCount: 310,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop&q=80",
      ],
    },

    // --- Ibu & Bayi ---
    {
      title: "Stroller Bayi Lipat Cabin Size Otomatis One-Hand Fold",
      slug: "stroller-bayi-lipat-cabin-size",
      description: "Kereta dorong bayi pintar yang melipat otomatis dengan satu sentuhan. Ringan dan muat di bagasi kabin pesawat, dilengkapi suspensi 4 roda lembut.",
      specifications: "Usia: Newborn hingga 4 Tahun (Beban max 22 kg)\nBerat Stroller: Hanya 5.9 kg\nFitur: Sandaran rebah 175°, kanopi UV50+, rem satu pijakan",
      price: 1290000,
      originalPrice: 1750000,
      discountPercent: 26,
      categoryId: categories["ibu-bayi"].id,
      brandId: null,
      stock: 25,
      soldCount: 160,
      rating: 4.9,
      reviewCount: 68,
      isFeatured: true,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Sterilizer Botol Susu UVC LED Kering Otomatis 16L",
      slug: "sterilizer-botol-susu-uvc-led-16l",
      description: "Alat sterilisasi uap dan pengering botol susu canggih menggunakan teknologi sinar UV-C tanpa merkuri. Membunuh 99.9% bakteri dan virus.",
      specifications: "Kapasitas: 16 Liter (hingga 12 botol sekaligus)\nDaya: 110 Watt pengeringan suhu rendah aman plastik BPA-Free\nMode: Auto, Sterilize, Dry, Storage hingga 72 jam",
      price: 999000,
      originalPrice: 1399000,
      discountPercent: 28,
      categoryId: categories["ibu-bayi"].id,
      brandId: null,
      stock: 30,
      soldCount: 220,
      rating: 4.9,
      reviewCount: 92,
      isFeatured: false,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2),
      images: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Set Pakaian Bayi Katun Organik SNI 6-in-1 Newborn",
      slug: "set-pakaian-bayi-katun-organik-sni",
      description: "Paket lengkap baju bayi baru lahir berbahan 100% katun organik bersertifikat SNI yang adem, bebas zat pewarna kimia berbahaya, dan tidak memicu alergi.",
      specifications: "Isi: 2 Baju lengan pendek, 2 Celana panjang, 1 Sarung tangan kaki, 1 Topi simpul\nUkuran: 0-3 Bulan",
      price: 135000,
      originalPrice: 180000,
      discountPercent: 25,
      categoryId: categories["ibu-bayi"].id,
      brandId: null,
      stock: 100,
      soldCount: 890,
      rating: 4.8,
      reviewCount: 340,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Playmat Bayi Lipat XPE Tebal 1.5cm Waterproof 180x200",
      slug: "playmat-bayi-lipat-xpe-tebal",
      description: "Karpet bermain anak empuk lipat 2 sisi motif edukatif. Bahan XPE busa densitas tinggi yang empuk meredam benturan saat bayi belajar merangkak.",
      specifications: "Ukuran: 180 x 200 cm, Tebal 1.5 cm\nBahan: High Grade XPE Foam aman BPA-free\nFitur: Mudah dibersihkan tinggal lap, gampang dilipat ringkas",
      price: 245000,
      originalPrice: 320000,
      discountPercent: 23,
      categoryId: categories["ibu-bayi"].id,
      brandId: null,
      stock: 55,
      soldCount: 470,
      rating: 4.8,
      reviewCount: 180,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80",
      ],
    },

    // --- Makanan & Minuman ---
    {
      title: "Biji Kopi Arabika Gayo Aceh Specialty Roast 500gr",
      slug: "biji-kopi-arabika-gayo-aceh-500gr",
      description: "Kopi Arabika single origin dataran tinggi Gayo Aceh dengan proses wash halus. Karakter rasa kaya aroma buah, cokelat manis, dan tingkat keasaman seimbang.",
      specifications: "Origin: Takengon, Gayo, Aceh (1400-1600 mdpl)\nProses: Full Washed\nRoast Level: Medium Roast\nBerat: 500 gram kemasan one-way valve ziplock",
      price: 135000,
      originalPrice: 165000,
      discountPercent: 18,
      categoryId: categories["makanan-minuman"].id,
      brandId: null,
      stock: 120,
      soldCount: 1450,
      rating: 4.9,
      reviewCount: 620,
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 86400000 * 2),
      images: [
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { name: "Biji Utuh (Whole Bean)", price: 135000, stock: 60, sku: "COF-GAYO-WB" },
        { name: "Giling Sedang (V60/Filter)", price: 135000, stock: 60, sku: "COF-GAYO-GRD" },
      ],
    },
    {
      title: "Madu Hutan Liar Murni Asli Sumbawa Raw Honey 500ml",
      slug: "madu-hutan-liar-asli-sumbawa-500ml",
      description: "Madu murni mentah yang dipanen langsung dari sarang lebah pohon sialang hutan Sumbawa. Tanpa pasteurisasi dan tanpa tambahan gula pengawet.",
      specifications: "Isi Bersih: 500 ml (kurang lebih 700 gram)\nSertifikasi: Uji Lab PIRT & Halal MUI\nKhasiat: Menjaga imunitas tubuh dan kesehatan pencernaan",
      price: 120000,
      originalPrice: 150000,
      discountPercent: 20,
      categoryId: categories["makanan-minuman"].id,
      brandId: null,
      stock: 85,
      soldCount: 920,
      rating: 4.9,
      reviewCount: 410,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Nescafe Dolce Gusto Capsule Espresso Intenso 16 Kapsul",
      slug: "nescafe-dolce-gusto-capsule-espresso-intenso",
      description: "Kapsul kopi espresso dengan perpaduan biji Robusta dan Arabika sangrai gelap yang menghadirkan aroma pedas rempah dengan crema beludru tebal.",
      specifications: "Isi: 16 Kapsul (16 cangkir espresso nikmat)\nIntensitas: 7 dari 11\nKompatibel: Semua mesin Nescafe Dolce Gusto",
      price: 139000,
      originalPrice: 160000,
      discountPercent: 13,
      categoryId: categories["makanan-minuman"].id,
      brandId: brands["nescafe"].id,
      stock: 75,
      soldCount: 680,
      rating: 4.8,
      reviewCount: 220,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
      ],
    },
    {
      title: "Granola Organik Roasted Almond & Chocolate Chip 400g",
      slug: "granola-organik-roasted-almond-chocolate-400g",
      description: "Sarapan sehat kaya serat dari rolled oats panggang, kacang almond renyah, biji chia, dan dark chocolate chip Belgia berpemanis madu alami.",
      specifications: "Berat Bersih: 400 gram\nBahan: Rolled Oats, Kacang Almond, Chia Seeds, Madu Murni, Cacao Nibs\nBebas: Minyak sawit, pewarna buatan, pemanis sintetis",
      price: 75000,
      originalPrice: 95000,
      discountPercent: 21,
      categoryId: categories["makanan-minuman"].id,
      brandId: null,
      stock: 110,
      soldCount: 1100,
      rating: 4.8,
      reviewCount: 380,
      isFeatured: false,
      isFlashSale: false,
      images: [
        "https://images.unsplash.com/photo-1517093707567-96a93b3336a9?w=800&auto=format&fit=crop&q=80",
      ],
    },
  ];

  for (const p of productsData) {
    const { images, variants, ...prodFields } = p;
    const createdProduct = await prisma.product.create({
      data: {
        ...prodFields,
        images: {
          create: images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            order: idx,
          })),
        },
        variants: variants
          ? {
              create: variants.map((v) => ({
                name: v.name,
                price: v.price,
                stock: v.stock,
                sku: v.sku,
              })),
            }
          : undefined,
        inventory: {
          create: {
            stock: prodFields.stock,
            minStockThreshold: 5,
            location: "Gudang Pusat Jakarta",
          },
        },
      },
    });

    // Add 2 reviews per product for social proof
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        rating: 5,
        comment: "Kualitas barang sangat bagus, original sesuai deskripsi. Pengiriman super cepat dan packing aman!",
      },
    });
  }

  console.log("32 Products created with images, variants, inventory, and reviews.");

  // 5. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "RZHEMAT50",
        description: "Diskon 50% potongan maksimal Rp 50.000",
        discountType: "PERCENT",
        discountValue: 50,
        minPurchase: 100000,
        maxDiscount: 50000,
        quota: 500,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 30),
        isActive: true,
      },
      {
        code: "GRATISONGKIR",
        description: "Potongan ongkos kirim Rp 20.000 untuk minimal belanja Rp 200.000",
        discountType: "FIXED",
        discountValue: 20000,
        minPurchase: 200000,
        maxDiscount: 20000,
        quota: 1000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 30),
        isActive: true,
      },
      {
        code: "WELCOME2026",
        description: "Voucher pengguna baru diskon Rp 25.000",
        discountType: "FIXED",
        discountValue: 25000,
        minPurchase: 50000,
        maxDiscount: 25000,
        quota: 300,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 60),
        isActive: true,
      },
    ],
  });
  console.log("Coupons created.");

  // 6. Banners
  await prisma.banner.createMany({
    data: [
      {
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
        title: "Flash Sale Eksklusif Pekan Ini",
        subtitle: "Dapatkan diskon hingga 70% untuk ratusan gadget dan aksesoris original.",
        badgeText: "Diskon s/d 70%",
        ctaText: "Serbu Promo",
        link: "/shop?flashSale=true",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80",
        isActive: true,
        order: 2,
      },
      {
        title: "Belanja Nyaman, Pengiriman Cepat",
        subtitle: "Bebas ongkos kirim ke seluruh kota di Indonesia dengan kurir pilihan terpercaya.",
        badgeText: "Gratis Ongkir Se-Indonesia",
        ctaText: "Mulai Belanja",
        link: "/shop",
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&auto=format&fit=crop&q=80",
        isActive: true,
        order: 3,
      },
    ],
  });
  console.log("Banners created.");

  // 7. Pre-seeded Orders with Live Tracking Timeline
  const firstProduct = await prisma.product.findFirst({
    where: { slug: "apple-iphone-15-pro-128gb" },
    include: { images: true },
  });
  const secondProduct = await prisma.product.findFirst({
    where: { slug: "sony-wh-1000xm5-wireless-headphones" },
    include: { images: true },
  });

  if (firstProduct) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: "RZ-20261007-00125",
        userId: customer.id,
        subtotal: 18999000,
        shippingCost: 0,
        discountAmount: 50000,
        totalAmount: 18949000,
        status: "SHIPPED",
        notes: "Mohon ditangani dengan hati-hati, paket barang bernilai tinggi.",
        shippingAddress: JSON.stringify({
          recipientName: "Budi Santoso",
          phone: "081388887777",
          addressLine: "Jl. Sudirman No. 45 Kav 2, Kel. Senayan, Kec. Kebayoran Baru",
          city: "Jakarta Selatan",
          province: "DKI Jakarta",
          postalCode: "12190",
        }),
        courierName: "JNE",
        courierService: "JNE YES (Yakin Esok Sampai)",
        trackingNumber: "JNE982736411029",
        items: {
          create: [
            {
              productId: firstProduct.id,
              title: firstProduct.title,
              price: firstProduct.price,
              quantity: 1,
              subtotal: firstProduct.price,
              image: firstProduct.images[0]?.url || "",
            },
          ],
        },
        payment: {
          create: {
            paymentMethod: "Virtual Account",
            paymentProvider: "BCA Virtual Account",
            amount: 18949000,
            status: "PAID",
            transactionId: "TX-BCA-88991244",
            paidAt: new Date(Date.now() - 86400000),
          },
        },
        shipment: {
          create: {
            courier: "JNE",
            service: "JNE YES",
            trackingNumber: "JNE982736411029",
            status: "IN_TRANSIT",
            recipientName: "Budi Santoso",
            recipientPhone: "081388887777",
            recipientAddress: "Jl. Sudirman No. 45 Kav 2, Jakarta Selatan",
            shippedAt: new Date(Date.now() - 3600000 * 12),
            estimatedDelivery: new Date(Date.now() + 3600000 * 12),
            trackings: {
              create: [
                {
                  status: "PICKED_UP",
                  description: "Paket telah dijemput oleh kurir JNE dari gudang RZ Store",
                  location: "Gudang Utama Jakarta Barat",
                  timestamp: new Date(Date.now() - 3600000 * 12),
                },
                {
                  status: "IN_TRANSIT",
                  description: "Paket tiba di sorting hub JNE Tomang dan sedang diproses menuju hub tujuan",
                  location: "Sorting Hub Jakarta",
                  timestamp: new Date(Date.now() - 3600000 * 6),
                },
                {
                  status: "IN_TRANSIT",
                  description: "Paket dalam perjalanan ke delivery hub Jakarta Selatan",
                  location: "Transit Hub Selatan",
                  timestamp: new Date(Date.now() - 3600000 * 2),
                },
              ],
            },
          },
        },
      },
    });
    console.log("Seeded Order RZ-20261007-00125 created with tracking history.");
  }

  if (secondProduct) {
    const order2 = await prisma.order.create({
      data: {
        orderNumber: "RZ-20261006-00098",
        userId: customer.id,
        subtotal: 4999000,
        shippingCost: 15000,
        discountAmount: 0,
        totalAmount: 5014000,
        status: "DELIVERED",
        shippingAddress: JSON.stringify({
          recipientName: "Budi Santoso",
          phone: "081388887777",
          addressLine: "Jl. Sudirman No. 45 Kav 2, Jakarta Selatan",
          city: "Jakarta Selatan",
          province: "DKI Jakarta",
          postalCode: "12190",
        }),
        courierName: "SiCepat",
        courierService: "SiCepat REG",
        trackingNumber: "004019283746",
        items: {
          create: [
            {
              productId: secondProduct.id,
              title: secondProduct.title,
              price: secondProduct.price,
              quantity: 1,
              subtotal: secondProduct.price,
              image: secondProduct.images[0]?.url || "",
            },
          ],
        },
        payment: {
          create: {
            paymentMethod: "QRIS",
            paymentProvider: "QRIS All Payment",
            amount: 5014000,
            status: "PAID",
            transactionId: "TX-QRIS-991827",
            paidAt: new Date(Date.now() - 86400000 * 3),
          },
        },
        shipment: {
          create: {
            courier: "SiCepat",
            service: "SiCepat REG",
            trackingNumber: "004019283746",
            status: "DELIVERED",
            recipientName: "Budi Santoso",
            recipientPhone: "081388887777",
            recipientAddress: "Jl. Sudirman No. 45 Kav 2, Jakarta Selatan",
            shippedAt: new Date(Date.now() - 86400000 * 2),
            deliveredAt: new Date(Date.now() - 86400000),
            trackings: {
              create: [
                {
                  status: "PICKED_UP",
                  description: "Paket telah diterima di drop point SiCepat",
                  location: "Drop Point Jakarta",
                  timestamp: new Date(Date.now() - 86400000 * 2),
                },
                {
                  status: "OUT_FOR_DELIVERY",
                  description: "Kurir SIGESIT sedang membawa paket menuju alamat penerima",
                  location: "Jakarta Selatan",
                  timestamp: new Date(Date.now() - 3600000 * 28),
                },
                {
                  status: "DELIVERED",
                  description: "Paket telah berhasil diterima oleh Budi Santoso (Ybs)",
                  location: "Jakarta Selatan",
                  timestamp: new Date(Date.now() - 86400000),
                },
              ],
            },
          },
        },
      },
    });
    console.log("Seeded Order RZ-20261006-00098 created as DELIVERED.");
  }

  // Pre-seed customer cart with an item so customer can experience the cart immediately
  const sampleCartItem = await prisma.product.findFirst({
    where: { slug: "rz-classic-heavyweight-oversized-tshirt" },
  });
  if (sampleCartItem) {
    const cart = await prisma.cart.create({
      data: {
        userId: customer.id,
      },
    });
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: sampleCartItem.id,
        quantity: 1,
        isSelected: true,
      },
    });
    console.log("Customer cart initialized with item.");
  }

  console.log("Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
