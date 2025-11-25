
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

export interface ThemeSettings {
  primaryColor: string; // brand-orange
  secondaryColor: string; // brand-green
  accentColor: string; // brand-yellow
  storeName?: string;
  logo?: string; // Base64 image string
  backgroundImage?: string; // Base64 image string for site background
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
