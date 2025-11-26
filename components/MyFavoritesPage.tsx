import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { User, Pizza } from '../types';
import { Heart } from 'lucide-react';
import PizzaCard from './PizzaCard';
import PageContainer from './containers/PageContainer';
import BackButton from './containers/BackButton';
import PageHeader from './containers/PageHeader';
import EmptyState from './containers/EmptyState';

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
    <PageContainer>
      <BackButton onClick={onBack} />
      
      <PageHeader 
        title="Meus Favoritos"
        subtitle="Suas pizzas favoritas em um só lugar"
        actions={
          <Heart size={32} className="text-red-500 fill-current" />
        }
      />

      {/* Favorites Grid */}
      {favoritePizzas.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nenhum favorito ainda"
          description="Clique no coração ❤️ nas pizzas que você mais gosta para salvá-las aqui!"
          actionLabel="Ver Cardápio"
          onAction={onBack}
        />
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
    </PageContainer>
  );
};

export default MyFavoritesPage;
