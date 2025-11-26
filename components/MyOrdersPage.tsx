import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { User, Order } from '../types';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import PageContainer from './containers/PageContainer';
import BackButton from './containers/BackButton';
import PageHeader from './containers/PageHeader';
import EmptyState from './containers/EmptyState';
import StatusBadge from './containers/StatusBadge';
import OrderStatusMessage from './containers/OrderStatusMessage';

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

  return (
    <PageContainer>
      <BackButton onClick={onBack} />
      
      <PageHeader 
        title="Meus Pedidos"
        subtitle="Acompanhe todos os seus pedidos em tempo real"
      />

      {/* Orders List */}
      {userOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Nenhum pedido ainda"
          description="Faça seu primeiro pedido e ele aparecerá aqui!"
          actionLabel="Ver Cardápio"
          onAction={onBack}
        />
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
                        <StatusBadge status={order.status} />
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
                  <OrderStatusMessage status={order.status} />
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

                  {/* Reorder Button - Only for cancelled orders */}
                  {order.status === 'cancelled' && (
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
    </PageContainer>
  );
};

export default MyOrdersPage;
