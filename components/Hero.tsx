import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Percent, Phone, Clock } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const Hero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
  const { banners, promotion } = useAdmin();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const currentItem = banners[currentIndex];

  return (
    <div className="relative bg-black">
      <div className="container mx-auto px-4">
        {/* Banner Carousel Compacto */}
        {banners.length > 0 && (
          <div className="relative h-[150px] md:h-[200px] overflow-hidden">
            <AnimatePresence mode='wait'>
              {currentItem && (
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={currentItem.image} 
                    alt={currentItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                  
                  <div className="absolute inset-0 flex items-center">
                    <div className="px-8">
                      <motion.h3 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="font-display text-white text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg"
                      >
                        {currentItem.title}
                      </motion.h3>
                      <motion.p
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/90 text-lg md:text-2xl drop-shadow-md"
                      >
                        {currentItem.subtitle}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {banners.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-brand-orange' : 'w-2 bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;