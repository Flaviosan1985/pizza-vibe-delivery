import React, { useState, useEffect } from 'react';
import { ShoppingCart, Pizza, Moon, Sun, LogOut } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAI: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
  logo?: string;
  storeName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenAI, isDarkMode, toggleTheme, onLogout, logo, storeName }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger bump animation when cartCount changes (and is positive)
  useEffect(() => {
    if (cartCount > 0) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Background logic:
  // Top: Transparent
  // Scrolled: Black/80 with blur and border
  const navBackground = isScrolled 
    ? 'bg-black/80 backdrop-blur-md shadow-lg border-b border-white/10 py-3' 
    : 'bg-transparent py-5';
  
  // Text Color Logic:
  const iconColor = 'text-white';

  const name = storeName || 'PizzaVibe';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBackground}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          {logo ? (
            <img src={logo} alt="Logo" className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-lg border-2 border-white/20" />
          ) : (
            <div className="bg-brand-green p-2.5 md:p-3 rounded-full text-white shadow-lg shadow-green-900/20">
              <Pizza className="w-6 h-6 md:w-8 md:h-8" />
            </div>
          )}
          {/* Gradient Text for Logo with Display Font */}
          <span className="font-display text-2xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-white to-brand-orange drop-shadow-sm leading-none">
            {name}
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={onOpenAI}
            className={`px-5 py-2.5 rounded-full border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white transition-all font-display font-bold text-sm uppercase tracking-wider bg-black/20 backdrop-blur-sm shadow-lg`}
          >
            ✨ Sommelier IA
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-colors hover:bg-white/10 ${iconColor}`}
            title={isDarkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
          >
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          {/* Cart */}
          <button 
            onClick={onOpenCart}
            className={`relative p-2.5 rounded-full transition-transform duration-200 ${isBumping ? 'scale-125 text-brand-orange' : ''} hover:bg-white/10 ${iconColor}`}
            title="Abrir Carrinho"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="font-display absolute -top-1 -right-1 bg-brand-green text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Logout (Visible on Mobile & Desktop) */}
          <button
            onClick={onLogout}
            className={`flex p-2.5 rounded-full transition-colors hover:bg-red-500/20 hover:text-red-500 ${iconColor}`}
            title="Sair"
          >
            <LogOut size={24} />
          </button>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;