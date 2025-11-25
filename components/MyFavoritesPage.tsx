import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { User, Pizza } from '../types';
import { ArrowLeft, Heart } from 'lucide-react';
import PizzaCard from './PizzaCard';

interface MyFavoritesPageProps {
  user: User;
  onBack: () => void;
  onSelectPizza: (pizza: Pizza) => void;
}

const MyFavoritesPage: React.FC<MyFavoritesPageProps> = ({ user, onBack, onSelectPizza }) => {
  const { getUserFavorites, pizzas } = useAdmin();
  const favoriteIds = getUserFavorites(user.phone);
  const favoritePizzas = pizzas.filter(p => favoriteIds.includes(p.id) && p.available !== false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-2 flex items-center gap-3">
            <Heart size={32} className="text-red-500 fill-current" />
            Meus Favoritos
          </h1>
          <p className="text-gray-400">
            Suas pizzas favoritas em um só lugar
          </p>
        </div>

        {/* Favorites Grid */}
        {favoritePizzas.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <Heart size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum favorito ainda</h3>
            <p className="text-gray-400 mb-6">
              Clique no coração ❤️ nas pizzas que você mais gosta para salvá-las aqui!
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-brand-orange hover:bg-orange-600 rounded-xl transition font-bold"
            >
              Ver Cardápio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favoritePizzas.map(pizza => (
              <div key={pizza.id} className="h-full">
                <PizzaCard
                  pizza={pizza}
                  onSelect={onSelectPizza}
                  userId={user.phone}
                />
              </div>
            ))}
          </div>
        )}

        {favoritePizzas.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            {favoritePizzas.length} {favoritePizzas.length === 1 ? 'pizza favorita' : 'pizzas favoritas'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavoritesPage;
