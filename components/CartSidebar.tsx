import React from 'react';
import { X, Plus, Minus, Trash2, Edit2, ShoppingBag, Gift, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import Button from './Button';
import { useAdmin } from '../contexts/AdminContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemove: (cartId: string) => void;
  onCheckout: () => void;
  onNavigateToMenu?: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cart, onUpdateQuantity, onRemove, onCheckout, onNavigateToMenu }) => {
  const { promotion } = useAdmin();
  const total = cart.reduce((acc, item) => acc + (item.unitTotal * item.quantity), 0);
  
  const amountToPromotion = promotion.enabled ? Math.max(0, promotion.minValue - total) : 0;
  const isEligibleForPromotion = promotion.enabled && total >= promotion.minValue;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-black z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-neutral-700 flex justify-between items-center bg-black">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white" style={{opacity: 1, fontWeight: 900}}>Seu Pedido</h2>
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
            <X size={24} className="text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center animate-pulse">
                <ShoppingBag size={40} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-lg font-medium">Sua sacola está vazia</p>
              <Button variant="outline" onClick={onClose}>Ir para o Cardápio</Button>
            </div>
          ) : (
            cart.map((item) => {
              const isPromotionalItem = item.id === 99999;
              return (
              <div key={item.cartId} className={`flex items-start gap-4 p-3 rounded-xl transition-colors border ${isPromotionalItem ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' : 'bg-neutral-800 border-neutral-700'}`}>
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-800 shrink-0" />
                  {isPromotionalItem && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
                      GRÁTIS
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-white line-clamp-1 flex items-center gap-2" style={{opacity: 1, fontWeight: 900}}>
                        {item.isHalfHalf ? 'Pizza Meio a Meio' : item.name}
                        {isPromotionalItem && <Gift size={16} className="text-green-500" />}
                      </h3>
                      {item.isHalfHalf && item.secondFlavor && (
                        <div className="text-xs text-brand-orange font-medium mt-0.5">
                          ½ {item.name} <br/> 
                          ½ {item.secondFlavor.name}
                        </div>
                      )}
                      {isPromotionalItem && (
                        <div className="text-xs text-green-500 font-medium mt-0.5">
                          🎁 Brinde promocional
                        </div>
                      )}
                    </div>
                    <p className={`font-black text-sm whitespace-nowrap ml-2 ${isPromotionalItem ? 'text-green-500' : 'text-[#B91C1C]'}`} style={{opacity: 1, fontWeight: 900}}>
                      {isPromotionalItem ? 'GRÁTIS' : `R$ ${(item.unitTotal * item.quantity).toFixed(2).replace('.', ',')}`}
                    </p>
                  </div>

                  {/* Customizations Display */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-0.5">
                    {item.selectedCrust && item.selectedCrust.price > 0 && (
                      <p>+ {item.selectedCrust.name}</p>
                    )}
                    {item.selectedAddons.length > 0 && (
                      <p>+ {item.selectedAddons.map(a => a.name).join(', ')}</p>
                    )}
                    {item.observation && (
                      <p className="italic text-gray-400 dark:text-gray-500">"Obs: {item.observation}"</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                     {!isPromotionalItem ? (
                       <>
                         <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-900 shadow-sm">
                            <button 
                              onClick={() => onUpdateQuantity(item.cartId, -1)}
                              className="p-1 px-2 hover:bg-neutral-700 rounded-l-lg transition-colors text-white">
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-white" style={{opacity: 1, fontWeight: 900}}>{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.cartId, 1)}
                              className="p-1 px-2 hover:bg-neutral-700 rounded-r-lg transition-colors text-white">
                              <Plus size={14} />
                            </button>
                         </div>
                         <button 
                           onClick={() => onRemove(item.cartId)}
                           className="text-gray-400 hover:text-red-500 transition-colors p-1"
                         >
                           <Trash2 size={16} />
                         </button>
                       </>
                     ) : (
                       <div className="text-xs text-green-500 font-medium flex items-center gap-1">
                         <Sparkles size={12} />
                         Brinde automático
                       </div>
                     )}
                  </div>
                </div>
              </div>
            );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-700 bg-black space-y-4">
            {/* Promotion Banner */}
            {promotion.enabled && !isEligibleForPromotion && amountToPromotion > 0 && (
              <div 
                onClick={() => {
                  onNavigateToMenu?.();
                  onClose();
                }}
                className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-700 border-4 border-blue-300 rounded-xl p-4 cursor-pointer group hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                <div className="absolute inset-0 bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Gift size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black text-sm flex items-center gap-2" style={{opacity: 1, fontWeight: 900}}>
                      <Sparkles size={14} className="text-yellow-300 animate-pulse" />
                      Falta só R$ {amountToPromotion.toFixed(2).replace('.', ',')} para ganhar!
                    </p>
                    <p className="text-white text-xs mt-0.5" style={{opacity: 1, fontWeight: 700}}>
                      {promotion.products[0]?.name || 'Brinde'} GRÁTIS 🎁
                    </p>
                  </div>
                  <div className="flex-shrink-0 px-3 py-1.5 bg-green-500 rounded-full text-white text-xs font-black group-hover:bg-green-600 transition-colors" style={{opacity: 1}}>
                    Adicionar +
                  </div>
                </div>
              </div>
            )}

            {isEligibleForPromotion && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-4 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Gift size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm flex items-center gap-2">
                      🎉 Parabéns! Você ganhou um brinde!
                    </p>
                    <p className="text-gray-300 text-xs mt-0.5">
                      {promotion.products[0]?.name || 'Brinde'} será adicionado automaticamente
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-white" style={{opacity: 1, fontWeight: 900}}>Subtotal</span>
              <span className="font-black text-white" style={{opacity: 1}}>{total.toFixed(2).replace('.', ',')}</span>
            </div>
            {/* Note: Delivery fee is not added here in sidebar anymore, only in checkout */}
            <div className="flex justify-between items-center text-xl pt-3 border-t border-neutral-700">
              <span className="font-black text-white" style={{opacity: 1, fontWeight: 900}}>Total Estimado</span>
              <span className="text-3xl font-black text-[#B91C1C]" style={{opacity: 1, fontWeight: 900, textShadow: '0 0 15px rgba(185, 28, 28, 0.8)'}}>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-[#B91C1C] to-red-700 hover:from-red-700 hover:to-[#B91C1C] text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all font-display uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
              style={{fontWeight: 900, opacity: 1}}
            >
              Finalizar Pedido
            </button>
            
            <button 
              onClick={onClose} 
              className="w-full py-4 rounded-xl border-4 border-white text-white font-black hover:bg-white hover:text-black transition-all text-base font-display uppercase tracking-wider hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.3)]" style={{fontWeight: 900, opacity: 1}}>
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;