import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../../services/api';
import { Sparkles, ArrowRight } from 'lucide-react';

const ModernHero = () => {
  const navigate = useNavigate();

  const { data: landingContent } = useQuery(
    'landing-content',
    async () => {
      const response = await api.get('/landing/content/');
      return response.data;
    },
    { retry: false, refetchOnWindowFocus: false }
  );

  const hero = landingContent?.hero || {
    title: "Where Teams Connect,\nCollaborate, and Create",
    subtitle: "Partner with creators who turn content into conversions and help brands grow through real-world performance.",
    creator_button_text: "Sign up as a Creator",
    brand_button_text: "Sign up as a Brand"
  };

  const cards = landingContent?.cards || [];
  const marqueeCards = [...cards, ...cards, ...cards];

  return (
    <section className="relative bg-transparent overflow-hidden pt-6 pb-0 flex flex-col items-center">
      
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-multiply z-10 pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center mb-0">
        
        {/* Cinematic Word-by-Word Reveal */}
        <motion.h1 
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-4 text-black max-w-4xl"
        >
          {hero.title.split('\n').map((line, lineIndex) => (
            <div key={lineIndex} className="block overflow-hidden py-1">
              {line.split(' ').map((word, wordIndex) => {
                const isGradient = word.startsWith('{') || word.endsWith('}');
                const cleanWord = word.replace(/{|}/g, '');
                
                return (
                  <motion.span
                    key={`${lineIndex}-${wordIndex}`}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2 + (lineIndex * 5 + wordIndex) * 0.08,
                      ease: [0.215, 0.61, 0.355, 1]
                    }}
                    className="inline-block mr-[0.2em]"
                  >
                    {isGradient || cleanWord === 'Collabo' ? (
                      <span 
                        style={{
                          background: 'linear-gradient(to right, #8915A0, #DB2777, #8915A0)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          backgroundSize: '200% auto',
                          color: 'transparent',
                        }}
                        className="animate-gradient-x inline-block"
                      >
                        {cleanWord}
                      </span>
                    ) : (
                      cleanWord
                    )}
                  </motion.span>
                );
              })}
            </div>
          ))}
        </motion.h1>

        {/* Subtitle with fade-in-scale */}
        <motion.p 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
          className="max-w-xl mx-auto text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 leading-relaxed font-medium"
        >
          {hero.subtitle}
        </motion.p>

        {/* CTAs with kinetic feel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
        >
          <button 
            onClick={() => navigate('/register?type=influencer')}
            style={{
              background: 'linear-gradient(to right, #8915A0, #DB2777, #8915A0)',
              backgroundSize: '200% auto',
            }}
            className="group relative w-full sm:w-auto px-8 py-4 text-white rounded-full font-black text-sm transition-all duration-300 shadow-[0_10px_30px_rgba(137,21,160,0.3)] hover:shadow-[0_15px_40px_rgba(137,21,160,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 animate-gradient-x overflow-hidden"
          >
            {/* Liquid Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer transition-transform" />
            <span className="relative z-10">{hero.creator_button_text}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
          </button>
          
          <button 
            onClick={() => navigate('/register?type=company')}
            className="w-full sm:w-auto px-8 py-4 bg-white/40 backdrop-blur-md hover:bg-white border-2 border-white/50 text-gray-900 rounded-full font-black text-sm transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
          >
            {hero.brand_button_text}
          </button>
        </motion.div>
      </div>

      {/* Ultra-Compact Marquee - Professional alignment */}
      <div className="w-full -mt-12 relative h-[140px] overflow-hidden flex flex-col justify-end pb-4">
        <div className="flex overflow-hidden mb-0">
          <div 
            className="flex gap-10 items-end animate-marquee shadow-none"
            style={{ willChange: "transform" }}
          >
            {marqueeCards.map((card, index) => {
              const baseIndex = index % (cards.length || 1);
              
              // Ultra-refined badge sizes
              const cardWidth = "w-[80px] sm:w-[100px]";
              const cardHeight = "h-[80px] sm:h-[100px]";
              
              const offsets = ["mb-4", "mb-12", "mb-0", "mb-16", "mb-6", "mb-20", "mb-2"];
              const offset = offsets[baseIndex % offsets.length];
              
              const getBgStyle = (color) => color?.startsWith('#') ? { backgroundColor: color } : {};
              const getTextStyle = (color) => color?.startsWith('#') ? { color: color } : {};
              const bgClass = !card.background_color?.startsWith('#') ? card.background_color : '';
              const textClass = !card.text_color?.startsWith('#') ? card.text_color : '';

              return (
                <div 
                  key={index}
                  className={`relative flex-shrink-0 ${cardWidth} ${cardHeight} ${offset} group cursor-pointer transition-all duration-500 hover:z-40`}
                >
                  <div 
                    style={getBgStyle(card.background_color)}
                    className={`w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-white/60 relative transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl ${bgClass || 'bg-white'}`}
                  >
                    {!card.image_url || card.image_url.includes('undefined') || card.image_url.includes('null') ? (
                      <div className="w-full h-full flex items-center justify-center p-6 text-center bg-gradient-to-br from-primary-50 to-accent-50">
                        <span 
                          style={getTextStyle(card.text_color)}
                          className={`font-black text-[10px] sm:text-[11px] uppercase tracking-tighter leading-tight ${textClass || 'text-gray-900'}`}
                        >
                          {card.label}
                        </span>
                      </div>
                    ) : (
                      <div className="w-full h-full relative bg-gray-50">
                        <img 
                          src={card.image_url} 
                          alt={card.label} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          onError={(e) => {
                            // Fallback to label if image fails to load
                            e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center p-6 text-center bg-gradient-to-br from-primary-50 to-accent-50"><span class="font-black text-[10px] uppercase tracking-tighter leading-tight text-gray-900">${card.label}</span></div>`;
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2.5rem]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
          display: flex;
          width: fit-content;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite ease-in-out;
        }
      `}} />
    </section>
  );
};

export default ModernHero;
