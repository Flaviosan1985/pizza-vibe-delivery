import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCartButtonProps {
  cartCount: number;
  onClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ cartCount, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          onClick={onClick}
          className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform duration-200 border-2 border-white/20 backdrop-blur-sm bg-brand-orange text-white hover:bg-red-700 ${
             isBumping ? 'scale-110' : 'hover:scale-105 active:scale-95'
          }`}
          aria-label="Ver Carrinho"
        >
          <div className="relative">
            <ShoppingCart size={28} className="fill-current" />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-brand-yellow text-brand-dark text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-brand-orange shadow-sm animate-slide-up">
                {cartCount}
              </span>
            )}
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartButton;