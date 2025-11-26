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
  const [isOpen, setIsOpen] = useState(true);
  const [openTime, setOpenTime] = useState('18:30');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if store is open (example: 18:00 - 23:00)
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hour + minutes / 60;
      
      // Open from 18:00 to 23:00
      const isCurrentlyOpen = currentTime >= 18 && currentTime < 23;
      setIsOpen(isCurrentlyOpen);
      
      if (!isCurrentlyOpen && currentTime < 18) {
        setOpenTime('18:30');
      }
    };
    
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Trigger bump animation when cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const navBackground = isScrolled 
    ? 'bg-[#B91C1C] shadow-lg py-3' 
    : 'bg-[#B91C1C] py-4';

  const name = storeName || 'PizzaVibe';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBackground}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          
          {/* LEFT: Logo + Store Name */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {logo ? (
              <img src={logo} alt="Logo" className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover shadow-lg" />
            ) : (
              <div className="bg-white p-2.5 md:p-3 rounded-xl text-[#B91C1C] shadow-lg">
                <Pizza className="w-6 h-6 md:w-9 md:h-9" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-display text-base md:text-2xl font-bold text-white uppercase tracking-wide leading-tight">
                {name}
              </span>
              {/* Status Badge */}
              <div className="flex items-center gap-1 md:gap-2 mt-1">
                <div className="flex items-center gap-1 md:gap-1.5 bg-white/20 rounded-full px-2 md:px-2.5 py-0.5">
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className="text-[10px] md:text-xs font-medium text-white">
                    {isOpen ? 'ABERTO' : `ABRE ÀS ${openTime}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Cart + User Menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* Cart Button - Touch optimized */}
            <button
              onClick={onOpenCart}
              className={`relative bg-white text-[#B91C1C] p-2.5 md:p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform touch-manipulation ${isBumping ? 'animate-bounce' : ''}`}
              title="Carrinho"
            >
              <ShoppingCart size={20} className="md:w-6 md:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
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
      </div>
    </nav>
  );
};

export default Navbar;