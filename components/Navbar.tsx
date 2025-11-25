import React, { useState, useEffect } from 'react';
import { ShoppingCart, Pizza, ClipboardList, Heart } from 'lucide-react';
import UserMenu from './UserMenu';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAI: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
  onMyAccount: () => void;
  onMyOrders: () => void;
  onMyFavorites: () => void;
  userName: string;
  userAvatar?: string;
  logo?: string;
  storeName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenAI, isDarkMode, toggleTheme, onLogout, onMyAccount, onMyOrders, onMyFavorites, userName, userAvatar, logo, storeName }) => {
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
        {/* Left: Welcome Message (Desktop Only) */}
        <div className="hidden md:flex items-center">
          <div className="text-white/90">
            <p className="text-sm font-light">Bem-vindo(a), <span className="font-display font-bold text-brand-orange">{userName}</span></p>
            <p className="text-xs text-white/70">As melhores pizzas da região 🍕</p>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
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

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          
          {/* AI Sommelier - Visible on all screens */}
          <button 
            onClick={onOpenAI}
            className={`px-3 py-2 md:px-5 md:py-2.5 rounded-full border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white transition-all font-display font-bold text-[10px] md:text-sm uppercase tracking-wider bg-black/20 backdrop-blur-sm shadow-lg`}
          >
            ✨ IA
          </button>

          {/* My Orders - Mobile Icon Only */}
          <button
            onClick={onMyOrders}
            className={`md:hidden p-2.5 rounded-full transition-colors hover:bg-white/10 ${iconColor}`}
            title="Meus Pedidos"
          >
            <ClipboardList size={22} />
          </button>

          {/* My Favorites - Mobile Icon Only */}
          <button
            onClick={onMyFavorites}
            className={`md:hidden p-2.5 rounded-full transition-colors hover:bg-white/10 ${iconColor}`}
            title="Meus Favoritos"
          >
            <Heart size={22} />
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

          {/* User Menu */}
          <UserMenu
            userName={userName}
            userAvatar={userAvatar}
            onMyAccount={onMyAccount}
            onMyOrders={onMyOrders}
            onMyFavorites={onMyFavorites}
            onLogout={onLogout}
          />
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;