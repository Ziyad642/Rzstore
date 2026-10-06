// Core Domain Types for RZ STORE (PT RZ E-Commerce Group)

export type Role = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string | null;
  role: Role;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku?: string | null;
  price: number;
  stock: number;
  attributes?: Record<string, string> | null;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  specifications?: string | null;
  price: number;
  originalPrice?: number | null;
  discountPercent?: number | null;
  categoryId: string;
  category?: Category;
  brandId?: string | null;
  brand?: Brand | null;
  stock: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSaleEnd?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  variantId?: string | null;
  variant?: ProductVariant | null;
  quantity: number;
  isSelected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  selectedCount: number;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
}

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "REFUNDED";

export type ShippingStatus =
  | "PENDING"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. RZ-20261007-00125
  userId: string;
  user?: { name: string; email: string; phone?: string | null };
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  notes?: string | null;
  shippingAddress: Address;
  courierName: string;
  courierService: string;
  trackingNumber?: string | null;
  items: OrderItem[];
  payment?: Payment | null;
  shipment?: Shipment | null;
  couponCode?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentMethod: string;
  paymentProvider?: string | null;
  amount: number;
  status: PaymentStatus;
  transactionId?: string | null;
  paymentProof?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentTracking {
  id: string;
  shipmentId: string;
  status: ShippingStatus;
  description: string;
  location?: string | null;
  timestamp: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  orderNumber?: string;
  courier: string;
  service: string;
  trackingNumber: string;
  status: ShippingStatus;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  shippedAt?: string | null;
  estimatedDelivery?: string | null;
  deliveredAt?: string | null;
  trackings: ShipmentTracking[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number | null;
  quota: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName?: string;
  userAvatar?: string | null;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
  ctaText?: string | null;
  badgeText?: string | null;
  isActive: boolean;
  order: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "ORDER" | "PROMO" | "SYSTEM";
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export interface CourierOption {
  courier: string;
  code: string;
  service: string;
  etd: string;
  price: number;
  description: string;
}

export interface PaymentMethodOption {
  id: string;
  name: string;
  category: "QRIS" | "VIRTUAL_ACCOUNT" | "BANK_TRANSFER" | "E_WALLET" | "COD";
  icon: string;
  instructions: string;
  accountNumber?: string;
  accountName?: string;
}
