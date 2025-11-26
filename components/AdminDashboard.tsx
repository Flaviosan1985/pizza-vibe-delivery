import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Save, Plus, Trash2, ToggleLeft, ToggleRight, Pizza as PizzaIcon, Tag, DollarSign, Palette, LogOut, X, Check, Calendar, Upload, Image as ImageIcon, Settings, List, Layout, Move, Minimize2, Maximize2, Lock, ShoppingCart, Clock, CheckCircle, Truck, XCircle, Eye, AlertCircle } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { Pizza, Coupon, OptionItem, BannerItem, CartItem, User, Order, OrderStatus } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { 
    pizzas, addPizza, updatePizza, togglePizzaAvailability, deletePizza,
    crusts, addons, addOption, updateOption, removeOption,
    categories, addCategory, removeCategory, updateCategory,
    coupons, addCoupon, removeCoupon, toggleCoupon, 
    cashback, updateCashback,
    theme, updateTheme,
    banners, addBanner, removeBanner,
    promotion, updatePromotion, addPromotionProduct, updatePromotionProduct, removePromotionProduct,
    orders, updateOrderStatus,
    isFirebaseConnected
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'menu' | 'pdv' | 'coupons' | 'cashback' | 'theme' | 'promotions' | 'settings'>('menu');
  const [subTabMenu, setSubTabMenu] = useState<'categorias' | 'pizzas' | 'extras'>('categorias');
  const [isMinimized, setIsMinimized] = useState(false);
  const dragControls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);

  // --- Local States for Forms ---
  
  // New Pizza State
  const [addingPizzaToCategory, setAddingPizzaToCategory] = useState<string | null>(null);
  const [newPizza, setNewPizza] = useState<Partial<Pizza>>({
    name: '',
    description: '',
    price: 0,
    category: 'Pizza grande 8 pedaços',
    image: '',
    rating: 5
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // New Coupon State
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({ code: '', type: 'percent', value: 0, active: true, expirationDate: '' });
  
  // New Banner State
  const [newBanner, setNewBanner] = useState<Partial<BannerItem>>({ title: '', subtitle: '', colorTheme: 'orange', image: '' });
  const [isAddingBanner, setIsAddingBanner] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Sync notification state
  const [showSyncNotification, setShowSyncNotification] = useState(false);

  // Edit Prices State (Inline)
  const [editingPrice, setEditingPrice] = useState<{id: number | string, price: string} | null>(null);
  const [editingName, setEditingName] = useState<{id: string, name: string} | null>(null);

  // Category State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string} | null>(null);

  // New Option State
  const [newOption, setNewOption] = useState<{name: string, price: number}>({ name: '', price: 0 });

  // Promotion State
  const [editingPromotionProduct, setEditingPromotionProduct] = useState<{id: string, name: string, image: string} | null>(null);
  const [newPromotionProduct, setNewPromotionProduct] = useState<{name: string, image: string}>({ name: '', image: '' });
  const promotionImageRef = useRef<HTMLInputElement>(null);

  // PDV State
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [playingAlert, setPlayingAlert] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousPendingCount = useRef<number>(0);

  // Prevent page scroll while dragging
  useEffect(() => {
    const panel = panelRef.current;
    if (panel) {
      const handleWheel = (e: WheelEvent) => e.stopPropagation();
      panel.addEventListener('wheel', handleWheel, { passive: true });
      return () => panel.removeEventListener('wheel', handleWheel);
    }
  }, []);

  // Monitor new pending orders and play alert sound
  useEffect(() => {
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const currentPendingCount = pendingOrders.length;

    // Play alert if new pending order arrived
    if (currentPendingCount > previousPendingCount.current && activeTab === 'pdv') {
      playAlertSound();
    }

    // Stop alert if no more pending orders
    if (currentPendingCount === 0 && playingAlert) {
      stopAlertSound();
    }

    previousPendingCount.current = currentPendingCount;
  }, [orders, activeTab, playingAlert]);

  const playAlertSound = () => {
    try {
      // Stop any existing alert
      if (audioRef.current) {
        clearInterval(audioRef.current as any);
      }

      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      const createBeep = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime + startTime);
        oscillator.stop(audioContext.currentTime + startTime + duration);
      };
      
      const playPattern = () => {
        const hasPending = orders.some(o => o.status === 'pending');
        if (!hasPending || activeTab !== 'pdv') {
          stopAlertSound();
          return;
        }
        
        // Create a pattern similar to delivery app notifications (3 beeps)
        createBeep(800, 0, 0.15);      // First beep
        createBeep(800, 0.2, 0.15);    // Second beep  
        createBeep(1000, 0.4, 0.25);   // Final higher beep
      };
      
      // Play immediately
      playPattern();
      setPlayingAlert(true);
      
      // Loop the sound every 3 seconds
      const interval = setInterval(() => {
        const newContext = new AudioContext();
        const hasPending = orders.some(o => o.status === 'pending');
        
        if (hasPending && activeTab === 'pdv') {
          const beep1 = newContext.createOscillator();
          const beep2 = newContext.createOscillator();
          const beep3 = newContext.createOscillator();
          const gain1 = newContext.createGain();
          const gain2 = newContext.createGain();
          const gain3 = newContext.createGain();
          
          beep1.type = 'sine';
          beep2.type = 'sine';
          beep3.type = 'sine';
          beep1.frequency.value = 800;
          beep2.frequency.value = 800;
          beep3.frequency.value = 1000;
          
          gain1.gain.setValueAtTime(0.3, newContext.currentTime);
          gain1.gain.exponentialRampToValueAtTime(0.01, newContext.currentTime + 0.15);
          gain2.gain.setValueAtTime(0.3, newContext.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, newContext.currentTime + 0.15);
          gain3.gain.setValueAtTime(0.3, newContext.currentTime);
          gain3.gain.exponentialRampToValueAtTime(0.01, newContext.currentTime + 0.25);
          
          beep1.connect(gain1);
          beep2.connect(gain2);
          beep3.connect(gain3);
          gain1.connect(newContext.destination);
          gain2.connect(newContext.destination);
          gain3.connect(newContext.destination);
          
          beep1.start(newContext.currentTime);
          beep1.stop(newContext.currentTime + 0.15);
          beep2.start(newContext.currentTime + 0.2);
          beep2.stop(newContext.currentTime + 0.35);
          beep3.start(newContext.currentTime + 0.4);
          beep3.stop(newContext.currentTime + 0.65);
        } else {
          clearInterval(interval);
          setPlayingAlert(false);
        }
      }, 3000);
      
      audioRef.current = interval as any;
      
    } catch (error) {
      console.error('Error playing alert sound:', error);
      setPlayingAlert(false);
    }
  };

  const stopAlertSound = () => {
    if (audioRef.current) {
      clearInterval(audioRef.current as any);
      audioRef.current = null;
    }
    setPlayingAlert(false);
  };

  // --- Helper Functions ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPizza(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateTheme({ ...theme, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateTheme({ ...theme, backgroundImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBanner(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPizza = () => {
    if (newPizza.name && newPizza.price && newPizza.category) {
      const pizza: Pizza = {
        id: Date.now(),
        name: newPizza.name,
        description: newPizza.description || '',
        price: newPizza.price,
        image: newPizza.image || 'https://picsum.photos/600/400', // Fallback
        category: newPizza.category as any,
        categoryId: addingPizzaToCategory!, // Assign category ID
        rating: newPizza.rating || 5,
        available: true
      };
      addPizza(pizza);
      setAddingPizzaToCategory(null);
      setNewPizza({ name: '', description: '', price: 0, category: 'Pizza grande 8 pedaços', image: '', rating: 5 });
      showSyncMessage();
    }
  };

  const showSyncMessage = () => {
    setShowSyncNotification(true);
    setTimeout(() => setShowSyncNotification(false), 3000);
  };

  const handleChangePassword = () => {
    const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
    
    if (currentPassword !== storedPassword) {
      setPasswordMessage({ type: 'error', text: 'Senha atual incorreta!' });
      setTimeout(() => setPasswordMessage(null), 3000);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Nova senha deve ter no mínimo 6 caracteres!' });
      setTimeout(() => setPasswordMessage(null), 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'As senhas não coincidem!' });
      setTimeout(() => setPasswordMessage(null), 3000);
      return;
    }

    localStorage.setItem('adminPassword', newPassword);
    setPasswordMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMessage(null), 3000);
  };

  // --- Renderers ---

  const renderPizzaForm = (categoryId: string) => (
    <div className="bg-white/10 border border-white/20 rounded-xl p-6 animate-slide-up mt-4">
       <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-bold text-white font-display">Novo Sabor</h4>
          <button onClick={() => setAddingPizzaToCategory(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={20}/></button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Upload Area */}
          <div 
            className="relative aspect-video bg-black/40 rounded-xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-brand-orange overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
             {newPizza.image ? (
               <>
                 <img src={newPizza.image} alt="Preview" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold flex items-center gap-2"><Upload size={16}/> Alterar</span>
                 </div>
               </>
             ) : (
               <div className="text-gray-400 flex flex-col items-center">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-sm">Clique para upload da imagem</span>
                  <span className="text-xs text-gray-500">(PC ou Celular)</span>
               </div>
             )}
             <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-xs text-gray-400 mb-1">Nome da Pizza</label>
                <input 
                  value={newPizza.name} 
                  onChange={e => setNewPizza({...newPizza, name: e.target.value})}
                  className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none" 
                  placeholder="Ex: Calabresa Especial"
                />
             </div>
             <div>
                <label className="block text-xs text-gray-400 mb-1">Preço (R$)</label>
                <input 
                  type="number"
                  value={newPizza.price} 
                  onChange={e => setNewPizza({...newPizza, price: parseFloat(e.target.value)})}
                  className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none" 
                />
             </div>
          </div>
          
          <div className="md:col-span-2">
             <label className="block text-xs text-gray-400 mb-1">Descrição</label>
             <textarea 
                value={newPizza.description}
                onChange={e => setNewPizza({...newPizza, description: e.target.value})}
                className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none h-24 resize-none"
                placeholder="Descreva os ingredientes..."
             />
          </div>
       </div>
       
       <div className="flex justify-end mt-6 pt-6 border-t border-white/10">
          <button 
            onClick={handleAddPizza}
            disabled={!newPizza.name || !newPizza.price}
            className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} /> Salvar Pizza
          </button>
       </div>
    </div>
  );

  const renderMenuPizzas = () => (
    <div className="space-y-6">
      {/* Pizza List */}
      <div className="grid gap-4">
        {pizzas.sort((a,b) => b.id - a.id).map(pizza => (
          <div key={pizza.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 group hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative">
               <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-bold text-white font-display">{pizza.name}</h4>
              <p className="text-xs text-gray-400">{categories.find(c => c.id === pizza.categoryId)?.name || 'Sem Categoria'}</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Price Editor */}
              {editingPrice?.id === pizza.id ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={editingPrice.price}
                    onChange={(e) => setEditingPrice({ ...editingPrice, price: e.target.value })}
                    className="w-20 bg-black/50 border border-brand-orange rounded px-2 py-1 text-white text-sm"
                    autoFocus
                  />
                  <button onClick={() => { updatePizza({ ...pizza, price: parseFloat(editingPrice.price) }); setEditingPrice(null); }} className="p-1 bg-green-600 rounded"><Check size={14}/></button>
                  <button onClick={() => setEditingPrice(null)} className="p-1 bg-gray-600 rounded"><X size={14}/></button>
                </div>
              ) : (
                <div onClick={() => setEditingPrice({ id: pizza.id, price: pizza.price.toString() })} className="text-brand-yellow font-bold cursor-pointer hover:underline border border-transparent hover:border-white/20 px-2 py-1 rounded font-display">
                  R$ {pizza.price.toFixed(2)}
                </div>
              )}

              {/* Availability */}
              <button onClick={() => togglePizzaAvailability(pizza.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${pizza.available !== false ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}>
                {pizza.available !== false ? 'Ativo' : 'Pausado'}
              </button>
              
              <button onClick={() => deletePizza(pizza.id)} className="text-gray-500 hover:text-red-500 p-2"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMenuCategorias = () => (
    <div className="space-y-8 animate-slide-up">
      {/* Add Category Form */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">Nome da Nova Categoria</label>
          <input 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
            placeholder="Ex: Pizzas Doces"
          />
        </div>
        <button 
          onClick={() => {
            if (newCategoryName.trim()) {
              addCategory({ id: Date.now().toString(), name: newCategoryName.trim() });
              setNewCategoryName('');
              showSyncMessage();
            }
          }}
          className="px-6 py-3 bg-brand-green hover:bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Criar
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              {editingCategory?.id === category.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input 
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="bg-black/50 border border-brand-orange rounded px-2 py-1 text-white text-lg font-bold font-display"
                    autoFocus
                  />
                  <button onClick={() => { updateCategory(category.id, editingCategory.name); setEditingCategory(null); }} className="p-1 bg-green-600 rounded"><Check size={14}/></button>
                  <button onClick={() => setEditingCategory(null)} className="p-1 bg-gray-600 rounded"><X size={14}/></button>
                </div>
              ) : (
                <h4 
                  className="text-xl font-bold text-white font-display cursor-pointer hover:text-brand-orange"
                  onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                >
                  {category.name}
                </h4>
              )}
              <button onClick={() => removeCategory(category.id)} className="text-gray-500 hover:text-red-500 p-2"><Trash2 size={16} /></button>
            </div>

            <div className="space-y-3 mb-4">
              {pizzas.filter(p => p.categoryId === category.id).map(pizza => (
                <div key={pizza.id} className="bg-black/20 p-2 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={pizza.image} alt={pizza.name} className="w-10 h-10 rounded object-cover" />
                    <span className="font-medium text-gray-300">{pizza.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-brand-yellow">R$ {pizza.price.toFixed(2)}</span>
                    <button onClick={() => togglePizzaAvailability(pizza.id)} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pizza.available !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {pizza.available !== false ? 'Ativo' : 'Pausado'}
                    </button>
                    <button onClick={() => deletePizza(pizza.id)} className="text-gray-600 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>

            {addingPizzaToCategory === category.id ? renderPizzaForm(category.id) : (
              <button onClick={() => setAddingPizzaToCategory(category.id)} className="w-full text-sm bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                <Plus size={16} /> Adicionar Sabor a esta Categoria
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderOptionsManager = (title: string, type: 'crust' | 'addon', items: OptionItem[]) => (
    <div className="space-y-4">
       <h4 className="font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2 font-display">
         {title} <span className="text-xs text-gray-500 font-normal font-sans">({items.length})</span>
       </h4>

       {/* Add Option Form */}
       <div className="flex gap-2 items-end bg-black/20 p-3 rounded-lg">
          <div className="flex-1">
             <label className="text-[10px] text-gray-500 uppercase">Nome</label>
             <input value={newOption.name} onChange={e => setNewOption({...newOption, name: e.target.value})} className="w-full bg-black/30 border border-gray-600 rounded p-1.5 text-sm text-white" placeholder="Novo Item" />
          </div>
          <div className="w-24">
             <label className="text-[10px] text-gray-500 uppercase">Preço</label>
             <input type="number" value={newOption.price} onChange={e => setNewOption({...newOption, price: parseFloat(e.target.value)})} className="w-full bg-black/30 border border-gray-600 rounded p-1.5 text-sm text-white" placeholder="0.00" />
          </div>
          <button 
            onClick={() => {
              if (newOption.name) {
                addOption(type, { id: `${type}-${Date.now()}`, name: newOption.name, price: newOption.price });
                setNewOption({ name: '', price: 0 });
              }
            }}
            className="bg-brand-orange px-3 py-1.5 rounded text-white font-bold h-[34px]"
          >
            <Plus size={18} />
          </button>
       </div>

       {/* List */}
       <div className="grid gap-2">
         {items.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-white/5 border border-white/5 p-2 rounded hover:bg-white/10">
               {editingName?.id === item.id ? (
                 <input autoFocus value={editingName.name} onChange={e => setEditingName({...editingName, name: e.target.value})} className="bg-black text-white px-2 py-1 rounded" />
               ) : (
                 <span onClick={() => setEditingName({id: item.id, name: item.name})} className="text-gray-300 font-medium cursor-pointer hover:text-white">{item.name}</span>
               )}

               <div className="flex items-center gap-3">
                  {editingPrice?.id === item.id ? (
                    <div className="flex items-center gap-1">
                      <input type="number" value={editingPrice.price} onChange={e => setEditingPrice({...editingPrice, price: e.target.value})} className="w-16 bg-black text-white px-1 py-0.5 rounded text-sm"/>
                      <button onClick={() => { updateOption(type, { ...item, price: parseFloat(editingPrice.price), name: editingName?.id === item.id ? editingName.name : item.name }); setEditingPrice(null); setEditingName(null); }} className="text-green-500"><Check size={14}/></button>
                    </div>
                  ) : (
                    <span onClick={() => setEditingPrice({id: item.id, price: item.price.toString()})} className="text-sm font-bold text-gray-400 cursor-pointer hover:text-white">
                      + R$ {item.price.toFixed(2)}
                    </span>
                  )}
                  <button onClick={() => removeOption(type, item.id)} className="text-red-900 hover:text-red-500"><Trash2 size={14}/></button>
               </div>
            </div>
         ))}
       </div>
    </div>
  );

  const renderMenuExtras = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
       <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          {renderOptionsManager('Bordas', 'crust', crusts)}
       </div>
       <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          {renderOptionsManager('Complementos / Adicionais', 'addon', addons)}
       </div>
    </div>
  );

  const renderCouponsTab = () => (
    <div className="space-y-6 animate-slide-up">
      <h3 className="text-xl font-bold text-white font-display">Cupons de Desconto</h3>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-end gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Código</label>
            <input 
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
              className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white uppercase"
              placeholder="Ex: PROMO10"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tipo</label>
            <select 
              value={newCoupon.type}
              onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value as 'percent' | 'fixed'})}
              className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white"
            >
              <option value="percent">% Porcentagem</option>
              <option value="fixed">R$ Fixo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Valor</label>
            <input 
              type="number"
              value={newCoupon.value}
              onChange={(e) => setNewCoupon({...newCoupon, value: parseFloat(e.target.value)})}
              className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Validade</label>
            <input 
              type="date"
              value={newCoupon.expirationDate}
              onChange={(e) => setNewCoupon({...newCoupon, expirationDate: e.target.value})}
              className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white"
            />
          </div>
        </div>
        <button 
          onClick={() => {
            if(newCoupon.code && newCoupon.value) {
              addCoupon({ id: Date.now().toString(), active: true, ...newCoupon } as Coupon);
              setNewCoupon({ code: '', type: 'percent', value: 0, active: true, expirationDate: '' });
              showSyncMessage();
            }
          }}
          className="w-full md:w-auto px-6 py-2 bg-brand-green hover:bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Criar Cupom
        </button>
      </div>

      <div className="grid gap-3">
        {coupons.length === 0 && <p className="text-gray-500 text-center py-4">Nenhum cupom ativo.</p>}
        {coupons.map(coupon => {
          const isExpired = coupon.expirationDate ? new Date() > new Date(coupon.expirationDate + 'T23:59:59') : false;
          return (
            <div key={coupon.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className={`p-2 rounded-lg ${isExpired ? 'bg-red-500/20 text-red-500' : 'bg-brand-yellow/20 text-brand-yellow'}`}>
                  <Tag size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-lg tracking-wider font-display">{coupon.code}</p>
                    {isExpired && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">Expirado</span>}
                  </div>
                  <p className="text-xs text-gray-400">
                    {coupon.type === 'percent' ? `${coupon.value}% OFF` : `R$ ${coupon.value.toFixed(2)} OFF`}
                    {coupon.expirationDate && ` • Válido até ${new Date(coupon.expirationDate + 'T00:00:00').toLocaleDateString('pt-BR')}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button onClick={() => toggleCoupon(coupon.id)} className={`text-2xl ${coupon.active ? 'text-green-500' : 'text-gray-600'}`}>
                  {coupon.active ? <ToggleRight /> : <ToggleLeft />}
                </button>
                <button onClick={() => removeCoupon(coupon.id)} className="text-red-500 hover:text-red-400 p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderThemeTab = () => (
    <div className="space-y-6 animate-slide-up">
      <h3 className="text-xl font-bold text-white font-display">Identidade Visual & Banners</h3>
      
      {/* Banner Management */}
      <h4 className="text-lg font-bold text-white mt-4 flex items-center gap-2">
         <Layout size={20} className="text-brand-orange" /> Banners Promocionais
      </h4>
      
      {!isAddingBanner ? (
         <button 
           onClick={() => setIsAddingBanner(true)}
           className="w-full bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-6 text-gray-400 hover:text-white hover:border-brand-orange hover:bg-brand-orange/5 transition-all flex items-center justify-center gap-2"
         >
           <Plus size={20} /> Adicionar Novo Banner (Promoção/Destaque)
         </button>
      ) : (
         <div className="bg-white/5 border border-white/10 rounded-xl p-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
               <div 
                  className="aspect-video bg-black/40 rounded-xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-brand-orange overflow-hidden relative"
                  onClick={() => bannerInputRef.current?.click()}
               >
                  {newBanner.image ? (
                     <img src={newBanner.image} className="w-full h-full object-cover" />
                  ) : (
                     <span className="text-xs text-gray-500">Upload Imagem</span>
                  )}
                  <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
               </div>
               <div className="md:col-span-2 space-y-3">
                  <input 
                    placeholder="Título (ex: PROMOÇÃO DO DIA)"
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                    className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white"
                  />
                  <input 
                    placeholder="Subtítulo (ex: Compre 2 leve 3)"
                    value={newBanner.subtitle}
                    onChange={(e) => setNewBanner({...newBanner, subtitle: e.target.value})}
                    className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white"
                  />
                  <select
                     value={newBanner.colorTheme}
                     onChange={(e) => setNewBanner({...newBanner, colorTheme: e.target.value as any})}
                     className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white"
                  >
                     <option value="orange">Tema Laranja (Fogo/Destaque)</option>
                     <option value="red">Tema Vermelho (Oferta/Promo)</option>
                     <option value="green">Tema Verde (Dica/Veggie)</option>
                  </select>
               </div>
             </div>
             <div className="flex justify-end gap-2">
               <button onClick={() => setIsAddingBanner(false)} className="text-gray-400 px-4 py-2 hover:text-white">Cancelar</button>
               <button 
                  onClick={() => {
                     if (newBanner.title && newBanner.image) {
                        addBanner({ id: Date.now().toString(), title: newBanner.title!, subtitle: newBanner.subtitle!, image: newBanner.image!, colorTheme: newBanner.colorTheme as any });
                        setIsAddingBanner(false);
                        setNewBanner({ title: '', subtitle: '', colorTheme: 'orange', image: '' });
                        showSyncMessage();
                     }
                  }}
                  className="bg-brand-green px-6 py-2 rounded font-bold text-white"
               >
                  Adicionar
               </button>
             </div>
         </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         {banners.map(banner => (
            <div key={banner.id} className="relative group rounded-xl overflow-hidden shadow-lg border border-white/10">
               <img src={banner.image} className="w-full h-32 object-cover opacity-60" />
               <div className="absolute inset-0 bg-black/50 p-3 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-brand-yellow uppercase">{banner.title}</span>
                  <span className="text-xs text-white font-medium line-clamp-1">{banner.subtitle}</span>
               </div>
               <button onClick={() => removeBanner(banner.id)} className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                  <Trash2 size={16} />
               </button>
            </div>
         ))}
      </div>


      {/* Logo & Name Settings */}
      <h4 className="text-lg font-bold text-white mt-8 font-display">Logo e Nome</h4>
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        <div>
           <label className="block text-gray-400 mb-2 font-medium">Nome da Pizzaria</label>
           <input 
              value={theme.storeName || 'PizzaVibe'}
              onChange={(e) => updateTheme({...theme, storeName: e.target.value})}
              className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none font-display font-bold text-lg"
              placeholder="Nome da sua Loja"
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-gray-400 mb-2 font-medium">Logotipo</label>
               <div className="flex items-start gap-4">
                  <div 
                    className="w-24 h-24 bg-black/40 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-brand-orange"
                    onClick={() => logoInputRef.current?.click()}
                  >
                     {theme.logo ? (
                       <img src={theme.logo} alt="Logo" className="w-full h-full object-cover" />
                     ) : (
                       <PizzaIcon size={32} className="text-gray-500" />
                     )}
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={16} className="text-white" />
                     </div>
                  </div>
                  <div className="flex-1">
                     <p className="text-xs text-gray-400 mb-2">Clique para upload do logo.</p>
                     {theme.logo && (
                       <button 
                         onClick={() => updateTheme({...theme, logo: ''})} 
                         className="text-xs text-red-500 hover:text-red-400 underline"
                       >
                         Remover
                       </button>
                     )}
                  </div>
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
               </div>
            </div>

            <div>
               <label className="block text-gray-400 mb-2 font-medium">Imagem de Fundo do Site</label>
               <div className="flex items-start gap-4">
                  <div 
                    className="w-32 h-24 bg-black/40 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-brand-orange"
                    onClick={() => backgroundInputRef.current?.click()}
                  >
                     {theme.backgroundImage ? (
                       <img src={theme.backgroundImage} alt="Background" className="w-full h-full object-cover" />
                     ) : (
                       <ImageIcon size={32} className="text-gray-500" />
                     )}
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={16} className="text-white" />
                     </div>
                  </div>
                  <div className="flex-1">
                     <p className="text-xs text-gray-400 mb-2">Fundo da página de login e cardápio.</p>
                     {theme.backgroundImage && (
                       <button 
                         onClick={() => updateTheme({...theme, backgroundImage: ''})} 
                         className="text-xs text-red-500 hover:text-red-400 underline"
                       >
                         Remover
                       </button>
                     )}
                  </div>
                  <input ref={backgroundInputRef} type="file" accept="image/*" className="hidden" onChange={handleBackgroundUpload} />
               </div>
            </div>
        </div>
      </div>

      {/* Colors Settings */}
      <h4 className="text-lg font-bold text-white mt-8 font-display">Cores do Site</h4>
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-gray-400 mb-2">Cor Principal (Botões, Destaques)</label>
          <div className="flex items-center gap-3">
            <input type="color" value={theme.primaryColor} onChange={(e) => updateTheme({...theme, primaryColor: e.target.value})} className="w-12 h-12 rounded border-none cursor-pointer" />
            <span className="text-white font-mono">{theme.primaryColor}</span>
          </div>
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Cor Secundária (Detalhes, Ícones)</label>
          <div className="flex items-center gap-3">
            <input type="color" value={theme.secondaryColor} onChange={(e) => updateTheme({...theme, secondaryColor: e.target.value})} className="w-12 h-12 rounded border-none cursor-pointer" />
            <span className="text-white font-mono">{theme.secondaryColor}</span>
          </div>
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Cor de Acento (Alertas, Preços)</label>
          <div className="flex items-center gap-3">
            <input type="color" value={theme.accentColor} onChange={(e) => updateTheme({...theme, accentColor: e.target.value})} className="w-12 h-12 rounded border-none cursor-pointer" />
            <span className="text-white font-mono">{theme.accentColor}</span>
          </div>
        </div>
      </div>

      {/* Business Information Settings */}
      <h4 className="text-lg font-bold text-white mt-8 font-display">Informações de Negócio</h4>
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        <p className="text-xs text-gray-400 mb-4">
          Essas informações serão exibidas na página de login para os clientes
        </p>

        {/* Horários */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2 font-medium">Horário (Segunda a Quinta)</label>
            <input 
              type="text"
              value={theme.businessHours?.weekdays || ''}
              onChange={(e) => updateTheme({
                ...theme, 
                businessHours: { 
                  weekdays: e.target.value, 
                  weekends: theme.businessHours?.weekends || '18:00 - 00:00' 
                }
              })}
              className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
              placeholder="Ex: 18:00 - 23:00"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2 font-medium">Horário (Sexta a Domingo)</label>
            <input 
              type="text"
              value={theme.businessHours?.weekends || ''}
              onChange={(e) => updateTheme({
                ...theme, 
                businessHours: { 
                  weekdays: theme.businessHours?.weekdays || '18:00 - 23:00', 
                  weekends: e.target.value 
                }
              })}
              className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
              placeholder="Ex: 18:00 - 00:00"
            />
          </div>
        </div>

        {/* Dias de Funcionamento */}
        <div>
          <label className="block text-gray-400 mb-2 font-medium">Dias de Funcionamento</label>
          <input 
            type="text"
            value={theme.operatingDays || ''}
            onChange={(e) => updateTheme({...theme, operatingDays: e.target.value})}
            className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
            placeholder="Ex: Segunda a Domingo"
          />
        </div>

        {/* Métodos de Pagamento */}
        <div>
          <label className="block text-gray-400 mb-2 font-medium">Métodos de Pagamento</label>
          <p className="text-xs text-gray-500 mb-2">Digite os métodos separados por vírgula</p>
          <input 
            type="text"
            value={theme.paymentMethods?.join(', ') || ''}
            onChange={(e) => updateTheme({
              ...theme, 
              paymentMethods: e.target.value.split(',').map(m => m.trim()).filter(m => m)
            })}
            className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
            placeholder="Ex: Dinheiro, Cartão, PIX, Vale Refeição"
          />
        </div>

        {/* Política Pizza Meio a Meio */}
        <div>
          <label className="block text-gray-400 mb-2 font-medium">Política Pizza Meio a Meio</label>
          <input 
            type="text"
            value={theme.halfPizzaPolicy || ''}
            onChange={(e) => updateTheme({...theme, halfPizzaPolicy: e.target.value})}
            className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
            placeholder="Ex: Será cobrado pelo maior valor entre os sabores"
          />
        </div>

        {/* Aviso de Preços */}
        <div>
          <label className="block text-gray-400 mb-2 font-medium">Aviso sobre Preços</label>
          <input 
            type="text"
            value={theme.priceDisclaimer || ''}
            onChange={(e) => updateTheme({...theme, priceDisclaimer: e.target.value})}
            className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
            placeholder="Ex: Preços sujeitos a alteração sem aviso prévio"
          />
        </div>

        {/* Redes Sociais */}
        <div className="pt-6 border-t border-white/10">
          <h5 className="text-base font-bold text-white mb-4">Redes Sociais</h5>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 font-medium">Facebook (URL completa)</label>
              <input 
                type="url"
                value={theme.facebookUrl || ''}
                onChange={(e) => updateTheme({...theme, facebookUrl: e.target.value})}
                className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                placeholder="Ex: https://facebook.com/suapizzaria"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 font-medium">Instagram (URL completa)</label>
              <input 
                type="url"
                value={theme.instagramUrl || ''}
                onChange={(e) => updateTheme({...theme, instagramUrl: e.target.value})}
                className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                placeholder="Ex: https://instagram.com/suapizzaria"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 font-medium">WhatsApp (apenas números)</label>
              <input 
                type="tel"
                value={theme.whatsappNumber || ''}
                onChange={(e) => updateTheme({...theme, whatsappNumber: e.target.value.replace(/\D/g, '')})}
                className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                placeholder="Ex: 5513996511793"
              />
              <p className="text-xs text-gray-500 mt-1">Formato: Código do país + DDD + número (sem espaços ou caracteres especiais)</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <button 
            onClick={() => showSyncMessage()}
            className="w-full bg-brand-green hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
          >
            💾 Salvar Informações
          </button>
        </div>
      </div>
    </div>
  );

  const renderPDVTab = () => {
    const getStatusColor = (status: OrderStatus) => {
      switch (status) {
        case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
        case 'preparing': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
        case 'ready': return 'text-green-500 bg-green-500/10 border-green-500/30';
        case 'delivered': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
        case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/30';
      }
    };

    const getStatusIcon = (status: OrderStatus) => {
      switch (status) {
        case 'pending': return <Clock size={16} />;
        case 'preparing': return <AlertCircle size={16} />;
        case 'ready': return <CheckCircle size={16} />;
        case 'delivered': return <Truck size={16} />;
        case 'cancelled': return <XCircle size={16} />;
      }
    };

    const getStatusLabel = (status: OrderStatus) => {
      switch (status) {
        case 'pending': return 'Pendente';
        case 'preparing': return 'Em Preparo';
        case 'ready': return 'Pronto';
        case 'delivered': return 'Entregue';
        case 'cancelled': return 'Cancelado';
      }
    };

    const filteredOrders = orderStatusFilter === 'all' 
      ? orders 
      : orders.filter(o => o.status === orderStatusFilter);

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
      updateOrderStatus(orderId, newStatus);
      showSyncMessage();
      
      // Stop alert sound when moving from pending to preparing
      if (newStatus === 'preparing') {
        stopAlertSound();
      }
    };

    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white font-display">Gerenciar Pedidos (PDV)</h3>
            {playingAlert && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-bold text-red-500">Novo Pedido!</span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-400">
            Total: <span className="text-white font-bold">{orders.length}</span> pedidos
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => {
            const count = status === 'all' ? orders.length : orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setOrderStatusFilter(status as OrderStatus | 'all')}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  orderStatusFilter === status
                    ? 'bg-brand-orange text-white shadow-lg'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {status === 'all' ? 'Todos' : getStatusLabel(status as OrderStatus)} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
              <ShoppingCart size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">Nenhum pedido {orderStatusFilter !== 'all' && `com status "${getStatusLabel(orderStatusFilter as OrderStatus)}"`}</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4 hover:bg-white/10 transition-colors"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-white font-display">
                        #{order.orderNumber}
                      </span>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-white">{order.customerName}</span>
                        • {order.customerPhone}
                      </p>
                      <p>{new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-brand-orange">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-xs text-gray-400">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2 border-t border-white/10 pt-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <img src={item.pizzaImage} alt={item.pizzaName} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {item.quantity}x {item.pizzaName}
                          {item.isHalfHalf && item.secondFlavorName && ` + ${item.secondFlavorName}`}
                        </p>
                        {(item.crust || (item.addons && item.addons.length > 0)) && (
                          <p className="text-xs text-gray-400">
                            {item.crust && `+ ${item.crust}`}
                            {item.addons && item.addons.length > 0 && ` + ${item.addons.join(', ')}`}
                          </p>
                        )}
                      </div>
                      <p className="text-gray-300 font-medium">
                        R$ {item.total.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 border-t border-white/10 pt-3">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(order.id, 'preparing')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-bold text-sm"
                      >
                        <AlertCircle size={16} />
                        Iniciar Preparo
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'ready')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition font-bold text-sm"
                    >
                      <CheckCircle size={16} />
                      Marcar como Pronto
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'delivered')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition font-bold text-sm"
                    >
                      <Truck size={16} />
                      Marcar como Entregue
                    </button>
                  )}
                  {(order.status === 'delivered' || order.status === 'cancelled') && (
                    <div className="flex-1 text-center text-sm text-gray-500 py-2">
                      Pedido finalizado
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderPromotionsTab = () => {
    const handlePromotionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPromotionProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    };

    const handleAddPromotionProduct = () => {
      if (!newPromotionProduct.name || !newPromotionProduct.image) {
        alert('Preencha nome e imagem do produto');
        return;
      }
      addPromotionProduct({
        id: Date.now().toString(),
        name: newPromotionProduct.name,
        image: newPromotionProduct.image
      });
      setNewPromotionProduct({ name: '', image: '' });
      showSyncMessage();
    };

    const handleUpdatePromotionProduct = () => {
      if (!editingPromotionProduct) return;
      updatePromotionProduct(editingPromotionProduct);
      setEditingPromotionProduct(null);
      showSyncMessage();
    };

    return (
      <div className="space-y-6 animate-slide-up">
        <h3 className="text-xl font-bold text-white font-display">Gerenciar Promoções</h3>
        
        {/* Enable/Disable Promotion */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-white">Status da Promoção</h4>
              <p className="text-xs text-gray-400">Ative ou pause a promoção de brinde</p>
            </div>
            <button 
              onClick={() => { 
                updatePromotion({...promotion, enabled: !promotion.enabled});
                showSyncMessage();
              }} 
              className={`text-4xl transition-colors ${promotion.enabled ? 'text-green-500' : 'text-gray-600'}`}
            >
              {promotion.enabled ? <ToggleRight /> : <ToggleLeft />}
            </button>
          </div>

          {/* Min Value */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 font-medium text-sm">Valor Mínimo para Ganhar Brinde (R$)</label>
              <input 
                type="number" 
                step="0.01"
                value={promotion.minValue} 
                onChange={(e) => {
                  updatePromotion({...promotion, minValue: parseFloat(e.target.value)});
                  showSyncMessage();
                }}
                className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white"
              />
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Produtos do Brinde</h4>
          <div className="space-y-3 mb-4">
            {promotion.products.map(product => (
              <div key={product.id} className="flex items-center gap-4 bg-black/30 border border-white/10 rounded-lg p-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  {editingPromotionProduct?.id === product.id ? (
                    <input 
                      type="text"
                      value={editingPromotionProduct.name}
                      onChange={(e) => setEditingPromotionProduct({...editingPromotionProduct, name: e.target.value})}
                      className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm"
                    />
                  ) : (
                    <p className="text-white font-medium">{product.name}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingPromotionProduct?.id === product.id ? (
                    <>
                      <button onClick={handleUpdatePromotionProduct} className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditingPromotionProduct(null)} className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition">
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setEditingPromotionProduct(product)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                      >
                        <Settings size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          removePromotionProduct(product.id);
                          showSyncMessage();
                        }}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Product */}
          <div className="bg-black/30 border border-white/20 rounded-lg p-4 space-y-3">
            <h5 className="text-sm font-bold text-white">Adicionar Novo Produto</h5>
            <input 
              type="text"
              placeholder="Nome do produto (ex: Frutuba 2L)"
              value={newPromotionProduct.name}
              onChange={(e) => setNewPromotionProduct({...newPromotionProduct, name: e.target.value})}
              className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white text-sm"
            />
            <div className="flex items-center gap-3">
              <button 
                onClick={() => promotionImageRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm"
              >
                <Upload size={16} />
                {newPromotionProduct.image ? 'Imagem Selecionada' : 'Upload Imagem'}
              </button>
              {newPromotionProduct.image && (
                <img src={newPromotionProduct.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
              )}
            </div>
            <button 
              onClick={handleAddPromotionProduct}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-orange hover:bg-orange-600 rounded-lg transition font-bold"
            >
              <Plus size={16} />
              Adicionar Produto
            </button>
            <input ref={promotionImageRef} type="file" accept="image/*" className="hidden" onChange={handlePromotionImageUpload} />
          </div>
        </div>

        {promotion.enabled && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <p className="text-green-400 font-bold text-sm">
              🎉 Promoção Ativa: Compras acima de R$ {promotion.minValue.toFixed(2)} ganham {promotion.products[0]?.name || 'brinde'} grátis!
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderCashbackTab = () => (
    <div className="space-y-6 animate-slide-up">
      <h3 className="text-xl font-bold text-white font-display">Configurar Cashback</h3>
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">Habilitar Cashback</span>
          <button onClick={() => updateCashback({...cashback, enabled: !cashback.enabled})} className={`text-4xl transition-colors ${cashback.enabled ? 'text-green-500' : 'text-gray-600'}`}>
            {cashback.enabled ? <ToggleRight /> : <ToggleLeft />}
          </button>
        </div>
        <div className={`space-y-4 transition-opacity ${cashback.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div>
            <label className="block text-gray-400 mb-2">Porcentagem de volta (%)</label>
            <input type="number" value={cashback.percentage} onChange={(e) => updateCashback({...cashback, percentage: parseFloat(e.target.value)})} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Validade dos créditos (dias após compra)</label>
            <input type="number" value={cashback.validityDays} onChange={(e) => updateCashback({...cashback, validityDays: parseInt(e.target.value)})} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Data Limite da Campanha</label>
            <input type="date" value={cashback.campaignEndDate || ''} onChange={(e) => updateCashback({...cashback, campaignEndDate: e.target.value})} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  // Tab Styles helper
  const getTabClass = (tabName: string, colorClass: string) => {
    const isActive = activeTab === tabName;
    return `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive ? `${colorClass} text-white shadow-lg` : 'text-gray-400 hover:bg-white/5'}`;
  };

  const getTabClassV2 = (tabName: string, colorClass: string) => {
    const isActive = activeTab === tabName;
    return `flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-bold transition-all border-b-4 ${isActive ? `${colorClass} text-white` : 'text-gray-400 border-transparent hover:bg-white/5'}`;
  };

  return (
    <motion.div
      ref={panelRef}
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      className="fixed bottom-10 right-10 z-[100] w-[90vw] max-w-4xl h-[70vh] bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans text-white"
      animate={{ height: isMinimized ? '64px' : '70vh' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header / Drag Handle */}
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        className="p-4 bg-black/40 border-b border-white/10 flex justify-between items-center cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-3">
          <Move size={16} className="text-gray-500" />
          <h1 className="text-lg font-bold text-white font-display">Painel <span className="text-brand-orange">Admin</span></h1>
          {/* Firebase Connection Indicator */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isFirebaseConnected 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-green-400 animate-pulse' : 'bg-orange-400'}`} />
            {isFirebaseConnected ? 'Firebase' : 'Modo Local'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={onLogout} className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 min-h-0 transition-opacity ${isMinimized ? 'opacity-0' : 'opacity-100'}`}>
        {/* Tab Navigation */}
        <nav className="flex-shrink-0 flex border-b border-white/10 bg-black/20">
          <button onClick={() => setActiveTab('menu')} className={getTabClassV2('menu', 'border-orange-500')}>
            <PizzaIcon size={16} /> Cardápio
          </button>
          <button onClick={() => setActiveTab('pdv')} className={getTabClassV2('pdv', 'border-cyan-500')}>
            <ShoppingCart size={16} /> PDV
          </button>
          <button onClick={() => setActiveTab('coupons')} className={getTabClassV2('coupons', 'border-green-500')}>
            <Tag size={16} /> Cupons
          </button>
          <button onClick={() => setActiveTab('cashback')} className={getTabClassV2('cashback', 'border-yellow-500')}>
            <DollarSign size={16} /> Cashback
          </button>
          <button onClick={() => setActiveTab('theme')} className={getTabClassV2('theme', 'border-blue-500')}>
            <Palette size={16} /> Tema
          </button>
          <button onClick={() => setActiveTab('promotions')} className={getTabClassV2('promotions', 'border-pink-500')}>
            <Tag size={16} /> Promoções
          </button>
          <button onClick={() => setActiveTab('settings')} className={getTabClassV2('settings', 'border-purple-500')}>
            <Settings size={16} /> Configurações
          </button>
        </nav>

        {/* Sync Notification */}
        {showSyncNotification && (
          <div className="absolute top-20 right-4 z-50 bg-green-500/90 backdrop-blur-md text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up">
            <Check size={18} />
            <span className="font-bold text-sm">Alterações salvas e sincronizadas!</span>
          </div>
        )}

        {/* Tab Content */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'menu' && (
            <div className="animate-slide-up">
              {/* Sub Tabs */}
              <div className="flex gap-4 border-b border-white/10 mb-6">
                  <button 
                    onClick={() => setSubTabMenu('categorias')} 
                    className={`pb-3 px-2 font-bold transition-colors border-b-2 ${subTabMenu === 'categorias' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                  >
                    Categorias & Sabores
                  </button>
                  <button 
                    onClick={() => setSubTabMenu('pizzas')} 
                    className={`pb-3 px-2 font-bold transition-colors border-b-2 ${subTabMenu === 'pizzas' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                  >
                    Visão Geral
                  </button>
                  <button 
                    onClick={() => setSubTabMenu('extras')} 
                    className={`pb-3 px-2 font-bold transition-colors border-b-2 ${subTabMenu === 'extras' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                  >
                    Bordas e Adicionais
                  </button>
              </div>

              {subTabMenu === 'categorias' ? renderMenuCategorias() : subTabMenu === 'pizzas' ? renderMenuPizzas() : renderMenuExtras()}
            </div>
          )}
          {activeTab === 'pdv' && renderPDVTab()}
          {activeTab === 'coupons' && renderCouponsTab()}
          {activeTab === 'theme' && renderThemeTab()}
          {activeTab === 'cashback' && renderCashbackTab()}
          {activeTab === 'promotions' && renderPromotionsTab()}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-slide-up">
              <h3 className="text-xl font-bold text-white font-display">Configurações da Conta</h3>
              
              {/* Change Password Section */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <Lock size={24} className="text-brand-orange" />
                  <div>
                    <h4 className="text-lg font-bold text-white">Alterar Senha de Acesso</h4>
                    <p className="text-xs text-gray-400">Mantenha sua conta segura alterando a senha periodicamente</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2 font-medium text-sm">Senha Atual</label>
                    <input 
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                      placeholder="Digite sua senha atual"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2 font-medium text-sm">Nova Senha</label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2 font-medium text-sm">Confirmar Nova Senha</label>
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                      placeholder="Digite a nova senha novamente"
                    />
                  </div>

                  {passwordMessage && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                      {passwordMessage.text}
                    </div>
                  )}

                  <button 
                    onClick={handleChangePassword}
                    disabled={!currentPassword || !newPassword || !confirmPassword}
                    className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Alterar Senha
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <Check size={18} /> Sincronização Automática Ativa
                </h4>
                <p className="text-xs text-gray-400">
                  Todas as alterações feitas no painel (pizzas, categorias, tema, cupons, etc.) são salvas automaticamente 
                  e sincronizadas em tempo real com o site. Os clientes verão as mudanças imediatamente!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
