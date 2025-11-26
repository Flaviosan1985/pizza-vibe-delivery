import React from 'react';
import { Phone, Clock, Facebook, Instagram } from 'lucide-react';

interface TopBarProps {
  phone?: string;
  hours?: string;
  facebook?: string;
  instagram?: string;
}

const TopBar: React.FC<TopBarProps> = ({ 
  phone = '(11) 99999-9999', 
  hours = 'Seg-Dom: 18:00 - 23:00',
  facebook,
  instagram
}) => {
  return (
    <div className="bg-brand-red border-b border-white/10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-wrap items-center justify-between text-xs md:text-sm text-white">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span className="font-medium">{phone}</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Clock size={14} />
              <span>{hours}</span>
            </div>
          </div>

          {/* Right: Social Media */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/70 hidden md:inline">Siga-nos:</span>
            {facebook && (
              <a 
                href={facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-brand-orange transition-colors"
              >
                <Facebook size={16} />
              </a>
            )}
            {instagram && (
              <a 
                href={instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-brand-orange transition-colors"
              >
                <Instagram size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
