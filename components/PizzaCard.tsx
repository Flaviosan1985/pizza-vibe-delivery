import React from 'react';
import { Pizza } from '../types';
import { ShoppingCart, Heart, Star } from 'lucide-react';
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group flex flex-col h-full bg-white rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer relative overflow-hidden border border-gray-100 ${isRecommended ? 'ring-2 ring-[#009246]' : ''}`}
      onClick={() => onSelect(pizza)}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-[#009246] to-green-600 text-white text-[10px] uppercase font-bold tracking-wide px-3 py-1.5 rounded-full shadow-lg z-10 flex items-center gap-1">
          <Star size={12} className="fill-current" />
          <span>IA Recomenda</span>
        </div>
      )}

      {/* Favorite Button */}
      {userId && (
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 w-10 h-10 rounded-full shadow-xl flex items-center justify-center z-10 transition-all backdrop-blur-sm ${
            isFav 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white/95 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
          aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart size={18} className={isFav ? 'fill-current' : ''} />
        </motion.button>
      )}

      {/* Image Content with Gradient Overlay */}
      <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img 
          src={pizza.image} 
          alt={pizza.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Text Content */}
      <div className="p-5 flex flex-col flex-1 bg-white">
        <h3 className="font-display text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#B91C1C] transition-colors">
          {pizza.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4 flex-1">
          {pizza.description}
        </p>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">A partir de</span>
            <span className="font-display text-2xl md:text-3xl font-black text-[#B91C1C]">
              R$ {pizza.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(pizza);
            }}
            className="bg-gradient-to-r from-[#B91C1C] to-red-700 hover:from-red-700 hover:to-[#B91C1C] text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <ShoppingCart size={20} />
            <span className="text-sm font-bold">Pedir</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PizzaCard;