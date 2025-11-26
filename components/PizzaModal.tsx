
import React, { useState, useEffect } from 'react';
import { X, Check, ShoppingBag, Plus, ShoppingCart } from 'lucide-react';
import { Pizza, CartItem, OptionItem } from '../types';
import { useAdmin } from '../contexts/AdminContext'; // Use context instead of constants
import Button from './Button';

interface PizzaModalProps {
  pizza: Pizza | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const PizzaModal: React.FC<PizzaModalProps> = ({ pizza, isOpen, onClose, onAddToCart }) => {
  const { crusts, addons } = useAdmin(); // Fetch dynamic options
  
  const [selectedCrust, setSelectedCrust] = useState<OptionItem | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<OptionItem[]>([]);
  const [observation, setObservation] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset state when pizza changes
  useEffect(() => {
    if (isOpen) {
      // Default to the first crust option (usually "Traditional") if available
      setSelectedCrust(crusts.length > 0 ? crusts[0] : null);
      setSelectedAddons([]);
      setObservation('');
      setQuantity(1);
    }
  }, [isOpen, pizza, crusts]);

  if (!isOpen || !pizza) return null;

  const toggleAddon = (addon: OptionItem) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const calculateTotal = () => {
    const crustPrice = selectedCrust ? selectedCrust.price : 0;
    const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
    return (pizza.price + crustPrice + addonsTotal) * quantity;
  };

  const handleConfirm = () => {
    const crustPrice = selectedCrust ? selectedCrust.price : 0;
    const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
    const unitTotal = pizza.price + crustPrice + addonsTotal;

    const cartItem: CartItem = {
      ...pizza,
      cartId: `${pizza.id}-${Date.now()}`,
      quantity,
      selectedCrust,
      selectedAddons,
      observation,
      unitTotal
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="bg-white dark:bg-brand-gray w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-slide-up transition-colors duration-300 border border-gray-100 dark:border-neutral-800">
        
        {/* Header Image */}
        <div className="h-48 relative shrink-0">
          <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-black rounded-full p-2 transition-all backdrop-blur-md"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-3xl font-bold">{pizza.name}</h2>
            <p className="opacity-90">{pizza.description}</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1 custom-scrollbar">
          
          {/* Bordas */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
              1. Escolha a Borda <span className="ml-2 text-xs font-normal text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">Recomendado</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {crusts.map((crust) => (
                <div 
                  key={crust.id}
                  onClick={() => setSelectedCrust(crust)}
                  className={`cursor-pointer border-2 rounded-xl p-4 flex justify-between items-center transition-all hover:scale-[1.02] active:scale-[0.98] ${selectedCrust?.id === crust.id ? 'border-[#009246] bg-green-50 dark:bg-green-900/20 shadow-md' : 'border-gray-200 dark:border-neutral-800 hover:border-[#009246] dark:hover:border-[#009246]'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${selectedCrust?.id === crust.id ? 'border-[#009246] bg-[#009246]' : 'border-gray-300 dark:border-gray-600'}`}>
                      {selectedCrust?.id === crust.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                    <span className="font-black text-gray-900 dark:text-gray-100">{crust.name}</span>
                  </div>
                  <span className="text-sm font-black text-[#009246]">
                    {crust.price === 0 ? 'Grátis' : `+R$${crust.price.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Adicionais */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
              2. Adicionais <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 dark:bg-brand-dark dark:text-gray-400 px-2 py-0.5 rounded-full">Opcional</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addons.map((addon) => {
                const isSelected = selectedAddons.some(a => a.id === addon.id);
                return (
                  <div 
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={`cursor-pointer border-2 rounded-xl p-4 flex justify-between items-center transition-all hover:scale-[1.02] active:scale-[0.98] ${isSelected ? 'border-[#009246] bg-green-50 dark:bg-green-900/20 shadow-md' : 'border-gray-200 dark:border-neutral-800 hover:border-[#009246] dark:hover:border-[#009246]'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded mr-3 flex items-center justify-center border-2 transition-all ${isSelected ? 'bg-[#009246] border-[#009246]' : 'border-gray-300 dark:border-gray-600'}`}>
                        {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className="font-black text-gray-900 dark:text-gray-100">{addon.name}</span>
                    </div>
                    <span className="text-sm font-black text-[#009246]">
                      +R${addon.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Observações */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">3. Observações</h3>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: Tirar cebola, pizza bem passada, cortar em pedaços menores..."
              className="w-full border-2 border-gray-200 dark:border-neutral-800 dark:bg-brand-dark dark:text-white rounded-xl p-3 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all min-h-[100px] resize-none"
            />
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-brand-dark/50 flex items-center justify-between gap-4">
           <div className="flex items-center bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-600 dark:text-white font-bold text-lg"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-gray-800 dark:text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-600 dark:text-white font-bold text-lg"
                >
                  +
                </button>
           </div>

           <button
             onClick={handleConfirm}
             className="flex-1 flex justify-between items-center bg-gradient-to-r from-[#009246] to-green-700 hover:from-green-700 hover:to-[#009246] text-white font-bold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
           >
             <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="animate-wiggle" />
                <span className="text-base">Adicionar</span>
             </div>
             <span className="text-lg font-black">R${calculateTotal().toFixed(2).replace('.', ',')}</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaModal;
