
export interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Pizza grande 8 pedaços' | 'Pizza broto 4 pedaços' | 'Doce' | 'Vegana' | 'Meio a Meio' | 'Bebida';
  categoryId?: string; // Reference to Category
  rating: number;
  available?: boolean; // New field for pausing/unpausing
}

export interface OptionItem {
  id: string;
  name: string;
  price: number;
}

export interface CartItem extends Pizza {
  cartId: string; // Unique ID for the specific combination (pizza + opts)
  quantity: number;
  selectedCrust: OptionItem | null;
  selectedAddons: OptionItem[];
  observation: string;
  unitTotal: number; // Base price + extras
  
  // Half and Half specific properties
  isHalfHalf?: boolean;
  secondFlavor?: Pizza;
}

export enum RecommendationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AIReply {
  text: string;
  recommendedPizzaId?: number;
}

export interface User {
  name: string;
  phone: string;
  isAdmin?: boolean;
  cashbackBalance?: number; // Balance available for redemption
  avatar?: string; // URL or base64 image for user avatar
  address?: string; // User's default address
}

// Admin & PDV Types
export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  active: boolean;
  expirationDate: string; // YYYY-MM-DD
}

export interface CashbackSettings {
  enabled: boolean;
  percentage: number;
  validityDays: number; // Days valid after purchase
  campaignEndDate?: string; // Date when the program ends
}

export interface BusinessHours {
  weekdays: string; // Ex: "18:00 - 23:00"
  weekends: string; // Ex: "18:00 - 00:00"
}

export interface ThemeSettings {
  primaryColor: string; // brand-orange
  secondaryColor: string; // brand-green
  accentColor: string; // brand-yellow
  storeName?: string;
  logo?: string; // Base64 image string
  backgroundImage?: string; // Base64 image string for site background
  businessHours?: BusinessHours;
  operatingDays?: string; // Ex: "Segunda a Domingo"
  paymentMethods?: string[]; // Ex: ["Dinheiro", "Cartão", "PIX", "Vale Refeição"]
  halfPizzaPolicy?: string; // Ex: "Será cobrado pelo maior valor"
  priceDisclaimer?: string; // Ex: "Preços sujeitos a alteração sem aviso prévio"
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  image: string; // Base64
  colorTheme: 'orange' | 'green' | 'red';
}

export interface Category {
  id: string;
  name: string;
}

export interface PromotionProduct {
  id: string;
  name: string;
  image: string;
}

export interface Promotion {
  enabled: boolean;
  minValue: number; // Valor mínimo para ganhar o brinde
  products: PromotionProduct[]; // Refrigerantes disponíveis
}

// Order Management Types
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  pizzaId: number;
  pizzaName: string;
  pizzaImage: string;
  quantity: number;
  unitPrice: number;
  total: number;
  crust?: string;
  addons?: string[];
  observation?: string;
  isHalfHalf?: boolean;
  secondFlavorName?: string;
}

export interface Order {
  id: string; // Unique order ID
  orderNumber: number; // Sequential number for display
  customerId: string; // User phone
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  estimatedTime?: number; // Minutes
}

export interface FavoritePizza {
  userId: string; // User phone
  pizzaId: number;
  addedAt: string; // ISO timestamp
}
