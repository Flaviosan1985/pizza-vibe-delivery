
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pizza, Coupon, CashbackSettings, ThemeSettings, OptionItem, BannerItem, Category, Promotion, PromotionProduct, Order, OrderStatus, FavoritePizza } from '../types';
import { PIZZAS as INITIAL_PIZZAS, CRUST_OPTIONS as INITIAL_CRUSTS, ADDON_OPTIONS as INITIAL_ADDONS } from '../constants';
// Firestore integration (optional, falls back to localStorage if not configured)
import { saveOrder as saveOrderToDB, updateOrderStatus as updateOrderStatusInDB, savePizza as savePizzaToDB, saveCoupon as saveCouponToDB, saveFavorite as saveFavoriteToDB, removeFavorite as removeFavoriteFromDB } from '../services/firestoreService';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebaseConfig';

interface AdminContextData {
  pizzas: Pizza[];
  crusts: OptionItem[];
  addons: OptionItem[];
  coupons: Coupon[];
  cashback: CashbackSettings;
  theme: ThemeSettings;
  banners: BannerItem[];
  categories: Category[];
  promotion: Promotion;
  orders: Order[];
  favorites: FavoritePizza[];
  isFirebaseConnected: boolean;
  onOrderStatusChange?: (order: Order, newStatus: OrderStatus) => void;
  
  // Pizza Actions
  addPizza: (pizza: Pizza) => void;
  updatePizza: (updatedPizza: Pizza) => void;
  togglePizzaAvailability: (id: number) => void;
  deletePizza: (id: number) => void;

  // Options Actions
  addOption: (type: 'crust' | 'addon', option: OptionItem) => void;
  updateOption: (type: 'crust' | 'addon', option: OptionItem) => void;
  removeOption: (type: 'crust' | 'addon', id: string) => void;

  // Category Actions
  addCategory: (category: Category) => void;
  updateCategory: (id: string, name: string) => void;
  removeCategory: (id: string) => void;

  // Banner Actions
  addBanner: (banner: BannerItem) => void;
  removeBanner: (id: string) => void;

  // Promotion Actions
  updatePromotion: (settings: Promotion) => void;
  addPromotionProduct: (product: PromotionProduct) => void;
  updatePromotionProduct: (product: PromotionProduct) => void;
  removePromotionProduct: (id: string) => void;

  // Order Actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByUser: (userId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  setOnOrderStatusChange: (callback: (order: Order, newStatus: OrderStatus) => void) => void;

  // Favorite Actions
  toggleFavorite: (userId: string, pizzaId: number) => void;
  isFavorite: (userId: string, pizzaId: number) => boolean;
  getUserFavorites: (userId: string) => number[];

  // Other Actions
  addCoupon: (coupon: Coupon) => void;
  removeCoupon: (id: string) => void;
  toggleCoupon: (id: string) => void;
  updateCashback: (settings: CashbackSettings) => void;
  updateTheme: (settings: ThemeSettings) => void;
  validateCoupon: (code: string, subtotal: number) => number;
}

const AdminContext = createContext<AdminContextData>({} as AdminContextData);

