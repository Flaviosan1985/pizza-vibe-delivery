import React, { useState, useMemo } from 'react';
import { Check, Plus, Trash2, ShoppingCart, AlertCircle, ChevronDown, Pizza } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interfaces conforme solicitado
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  type: 'crust' | 'addon'; // Necessário para distinguir borda de outros adicionais
}

export interface HalfHalfCartItem {
  type: 'half-half';
  flavors: [Product, Product?];
  quantity: number;
  crust?: Extra | null;
  addons: Extra[];
  observation: string;
  totalPrice: number;
}

interface PizzaMeioAMeioProps {
  products: Product[];
  extras: Extra[];
  onAddToCart: (item: HalfHalfCartItem) => void;
  onClose?: () => void;
}

const PizzaMeioAMeio: React.FC<PizzaMeioAMeioProps> = ({ products, extras, onAddToCart, onClose }) => {
  const [flavor1, setFlavor1] = useState<Product | null>(null);
  const [flavor2, setFlavor2] = useState<Product | null>(null);
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [selectedCrust, setSelectedCrust] = useState<Extra | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Extra[]>([]);
  const [observation, setObservation] = useState('');
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);

  // Filtrar extras
  const crustOptions = useMemo(() => extras.filter(e => e.type === 'crust'), [extras]);
  const addonOptions = useMemo(() => extras.filter(e => e.type === 'addon'), [extras]);

  // Lógica de Preço: Maior valor entre os sabores + extras
  const totalPrice = useMemo(() => {
    let base = 0;
    if (flavor1 && !flavor2) base = flavor1.price;
    else if (!flavor1 && flavor2) base = flavor2.price;
    else if (flavor1 && flavor2) base = Math.max(flavor1.price, flavor2.price);

    const crustPrice = selectedCrust?.price || 0;
    const addonsPrice = selectedAddons.reduce((acc, curr) => acc + curr.price, 0);

    return base + crustPrice + addonsPrice;
  }, [flavor1, flavor2, selectedCrust, selectedAddons]);

  const handleSelectProduct = (product: Product) => {
    if (activeSlot === 1) {
      setFlavor1(product);
      if (!flavor2) setActiveSlot(2); // Auto-avança
    } else {
      setFlavor2(product);
    }
  };

  const handleToggleAddon = (extra: Extra) => {
    setSelectedAddons(prev => {
      const exists = prev.find(e => e.id === extra.id);
      return exists ? prev.filter(e => e.id !== extra.id) : [...prev, extra];
    });
  };

  const handleAddToCartClick = () => {
    if (!flavor1) return;
    
    // Trigger animation
    setIsAnimating(true);

    const item: HalfHalfCartItem = {
      type: 'half-half',
      flavors: flavor2 ? [flavor1, flavor2] : [flavor1],
      quantity: 1,
      crust: selectedCrust,
      addons: selectedAddons,
      observation,
      totalPrice
    };

    // Delay the actual add to cart to allow animation to start/play
    setTimeout(() => {
      onAddToCart(item);
      setIsAnimating(false);
    }, 800);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-white rounded-xl overflow-hidden shadow-2xl border border-neutral-800 relative">
      
      {/* Header */}
      <div className="p-4 bg-neutral-800 border-b border-neutral-700 flex justify-between items-center shadow-md z-10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-yellow-500 rounded-sm"></span>
            Pizza Meio a Meio
          </h2>
          <p className="text-xs text-neutral-400">Monte do seu jeito</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 bg-neutral-700 rounded-full hover:bg-neutral-600 transition">
            <ChevronDown className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        
        {/* Visual Selector */}
        <div className="flex gap-4">
          {/* Slot 1 */}
          <div 
            onClick={() => setActiveSlot(1)}
            className={`flex-1 relative h-40 rounded-lg border-2 overflow-hidden cursor-pointer transition-all group ${
              activeSlot === 1 ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'border-neutral-700 opacity-80'
            }`}
          >
            {flavor1 ? (
              <>
                <img src={flavor1.image} alt={flavor1.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-xs font-bold text-yellow-500 uppercase">1ª Metade</span>
                  <span className="font-bold text-white text-sm line-clamp-2">{flavor1.name}</span>
                  <span className="text-xs text-neutral-300">{formatCurrency(flavor1.price)}</span>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 bg-neutral-800">
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Escolher 1º Sabor</span>
              </div>
            )}
          </div>

          {/* Slot 2 */}
          <div 
            onClick={() => setActiveSlot(2)}
            className={`flex-1 relative h-40 rounded-lg border-2 overflow-hidden cursor-pointer transition-all group ${
              activeSlot === 2 ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'border-neutral-700 opacity-80'
            }`}
          >
            {flavor2 ? (
              <>
                <img src={flavor2.image} alt={flavor2.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-xs font-bold text-yellow-500 uppercase">2ª Metade</span>
                  <span className="font-bold text-white text-sm line-clamp-2">{flavor2.name}</span>
                  <span className="text-xs text-neutral-300">{formatCurrency(flavor2.price)}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFlavor2(null); }}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-red-500 text-white transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 bg-neutral-800 border-dashed border-neutral-600">
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Escolher 2º Sabor</span>
                <span className="text-[10px] opacity-70">(Opcional)</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Alert */}
        {flavor1 && flavor2 && (
          <div className="bg-neutral-800/80 border border-neutral-700 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-300">
              O valor final da pizza será baseado no sabor de 
              <span className="font-bold text-yellow-500 mx-1">MAIOR VALOR</span> 
              ({formatCurrency(Math.max(flavor1.price, flavor2.price))}).
            </p>
          </div>
        )}

        {/* Product List */}
        <div>
          <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
            Cardápio ({activeSlot}ª Metade)
          </h3>
          <div className="space-y-2">
            {products.map(product => {
              const isSelected = (activeSlot === 1 && flavor1?.id === product.id) || (activeSlot === 2 && flavor2?.id === product.id);
              return (
                <div 
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-yellow-500/10 border-yellow-500' 
                      : 'bg-neutral-800 border-transparent hover:bg-neutral-700'
                  }`}
                >
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded bg-neutral-700 object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-sm ${isSelected ? 'text-yellow-500' : 'text-white'}`}>{product.name}</span>
                      <span className="text-xs font-bold text-neutral-300">{formatCurrency(product.price)}</span>
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-1">{product.description}</p>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-yellow-500" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Customization - Shows after second flavor is selected */}
        {/* Bordas e complementos aparecem após a escolha do segundo sabor */}
        {flavor1 && flavor2 && (
          <div className="space-y-6 pt-4 border-t border-neutral-800 animate-slide-up">
            
            {/* Crusts */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-red-500 rounded-sm"></div>
                Borda Recheada
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <div 
                  onClick={() => setSelectedCrust(null)}
                  className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center ${
                    selectedCrust === null ? 'border-yellow-500 bg-yellow-500/10' : 'border-neutral-700 bg-neutral-800'
                  }`}
                >
                  <span className="text-sm font-medium">Tradicional</span>
                  {selectedCrust === null && <Check className="w-4 h-4 text-yellow-500" />}
                </div>
                {crustOptions.map(crust => (
                  <div 
                    key={crust.id}
                    onClick={() => setSelectedCrust(crust)}
                    className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center ${
                      selectedCrust?.id === crust.id ? 'border-yellow-500 bg-yellow-500/10' : 'border-neutral-700 bg-neutral-800'
                    }`}
                  >
                    <span className="text-sm font-medium">{crust.name}</span>
                    <span className="text-xs text-neutral-400">+ {formatCurrency(crust.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Addons */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-red-500 rounded-sm"></div>
                Adicionais Extras
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {addonOptions.map(addon => {
                  const isActive = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <div 
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon)}
                      className={`p-3 rounded-lg border cursor-pointer flex flex-col transition-all ${
                        isActive ? 'border-green-500 bg-green-500/10' : 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-medium ${isActive ? 'text-green-500' : 'text-white'}`}>{addon.name}</span>
                        {isActive && <Check className="w-3 h-3 text-green-500" />}
                      </div>
                      <span className="text-xs text-neutral-400">+ {formatCurrency(addon.price)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Observations */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Observações</h3>
              <textarea 
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Ex: Tirar cebola da parte de calabresa..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500 resize-none h-24"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-neutral-900 border-t border-neutral-800 z-20">
        <div className="flex justify-between items-end mb-4">
          <span className="text-sm text-neutral-400">Total a pagar:</span>
          <span className="text-2xl font-bold text-yellow-500">{formatCurrency(totalPrice)}</span>
        </div>
        
        <button
          onClick={handleAddToCartClick}
          disabled={!flavor1 || isAnimating}
          className={`w-full py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
            flavor1 
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20' 
              : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
          }`}
        >
          {isAnimating ? (
            <span className="animate-pulse">Adicionando...</span>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Carrinho
            </>
          )}
        </button>
      </div>

      {/* Flying Pizza Animation Portal */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ 
              position: 'fixed',
              bottom: '40px', 
              left: '50%', 
              x: '-50%',
              scale: 0.5, 
              opacity: 1, 
              zIndex: 9999,
              rotate: 0 
            }}
            animate={{ 
              top: '30px', // Approximate Navbar Cart position
              left: 'calc(100% - 50px)', 
              x: '0%',
              scale: 0.2, 
              opacity: 0,
              rotate: 360 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeIn" // Accelerate towards cart
            }}
            className="pointer-events-none"
          >
            <div className="bg-yellow-500 p-3 rounded-full shadow-lg shadow-yellow-500/50">
              <Pizza className="w-8 h-8 text-black fill-black/20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PizzaMeioAMeio;