
import React, { useState, useEffect } from 'react';
import { Trash2, Minus, Plus, Tag, ArrowRight, ShoppingBag, Coins, Check, AlertCircle, ChevronLeft } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { User } from '../types';
import PageContainer from './containers/PageContainer';
import BackButton from './containers/BackButton';
import EmptyState from './containers/EmptyState';

interface CartItem {
  cartId: string;
  name: string;
  description: string;
  image: string;
  quantity: number;
  unitTotal: number;
  selectedCrust?: { name: string; price: number } | null;
  selectedAddons?: { name: string; price: number }[];
  observation?: string;
}

interface CartPageProps {
  cartItems: CartItem[];
  updateQuantity: (cartId: string, delta: number) => void;
  removeItem: (cartId: string) => void;
  proceedToCheckout: () => void;
  onBackToMenu: () => void;
  deliveryFee?: number;
  user?: User | null; // Pass user to check cashback balance
}

const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  updateQuantity,
  removeItem,
  proceedToCheckout,
  onBackToMenu,
  deliveryFee = 5.00,
  user
}) => {
  const { validateCoupon, cashback, coupons } = useAdmin();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  
  const [useCashback, setUseCashback] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitTotal * item.quantity), 0);
  
  // Logic to mix coupon and cashback
  const cashbackValue = (user?.cashbackBalance && useCashback) ? Math.min(user.cashbackBalance, subtotal - appliedDiscount) : 0;
  
  const total = Math.max(0, subtotal + deliveryFee - appliedDiscount - cashbackValue);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleApplyCoupon = (codeOverride?: string) => {
    setCouponError('');
    const codeToTest = codeOverride || couponCode;

    if (!codeToTest) return;
    
    const discount = validateCoupon(codeToTest, subtotal);
    if (discount > 0) {
      setAppliedDiscount(discount);
      setCouponCode(codeToTest.toUpperCase());
      setCouponError('');
      // Keep input visible to show success state
    } else {
      setAppliedDiscount(0);
      setCouponError('Cupom inválido ou expirado');
    }
  };

  // Filter available coupons from Admin Context
  const availableCoupons = coupons.filter(c => {
    if (!c.active) return false;
    if (c.expirationDate) {
      const today = new Date();
      const expDate = new Date(c.expirationDate + 'T23:59:59');
      if (today > expDate) return false;
    }
    return true;
  });

  // Re-validate when subtotal changes (in case item removal makes coupon invalid if logic changed, or just to update %)
  useEffect(() => {
    if (appliedDiscount > 0 && couponCode) {
      const discount = validateCoupon(couponCode, subtotal);
      if (discount > 0) {
        setAppliedDiscount(discount);
      } else {
        setAppliedDiscount(0);
        setCouponCode('');
        setCouponError('O cupom não é mais válido para este valor.');
      }
    }
  }, [subtotal, validateCoupon, couponCode]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-black via-50% to-[#8B0000] text-white flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-neutral-800 p-8 rounded-full mb-6 animate-pulse">
          <ShoppingBag size={64} className="text-neutral-500" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-center">Seu carrinho está vazio</h2>
        <button onClick={onBackToMenu} className="mt-8 bg-brand-orange text-white font-bold font-display tracking-wide py-3 px-8 rounded-full hover:bg-orange-600 flex items-center gap-2">
          <ChevronLeft size={20} /> Voltar para o Cardápio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black via-50% to-[#8B0000] text-white font-sans pb-44 lg:pb-0 relative">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <button onClick={onBackToMenu} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Carrinho</h1>
          <span className="bg-brand-orange text-white text-xs md:text-sm font-bold font-display px-3 py-1 rounded-full">
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)} itens
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.cartId} className="bg-neutral-800 rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4 border border-neutral-700 relative">
                <div className="w-20 h-20 sm:w-32 sm:h-32 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl bg-neutral-700" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-display text-lg sm:text-2xl font-bold text-white mb-1 line-clamp-1">{item.name}</h3>
                      <button onClick={() => removeItem(item.cartId)} className="text-neutral-500 hover:text-red-500 p-1"><Trash2 size={18} /></button>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-400 line-clamp-1 mb-1">{item.description}</p>
                    <div className="text-[10px] sm:text-xs text-neutral-300 space-y-0.5">
                      {item.selectedCrust && <p>Borda: {item.selectedCrust.name}</p>}
                      {item.observation && <p className="text-yellow-500/80 italic">Obs: "{item.observation}"</p>}
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-2 sm:mt-0">
                    <div className="flex items-center bg-neutral-900 rounded-lg border border-neutral-700 h-8 sm:h-auto">
                      <button onClick={() => updateQuantity(item.cartId, -1)} className="w-8 p-1 hover:bg-neutral-700 rounded-l-lg"><Minus size={14} /></button>
                      <span className="w-6 text-center text-xs font-bold font-display">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, 1)} className="w-8 p-1 hover:bg-neutral-700 rounded-r-lg"><Plus size={14} /></button>
                    </div>
                    <span className="font-display text-lg sm:text-2xl font-bold text-brand-orange">{formatCurrency(item.unitTotal * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700 sticky top-24 shadow-xl">
              <h2 className="font-display text-2xl font-black mb-6 flex items-center gap-2" style={{opacity: 1, color: '#000'}}><ShoppingBag className="text-brand-orange" /> Resumo</h2>
              
              {/* --- Animated Coupon Section --- */}
              <div className="mb-6">
                {!showCouponInput && appliedDiscount === 0 ? (
                  <button 
                    onClick={() => setShowCouponInput(true)}
                    className="w-full bg-gradient-to-r from-[#009246] to-green-700 hover:from-green-700 hover:to-[#009246] text-white font-black py-5 rounded-xl shadow-[0_0_20px_rgba(0,146,70,0.6)] flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 border-4 border-green-300"
                  >
                    <Tag size={24} className="animate-wiggle" />
                    <span className="font-display tracking-wide uppercase text-lg" style={{fontWeight: 900, opacity: 1}}>Tem Cupom de Desconto?</span>
                  </button>
                ) : (
                  <div className="animate-slide-up bg-neutral-900 p-4 rounded-xl border border-neutral-700 shadow-inner">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider font-display">Aplicar Cupom</label>
                      {appliedDiscount === 0 && (
                        <button onClick={() => setShowCouponInput(false)} className="text-xs text-red-400 hover:text-red-300">Fechar</button>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                        placeholder="CÓDIGO"
                        className="flex-1 bg-black/50 border border-neutral-700 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-brand-orange uppercase font-display font-bold text-white tracking-widest placeholder:tracking-normal"
                        disabled={appliedDiscount > 0}
                      />
                      {appliedDiscount > 0 ? (
                        <button onClick={() => { setAppliedDiscount(0); setCouponCode(''); }} className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg font-bold text-xs uppercase tracking-wider"><Trash2 size={16}/></button>
                      ) : (
                        <button onClick={() => handleApplyCoupon()} className="bg-brand-orange hover:bg-orange-600 text-white px-4 rounded-lg font-bold text-sm uppercase tracking-wider">OK</button>
                      )}
                    </div>
                    
                    {couponError && (
                       <div className="flex items-center gap-1 text-red-500 text-xs mt-2 bg-red-500/10 p-2 rounded">
                         <AlertCircle size={12} /> {couponError}
                       </div>
                    )}
                    
                    {appliedDiscount > 0 && (
                      <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-500 text-xs font-bold">
                        <Check size={14} /> Cupom aplicado! Economia de {formatCurrency(appliedDiscount)}
                      </div>
                    )}

                    {/* Integrated Coupons List from Admin */}
                    {availableCoupons.length > 0 && appliedDiscount === 0 && (
                      <div className="mt-4 pt-3 border-t border-neutral-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Sugestões para você:</p>
                        <div className="space-y-2">
                          {availableCoupons.map(coupon => (
                             <button 
                               key={coupon.id}
                               onClick={() => handleApplyCoupon(coupon.code)}
                               className="w-full text-left p-2.5 rounded-lg border border-dashed border-gray-600 hover:border-brand-green hover:bg-brand-green/10 transition-all group relative overflow-hidden"
                             >
                                <div className="flex justify-between items-center relative z-10">
                                   <div className="flex flex-col">
                                      <span className="text-brand-orange font-display font-black tracking-widest text-sm">{coupon.code}</span>
                                      <span className="text-[10px] text-gray-400">
                                        {coupon.type === 'percent' ? `${coupon.value}% OFF` : `R$ ${coupon.value.toFixed(2)} de desconto`}
                                      </span>
                                   </div>
                                   <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-brand-green group-hover:text-white text-gray-500 transition-colors">
                                      <Plus size={14} />
                                   </div>
                                </div>
                             </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* --- Animated Cashback Button --- */}
              {user?.cashbackBalance && user.cashbackBalance > 0 && (
                <div className="mb-6">
                  {!useCashback ? (
                    <button 
                      onClick={() => setUseCashback(true)}
                      className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black py-4 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.4)] flex items-center justify-center gap-3 animate-bounce transition-all border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1"
                    >
                      <Coins size={24} className="animate-spin-slow" />
                      <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] uppercase tracking-widest opacity-80">Saldo disponível</span>
                        <span className="text-lg font-display">USAR {formatCurrency(user.cashbackBalance)}</span>
                      </div>
                    </button>
                  ) : (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 p-4 rounded-xl flex justify-between items-center animate-slide-up shadow-inner relative overflow-hidden">
                       <div className="absolute inset-0 bg-yellow-500/5 animate-pulse"></div>
                       <div className="relative z-10 flex items-center gap-3">
                          <div className="bg-yellow-500 p-2 rounded-full text-black shadow-lg">
                             <Coins size={18} /> 
                          </div>
                          <div>
                             <span className="block text-brand-yellow font-bold text-sm font-display">Cashback Ativo</span>
                             <span className="text-[10px] text-gray-400">Desconto aplicado no total</span>
                          </div>
                       </div>
                       <button onClick={() => setUseCashback(false)} className="relative z-10 text-xs text-red-400 hover:text-red-300 font-bold underline bg-black/40 px-2 py-1 rounded">Remover</button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 py-4 border-y border-neutral-700 mb-6 bg-black/20 p-4 rounded-xl">
                <div className="flex justify-between text-sm"><span className="font-bold" style={{opacity: 1, fontWeight: 900, color: '#FFF'}}>Subtotal</span><span className="font-display font-black text-white" style={{opacity: 1}}>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="font-bold" style={{opacity: 1, fontWeight: 900, color: '#FFF'}}>Taxa de Entrega</span><span className="font-display font-black text-white" style={{opacity: 1}}>{formatCurrency(deliveryFee)}</span></div>
                
                {appliedDiscount > 0 && (
                   <div className="flex justify-between text-green-500 font-bold text-sm bg-green-500/10 p-1.5 rounded">
                      <span className="flex items-center gap-1"><Tag size={12}/> Cupom</span>
                      <span className="font-display">- {formatCurrency(appliedDiscount)}</span>
                   </div>
                )}
                
                {cashbackValue > 0 && (
                   <div className="flex justify-between text-yellow-500 font-bold text-sm bg-yellow-500/10 p-1.5 rounded">
                      <span className="flex items-center gap-1"><Coins size={12}/> Cashback</span>
                      <span className="font-display">- {formatCurrency(cashbackValue)}</span>
                   </div>
                )}
              </div>

              <div className="flex justify-between items-end mb-6 bg-neutral-900/50 p-4 rounded-xl border border-neutral-700">
                 <span className="text-xl font-black font-display" style={{opacity: 1, fontWeight: 900, color: '#FFF'}}>Total Estimado</span>
                 <span className="text-5xl font-black text-[#B91C1C] font-display tracking-tight" style={{opacity: 1, fontWeight: 900, textShadow: '0 0 15px rgba(185, 28, 28, 0.8)'}}>{formatCurrency(total)}</span>
              </div>
              
              <button onClick={proceedToCheckout} className="w-full bg-gradient-to-r from-[#B91C1C] to-red-700 hover:from-red-700 hover:to-[#B91C1C] text-white font-black text-base md:text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 font-display uppercase tracking-wider group hover:scale-[1.02] active:scale-[0.98]" style={{fontWeight: 900}}>
                 Finalizar Pedido 
                 <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button onClick={onBackToMenu} className="w-full mt-3 bg-transparent border-4 border-white hover:bg-white hover:text-black text-white font-black text-base md:text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 font-display uppercase tracking-wider hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.3)]" style={{fontWeight: 900, opacity: 1}}>
                 <ChevronLeft size={22} />
                 Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
