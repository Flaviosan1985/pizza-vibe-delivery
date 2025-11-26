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
        {/* Left: Empty Space for Balance */}
        <div className="flex-1"></div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
          {logo ? (
            <img src={logo} alt="Logo" className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-lg border-2 border-white/20" />
          ) : (
            <div className="bg-brand-green p-2.5 md:p-3 rounded-full text-white shadow-lg shadow-green-900/20">
              <Pizza className="w-6 h-6 md:w-8 md:h-8" />
            </div>
          )}
          {/* Gradient Text for Logo with Italian Flag Colors */}
          <span className="font-display text-2xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-white to-brand-red drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] leading-none">
            {name}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 md:space-x-4 flex-1 justify-end">
          
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