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
        <div className="grid grid-cols-3 items-center gap-4">
          
          {/* LEFT: TELEFONE */}
          <div className="flex items-center justify-start">
            <a 
              href="tel:+5513996511793" 
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
            >
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <span className="hidden md:block font-bold text-sm">(13) 99651-1793</span>
            </a>
          </div>

          {/* CENTER: LOGO (MAIOR e em DESTAQUE) */}
          <div className="flex items-center justify-center">
            {logo ? (
              <img 
                src={logo} 
                alt="Logo" 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-2xl relative -mt-6 md:-mt-8 border-4 border-white" 
                style={{boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'}}
              />
            ) : (
              <div 
                className="bg-white p-6 md:p-8 rounded-full text-[#B91C1C] shadow-2xl relative -mt-6 md:-mt-8 border-4 border-white" 
                style={{boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'}}
              >
                <Pizza className="w-12 h-12 md:w-16 md:h-16" />
              </div>
            )}
          </div>

          {/* RIGHT: PERFIL (Cart + User Menu) */}
          <div className="flex items-center justify-end space-x-2 md:space-x-3">
            {/* Cart Button */}
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