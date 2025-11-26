import React from 'react';
import { Clock, Package, CheckCircle, Truck, XCircle } from 'lucide-react';
import { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: 'Aguardando Confirmação',
          color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
        };
      case 'preparing':
        return {
          icon: Package,
          label: '👨‍🍳 Em Preparo',
          color: 'text-blue-500 bg-blue-500/10 border-blue-500/30'
        };
      case 'ready':
        return {
          icon: CheckCircle,
          label: '✅ SEU PEDIDO ESTÁ PRONTO!',
          color: 'text-green-500 bg-green-500/10 border-green-500/30'
        };
      case 'delivered':
        return {
          icon: Truck,
          label: '🚚 Saiu para Entrega',
          color: 'text-gray-500 bg-gray-500/10 border-gray-500/30'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          label: 'Cancelado',
          color: 'text-red-500 bg-red-500/10 border-red-500/30'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <span className={`flex items-center ${sizeClasses[size]} rounded-full font-bold border ${config.color}`}>
      <Icon size={iconSizes[size]} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
