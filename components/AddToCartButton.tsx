import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  price?: number;
  onClick?: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ price, onClick, className = '', ...props }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Center of the button
      setStartPos({ 
        x: rect.left + rect.width / 2 - 12, // -12 to center the 24px icon
        y: rect.top + rect.height / 2 - 12 
      });
      setIsAnimating(true);
    }

    if (onClick) {
      onClick();
    }

    // Reset after animation duration
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`relative w-full group overflow-hidden bg-black/50 hover:bg-brand-green text-white border border-white/10 hover:border-brand-green rounded-xl px-6 py-4 flex items-center justify-between transition-all duration-300 active:scale-[0.98] shadow-lg ${className}`}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold">Adicionar ao pedido</span>
        </div>
        
        {price !== undefined && (
          <span className="font-bold text-white text-lg group-hover:text-white transition-colors">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ 
              position: 'fixed',
              left: startPos.x, 
              top: startPos.y, 
              scale: 1, 
              opacity: 1, 
              zIndex: 9999,
              rotate: 0 
            }}
            animate={{ 
              left: window.innerWidth - 60, // Approximate cart position (top right)
              top: 25, 
              scale: 0.3, 
              opacity: 0,
              rotate: 360 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut" 
            }}
            className="pointer-events-none"
          >
            <div className="bg-brand-green p-2 rounded-full shadow-lg shadow-green-500/50">
              <Pizza className="w-6 h-6 text-white fill-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddToCartButton;