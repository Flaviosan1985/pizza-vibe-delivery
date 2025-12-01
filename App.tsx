
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import { useAutoRevalidate, useRevalidateOnFocus, useRevalidateOnOnline } from './hooks/useAutoRevalidate';
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
import MyOrdersPage from './components/MyOrdersPage';
import MyFavoritesPage from './components/MyFavoritesPage';
import MyAccountPage from './components/MyAccountPage';
import Toast from './components/Toast';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
// REMOVED static imports of CRUST_OPTIONS, ADDON_OPTIONS
import { Pizza, CartItem, User, Order, OrderStatus, Category } from './types';
import { Phone, MapPin, Instagram, Facebook, Search, X, CircleDashed } from 'lucide-react';

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
  const { pizzas, crusts, addons, theme, categories, promotion, addOrder, setOnOrderStatusChange } = useAdmin();

  // Authentication State
  const [user, setUser] = useState<User | null>(null);

  // App Flow State
  const [currentView, setCurrentView] = useState<'home' | 'checkout' | 'admin' | 'cart' | 'myOrders' | 'myFavorites' | 'myAccount'>('home');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeMenuTab, setActiveMenuTab] = useState<'traditional' | 'half' | 'broto' | 'sweet'>('traditional');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notification state
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    status?: OrderStatus;
    orderNumber?: number;
  }>({ visible: false, message: '' });
  
  // Customization modal state
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Half and Half Modal state
  const [isHalfHalfOpen, setIsHalfHalfOpen] = useState(false);

  // Animation state
  const [animatingItem, setAnimatingItem] = useState<CartItem | null>(null);
  const [recommendedId, setRecommendedId] = useState<number | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Função de revalidação dos dados
  const revalidateData = useCallback(() => {
    // Força reload do localStorage para sincronizar com possíveis mudanças
    const event = new Event('storage');
    window.dispatchEvent(event);
    console.log('🔄 Dados revalidados');
  }, []);

  // Auto-revalidação a cada 60 segundos (similar ao ISR)
  useAutoRevalidate({
    enabled: true,
    interval: 60000, // 60 segundos
    onRevalidate: revalidateData
  });

  // Revalidar quando o usuário volta para a aba
  useRevalidateOnFocus(revalidateData);

  // Revalidar quando a conexão é restaurada
  useRevalidateOnOnline(revalidateData);

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

  // Register notification callback for order status changes
  useEffect(() => {
    const handleOrderStatusChange = (order: Order, newStatus: OrderStatus) => {
      // Only show notification if it's the current user's order
      if (user && order.customerId === user.phone) {
        const messages: Record<OrderStatus, string> = {
          pending: 'Seu pedido foi recebido e está aguardando confirmação.',
          preparing: '👨‍🍳 Seu pedido está sendo preparado! Pizza quentinha a caminho!',
          ready: '🎉 SEU PEDIDO ESTÁ PRONTO! Pode vir buscar na loja!',
          delivered: '🚚 Seu pedido saiu para entrega! Chegando em breve!',
          cancelled: 'Seu pedido foi cancelado.'
        };
        
        setNotification({
          visible: true,
          message: messages[newStatus],
          status: newStatus,
          orderNumber: order.orderNumber
        });

        // Play a notification sound for ready and delivered status
        if (newStatus === 'ready' || newStatus === 'delivered') {
          try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = newStatus === 'ready' ? 1000 : 800;
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
          } catch (error) {
            console.log('Could not play notification sound');
          }
        }
      }
    };

    setOnOrderStatusChange(handleOrderStatusChange);
  }, [user, setOnOrderStatusChange]);

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

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('pizzaVibeUser', JSON.stringify(updatedUser));
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
    return <LoginScreen onLogin={handleLogin} logo={theme.logo} storeName={theme.storeName} backgroundImage={theme.backgroundImage} theme={theme} />;
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
      secondFlavor: secondaryFlavor ? { 
        ...secondaryFlavor, 
        rating: 0,
        category: 'Pizza grande 8 pedaços' as const,
        available: true
      } : undefined,
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
    const discount = 0; // TODO: Add coupon discount if applied
    const total = subtotal + deliveryFee - discount;

    // Create Order in system
    const newOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'> = {
      customerId: user.phone,
      customerName: user.name,
      customerPhone: user.phone,
      items: cart.map(item => ({
        pizzaId: item.id,
        pizzaName: item.name,
        pizzaImage: item.image,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.unitTotal * item.quantity,
        crust: item.selectedCrust?.name,
        addons: item.selectedAddons?.map(a => a.name),
        observation: item.observation,
        isHalfHalf: item.isHalfHalf,
        secondFlavorName: item.secondFlavor?.name
      })),
      subtotal,
      deliveryFee,
      discount,
      total,
      status: 'pending',
      paymentMethod: payment.method === 'credit' ? 'Cartão de Crédito' : 
                     payment.method === 'debit' ? 'Cartão de Débito' : 
                     payment.method === 'pix' ? 'PIX' : 'Dinheiro',
      deliveryAddress: deliveryMode === 'delivery' && address 
        ? `${address.street}, ${address.number}${address.complement ? ', ' + address.complement : ''}, ${address.neighborhood} - ${address.city}`
        : undefined
    };
    addOrder(newOrder as Order);

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
    
    // Show success message with estimated time
    const estimatedTime = deliveryMode === 'delivery' ? '60 a 90 minutos' : '30 minutos';
    const message = deliveryMode === 'delivery' 
      ? `🍕 Seu pedido está sendo preparado!\n\n⏱️ Tempo aproximado: ${estimatedTime}\n\nObrigado por comprar na Pizzaria Zattera! ❤️`
      : `🍕 Seu pedido foi encaminhado!\n\n⏱️ Tempo aproximado: ${estimatedTime}\n\nObrigado por comprar na Pizzaria Zattera! ❤️`;
    
    setNotification({
      visible: true,
      message,
      status: 'pending'
    });
    
    // Clear cart and return to home after 5 seconds
    setTimeout(() => {
      setCart([]);
      setIsCartOpen(false);
      setCurrentView('home');
      setNotification({ visible: false, message: '' });
      window.scrollTo(0, 0);
    }, 5000);
  };

  const scrollToMenu = () => menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  const handleAIRecommendation = (id: number) => {
    setRecommendedId(id);
    scrollToMenu();
    setTimeout(() => setRecommendedId(null), 10000);
  };

  const handleReorder = (order: Order) => {
    // Clear current cart
    setCart([]);
    
    // Add order items back to cart
    order.items.forEach(item => {
      const pizza = pizzas.find(p => p.id === item.pizzaId);
      if (pizza && pizza.available !== false) {
        const crust = item.crust ? crusts.find(c => c.name === item.crust) : null;
        const itemAddons = item.addons ? addons.filter(a => item.addons?.includes(a.name)) : [];
        
        const cartItem: CartItem = {
          ...pizza,
          cartId: `reorder-${Date.now()}-${Math.random()}`,
          quantity: item.quantity,
          selectedCrust: crust || null,
          selectedAddons: itemAddons,
          observation: item.observation || '',
          unitTotal: item.unitPrice + (crust?.price || 0) + itemAddons.reduce((sum, a) => sum + a.price, 0),
          isHalfHalf: item.isHalfHalf,
          secondFlavor: item.isHalfHalf && item.secondFlavorName ? pizzas.find(p => p.name === item.secondFlavorName) : undefined
        };
        
        setCart(prev => [...prev, cartItem]);
      }
    });
    
    // Navigate to home and show cart
    setCurrentView('home');
    setIsCartOpen(true);
    window.scrollTo(0, 0);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Helper para buscar categoria por ID ou nome (compatibilidade com sistema antigo)
  const getCategoryForPizza = (p: Pizza): Category | undefined => {
    if (p.categoryId) {
      return categories.find(c => c.id === p.categoryId);
    }
    // Fallback: buscar por nome exato ou similar
    if (p.category) {
      return categories.find(c => 
        c.name.toLowerCase() === p.category.toLowerCase() ||
        c.name.toLowerCase().includes(p.category.toLowerCase())
      );
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

    // Agrupar pizzas por categoryId usando as categorias dinâmicas
    const categoriesInTab = categories
      .filter(cat => filteredPizzas.some(p => p.categoryId === cat.id))
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div className="space-y-8 md:space-y-12 animate-slide-up">
        {categoriesInTab.map(category => {
          const pizzasInCategory = filteredPizzas.filter(p => p.categoryId === category.id);
          return (
            <div key={category.id} className="mb-12">
              <div className="mb-6">
                <h4 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight uppercase">
                  {category.name}
                </h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
                {pizzasInCategory.map(pizza => (
                  <div key={pizza.id} className="h-full">
                    <PizzaCard 
                      pizza={pizza} 
                      onSelect={handleSelectPizza} 
                      isRecommended={recommendedId === pizza.id}
                      userId={user?.phone}
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

     // Agrupar por categoryId usando categorias dinâmicas
     const categoriesInResults = categories
       .filter(cat => allMatches.some(p => p.categoryId === cat.id))
       .sort((a, b) => a.name.localeCompare(b.name));
     
     return (
        <div className="space-y-8 animate-slide-up">
           <div className="bg-white border-2 border-brand-orange p-4 rounded-lg mb-8 flex items-center justify-between shadow-lg">
              <span className="text-brand-red font-bold font-display text-lg">🔍 Resultados para "{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="text-sm text-gray-600 hover:text-brand-red font-semibold underline">Limpar</button>
           </div>
           {categoriesInResults.map(category => {
              const pizzasInCategory = allMatches.filter(p => p.categoryId === category.id);
              return (
                <div key={category.id} className="mb-12">
                   <div className="mb-6">
                      <h4 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight uppercase">
                         {category.name}
                      </h4>
                   </div>
                   <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {pizzasInCategory.map(pizza => (
                         <div key={pizza.id} className="h-full">
                            <PizzaCard pizza={pizza} onSelect={handleSelectPizza} isRecommended={recommendedId === pizza.id} userId={user?.phone} />
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
    <div className="min-h-screen font-sans text-gray-900 relative selection:bg-brand-orange selection:text-white">
      {/* Global Background - Preto em cima, Vermelho embaixo */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black via-50% to-[#8B0000]"></div>
      </div>

      {/* Toast Notification */}
      <Toast
        visible={notification.visible}
        message={notification.message}
        status={notification.status}
        orderNumber={notification.orderNumber}
        onClose={() => setNotification({ visible: false, message: '' })}
      />

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
        ) : currentView === 'myOrders' ? (
          <MyOrdersPage
            user={user}
            onBack={() => { setCurrentView('home'); window.scrollTo(0, 0); }}
            onReorder={handleReorder}
          />
        ) : currentView === 'myFavorites' ? (
          <MyFavoritesPage
            user={user}
            onBack={() => { setCurrentView('home'); window.scrollTo(0, 0); }}
            onSelectPizza={handleSelectPizza}
          />
        ) : currentView === 'myAccount' ? (
          <MyAccountPage
            user={user}
            onBack={() => { setCurrentView('home'); window.scrollTo(0, 0); }}
            onMyOrders={() => setCurrentView('myOrders')}
            onMyFavorites={() => setCurrentView('myFavorites')}
            onUpdateUser={handleUpdateUser}
          />
        ) : (
          <>
            {/* Banner animado no topo */}
            <Hero onCtaClick={scrollToMenu} />
            
            {/* Navbar com logo centralizada (SEM barra vermelha) */}
            <Navbar
              cartCount={cartCount}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenAI={() => setIsAIOpen(true)}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              onLogout={handleLogout}
              onMyAccount={() => setCurrentView('myAccount')}
              onMyOrders={() => setCurrentView('myOrders')}
              onMyFavorites={() => setCurrentView('myFavorites')}
              userName={user?.name.split(' ')[0] || 'Usuário'}
              userAvatar={user?.avatar}
              logo={theme.logo}
              storeName={theme.storeName}
            />
            
            <FloatingCartButton cartCount={cartCount} onClick={() => setIsCartOpen(true)} />
            
            {animatingItem && (
              <div className="fixed z-[9999] w-32 h-32 rounded-full overflow-hidden border-4 border-brand-orange shadow-2xl animate-fly-to-cart pointer-events-none" style={{ top: '50%', left: '50%' }}>
                <img src={animatingItem.image} alt="Pizza" className="w-full h-full object-cover" />
              </div>
            )}

            <main className="container mx-auto px-2 md:px-4 py-8 md:py-12 mt-28 md:mt-32" ref={menuRef}>
              {/* Search Bar */}
              <div className="max-w-md mx-auto mb-6 md:mb-8 relative animate-slide-up px-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-orange transition-colors">
                    <Search size={20} className="md:w-6 md:h-6" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Buscar pizza..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 md:pl-12 pr-10 py-2 md:py-2.5 text-xs md:text-sm rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all shadow-md placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-brand-red"><X size={20} /></button>
                  )}
                </div>
              </div>

              {/* Menu Tabs - Animadas */}
              {!searchQuery && (
                <div className="flex justify-start md:justify-center gap-2 md:gap-3 mb-6 md:mb-8 overflow-x-auto pb-4 px-2 scrollbar-hide">
                  {[
                    { id: 'traditional', label: '🍕 Tradicionais', color: 'from-[#B91C1C] to-red-700' },
                    { id: 'broto', label: '🍕 Broto', color: 'from-orange-600 to-orange-700' },
                    { id: 'sweet', label: '🍰 Doces', color: 'from-pink-600 to-pink-700' },
                    { id: 'half', label: '🎯 Meio a Meio', color: 'from-[#009246] to-green-700' }
                  ].map(tab => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveMenuTab(tab.id as any)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex-shrink-0 px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-display font-bold text-xs md:text-sm transition-all duration-300 whitespace-nowrap overflow-hidden ${
                        activeMenuTab === tab.id
                          ? 'text-white shadow-2xl'
                          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {activeMenuTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className={`absolute inset-0 bg-gradient-to-r ${tab.color}`}
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </motion.button>
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
                      if (p.category === 'Pizza broto 4 pedaços') return true;
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
                              <PizzaCard pizza={halfHalfProduct} onSelect={handleSelectPizza} isRecommended={true} userId={user?.phone} />
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
