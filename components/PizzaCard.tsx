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
      className={`group flex flex-col h-full bg-white rounded-lg transition-all duration-300 hover:shadow-2xl cursor-pointer relative overflow-hidden border-2 border-gray-200 hover:border-brand-orange ${isRecommended ? 'ring-2 ring-brand-green' : ''}`}
      onClick={() => onSelect(pizza)}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute top-3 left-3 bg-brand-green text-white text-[10px] uppercase font-display font-black tracking-wide px-3 py-1 rounded shadow-md z-10">
          Recomendado
        </div>
      )}

      {/* Favorite Button */}
      {userId && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full shadow-lg flex items-center justify-center z-10 transition-colors ${
            isFav 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
          aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart size={18} className={isFav ? 'fill-current' : ''} />
        </motion.button>
      )}

      {/* Image Content */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <img 
          src={pizza.image} 
          alt={pizza.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Text Content */}
      <div className="p-4 flex flex-col flex-1 bg-white">
        <h3 className="font-display text-base md:text-lg font-bold text-gray-900 mb-2 leading-tight">
          {pizza.name}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3 flex-1">
          {pizza.description}
        </p>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-semibold">A partir de</span>
            <span className="font-display text-xl md:text-2xl font-bold text-brand-red">
              R$ {pizza.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(pizza);
            }}
            className="bg-brand-orange hover:bg-brand-red text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
          >
            <ShoppingCart size={18} />
            <span className="hidden md:inline text-sm">Pedir</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;