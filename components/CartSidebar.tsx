import React from 'react';
import { X, Plus, Minus, Trash2, Edit2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import Button from './Button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemove: (cartId: string) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cart, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = cart.reduce((acc, item) => acc + (item.unitTotal * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-brand-gray z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Seu Pedido</h2>
            <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">{cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center animate-pulse">
                <ShoppingBag size={40} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-lg font-medium">Sua sacola está vazia</p>
              <Button variant="outline" onClick={onClose}>Ir para o Cardápio</Button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-800 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
                        {item.isHalfHalf ? 'Pizza Meio a Meio' : item.name}
                      </h3>
                      {item.isHalfHalf && item.secondFlavor && (
                        <div className="text-xs text-brand-orange font-medium mt-0.5">
                          ½ {item.name} <br/> 
                          ½ {item.secondFlavor.name}
                        </div>
                      )}
                    </div>
                    <p className="text-brand-orange font-bold text-sm whitespace-nowrap ml-2">
                      R$ {(item.unitTotal * item.quantity).toFixed(2).replace('.', ',')}
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
                     <div className="flex items-center border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <button 
                          onClick={() => onUpdateQuantity(item.cartId, -1)}
                          className="p-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors text-gray-600 dark:text-gray-300"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-800 dark:text-gray-100">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.cartId, 1)}
                          className="p-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors text-gray-600 dark:text-gray-300"
                        >
                          <Plus size={14} />
                        </button>
                     </div>
                     <button 
                       onClick={() => onRemove(item.cartId)}
                       className="text-gray-400 hover:text-red-500 transition-colors p-1"
                     >
                       <Trash2 size={16} />
                     </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 space-y-4">
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 text-sm">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            {/* Note: Delivery fee is not added here in sidebar anymore, only in checkout */}
            <div className="flex justify-between items-center text-xl font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
              <span>Total Estimado</span>
              <span>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <Button onClick={onCheckout} className="w-full shadow-xl shadow-orange-200 dark:shadow-none" size="lg">
              Finalizar Pedido
            </Button>
            
            <button 
              onClick={onClose} 
              className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;