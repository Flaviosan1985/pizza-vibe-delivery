
import React, { useState, useRef } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Pizza, Coupon, OptionItem, BannerItem } from '../types';
import { Save, Plus, Trash2, ToggleLeft, ToggleRight, Pizza as PizzaIcon, Tag, DollarSign, Palette, LogOut, X, Check, Calendar, Upload, Image as ImageIcon, Settings, List, Layout } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { 
    pizzas, addPizza, updatePizza, togglePizzaAvailability, deletePizza,
    crusts, addons, addOption, updateOption, removeOption,
    coupons, addCoupon, removeCoupon, toggleCoupon, 
    cashback, updateCashback,
    theme, updateTheme,
    banners, addBanner, removeBanner
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'menu' | 'coupons' | 'cashback' | 'theme'>('menu');
  const [subTabMenu, setSubTabMenu] = useState<'pizzas' | 'extras'>('pizzas');

  // --- Local States for Forms ---
  
  // New Pizza State
  const [isAddingPizza, setIsAddingPizza] = useState(false);
  const [newPizza, setNewPizza] = useState<Partial<Pizza>>({
    name: '',
    description: '',
    price: 0,
    category: 'Classica',
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

  // Edit Prices State (Inline)
  const [editingPrice, setEditingPrice] = useState<{id: number | string, price: string} | null>(null);
  const [editingName, setEditingName] = useState<{id: string, name: string} | null>(null);

  // New Option State
  const [newOption, setNewOption] = useState<{name: string, price: number}>({ name: '', price: 0 });


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
        rating: 5,
        available: true
      };
      addPizza(pizza);
      setIsAddingPizza(false);
      setNewPizza({ name: '', description: '', price: 0, category: 'Classica', image: '', rating: 5 });
    }
  };

  // --- Renderers ---

  const renderMenuPizzas = () => (
    <div className="space-y-6">
      {/* Add Button */}
      {!isAddingPizza ? (
        <button 
          onClick={() => setIsAddingPizza(true)}
          className="w-full bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-brand-orange hover:bg-brand-orange/5 transition-all group"
        >
          <div className="p-4 bg-white/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
             <Plus size={32} />
          </div>
          <span className="font-bold">Adicionar Novo Sabor</span>
        </button>
      ) : (
        <div className="bg-white/10 border border-white/20 rounded-xl p-6 animate-slide-up">
           <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold text-white font-display">Novo Sabor</h4>
              <button onClick={() => setIsAddingPizza(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20}/></button>
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
                    <label className="block text-xs text-gray-400 mb-1">Categoria</label>
                    <select 
                      value={newPizza.category}
                      onChange={e => setNewPizza({...newPizza, category: e.target.value as any})}
                      className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-brand-orange outline-none"
                    >
                       {['Classica', 'Especial', 'Vegana', 'Doce', 'Broto'].map(c => (
                         <option key={c} value={c}>{c}</option>
                       ))}
                    </select>
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
      )}

      {/* Pizza List */}
      <div className="grid gap-4">
        {pizzas.filter(p => p.category !== 'Meio a Meio').sort((a,b) => b.id - a.id).map(pizza => (
          <div key={pizza.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 group hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative">
               <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-bold text-white font-display">{pizza.name}</h4>
              <p className="text-xs text-gray-400">{pizza.category}</p>
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
    </div>
  );

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

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black/40 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white font-display">Painel <span className="text-brand-orange">Admin</span></h1>
          <p className="text-xs text-gray-500 mt-1">PDV & Configurações</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('menu')} className={getTabClass('menu', 'bg-orange-600')}>
            <PizzaIcon size={20} /> Cardápio
          </button>
          <button onClick={() => setActiveTab('coupons')} className={getTabClass('coupons', 'bg-green-600')}>
            <Tag size={20} /> Cupons
          </button>
          <button onClick={() => setActiveTab('cashback')} className={getTabClass('cashback', 'bg-yellow-600')}>
            <DollarSign size={20} /> Cashback
          </button>
          <button onClick={() => setActiveTab('theme')} className={getTabClass('theme', 'bg-blue-600')}>
            <Palette size={20} /> Cores & Tema
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} /> Sair do Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'menu' && (
           <div className="animate-slide-up">
             <h3 className="text-2xl font-bold text-white mb-6 font-display">Gerenciar Cardápio</h3>
             
             {/* Sub Tabs */}
             <div className="flex gap-4 border-b border-white/10 mb-6">
                <button 
                  onClick={() => setSubTabMenu('pizzas')} 
                  className={`pb-3 px-2 font-bold transition-colors border-b-2 ${subTabMenu === 'pizzas' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                   Pizzas & Sabores
                </button>
                <button 
                  onClick={() => setSubTabMenu('extras')} 
                  className={`pb-3 px-2 font-bold transition-colors border-b-2 ${subTabMenu === 'extras' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                   Bordas & Extras
                </button>
             </div>

             {subTabMenu === 'pizzas' ? renderMenuPizzas() : renderMenuExtras()}
           </div>
        )}
        {activeTab === 'coupons' && renderCouponsTab()}
        {activeTab === 'theme' && renderThemeTab()}
        {activeTab === 'cashback' && renderCashbackTab()}
      </main>
    </div>
  );
};

export default AdminDashboard;
