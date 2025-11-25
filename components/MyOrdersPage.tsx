import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { User, Order, OrderStatus } from '../types';
import { ArrowLeft, Clock, CheckCircle, Truck, Package, XCircle, ShoppingBag, RefreshCw } from 'lucide-react';
import Button from './Button';

interface MyOrdersPageProps {
  user: User;
  onBack: () => void;
  onReorder: (order: Order) => void;
}

const MyOrdersPage: React.FC<MyOrdersPageProps> = ({ user, onBack, onReorder }) => {
  const { getOrdersByUser } = useAdmin();
  const userOrders = getOrdersByUser(user.phone).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'preparing': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'ready': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'delivered': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/30';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'preparing': return <Package size={16} />;
      case 'ready': return <CheckCircle size={16} />;
      case 'delivered': return <Truck size={16} />;
      case 'cancelled': return <XCircle size={16} />;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Aguardando';
      case 'preparing': return 'Em Preparo';
      case 'ready': return '🎉 Pronto para Retirada!';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
    }
  };

  const getStatusMessage = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Seu pedido foi recebido e será processado em breve.';
      case 'preparing': return 'Nosso chef está preparando seu pedido com carinho!';
      case 'ready': return 'Seu pedido está prontinho! Pode vir buscar! 🍕';
      case 'delivered': return 'Pedido entregue. Esperamos que tenha gostado!';
      case 'cancelled': return 'Este pedido foi cancelado.';
    }
  };

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
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-2">
            Meus Pedidos
          </h1>
          <p className="text-gray-400">
            Acompanhe todos os seus pedidos em tempo real
          </p>
        </div>

        {/* Orders List */}
        {userOrders.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <ShoppingBag size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum pedido ainda</h3>
            <p className="text-gray-400 mb-6">Faça seu primeiro pedido e ele aparecerá aqui!</p>
            <Button onClick={onBack}>Ver Cardápio</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-white font-display">
                          Pedido #{order.orderNumber}
                        </span>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-brand-orange">
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>

                  {/* Status Message */}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className={`p-4 rounded-xl border ${getStatusColor(order.status)}`}>
                      <p className="text-sm font-medium">{getStatusMessage(order.status)}</p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="p-6 space-y-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Itens do Pedido</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-black/30 rounded-xl p-4">
                      <img
                        src={item.pizzaImage}
                        alt={item.pizzaName}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white font-bold">
                          {item.quantity}x {item.pizzaName}
                          {item.isHalfHalf && item.secondFlavorName && ` + ${item.secondFlavorName}`}
                        </p>
                        {(item.crust || (item.addons && item.addons.length > 0)) && (
                          <p className="text-sm text-gray-400 mt-1">
                            {item.crust && `+ ${item.crust}`}
                            {item.addons && item.addons.length > 0 && ` + ${item.addons.join(', ')}`}
                          </p>
                        )}
                        {item.observation && (
                          <p className="text-xs text-gray-500 italic mt-1">Obs: {item.observation}</p>
                        )}
                      </div>
                      <p className="text-white font-bold text-lg">
                        R$ {item.total.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  ))}

                  {/* Order Summary */}
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Subtotal</span>
                      <span>R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Taxa de Entrega</span>
                        <span>R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Desconto</span>
                        <span>- R$ {order.discount.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-2">
                      <span>Total</span>
                      <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>

                  {/* Reorder Button */}
                  {(order.status === 'delivered' || order.status === 'cancelled') && (
                    <button
                      onClick={() => onReorder(order)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-orange hover:bg-orange-600 rounded-xl transition font-bold mt-4"
                    >
                      <RefreshCw size={18} />
                      Pedir Novamente
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
