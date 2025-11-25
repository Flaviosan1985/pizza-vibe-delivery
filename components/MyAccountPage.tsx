import React, { useState } from 'react';
import { User } from '../types';
import { ArrowLeft, Heart, ClipboardList, User as UserIcon, Phone, MapPin, Camera, Save } from 'lucide-react';
import Button from './Button';
import { useAdmin } from '../contexts/AdminContext';

interface MyAccountPageProps {
  user: User;
  onBack: () => void;
  onMyOrders: () => void;
  onMyFavorites: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const MyAccountPage: React.FC<MyAccountPageProps> = ({ 
  user, 
  onBack, 
  onMyOrders, 
  onMyFavorites,
  onUpdateUser 
}) => {
  const { getOrdersByUser, getUserFavorites, pizzas } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedAvatar, setEditedAvatar] = useState(user.avatar || '');

  const userOrders = getOrdersByUser(user.phone);
  const favoritePizzaIds = getUserFavorites(user.phone);
  const favoritePizzas = pizzas.filter(p => favoritePizzaIds.includes(p.id));

  const completedOrders = userOrders.filter(o => o.status === 'delivered').length;
  const totalSpent = userOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: editedName,
      avatar: editedAvatar || undefined
    };
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-orange via-brand-green to-brand-orange p-6">
        <div className="container mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span className="font-display font-semibold">Voltar</span>
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative group">
              {editedAvatar ? (
                <img
                  src={editedAvatar}
                  alt={user.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-display font-bold text-white text-4xl border-4 border-white shadow-2xl">
                  {getInitials(user.name)}
                </div>
              )}
              
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-brand-orange p-2 rounded-full text-white shadow-lg hover:bg-orange-600 transition-colors">
                  <Camera size={20} />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="font-display text-3xl font-bold text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-brand-orange"
                />
              ) : (
                <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                  {user.name}
                </h1>
              )}
              
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-1 md:space-y-0 md:space-x-4 text-white/80">
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span className="text-sm">{user.phone}</span>
                </div>
                {user.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span className="text-sm">{user.address}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center md:justify-start space-x-4 mt-4">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-display font-semibold flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Salvar</span>
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedName(user.name);
                        setEditedAvatar(user.avatar || '');
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-display font-semibold"
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-display font-semibold backdrop-blur-md border border-white/20"
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-10 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6 text-center">
            <ClipboardList size={32} className="mx-auto mb-2 text-blue-400" />
            <p className="text-3xl font-display font-bold text-white mb-1">
              {userOrders.length}
            </p>
            <p className="text-sm text-gray-300">Pedidos Realizados</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 text-center">
            <Heart size={32} className="mx-auto mb-2 text-red-400" />
            <p className="text-3xl font-display font-bold text-white mb-1">
              {favoritePizzas.length}
            </p>
            <p className="text-sm text-gray-300">Pizzas Favoritas</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 text-center">
            <UserIcon size={32} className="mx-auto mb-2 text-green-400" />
            <p className="text-3xl font-display font-bold text-white mb-1">
              R$ {totalSpent.toFixed(2)}
            </p>
            <p className="text-sm text-gray-300">Total Gasto</p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl font-bold text-white mb-6">
          Acesso Rápido
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={onMyOrders}
            className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-gray-800/70 transition-all group text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-brand-orange transition-colors">
                  Meus Pedidos
                </h3>
                <p className="text-sm text-gray-400">
                  Veja o histórico e status dos seus pedidos
                </p>
              </div>
              <ClipboardList size={48} className="text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
          </button>

          <button
            onClick={onMyFavorites}
            className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-gray-800/70 transition-all group text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-brand-orange transition-colors">
                  Meus Favoritos
                </h3>
                <p className="text-sm text-gray-400">
                  Suas pizzas favoritas sempre à mão
                </p>
              </div>
              <Heart size={48} className="text-red-400 group-hover:scale-110 transition-transform" />
            </div>
          </button>
        </div>

        {/* Recent Favorites Preview */}
        {favoritePizzas.length > 0 && (
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-4">
              Suas Pizzas Favoritas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {favoritePizzas.slice(0, 4).map(pizza => (
                <div key={pizza.id} className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-brand-orange/50 transition-all">
                  <img 
                    src={pizza.image} 
                    alt={pizza.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <p className="font-display font-semibold text-white text-sm truncate">
                      {pizza.name}
                    </p>
                    <p className="text-brand-orange font-bold text-sm">
                      R$ {pizza.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;
