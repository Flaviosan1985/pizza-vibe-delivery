
import React, { useState, useEffect, useMemo } from 'react';
import { Check, Plus, AlertCircle, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';

// Types definition based on the prompt requirements
export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  type: 'crust' | 'addon'; // Distinguishing between crust and general addons
}

export interface CartItem {
  product: Product; // Represents the "primary" product or a virtual product
  quantity: number;
  secondFlavor?: Product;
  selectedCrust?: Extra;
  selectedAddons: Extra[];
  observation: string;
  totalPrice: number;
}

interface PizzaHalfAndHalfProps {
  categories: Category[];
  products: Product[];
  extras: Extra[];
  onAddToCart: (item: CartItem) => void;
  onClose?: () => void;
}

const PizzaHalfAndHalf: React.FC<PizzaHalfAndHalfProps> = ({
  categories,
  products,
  extras,
  onAddToCart,
  onClose
}) => {
  // --- State ---
  const [flavor1, setFlavor1] = useState<Product | null>(null);
  const [flavor2, setFlavor2] = useState<Product | null>(null);
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1); // Which side are we selecting?
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || '');
  
  const [selectedCrust, setSelectedCrust] = useState<Extra | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Extra[]>([]);
  const [observation, setObservation] = useState<string>('');

  // --- Derived State & Logic ---

  // Filter products by category
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.categoryId === selectedCategory);
  }, [products, selectedCategory]);

  // Separate extras into Crusts and Addons
  const crustOptions = useMemo(() => extras.filter(e => e.type === 'crust'), [extras]);
  const addonOptions = useMemo(() => extras.filter(e => e.type === 'addon'), [extras]);

  // Price Calculation: Max price between flavors + crust + addons
  const basePrice = useMemo(() => {
    if (!flavor1 && !flavor2) return 0;
    if (flavor1 && !flavor2) return flavor1.price;
    if (!flavor1 && flavor2) return flavor2.price;
    return Math.max(flavor1!.price, flavor2!.price);
  }, [flavor1, flavor2]);

  const extrasTotal = useMemo(() => {
    const crustPrice = selectedCrust?.price || 0;
    const addonsPrice = selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
    return crustPrice + addonsPrice;
  }, [selectedCrust, selectedAddons]);

  const finalTotal = basePrice + extrasTotal;

  // --- Handlers ---

  const handleSelectProduct = (product: Product) => {
    if (activeSlot === 1) {
      setFlavor1(product);
      // Auto-advance to slot 2 if it's empty, otherwise stay to allow correction
      if (!flavor2) setActiveSlot(2);
    } else {
      setFlavor2(product);
    }
  };

  const handleToggleAddon = (extra: Extra) => {
    setSelectedAddons(prev => {
      const exists = prev.find(e => e.id === extra.id);
      if (exists) return prev.filter(e => e.id !== extra.id);
      return [...prev, extra];
    });
  };

  const handleAddToCartClick = () => {
    if (!flavor1 && !flavor2) return;

    // Use flavor1 as base, attach flavor2 info if exists
    const primaryFlavor = flavor1 || flavor2!;
    
    // Construct the Cart Item
    const item: CartItem = {
      product: primaryFlavor,
      secondFlavor: flavor1 && flavor2 ? (flavor1.id === primaryFlavor.id ? flavor2 : flavor1) : undefined,
      quantity: 1,
      selectedCrust: selectedCrust || undefined,
      selectedAddons,
      observation,
      totalPrice: finalTotal
    };

    onAddToCart(item);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Determine if we show customization options
  // Requirement: "O botão de borda recheada só deve aparecer APÓS o cliente ter escolhido pelo menos o segundo sabor"
  // However, logical fallback: show if 2 flavors selected OR if user explicitly stays on 1 flavor but proceeds.
  // For this implementation, we show options if at least 1 flavor is selected, but emphasize "Complete your pizza".
  const hasSelectedFlavors = flavor1 || flavor2;

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-white overflow-hidden rounded-t-xl md:rounded-xl shadow-2xl ring-1 ring-white/10 font-sans">
      
      {/* --- Header --- */}
      <div className="flex-none p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 z-10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
            <span className="bg-yellow-500 w-2 h-6 rounded-sm"></span>
            Montar Pizza
          </h2>
          <p className="text-xs text-neutral-400">Escolha até 2 sabores</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition">
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* --- Visual Selector (The "Pizza") --- */}
        <div className="p-6 bg-neutral-900 sticky top-0 z-10 shadow-lg">
          <div className="flex gap-4 mb-2">
            
            {/* Slot 1 */}
            <div 
              onClick={() => setActiveSlot(1)}
              className={`flex-1 relative h-32 rounded-xl border-2 transition-all cursor-pointer overflow-hidden group ${
                activeSlot === 1 
                  ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                  : 'border-neutral-700 hover:border-neutral-500'
              }`}
            >
              {flavor1 ? (
                <>
                  <img src={flavor1.image} alt={flavor1.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-xs font-bold text-yellow-500 uppercase mb-0.5">1º Sabor</span>
                    <span className="font-bold text-white leading-tight line-clamp-2 font-display">{flavor1.name}</span>
                    <span className="text-xs text-neutral-300 font-bold">{formatCurrency(flavor1.price)}</span>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                  <Plus className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-sm font-medium">1º Sabor</span>
                </div>
              )}
            </div>

            {/* Slot 2 */}
            <div 
              onClick={() => setActiveSlot(2)}
              className={`flex-1 relative h-32 rounded-xl border-2 transition-all cursor-pointer overflow-hidden group ${
                activeSlot === 2 
                  ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                  : 'border-neutral-700 hover:border-neutral-500'
              }`}
            >
              {flavor2 ? (
                <>
                  <img src={flavor2.image} alt={flavor2.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-xs font-bold text-yellow-500 uppercase mb-0.5">2º Sabor</span>
                    <span className="font-bold text-white leading-tight line-clamp-2 font-display">{flavor2.name}</span>
                    <span className="text-xs text-neutral-300 font-bold">{formatCurrency(flavor2.price)}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFlavor2(null); }}
                    className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white hover:bg-red-500 transition"
                  >
                    <ChevronDown className="w-3 h-3 rotate-45" /> {/* Using Chevron as X */}
                  </button>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                   <div className="border border-dashed border-neutral-600 rounded-full p-2 mb-2">
                      <Plus className="w-4 h-4" />
                   </div>
                  <span className="text-sm font-medium">Adicionar 2º Sabor</span>
                  <span className="text-[10px] text-neutral-600">(Opcional)</span>
                </div>
              )}
            </div>

          </div>

          {/* Pricing Alert */}
          {flavor1 && flavor2 && flavor1.price !== flavor2.price && (
            <div className="flex items-start gap-2 text-xs text-neutral-400 bg-neutral-800/50 p-2 rounded-lg border border-neutral-800">
              <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
              <span>
                Prevalecerá o valor do sabor 
                <span className="text-yellow-500 font-bold mx-1">
                  {flavor1.price > flavor2.price ? '1º (maior valor)' : '2º (maior valor)'}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* --- Category Tabs --- */}
        <div className="sticky top-[180px] bg-neutral-900 z-10 pb-2 px-4 border-b border-neutral-800">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors font-display ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* --- Product Grid --- */}
        <div className="p-4 grid gap-3">
          {filteredProducts.map(product => {
            const isSelected = flavor1?.id === product.id || flavor2?.id === product.id;
            const isCurrentSlot = (activeSlot === 1 && flavor1?.id === product.id) || (activeSlot === 2 && flavor2?.id === product.id);

            return (
              <div 
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer bg-neutral-800/50 hover:bg-neutral-800 ${
                  isCurrentSlot 
                    ? 'border-yellow-500 ring-1 ring-yellow-500/50' 
                    : isSelected 
                      ? 'border-neutral-600 opacity-60' 
                      : 'border-transparent hover:border-neutral-600'
                }`}
              >
                <img src={product.image} alt={product.name} className="w-16 h-16 rounded-md object-cover bg-neutral-700" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-white truncate font-display">{product.name}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-tight mt-1">{product.description}</p>
                  <div className="mt-2 text-sm font-bold text-yellow-500 font-display">
                    {formatCurrency(product.price)}
                  </div>
                </div>
                {isCurrentSlot && (
                  <div className="bg-yellow-500 text-black p-1.5 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* --- Customization Section (Crust & Extras) --- */}
        {hasSelectedFlavors && (
          <div className="p-4 space-y-6 bg-neutral-900 border-t border-neutral-800 mt-2">
            
            {/* Borda (Crust) */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 font-display">
                <div className="w-1 h-4 bg-red-600 rounded-sm"></div>
                Borda Recheada
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <div 
                  onClick={() => setSelectedCrust(null)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedCrust === null 
                      ? 'border-yellow-500 bg-yellow-500/10' 
                      : 'border-neutral-700 bg-neutral-800'
                  }`}
                >
                  <span className="text-sm font-medium">Tradicional (Sem recheio)</span>
                  {selectedCrust === null && <Check className="w-4 h-4 text-yellow-500" />}
                </div>
                {crustOptions.map(crust => (
                  <div 
                    key={crust.id}
                    onClick={() => setSelectedCrust(crust)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCrust?.id === crust.id 
                        ? 'border-yellow-500 bg-yellow-500/10' 
                        : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <span className="text-sm font-medium">{crust.name}</span>
                    <span className="text-sm text-neutral-400 font-bold">+ {formatCurrency(crust.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Extras (Addons) */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 font-display">
                <div className="w-1 h-4 bg-red-600 rounded-sm"></div>
                Turbine sua Pizza
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {addonOptions.map(addon => {
                  const isSelected = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <div 
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon)}
                      className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-green-500 bg-green-500/10' 
                          : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${isSelected ? 'text-green-400' : 'text-white'}`}>{addon.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-green-500" />}
                      </div>
                      <span className="text-xs text-neutral-400 font-bold">+ {formatCurrency(addon.price)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Observations */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 font-display">
                <div className="w-1 h-4 bg-red-600 rounded-sm"></div>
                Observações
              </h3>
              <textarea 
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Ex: Sem cebola na metade de calabresa, bem assada..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors h-24 resize-none"
              />
            </div>
          </div>
        )}
        
        {/* Spacer for sticky footer */}
        <div className="h-24"></div>
      </div>

      {/* --- Footer / Actions --- */}
      <div className="flex-none p-4 bg-neutral-900 border-t border-neutral-800 z-20 sticky bottom-0">
        <div className="flex justify-between items-end mb-4 text-sm">
          <span className="text-neutral-400 font-display font-bold uppercase tracking-wider">Total do pedido:</span>
          <div className="text-right">
             <span className="text-2xl font-bold text-white block font-display">{formatCurrency(finalTotal)}</span>
             {extrasTotal > 0 && <span className="text-xs text-neutral-500">Incluso +{formatCurrency(extrasTotal)} em adicionais</span>}
          </div>
        </div>
        
        <button
          onClick={handleAddToCartClick}
          disabled={!hasSelectedFlavors}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg font-display uppercase tracking-wide ${
            hasSelectedFlavors 
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20' 
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          Adicionar ao Carrinho
        </button>
      </div>

    </div>
  );
};

export default PizzaHalfAndHalf;
