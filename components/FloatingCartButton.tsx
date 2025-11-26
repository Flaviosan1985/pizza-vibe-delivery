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
          animate={{ 
            opacity: 1, 
            scale: isBumping ? 1.15 : 1, 
            y: 0,
            rotate: isBumping ? [0, -10, 10, -10, 0] : 0
          }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            rotate: { duration: 0.5 }
          }}
          onClick={onClick}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20 backdrop-blur-sm bg-gradient-to-br from-[#B91C1C] to-red-700 text-white hover:from-red-700 hover:to-[#B91C1C] hover:scale-105 active:scale-95 touch-manipulation"
          aria-label="Ver Carrinho"
        >
          <motion.div 
            className="relative"
            animate={cartCount > 0 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ShoppingCart size={28} className="fill-current" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-pulse"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartButton;