import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Truck, XCircle, X, MapPin } from 'lucide-react';
import { OrderStatus } from '../types';

interface ToastProps {
  message: string;
  status?: OrderStatus;
  orderNumber?: number;
  visible: boolean;
  onClose: () => void;
  duration?: number;
  showMapLink?: boolean;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  status, 
  orderNumber, 
  visible, 
  onClose, 
  duration = 5000,
  showMapLink = false
}) => {
  useEffect(() => {
    if (visible && duration > 0) {
      // Increase duration for important status updates
      const finalDuration = (status === 'ready' || status === 'delivered') ? 10000 : duration;
      const timer = setTimeout(onClose, finalDuration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose, status]);

  const getStatusConfig = () => {
    switch (status) {
      case 'preparing':
        return {
          icon: <Clock className="w-6 h-6" />,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          title: 'Pedido em Preparo'
        };
      case 'ready':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'bg-green-500',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500',
          title: '✅ SEU PEDIDO ESTÁ PRONTO!'
        };
      case 'delivered':
        return {
          icon: <Truck className="w-6 h-6" />,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500',
          title: '🚚 SAIU PARA ENTREGA!'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-6 h-6" />,
          color: 'bg-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          title: 'Pedido Cancelado'
        };
      default:
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'bg-brand-orange',
          bgColor: 'bg-brand-orange/10',
          borderColor: 'border-brand-orange/30',
          title: 'Notificação'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-20 right-4 z-[9999] max-w-md"
        >
          <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl shadow-2xl backdrop-blur-md p-4 pr-12 ${
            (status === 'ready' || status === 'delivered') ? 'animate-pulse' : ''
          }`}>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              aria-label="Fechar notificação"
            >
              <X size={20} />
            </button>

            <div className="flex items-start space-x-3">
              <div className={`${config.color} p-2 rounded-full text-white flex-shrink-0`}>
                {config.icon}
              </div>
              
              <div className="flex-1">
                <h4 className="font-display font-bold text-white text-lg mb-1">
                  {config.title}
                </h4>
                {orderNumber && (
                  <p className="text-sm text-gray-300 mb-2">
                    Pedido #{orderNumber}
                  </p>
                )}
                <p className="text-white text-sm leading-relaxed whitespace-pre-line">
                  {message}
                </p>
                
                {showMapLink && (
                  <a 
                    href="https://maps.app.goo.gl/NYjRtDwTaza4GWaq9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-green-600 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg text-sm animate-pulse"
                  >
                    <MapPin size={16} />
                    Ver no Mapa
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
