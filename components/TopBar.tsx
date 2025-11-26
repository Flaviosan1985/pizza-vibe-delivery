import React from 'react';
import { Phone, Clock, Facebook, Instagram, User } from 'lucide-react';

interface TopBarProps {
  phone?: string;
  hours?: string;
  facebook?: string;
  instagram?: string;
  userName?: string;
  onUserClick?: () => void;
  onLogout?: () => void;
  logo?: string;
  storeName?: string;
}

const TopBar: React.FC<TopBarProps> = ({ 
  phone = '(11) 99999-9999', 
  hours = 'Seg-Dom: 18:00 - 23:00',
  facebook,
  instagram,
  userName,
  onUserClick,
  onLogout,
  logo,
  storeName
}) => {
  return (
    <div className="bg-brand-red border-b border-white/10">
      <div className="container mx-auto px-4 py-1.5">
        <div className="flex items-center justify-between text-white">
          {/* Left: Logo Only */}
          <div className="flex items-center">
            {logo ? (
              <img src={logo} alt="Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-md" />
            ) : (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-green flex items-center justify-center shadow-md">
                <User size={16} className="text-white md:w-5 md:h-5" />
              </div>
            )}
          </div>

          {/* Center: Contact Info */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Phone size={14} />
              <span className="font-medium">{phone}</span>
            </div>
          </div>

          {/* Right: Social Media + User + Logout */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-2">
              {facebook && (
                <a 
                  href={facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-all hover:scale-110 hover:rotate-6 active:scale-95"
                >
                  <Facebook size={16} />
                </a>
              )}
              {instagram && (
                <a 
                  href={instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-all hover:scale-110 hover:-rotate-6 active:scale-95"
                >
                  <Instagram size={16} />
                </a>
              )}
              <div className="border-l border-white/30 h-5 mx-1"></div>
            </div>
            <button 
              onClick={onUserClick}
              className="flex items-center gap-1 hover:text-brand-orange transition-colors"
            >
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white flex items-center justify-center">
                <User size={14} className="text-brand-red md:w-4 md:h-4" strokeWidth={2.5} />
              </div>
              {userName && (
                <span className="hidden md:inline font-semibold text-[10px]">{userName}</span>
              )}
            </button>
            <button
              onClick={onLogout}
              className="px-2 py-0.5 md:px-2.5 md:py-1 bg-white/10 hover:bg-white/20 rounded-md font-semibold transition-colors text-[9px] md:text-[10px]"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
