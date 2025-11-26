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

      {/* Image Content - Compacta */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl">
        <img 
          src={pizza.image} 
          alt={pizza.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Text Content - Compacto estilo Pedido.app */}
      <div className="p-3 md:p-4 flex flex-col flex-1 bg-white">
        {/* Nome em negrito */}
        <h3 className="text-sm md:text-base font-black text-gray-900 mb-1 leading-tight group-hover:text-[#B91C1C] transition-colors uppercase tracking-tight">
          {pizza.name}
        </h3>
        
        {/* Descrição fonte normal */}
        <p className="text-xs text-gray-600 leading-snug line-clamp-2 mb-2 flex-1 font-normal">
          {pizza.description}
        </p>
        
        {/* Preço e Botão - Layout horizontal compacto */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-medium">A partir de</span>
            <span className="text-lg md:text-xl font-black text-[#009246]">
              R${pizza.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(pizza);
            }}
            className="bg-[#009246] hover:bg-green-700 text-white font-bold p-3 rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg touch-manipulation"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PizzaCard;