const INITIAL_BANNERS: BannerItem[] = [
  {
    id: '1',
    title: "PROMOÇÃO DO DIA",
    subtitle: "Peça 2 Grandes e ganhe o refri!",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2070&auto=format&fit=crop",
    colorTheme: 'red'
  },
  {
    id: '2',
    title: "A MAIS PEDIDA",
    subtitle: "Pepperoni com Borda de Catupiry",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1780&auto=format&fit=crop",
    colorTheme: 'orange'
  },
  {
    id: '3',
    title: "DICA DO CHEF",
    subtitle: "Experimente a nova Quatro Queijos Trufada",
    image: "https://images.unsplash.com/photo-1573821663912-6df460f9c684?q=80&w=1974&auto=format&fit=crop",
    colorTheme: 'green'
  }
];

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State Initialization ---
  
  // Firebase connection state
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  
  // Menu (Pizzas)
  const [pizzas, setPizzas] = useState<Pizza[]>(() => {
    const saved = localStorage.getItem('pv_pizzas');
    return saved ? JSON.parse(saved) : INITIAL_PIZZAS.map(p => ({...p, available: true}));
  });

  // Crusts (Bordas)
  const [crusts, setCrusts] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem('pv_crusts');
    return saved ? JSON.parse(saved) : INITIAL_CRUSTS;
  });

  // Addons (Extras)
  const [addons, setAddons] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem('pv_addons');
    return saved ? JSON.parse(saved) : INITIAL_ADDONS;
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('pv_coupons');
    return saved ? JSON.parse(saved) : [];
  });

  // Banners
  const [banners, setBanners] = useState<BannerItem[]>(() => {
    const saved = localStorage.getItem('pv_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('pv_categories');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Clássica' },
      { id: '2', name: 'Premium' },
      { id: '3', name: 'Doce' },
      { id: '4', name: 'Broto' }
    ];
  });

  // Promotion
  const [promotion, setPromotion] = useState<Promotion>(() => {
    const saved = localStorage.getItem('pv_promotion');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      minValue: 86.00,
      products: [
        { id: 'refri-1', name: 'Frutuba 2L', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400' }
      ]
    };
  });

  // Cashback
  const [cashback, setCashback] = useState<CashbackSettings>(() => {
    const saved = localStorage.getItem('pv_cashback');
    return saved ? JSON.parse(saved) : { enabled: false, percentage: 5, validityDays: 30, campaignEndDate: '' };
  });

  // Theme
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('pv_theme');
    return saved ? JSON.parse(saved) : {
      primaryColor: '#D62828',
      secondaryColor: '#009246',
      accentColor: '#F4C430',
      storeName: 'PizzaVibe',
      logo: '',
      backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop'
    };
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pv_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [orderCounter, setOrderCounter] = useState<number>(() => {
    const saved = localStorage.getItem('pv_orderCounter');
    return saved ? parseInt(saved) : 1;
  });

  // Favorites
  const [favorites, setFavorites] = useState<FavoritePizza[]>(() => {
    const saved = localStorage.getItem('pv_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Notification callback
  const [orderStatusChangeCallback, setOrderStatusChangeCallback] = useState<((order: Order, newStatus: OrderStatus) => void) | undefined>();

  // --- Persistence ---
  useEffect(() => { localStorage.setItem('pv_pizzas', JSON.stringify(pizzas)); }, [pizzas]);
  useEffect(() => { localStorage.setItem('pv_crusts', JSON.stringify(crusts)); }, [crusts]);
  useEffect(() => { localStorage.setItem('pv_addons', JSON.stringify(addons)); }, [addons]);
  useEffect(() => { localStorage.setItem('pv_coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem('pv_banners', JSON.stringify(banners)); }, [banners]);
  useEffect(() => { localStorage.setItem('pv_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('pv_promotion', JSON.stringify(promotion)); }, [promotion]);
  useEffect(() => { localStorage.setItem('pv_cashback', JSON.stringify(cashback)); }, [cashback]);
  useEffect(() => { localStorage.setItem('pv_theme', JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem('pv_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('pv_orderCounter', orderCounter.toString()); }, [orderCounter]);
  useEffect(() => { localStorage.setItem('pv_favorites', JSON.stringify(favorites)); }, [favorites]);

  // Try to hydrate and subscribe to orders from Firestore on startup (if configured)
  useEffect(() => {
    let unsubscribeOrders: undefined | (() => void);
    let unsubscribePizzas: undefined | (() => void);
    let unsubscribeCoupons: undefined | (() => void);
    let unsubscribeFavorites: undefined | (() => void);
    
    (async () => {
      if (!isFirebaseConfigured() || !db) {
        console.warn('[PDV] Firestore não configurado. Usando modo local (localStorage).');
        setIsFirebaseConnected(false);
        return;
      }

      try {
        // Test connection with orders listener
        const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        unsubscribeOrders = onSnapshot(ordersQuery, 
          (snap) => {
            const remoteOrders = snap.docs.map(doc => doc.data() as Order);
            setOrders(remoteOrders);
            const maxOrderNumber = remoteOrders.reduce((max, o) => Math.max(max, Number(o.orderNumber || 0)), 0);
            setOrderCounter(isFinite(maxOrderNumber) && maxOrderNumber > 0 ? maxOrderNumber + 1 : 1);
            setIsFirebaseConnected(true);
          },
          (error) => {
            console.warn('[PDV] Erro no listener de pedidos:', error);
            setIsFirebaseConnected(false);
          }
        );

        // Real-time listener for pizzas
        const pizzasQuery = query(collection(db, 'pizzas'));
        unsubscribePizzas = onSnapshot(pizzasQuery,
          (snap) => {
            if (!snap.empty) {
              const remotePizzas = snap.docs.map(doc => doc.data() as Pizza);
              setPizzas(remotePizzas);
            }
          },
          (error) => {
            console.warn('[PDV] Erro no listener de pizzas:', error);
          }
        );

        // Real-time listener for coupons
        const couponsQuery = query(collection(db, 'coupons'));
        unsubscribeCoupons = onSnapshot(couponsQuery,
          (snap) => {
            if (!snap.empty) {
              const remoteCoupons = snap.docs.map(doc => doc.data() as Coupon);
              setCoupons(remoteCoupons);
            }
          },
          (error) => {
            console.warn('[PDV] Erro no listener de cupons:', error);
          }
        );

        // Real-time listener for favorites
        const favoritesQuery = query(collection(db, 'favorites'));
        unsubscribeFavorites = onSnapshot(favoritesQuery,
          (snap) => {
            if (!snap.empty) {
              const remoteFavorites = snap.docs.map(doc => doc.data() as FavoritePizza);
              setFavorites(remoteFavorites);
            }
          },
          (error) => {
            console.warn('[PDV] Erro no listener de favoritos:', error);
          }
        );

      } catch (err) {
        console.warn('[PDV] Firestore não disponível. Usando localStorage.', err);
        setIsFirebaseConnected(false);
      }
    })();

    return () => { 
      try { 
        unsubscribeOrders && unsubscribeOrders();
        unsubscribePizzas && unsubscribePizzas();
        unsubscribeCoupons && unsubscribeCoupons();
        unsubscribeFavorites && unsubscribeFavorites();
      } catch { /* noop */ } 
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Theme Application ---
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-brand-orange', theme.primaryColor);
    root.style.setProperty('--color-brand-green', theme.secondaryColor);
    root.style.setProperty('--color-brand-yellow', theme.accentColor);
  }, [theme]);

  // --- Actions ---

  const addPizza = (pizza: Pizza) => {
    setPizzas(prev => [pizza, ...prev]);
    // Sync to Firebase if connected
    if (isFirebaseConnected) {
      try {
        savePizzaToDB(pizza).catch(() => {/* noop */});
      } catch (_) { /* ignore */ }
    }
  };

  const updatePizza = (updatedPizza: Pizza) => {
    setPizzas(prev => prev.map(p => p.id === updatedPizza.id ? updatedPizza : p));
    // Sync to Firebase if connected
    if (isFirebaseConnected) {
      try {
        savePizzaToDB(updatedPizza).catch(() => {/* noop */});
      } catch (_) { /* ignore */ }
    }
  };

  const deletePizza = (id: number) => {
    setPizzas(prev => prev.filter(p => p.id !== id));
  };

  const togglePizzaAvailability = (id: number) => {
    setPizzas(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };

  const addOption = (type: 'crust' | 'addon', option: OptionItem) => {
    if (type === 'crust') setCrusts(prev => [...prev, option]);
    else setAddons(prev => [...prev, option]);
  };

  const updateOption = (type: 'crust' | 'addon', option: OptionItem) => {
    if (type === 'crust') setCrusts(prev => prev.map(o => o.id === option.id ? option : o));
    else setAddons(prev => prev.map(o => o.id === option.id ? option : o));
  };

  const removeOption = (type: 'crust' | 'addon', id: string) => {
    if (type === 'crust') setCrusts(prev => prev.filter(o => o.id !== id));
    else setAddons(prev => prev.filter(o => o.id !== id));
  };

  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const removeCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addBanner = (banner: BannerItem) => {
    setBanners(prev => [...prev, banner]);
  };

  const removeBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [...prev, coupon]);
    // Sync to Firebase if connected
    if (isFirebaseConnected) {
      try {
        saveCouponToDB(coupon).catch(() => {/* noop */});
      } catch (_) { /* ignore */ }
    }
  };

  const removeCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const toggleCoupon = (id: string) => {
    setCoupons(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, active: !c.active } : c);
      // Sync to Firebase if connected
      if (isFirebaseConnected) {
        const updatedCoupon = updated.find(c => c.id === id);
        if (updatedCoupon) {
          try {
            saveCouponToDB(updatedCoupon).catch(() => {/* noop */});
          } catch (_) { /* ignore */ }
        }
      }
      return updated;
    });
  };

  const updateCashback = (settings: CashbackSettings) => {
    setCashback(settings);
  };

  const updateTheme = (settings: ThemeSettings) => {
    setTheme(settings);
  };

  const validateCoupon = (code: string, subtotal: number): number => {
    if (!code || subtotal <= 0) return 0;
    
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) return 0; // Not found
    if (!coupon.active) return 0; // Paused

    // Check expiration
    if (coupon.expirationDate) {
      const today = new Date();
      const expDate = new Date(coupon.expirationDate + 'T23:59:59'); // End of day validity
      if (today > expDate) return 0; // Expired
    }
    
    if (coupon.type === 'percent') {
      return (subtotal * coupon.value) / 100;
    } else {
      return Math.min(coupon.value, subtotal);
    }
  };

  // --- Promotion Actions ---
  const updatePromotion = (settings: Promotion) => {
    setPromotion(settings);
  };

  const addPromotionProduct = (product: PromotionProduct) => {
    setPromotion(prev => ({
      ...prev,
      products: [...prev.products, product]
    }));
  };

  const updatePromotionProduct = (product: PromotionProduct) => {
    setPromotion(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === product.id ? product : p)
    }));
  };

  const removePromotionProduct = (id: string) => {
    setPromotion(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  // --- Order Actions ---
  const addOrder = (order: Order) => {
    const newOrder = {
      ...order,
      orderNumber: orderCounter,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    setOrderCounter(prev => prev + 1);

    // Write-through to Firestore (best-effort) only if connected
    if (isFirebaseConnected) {
      try {
        saveOrderToDB(newOrder as Order).catch(() => {/* noop */});
      } catch (_) { /* ignore */ }
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => {
      const updatedOrders = prev.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status, updatedAt: new Date().toISOString() };
          
          // Trigger notification callback
          if (orderStatusChangeCallback) {
            setTimeout(() => orderStatusChangeCallback(updatedOrder, status), 100);
          }
          
          // Send WhatsApp link when order is ready
          if (status === 'ready') {
            const message = `🎉 *Seu pedido está pronto!*\n\nPedido #${order.orderNumber}\nCliente: ${order.customerName}\n\nSeu pedido está prontinho e te esperando! 🍕\n\n${order.deliveryAddress ? '🛵 Saiu para entrega!' : '📍 Pode retirar na loja!'}`;
            const whatsappUrl = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
            
            // Open WhatsApp in new tab
            if (typeof window !== 'undefined') {
              window.open(whatsappUrl, '_blank');
            }
          }
          
          return updatedOrder;
        }
        return order;
      });

      // Persist status update to Firestore (best-effort) only if connected
      if (isFirebaseConnected) {
        try {
          updateOrderStatusInDB(orderId, status).catch(() => {/* noop */});
        } catch (_) { /* ignore */ }
      }

      return updatedOrders;
    });
  };

  const getOrdersByUser = (userId: string): Order[] => {
    return orders.filter(order => order.customerId === userId);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  // --- Favorite Actions ---
  const toggleFavorite = (userId: string, pizzaId: number) => {
    const existingFav = favorites.find(f => f.userId === userId && f.pizzaId === pizzaId);
    
    if (existingFav) {
      // Remove favorite
      setFavorites(prev => prev.filter(f => !(f.userId === userId && f.pizzaId === pizzaId)));
      // Sync to Firebase if connected
      if (isFirebaseConnected) {
        try {
          removeFavoriteFromDB(userId, pizzaId).catch(() => {/* noop */});
        } catch (_) { /* ignore */ }
      }
    } else {
      // Add favorite
      const newFav = {
        userId,
        pizzaId,
        addedAt: new Date().toISOString()
      };
      setFavorites(prev => [...prev, newFav]);
      // Sync to Firebase if connected
      if (isFirebaseConnected) {
        try {
          saveFavoriteToDB(newFav).catch(() => {/* noop */});
        } catch (_) { /* ignore */ }
      }
    }
  };

  const isFavorite = (userId: string, pizzaId: number): boolean => {
    return favorites.some(f => f.userId === userId && f.pizzaId === pizzaId);
  };

  const getUserFavorites = (userId: string): number[] => {
    return favorites
      .filter(f => f.userId === userId)
      .map(f => f.pizzaId);
  };

  const setOnOrderStatusChange = (callback: (order: Order, newStatus: OrderStatus) => void) => {
    setOrderStatusChangeCallback(() => callback);
  };

  return (
    <AdminContext.Provider value={{
      pizzas,
      crusts,
      addons,
      coupons,
      cashback,
      theme,
      banners,
      categories,
      promotion,
      orders,
      favorites,
      isFirebaseConnected,
      addPizza,
      updatePizza,
      deletePizza,
      togglePizzaAvailability,
      addOption,
      updateOption,
      removeOption,
      addCategory,
      updateCategory,
      removeCategory,
      addBanner,
      removeBanner,
      addCoupon,
      removeCoupon,
      toggleCoupon,
      updatePromotion,
      addPromotionProduct,
      updatePromotionProduct,
      removePromotionProduct,
      addOrder,
      updateOrderStatus,
      getOrdersByUser,
      getOrderById,
      setOnOrderStatusChange,
      toggleFavorite,
      isFavorite,
      getUserFavorites,
      updateCashback,
      updateTheme,
      validateCoupon,
      onOrderStatusChange: orderStatusChangeCallback
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
