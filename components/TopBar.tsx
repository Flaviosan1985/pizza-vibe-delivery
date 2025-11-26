import React from 'react';
import { Phone, Clock, Facebook, Instagram, User } from 'lucide-react';

interface TopBarProps {
  phone?: string;
  hours?: string;
  facebook?: string;
  instagram?: string;
  userName?: string;
  onUserClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  phone = '(11) 99999-9999', 
  hours = 'Seg-Dom: 18:00 - 23:00',
  facebook,
  instagram,
  userName,
  onUserClick
}) => {
  return (
    <div className="bg-brand-red border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between text-xs md:text-sm text-white">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span className="font-medium">{phone}</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Clock size={16} />
              <span>{hours}</span>
            </div>
          </div>

          {/* Right: Social Media + User */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/70 hidden md:inline">Siga-nos:</span>
            <div className="flex items-center gap-3">
              {facebook && (
                <a 
                  href={facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-colors p-1"
                >
                  <Facebook size={18} />
                </a>
              )}
              {instagram && (
                <a 
                  href={instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brand-orange transition-colors p-1"
                >
                  <Instagram size={18} />
                </a>
              )}
              <div className="border-l border-white/30 h-6 mx-2"></div>
              <button 
                onClick={onUserClick}
                className="flex items-center gap-2 hover:text-brand-orange transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <User size={18} className="text-brand-red" strokeWidth={2.5} />
                </div>
                {userName && (
                  <span className="hidden md:inline font-semibold">{userName}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
