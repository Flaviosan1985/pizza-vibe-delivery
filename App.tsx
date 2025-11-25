
import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PizzaCard from './components/PizzaCard';
import CartSidebar from './components/CartSidebar';
import AISommelier from './components/AISommelier';
import PizzaModal from './components/PizzaModal';
import PizzaMeioAMeio, { HalfHalfCartItem } from './components/PizzaMeioAMeio';
import LoginScreen from './components/LoginScreen';
import CheckoutPage, { PaymentInfo } from './components/CheckoutPage';
import FloatingCartButton from './components/FloatingCartButton';
import AdminDashboard from './components/AdminDashboard';
import CartPage from './components/CartPage';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
// REMOVED static imports of CRUST_OPTIONS, ADDON_OPTIONS
import { Pizza, CartItem, User, Category } from './types';
import { Phone, MapPin, Instagram, Facebook, Search, X, CircleDashed } from 'lucide-react';

// Utility function to normalize accents for string comparison (e.g., "Clássica" → "Classica")
const normalizeAccents = (str: string): string => 
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Wrapper component to provide context to the inner App logic
const AppWrapper: React.FC = () => {
  return (
    <AdminProvider>
      <App />
    </AdminProvider>
  );
};

const App: React.FC = () => {
  // Use Context for Data (Pizzas, Crusts, Addons, Categories)
  const { pizzas, crusts, addons, theme, categories, promotion } = useAdmin();

  // Authentication State
  const [user, setUser] = useState<User | null>(null);

  // App Flow State
  const [currentView, setCurrentView] = useState<'home' | 'checkout' | 'admin' | 'cart'>('home');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeMenuTab, setActiveMenuTab] = useState<'traditional' | 'half' | 'broto' | 'sweet'>('traditional');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customization modal state
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Half and Half Modal state
  const [isHalfHalfOpen, setIsHalfHalfOpen] = useState(false);

  // Animation state
  const [animatingItem, setAnimatingItem] = useState<CartItem | null>(null);
  const [recommendedId, setRecommendedId] = useState<number | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Initialize Logic
  useEffect(() => {
    // Theme defaults to dark/elegant
    document.documentElement.classList.add('dark');
    setIsDarkMode(true);

    // Persisted User
    const savedUser = localStorage.getItem('pizzaVibeUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser.isAdmin) {
          setCurrentView('admin');
        }
      } catch (e) { console.error("Failed to parse user"); }
    }
  }, []);

  // Auto-add promotional item when threshold is reached
  useEffect(() => {
    if (!promotion.enabled || promotion.products.length === 0) return;
    
    const subtotal = cart.reduce((acc, item) => acc + (item.unitTotal * item.quantity), 0);
    const hasPromotionalItem = cart.some(item => item.id === 99999);
    
    if (subtotal >= promotion.minValue && !hasPromotionalItem) {
      // Add promotional item automatically
      const promoProduct = promotion.products[0];
      const promotionalItem: CartItem = {
        id: 99999,
        name: promoProduct.name,
        description: '🎁 Brinde promocional - GRÁTIS',
        price: 0,
        image: promoProduct.image,
        category: 'Bebida',
        rating: 5,
        cartId: 'promo-gift',
        quantity: 1,
        selectedCrust: null,
        selectedAddons: [],
        observation: '',
        unitTotal: 0,
        available: true
      };
      setCart(prev => [...prev, promotionalItem]);
    } else if (subtotal < promotion.minValue && hasPromotionalItem) {
      // Remove promotional item if user reduces cart below threshold
      setCart(prev => prev.filter(item => item.id !== 99999));
    }
  }, [cart, promotion]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('pizzaVibeUser', JSON.stringify(newUser));
    if (newUser.isAdmin) {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pizzaVibeUser');
    setCart([]);
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} logo={theme.logo} storeName={theme.storeName} backgroundImage={theme.backgroundImage} />;
  }

  // --- ADMIN VIEW ---
  if (currentView === 'admin' && user.isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // --- Main Customer Logic ---

  const handleSelectPizza = (pizza: Pizza) => {
    if (pizza.category === 'Meio a Meio') {
      setIsHalfHalfOpen(true);
    } else {
      setSelectedPizza(pizza);
      setIsModalOpen(true);
    }
  };

  const handleAddToCart = (item: CartItem) => {
    setIsModalOpen(false);
    startAddToCartAnimation(item);
  };

  const handleAddHalfHalfToCart = (item: HalfHalfCartItem) => {
    setIsHalfHalfOpen(false);
    const primaryFlavor = item.flavors[0];
    const secondaryFlavor = item.flavors[1];

    const newCartItem: CartItem = {
      id: 9999, 
      name: primaryFlavor.name, 
      description: `½ ${primaryFlavor.name} e ½ ${secondaryFlavor?.name || '...' }`,
      price: item.totalPrice, 
      image: primaryFlavor.image,
      category: 'Meio a Meio',
      rating: 5,
      cartId: `half-${Date.now()}`,
      quantity: 1,
      selectedCrust: item.crust ? { id: item.crust.id, name: item.crust.name, price: item.crust.price } : null,
      selectedAddons: item.addons.map(a => ({ id: a.id, name: a.name, price: a.price })),
      observation: item.observation,
      unitTotal: item.totalPrice,
      isHalfHalf: true,
      secondFlavor: secondaryFlavor ? { ...secondaryFlavor, category: 'Classica', rating: 0, available: true } : undefined,
      available: true
    };
    startAddToCartAnimation(newCartItem);
  };

  const startAddToCartAnimation = (item: CartItem) => {
    setAnimatingItem(item);
    setTimeout(() => {
      setCart(prev => [...prev, item]);
      setAnimatingItem(null);
    }, 800);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo(0, 0);
  };
  
  const handleOpenCartPage = () => {
     setIsCartOpen(false);
     setCurrentView('cart');
     window.scrollTo(0,0);
  }

  const handleSendOrderToWhatsApp = (address: any, payment: PaymentInfo, deliveryMode: 'delivery' | 'pickup') => {
    if (!user) return;
    const fmt = (n: number) => n.toFixed(2).replace('.', ',');

    const subtotal = cart.reduce((acc, item) => acc + (item.unitTotal * item.quantity), 0);
    const deliveryFee = deliveryMode === 'pickup' ? 0 : 5.00;
    const total = subtotal + deliveryFee;

    let text = `*NOVO PEDIDO - ${theme.storeName || 'PizzaVibe'}*\n\n`;
    text += `👤 *Cliente:* ${user.name}\n`;
    text += `📱 *Telefone:* ${user.phone}\n\n`;
    text += `🛵 *Tipo:* ${deliveryMode === 'delivery' ? 'ENTREGA' : 'RETIRADA NA LOJA'}\n`;
    
    if (deliveryMode === 'delivery' && address) {
      text += `📍 *Endereço:*\n${address.street}, ${address.number}\n`;
      if (address.complement) text += `Comp: ${address.complement}\n`;
      text += `${address.neighborhood} - ${address.city}\n`;
    }

    text += `\n🍕 *PEDIDO:*\n`;
    cart.forEach(item => {
      text += `\n▪️ ${item.quantity}x ${item.name} (R$ ${fmt(item.unitTotal * item.quantity)})`;
      if (item.isHalfHalf && item.description) text += `\n   ↪ _${item.description}_`;
      if (item.selectedCrust) text += `\n   ↪ Borda: ${item.selectedCrust.name}`;
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        text += `\n   ↪ Extras: ${item.selectedAddons.map(a => a.name).join(', ')}`;
      }
      if (item.observation) text += `\n   ↪ Obs: ${item.observation}`;
    });

    text += `\n\n💰 *PAGAMENTO:* ${payment.method === 'credit' ? 'Cartão Crédito' : payment.method === 'debit' ? 'Cartão Débito' : payment.method === 'pix' ? 'PIX' : 'Dinheiro'}`;
    if (payment.method === 'cash' && payment.changeFor) text += `\nTroco para: R$ ${payment.changeFor}`;
    text += `\n\n🧾 *TOTAL: R$ ${fmt(total)}*`;

    window.open(`https://wa.me/5513996511793?text=${encodeURIComponent(text)}`, '_blank');
  };

  const scrollToMenu = () => menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  const handleAIRecommendation = (id: number) => {
    setRecommendedId(id);
    scrollToMenu();
    setTimeout(() => setRecommendedId(null), 10000);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Helper para buscar categoria por ID ou nome (compatibilidade com sistema antigo)
  const getCategoryForPizza = (p: Pizza): Category | undefined => {
    if (p.categoryId) {
      return categories.find(c => c.id === p.categoryId);
    }
    // Fallback: buscar por nome exato com normalização de acentos
    if (p.category) {
      const pizzaCategoryLower = p.category.toLowerCase();
      const pizzaCategoryNormalized = normalizeAccents(pizzaCategoryLower);
      
      return categories.find(c => {
        const categoryNameLower = c.name.toLowerCase();
        return categoryNameLower === pizzaCategoryLower ||
               normalizeAccents(categoryNameLower) === pizzaCategoryNormalized;
      });
    }
    return undefined;
  };

  // Helpers for filtering logic using dynamic pizza list
  const halfHalfProduct = pizzas.find(p => p.category === 'Meio a Meio');
  const halfHalfProducts = pizzas.filter(p => p.category !== 'Meio a Meio' && p.available !== false);
  
  // Combine dynamic extras for the Half/Half builder
  const halfHalfExtras = [
    ...crusts.map(c => ({ ...c, type: 'crust' as const })),
    ...addons.map(a => ({ ...a, type: 'addon' as const }))
  ];

  // Helper to check if a pizza belongs to a category (supports both categoryId and legacy category string)
  const pizzaBelongsToCategory = (pizza: Pizza, category: Category): boolean => {
    if (pizza.categoryId) {
      return pizza.categoryId === category.id;
    }
    // Fallback: match by category name (case-insensitive, handles accent variations)
    if (pizza.category) {
      const categoryNameLower = category.name.toLowerCase();
      const pizzaCategoryLower = pizza.category.toLowerCase();
      
      // Exact match (case-insensitive) or accent-normalized match
      return categoryNameLower === pizzaCategoryLower ||
             normalizeAccents(categoryNameLower) === normalizeAccents(pizzaCategoryLower);
    }
    return false;
  };

  const renderTabPizzaGrid = (filterFn: (p: Pizza) => boolean) => {
    const filteredPizzas = pizzas.filter(p => filterFn(p) && p.available !== false);

    if (filteredPizzas.length === 0) {
      return (
        <div className="text-center py-16">
           <div className="inline-block p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full mb-4">
              <CircleDashed size={32} className="text-gray-400" />
           </div>
           <p className="text-gray-400">Nenhuma pizza disponível nesta categoria no momento.</p>
        </div>
      );
    }

    // Agrupar pizzas por categoryId ou category string usando as categorias dinâmicas
    const categoriesInTab = categories
      .filter(cat => filteredPizzas.some(p => pizzaBelongsToCategory(p, cat)))
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div className="space-y-8 md:space-y-12 animate-slide-up">
        {categoriesInTab.map(category => {
          const pizzasInCategory = filteredPizzas.filter(p => pizzaBelongsToCategory(p, category));
          return (
            <div key={category.id}>
              <h4 className="font-display text-xl md:text-3xl font-bold mb-4 md:mb-6 text-white tracking-tight border-b border-white/10 pb-3 flex items-center gap-3">
                <span className="w-1.5 h-6 md:h-8 bg-brand-orange rounded-full"></span>
                {category.name}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                {pizzasInCategory.map(pizza => (
                  <div key={pizza.id} className="h-full">
                    <PizzaCard 
                      pizza={pizza} 
                      onSelect={handleSelectPizza} 
                      isRecommended={recommendedId === pizza.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGlobalSearchResults = () => {
     const allMatches = pizzas.filter(p => {
        if (p.category === 'Meio a Meio' || p.available === false) return false;
        return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               p.description.toLowerCase().includes(searchQuery.toLowerCase());
     });

     if (allMatches.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-16 animate-slide-up text-center px-4">
             <h3 className="font-display text-2xl font-bold text-white mb-2">Nenhum resultado para "{searchQuery}"</h3>
             <button onClick={() => setSearchQuery('')} className="px-8 py-3 bg-brand-orange text-white rounded-full font-bold mt-4 hover:bg-orange-600 transition">Limpar busca</button>
          </div>
        );
     }

     // Agrupar por categoryId ou category string usando categorias dinâmicas
     const categoriesInResults = categories
       .filter(cat => allMatches.some(p => pizzaBelongsToCategory(p, cat)))
       .sort((a, b) => a.name.localeCompare(b.name));
     
     return (
        <div className="space-y-12 animate-slide-up">
           <div className="bg-brand-orange/10 border border-brand-orange/30 p-4 rounded-2xl mb-8 flex items-center justify-between backdrop-blur-md">
              <span className="text-brand-orange font-bold font-display">🔍 Resultados para "{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="text-sm text-gray-400 hover:text-white underline">Limpar</button>
           </div>
           {categoriesInResults.map(category => {
              const pizzasInCategory = allMatches.filter(p => pizzaBelongsToCategory(p, category));
              return (
                <div key={category.id}>
                   <h4 className="font-display text-2xl md:text-3xl font-bold mb-6 text-white tracking-tight flex items-center gap-3">
                      <span className="w-1.5 h-6 md:h-8 bg-brand-orange rounded-full"></span>
                      {category.name}
                   </h4>
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                      {pizzasInCategory.map(pizza => (
                         <div key={pizza.id} className="h-full">
                            <PizzaCard pizza={pizza} onSelect={handleSelectPizza} isRecommended={recommendedId === pizza.id} />
                         </div>
                      ))}
                   </div>
                </div>
              );
           })}
        </div>
     );
  };

  return (
    <div className="min-h-screen font-sans text-gray-100 relative selection:bg-brand-orange selection:text-white">
      {/* Global Background */}
      <div className="fixed inset-0 z-[-1]">
         <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${theme.backgroundImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop'}")` }}>
           <div className="absolute inset-0 bg-black/40"></div>
         </div>
      </div>

      <div className="relative z-10">
        {currentView === 'checkout' ? (
          <CheckoutPage 
            cartItems={cart}
            deliveryFee={5.00}
            onPlaceOrder={handleSendOrderToWhatsApp}
            onRemoveItem={removeFromCart}
            onBack={() => { setCurrentView('home'); window.scrollTo(0, 0); }}
          />
        ) : currentView === 'cart' ? (
           <CartPage 
             cartItems={cart}
             updateQuantity={updateQuantity}
             removeItem={removeFromCart}
             proceedToCheckout={handleCheckout}
             onBackToMenu={() => { setCurrentView('home'); window.scrollTo(0,0); }}
             user={user}
           />
        ) : (
          <>
            <Navbar 
              cartCount={cartCount} 
              onOpenCart={() => setIsCartOpen(true)} 
              onOpenAI={() => setIsAIOpen(true)}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              onLogout={handleLogout}
              logo={theme.logo}
              storeName={theme.storeName}
            />
            
            <FloatingCartButton cartCount={cartCount} onClick={() => setIsCartOpen(true)} />
            
            {animatingItem && (
              <div className="fixed z-[9999] w-32 h-32 rounded-full overflow-hidden border-4 border-brand-orange shadow-2xl animate-fly-to-cart pointer-events-none" style={{ top: '50%', left: '50%' }}>
                <img src={animatingItem.image} alt="Pizza" className="w-full h-full object-cover" />
              </div>
            )}

            <Hero onCtaClick={scrollToMenu} />

            <main className="container mx-auto px-2 md:px-4 py-8 md:py-12" ref={menuRef}>
              <div className="text-center mb-6 md:mb-8">
                <h2 className="font-display text-brand-orange font-bold uppercase tracking-[0.2em] mb-1 text-xs md:text-base animate-pulse">
                  Olá, {user.name}!
                </h2>
              </div>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto mb-8 md:mb-10 relative animate-slide-up px-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-orange transition-colors">
                    <Search size={18} className="md:w-5 md:h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="O que você quer comer hoje?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-4 text-sm md:text-base rounded-full border border-white/20 bg-black/40 backdrop-blur-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all shadow-xl"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-white"><X size={18} /></button>
                  )}
                </div>
              </div>

              {/* Menu Tabs */}
              {!searchQuery && (
                <div className="flex justify-start md:justify-center gap-2 md:gap-3 mb-8 md:mb-12 overflow-x-auto pb-4 px-2 no-scrollbar">
                  {[
                    { id: 'traditional', label: 'Inteiras' },
                    { id: 'broto', label: 'Broto' },
                    { id: 'sweet', label: 'Doces' },
                    { id: 'half', label: 'Meio a Meio' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveMenuTab(tab.id as any)}
                      className={`flex-shrink-0 px-6 py-3 rounded-full font-display font-bold text-sm md:text-base transition-all duration-300 whitespace-nowrap backdrop-blur-md border relative overflow-hidden group ${
                        activeMenuTab === tab.id
                          ? 'bg-brand-orange text-white shadow-lg shadow-orange-500/30 border-brand-orange scale-105'
                          : 'bg-black/40 text-gray-400 hover:bg-black/60 hover:text-white border-white/10 hover:border-white/20 hover:scale-105'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="min-h-[500px]">
                {searchQuery ? renderGlobalSearchResults() : (
                  <>
                    {activeMenuTab === 'traditional' && renderTabPizzaGrid(p => {
                      // Inclui pizzas das categorias tradicionais (sem Meio a Meio, Broto, Doce)
                      if (p.category && ['Meio a Meio', 'Broto', 'Doce'].includes(p.category)) return false;
                      if (!p.categoryId) return ['Classica', 'Especial', 'Vegana', 'Premium'].includes(p.category);
                      const cat = categories.find(c => c.id === p.categoryId);
                      return cat && !['Broto', 'Doce'].includes(cat.name);
                    })}
                    {activeMenuTab === 'broto' && renderTabPizzaGrid(p => {
                      if (p.category === 'Broto') return true;
                      if (!p.categoryId) return false;
                      const cat = categories.find(c => c.id === p.categoryId);
                      return cat?.name === 'Broto';
                    })}
                    {activeMenuTab === 'sweet' && renderTabPizzaGrid(p => {
                      if (p.category === 'Doce') return true;
                      if (!p.categoryId) return false;
                      const cat = categories.find(c => c.id === p.categoryId);
                      return cat?.name === 'Doce';
                    })}
                    {activeMenuTab === 'half' && (
                      <div className="animate-slide-up flex flex-col items-center justify-center max-w-4xl mx-auto py-10">
                        <div className="w-full max-w-sm px-4">
                          {halfHalfProduct && (
                            <div className="transform transition-transform hover:scale-[1.02] duration-300">
                              <PizzaCard pizza={halfHalfProduct} onSelect={handleSelectPizza} isRecommended={true} />
                            </div>
                          )}
                        </div>
                        <div className="mt-8 text-center max-w-md text-gray-300 px-4">
                            <h4 className="font-display text-2xl font-bold mb-3 text-white">Crie sua combinação!</h4>
                            <p className="text-sm md:text-base font-light">Escolha dois sabores, adicione bordas recheadas e personalize tudo no nosso montador exclusivo.</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-black/60 backdrop-blur-xl border-t border-white/10 text-gray-400 pt-16 pb-10 mt-20">
              <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 mb-8 text-center md:text-left">
                  <div>
                    <h4 className="font-display text-3xl font-bold mb-6 text-white tracking-tight">
                      {theme.storeName ? (
                        <span>{theme.storeName}</span>
                      ) : (
                        <>Pizza<span className="text-brand-orange">Vibe</span></>
                      )}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto md:mx-0">
                      Levando felicidade em forma de pizza para sua casa. Ingredientes frescos e tradição em cada fatia.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold mb-6 text-white">Contato</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                      <li className="flex justify-center md:justify-start items-center"><MapPin size={18} className="mr-3 text-brand-orange"/> Centro, Peruíbe - SP</li>
                      <li className="flex justify-center md:justify-start items-center"><Phone size={18} className="mr-3 text-brand-orange"/> (13) 99651-1793</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold mb-6 text-white">Siga-nos</h4>
                    <div className="flex justify-center md:justify-start space-x-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange text-white transition-all hover:-translate-y-1"><Instagram size={20}/></a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange text-white transition-all hover:-translate-y-1"><Facebook size={20}/></a>
                    </div>
                  </div>
              </div>
              <div className="text-center border-t border-white/10 pt-8 mt-8">
                 <p className="text-xs text-gray-600">© {new Date().getFullYear()} {theme.storeName || 'PizzaVibe Delivery'}. Todos os direitos reservados.</p>
              </div>
            </footer>

            <CartSidebar 
              isOpen={isCartOpen} 
              onClose={() => setIsCartOpen(false)} 
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onCheckout={handleCheckout}
              onNavigateToMenu={scrollToMenu}
            />

            <AISommelier isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} onRecommendation={handleAIRecommendation} />
            <PizzaModal pizza={selectedPizza} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddToCart={handleAddToCart} />
            
            {isHalfHalfOpen && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsHalfHalfOpen(false)}></div>
                <div className="w-full max-w-4xl h-[90vh] max-h-[800px] relative z-10 animate-slide-up">
                    <PizzaMeioAMeio 
                       products={halfHalfProducts} 
                       extras={halfHalfExtras} 
                       onAddToCart={handleAddHalfHalfToCart} 
                       onClose={() => setIsHalfHalfOpen(false)} 
                    />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AppWrapper;
