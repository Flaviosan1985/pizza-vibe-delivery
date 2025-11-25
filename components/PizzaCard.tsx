import React from 'react';
import { Pizza } from '../types';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdmin } from '../contexts/AdminContext';

interface PizzaCardProps {
  pizza: Pizza;
  onSelect: (pizza: Pizza) => void;
  isRecommended?: boolean;
  userId?: string;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onSelect, isRecommended, userId }) => {
  const { toggleFavorite, isFavorite } = useAdmin();
  const isFav = userId ? isFavorite(userId, pizza.id) : false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userId) {
      toggleFavorite(userId, pizza.id);
    }
  };
  return (
    <div 
      className={`group flex flex-col h-full rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer relative bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 shadow-lg overflow-hidden ${isRecommended ? 'ring-1 ring-brand-green/50 shadow-green-900/20' : ''}`}
      onClick={() => onSelect(pizza)}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute top-2 left-2 bg-brand-green text-white text-[9px] uppercase font-display font-black tracking-widest px-2 py-0.5 rounded-full shadow-md z-10">
          Top
        </div>
      )}

      {/* Favorite Button */}
      {userId && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg flex items-center justify-center z-10 border backdrop-blur-sm transition-colors ${
            isFav 
              ? 'bg-red-500/90 border-red-500 text-white' 
              : 'bg-black/60 border-white/20 text-white hover:bg-red-500/50'
          }`}
          aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart size={16} className={isFav ? 'fill-current' : ''} />
        </motion.button>
      )}

      {/* Image Content - Optimized Height for Mobile/Desktop */}
      <div className="relative w-full h-28 sm:h-48 shrink-0 overflow-hidden bg-gray-900/50">
        <img 
          src={pizza.image} 
          alt={pizza.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
        
        {/* Animated Cart Button - Compact */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-2 right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg flex items-center justify-center transform transition-all duration-300 z-10 border border-white/20 bg-black/60 text-white hover:bg-brand-green hover:border-brand-green focus:outline-none backdrop-blur-sm"
          aria-label="Adicionar ao carrinho"
          onClick={(e) => {
             e.stopPropagation();
             onSelect(pizza);
          }}
        >
          <ShoppingCart size={14} strokeWidth={2.5} className="ml-[-1px] sm:w-[18px] sm:h-[18px]" />
        </motion.button>
      </div>

      {/* Text Content - Flex Column for Alignment */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        
        {/* Title & Desc */}
        <div className="mb-2">
          <h3 className="font-display text-sm sm:text-lg font-bold text-white mb-1 leading-tight group-hover:text-brand-green transition-colors line-clamp-1">
            {pizza.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-300 leading-relaxed line-clamp-2 font-light min-h-[2.5em]">
            {pizza.description}
          </p>
        </div>
        
        {/* Price Section - Always at Bottom */}
        <div className="mt-auto pt-2 sm:pt-3 border-t border-white/10 flex justify-between items-end">
          <div className="flex flex-col">
             <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-bold tracking-wider">Valor</span>
             <span className="font-display text-sm sm:text-xl font-bold text-white tracking-tight leading-none">
               R$ {pizza.price.toFixed(2).replace('.', ',')}
             </span>
          </div>
          <span className="text-[8px] sm:text-[10px] uppercase font-bold text-brand-orange tracking-wider bg-brand-orange/10 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">
            Ver +
          </span>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;