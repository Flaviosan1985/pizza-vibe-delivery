import React from 'react';
import { OrderStatus } from '../../types';

interface OrderStatusMessageProps {
  status: OrderStatus;
}

const OrderStatusMessage: React.FC<OrderStatusMessageProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          message: 'Seu pedido foi recebido! Aguarde enquanto confirmamos.',
          color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
          extraInfo: null
        };
      case 'preparing':
        return {
          message: 'Nosso chef está preparando sua pizza com muito carinho! 🍕🔥',
          color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
          extraInfo: null
        };
      case 'ready':
        return {
          message: '🎉 PRONTO! Seu pedido está quentinho e pode ser retirado na loja!',
          color: 'bg-green-500/20 border-green-500 animate-pulse',
          extraInfo: '📍 Venha retirar na loja o mais rápido possível para garantir que sua pizza esteja quentinha!'
        };
      case 'delivered':
        return {
          message: '🚚 Pedido saiu para entrega! Em breve estará aí!',
          color: 'bg-blue-500/20 border-blue-500 animate-pulse',
          extraInfo: '⏱️ Tempo estimado de entrega: 30-45 minutos'
        };
      case 'cancelled':
        return {
          message: 'Este pedido foi cancelado. Entre em contato se tiver dúvidas.',
          color: 'text-red-500 bg-red-500/10 border-red-500/30',
          extraInfo: null
        };
    }
  };

  const config = getStatusConfig();

  if (status === 'cancelled') {
    return null;
  }

  return (
    <div className={`p-4 rounded-xl border ${config.color}`}>
      <p className={`font-bold ${status === 'ready' || status === 'delivered' ? 'text-base md:text-lg' : 'text-sm'}`}>
        {config.message}
      </p>
      {config.extraInfo && (
        <p className={`text-xs mt-2 ${
          status === 'ready' ? 'text-green-300' : 'text-blue-300'
        }`}>
          {config.extraInfo}
        </p>
      )}
    </div>
  );
};

export default OrderStatusMessage;
