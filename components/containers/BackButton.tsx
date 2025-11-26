import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label = 'Voltar' }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
    >
      <ArrowLeft size={20} />
      {label}
    </button>
  );
};

export default BackButton;
