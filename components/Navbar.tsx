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

  const name = storeName || 'PizzaVibe';

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-sm py-4 md:py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          {/* CENTER: LOGO (CENTRADA, FIXA NO TOPO) */}
          <div className="flex items-center justify-center">
            {logo ? (
              <img 
                src={logo} 
                alt="Logo" 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-2xl border-4 border-white" 
                style={{boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'}}
              />
            ) : (
              <div 
                className="bg-white p-5 md:p-6 rounded-full text-[#B91C1C] shadow-2xl border-4 border-white" 
                style={{boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'}}
              >
                <Pizza className="w-10 h-10 md:w-12 md:h-12" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;