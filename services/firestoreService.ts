import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Order, Pizza, User, FavoritePizza, Coupon, ThemeSettings } from '../types';

// Collections
const ORDERS_COLLECTION = 'orders';
const PIZZAS_COLLECTION = 'pizzas';
const USERS_COLLECTION = 'users';
const FAVORITES_COLLECTION = 'favorites';
const COUPONS_COLLECTION = 'coupons';
const SETTINGS_COLLECTION = 'settings';

// ==================== ORDERS ====================

export const saveOrder = async (order: Order): Promise<void> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, order.id);
    await setDoc(orderRef, {
      ...order,
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: order.updatedAt || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('customerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Order);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Order);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// ==================== PIZZAS ====================

export const savePizza = async (pizza: Pizza): Promise<void> => {
  try {
    const pizzaRef = doc(db, PIZZAS_COLLECTION, pizza.id.toString());
    await setDoc(pizzaRef, pizza);
  } catch (error) {
    console.error('Error saving pizza:', error);
    throw error;
  }
};

export const getAllPizzas = async (): Promise<Pizza[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PIZZAS_COLLECTION));
    return querySnapshot.docs.map(doc => doc.data() as Pizza);
  } catch (error) {
    console.error('Error fetching pizzas:', error);
    return [];
  }
};

export const updatePizza = async (pizzaId: number, updates: Partial<Pizza>): Promise<void> => {
  try {
    const pizzaRef = doc(db, PIZZAS_COLLECTION, pizzaId.toString());
    await updateDoc(pizzaRef, updates);
  } catch (error) {
    console.error('Error updating pizza:', error);
    throw error;
  }
};

export const deletePizza = async (pizzaId: number): Promise<void> => {
  try {
    const pizzaRef = doc(db, PIZZAS_COLLECTION, pizzaId.toString());
    await deleteDoc(pizzaRef);
  } catch (error) {
    console.error('Error deleting pizza:', error);
    throw error;
  }
};

// ==================== USERS ====================

export const saveUser = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, user.phone);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const getUser = async (phone: string): Promise<User | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, phone);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() as User : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// ==================== FAVORITES ====================

export const saveFavorite = async (favorite: FavoritePizza): Promise<void> => {
  try {
    const favoriteId = `${favorite.userId}_${favorite.pizzaId}`;
    const favoriteRef = doc(db, FAVORITES_COLLECTION, favoriteId);
    await setDoc(favoriteRef, favorite);
  } catch (error) {
    console.error('Error saving favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (userId: string, pizzaId: number): Promise<void> => {
  try {
    const favoriteId = `${userId}_${pizzaId}`;
    const favoriteRef = doc(db, FAVORITES_COLLECTION, favoriteId);
    await deleteDoc(favoriteRef);
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const getUserFavorites = async (userId: string): Promise<FavoritePizza[]> => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FavoritePizza);
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return [];
  }
};

// ==================== COUPONS ====================

export const saveCoupon = async (coupon: Coupon): Promise<void> => {
  try {
    const couponRef = doc(db, COUPONS_COLLECTION, coupon.id);
    await setDoc(couponRef, coupon);
  } catch (error) {
    console.error('Error saving coupon:', error);
    throw error;
  }
};

export const getAllCoupons = async (): Promise<Coupon[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COUPONS_COLLECTION));
    return querySnapshot.docs.map(doc => doc.data() as Coupon);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
};

// ==================== SETTINGS ====================

export const saveThemeSettings = async (theme: ThemeSettings): Promise<void> => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'theme');
    await setDoc(settingsRef, theme);
  } catch (error) {
    console.error('Error saving theme settings:', error);
    throw error;
  }
};

export const getThemeSettings = async (): Promise<ThemeSettings | null> => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'theme');
    const settingsDoc = await getDoc(settingsRef);
    return settingsDoc.exists() ? settingsDoc.data() as ThemeSettings : null;
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    return null;
  }
};

// ==================== SYNC HELPERS ====================

// Sync localStorage data to Firebase (migration helper)
export const syncLocalStorageToFirebase = async (): Promise<void> => {
  try {
    // Sync orders
    const orders = localStorage.getItem('pv_orders');
    if (orders) {
      const parsedOrders: Order[] = JSON.parse(orders);
      for (const order of parsedOrders) {
        await saveOrder(order);
      }
    }

    // Sync favorites
    const favorites = localStorage.getItem('pv_favorites');
    if (favorites) {
      const parsedFavorites: FavoritePizza[] = JSON.parse(favorites);
      for (const favorite of parsedFavorites) {
        await saveFavorite(favorite);
      }
    }

    console.log('✅ Sync completed successfully!');
  } catch (error) {
    console.error('Error syncing to Firebase:', error);
    throw error;
  }
};
