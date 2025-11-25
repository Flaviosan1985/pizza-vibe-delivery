import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, ClipboardList, LogOut, Settings, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  userName: string;
  userAvatar?: string;
  onMyAccount: () => void;
  onMyOrders: () => void;
  onMyFavorites: () => void;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  userName,
  userAvatar,
  onMyAccount,
  onMyOrders,
  onMyFavorites,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleMenuClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-white/10 transition-all text-white"
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName}
            className="w-9 h-9 rounded-full object-cover border-2 border-brand-orange"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-orange to-brand-green flex items-center justify-center font-display font-bold text-white text-sm border-2 border-white/20">
            {getInitials(userName)}
          </div>
        )}
        <span className="hidden md:block font-display font-semibold text-sm max-w-[100px] truncate">
          {userName.split(' ')[0]}
        </span>
        <ChevronDown 
          size={16} 
          className={`hidden md:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[9999]"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-brand-orange/10 to-brand-green/10">
              <p className="font-display font-bold text-white text-sm truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Bem-vindo(a)! 👋
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => handleMenuClick(onMyAccount)}
                className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-white/5 transition-colors text-white"
              >
                <Settings size={18} className="text-brand-orange" />
                <span className="font-display text-sm">Minha Conta</span>
              </button>

              <button
                onClick={() => handleMenuClick(onMyOrders)}
                className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-white/5 transition-colors text-white"
              >
                <ClipboardList size={18} className="text-blue-400" />
                <span className="font-display text-sm">Meus Pedidos</span>
              </button>

              <button
                onClick={() => handleMenuClick(onMyFavorites)}
                className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-white/5 transition-colors text-white"
              >
                <Heart size={18} className="text-red-400" />
                <span className="font-display text-sm">Favoritos</span>
              </button>

              <div className="border-t border-white/10 my-2"></div>

              <button
                onClick={() => handleMenuClick(onLogout)}
                className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-red-500/10 transition-colors text-red-400"
              >
                <LogOut size={18} />
                <span className="font-display text-sm">Sair</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
