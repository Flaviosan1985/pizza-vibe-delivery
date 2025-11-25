
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pizza, Coupon, CashbackSettings, ThemeSettings, OptionItem, BannerItem, Category } from '../types';
import { PIZZAS as INITIAL_PIZZAS, CRUST_OPTIONS as INITIAL_CRUSTS, ADDON_OPTIONS as INITIAL_ADDONS } from '../constants';

interface AdminContextData {
  pizzas: Pizza[];
  crusts: OptionItem[];
  addons: OptionItem[];
  coupons: Coupon[];
  cashback: CashbackSettings;
  theme: ThemeSettings;
  banners: BannerItem[];
  categories: Category[];
  
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

  // --- Persistence ---
  useEffect(() => { localStorage.setItem('pv_pizzas', JSON.stringify(pizzas)); }, [pizzas]);
  useEffect(() => { localStorage.setItem('pv_crusts', JSON.stringify(crusts)); }, [crusts]);
  useEffect(() => { localStorage.setItem('pv_addons', JSON.stringify(addons)); }, [addons]);
  useEffect(() => { localStorage.setItem('pv_coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem('pv_banners', JSON.stringify(banners)); }, [banners]);
  useEffect(() => { localStorage.setItem('pv_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('pv_cashback', JSON.stringify(cashback)); }, [cashback]);
  useEffect(() => { localStorage.setItem('pv_theme', JSON.stringify(theme)); }, [theme]);

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
  };

  const updatePizza = (updatedPizza: Pizza) => {
    setPizzas(prev => prev.map(p => p.id === updatedPizza.id ? updatedPizza : p));
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
  };

  const removeCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const toggleCoupon = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
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
      updateCashback,
      updateTheme,
      validateCoupon
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
