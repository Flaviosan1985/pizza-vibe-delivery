import React, { useState } from 'react';
import { Sparkles, Send, X, Loader2 } from 'lucide-react';
import Button from './Button';
import { getPizzaRecommendation } from '../services/geminiService';
import { AIReply, RecommendationStatus } from '../types';

interface AISommelierProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommendation: (pizzaId: number) => void;
}

const AISommelier: React.FC<AISommelierProps> = ({ isOpen, onClose, onRecommendation }) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<RecommendationStatus>(RecommendationStatus.IDLE);
  const [reply, setReply] = useState<AIReply | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setStatus(RecommendationStatus.LOADING);
    const result = await getPizzaRecommendation(input);
    setReply(result);
    setStatus(RecommendationStatus.SUCCESS);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white dark:bg-brand-gray rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-slide-up transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="text-yellow-300" size={24} />
            </div>
            <h2 className="text-2xl font-bold">Pizza Sommelier IA</h2>
          </div>
          <p className="text-indigo-100 text-sm">
            Não sabe o que pedir? Diga o que você gosta (ex: "algo picante", "vegetariano", "doce") e eu escolho a perfeita!
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {status === RecommendationStatus.SUCCESS && reply && (
             <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4">
                <p className="text-indigo-900 dark:text-indigo-200 font-medium mb-3">"{reply.text}"</p>
                {reply.recommendedPizzaId && (
                  <Button 
                    size="sm" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      if (reply.recommendedPizzaId) {
                        onRecommendation(reply.recommendedPizzaId);
                        onClose();
                      }
                    }}
                  >
                    Ver essa Pizza
                  </Button>
                )}
             </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Quero algo com muito queijo e bacon..."
              className="w-full bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 rounded-xl py-4 pl-4 pr-14 outline-none transition-all text-gray-700 dark:text-white"
              autoFocus
            />
            <button 
              type="submit"
              disabled={status === RecommendationStatus.LOADING || !input.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              {status === RecommendationStatus.LOADING ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AISommelier;