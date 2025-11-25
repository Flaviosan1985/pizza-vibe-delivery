import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Percent, Flame } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const Hero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
  const { banners } = useAdmin();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, [banners.length]);

  const getGradient = (theme: string) => {
    switch (theme) {
      case 'orange': return "from-orange-600/80 to-yellow-600/80";
      case 'green': return "from-green-600/80 to-brand-green/80";
      case 'red': return "from-red-600/80 to-brand-orange/80";
      default: return "from-gray-600/80 to-gray-800/80";
    }
  };

  const getIcon = (theme: string) => {
    switch (theme) {
      case 'orange': return <Flame className="text-orange-500" size={16} />;
      case 'green': return <Star className="text-yellow-400" size={16} />;
      case 'red': return <Percent className="text-brand-yellow" size={16} />;
      default: return <Sparkles className="text-white" size={16} />;
    }
  };

  if (banners.length === 0) return null;

  const currentItem = banners[currentIndex];

  return (
    <div className="relative h-[320px] md:h-[500px] flex items-center justify-center overflow-hidden mb-[-20px] md:mb-[-40px]">
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-center pt-8 md:pt-10">
        
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 md:mb-6 leading-[0.9] drop-shadow-2xl">
          Sabor que <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-white to-brand-orange">
            Conecta Pessoas
          </span>
        </h1>
        
        {/* Animated Image Banner Carousel */}
        <div className="mt-2 md:mt-4 mx-auto max-w-4xl h-40 md:h-64 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-sm group">
           <AnimatePresence mode='wait'>
             {currentItem && (
               <motion.div
                 key={currentItem.id}
                 initial={{ opacity: 0, scale: 1.1 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.8 }}
                 className="absolute inset-0"
               >
                 {/* Background Image */}
                 <img 
                   src={currentItem.image} 
                   alt={currentItem.title}
                   className="w-full h-full object-cover opacity-80"
                 />
                 
                 {/* Gradient Overlay based on item color */}
                 <div className={`absolute inset-0 bg-gradient-to-r ${getGradient(currentItem.colorTheme)} opacity-90 mix-blend-multiply`}></div>
                 
                 {/* Content Overlay */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 md:p-6 bg-black/20">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-2 mb-2 md:mb-3 bg-black/40 px-3 py-1.5 md:px-5 md:py-2 rounded-full backdrop-blur-md border border-white/10"
                    >
                      {getIcon(currentItem.colorTheme)}
                      <span className="font-display font-bold text-[10px] md:text-sm tracking-[0.2em] uppercase">{currentItem.title}</span>
                    </motion.div>
                    
                    <motion.h3 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="font-display text-xl md:text-4xl font-extrabold text-center max-w-2xl drop-shadow-md leading-tight"
                    >
                      "{currentItem.subtitle}"
                    </motion.h3>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Progress Indicators */}
           <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
             {banners.map((item, idx) => (
               <button
                 key={item.id}
                 onClick={() => setCurrentIndex(idx)}
                 className={`h-1 md:h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 md:w-8 bg-white shadow-glow' : 'w-1.5 md:w-2 bg-white/30 hover:bg-white/50'}`}
               />
             ))}
           </div>
        </div>

        <p className="text-sm md:text-lg text-gray-200 mt-6 md:mt-8 max-w-xl mx-auto font-light hidden sm:block drop-shadow-md opacity-90 leading-relaxed">
          Ingredientes selecionados, massa artesanal e um forno a lenha esperando pelo seu pedido.
        </p>
      </div>
    </div>
  );
};

export default Hero;