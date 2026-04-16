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
    <section className="relative bg-transparent overflow-hidden pt-20 pb-0 flex flex-col items-center">
      
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-multiply z-10 pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center mb-0">
        
        {/* Headline - Improved with Dynamic Gradient Support */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-4 text-black max-w-4xl"
        >
          {hero.title.split('\n').map((line, i) => {
            // Support {Gradient Text} syntax
            const parts = line.split(/({.*?})/);
            return (
              <span key={i} className="block overflow-visible">
                {parts.map((part, index) => {
                  if (part.startsWith('{') && part.endsWith('}')) {
                    const text = part.slice(1, -1);
                    return (
                      <span 
                        key={index}
                        style={{
                          background: 'linear-gradient(to right, #8915A0, #DB2777, #8915A0)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          backgroundSize: '200% auto',
                          color: 'transparent',
                          paddingBottom: '0.1em'
                        }}
                        className="animate-gradient-x inline-block"
                      >
                        {text}
                      </span>
                    );
                  }
                  // Fallback for previous split logic if no { } found
                  if (!line.includes('{') && line.includes('Collabo') && i === 1) {
                     const subParts = line.split('Collabo');
                     return (
                       <React.Fragment key={index}>
                         {subParts[0]}
                         <span 
                            style={{
                              background: 'linear-gradient(to right, #8915A0, #DB2777, #8915A0)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              backgroundSize: '200% auto',
                              color: 'transparent',
                              paddingBottom: '0.1em'
                            }}
                            className="animate-gradient-x inline-block"
                          >
                            Collabo
                          </span>
                          {subParts[1]}
                       </React.Fragment>
                     );
                  }
                  return <span key={index} className="text-black">{part}</span>;
                })}
              </span>
            );
          })}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="max-w-xl mx-auto text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 leading-relaxed font-medium"
        >
          {hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full sm:w-auto"
        >
          <button 
            onClick={() => navigate('/register?type=influencer')}
            style={{
              background: 'linear-gradient(to right, #8915A0, #DB2777, #8915A0)',
              backgroundSize: '200% auto',
            }}
            className="group relative w-full sm:w-auto px-6 py-3 text-white rounded-full font-black text-sm transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 animate-gradient-x"
          >
            <span>{hero.creator_button_text}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => navigate('/register?type=company')}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-full font-black text-sm transition-all duration-300 shadow-lg"
          >
            {hero.brand_button_text}
          </button>
        </motion.div>
      </div>

      {/* Clustered "Grouped Badge" Style Marquee - Metapic Perfection */}
      <div className="w-full -mt-12 relative h-[300px] overflow-hidden flex flex-col justify-end pb-4">
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
      `}} />
    </section>
  );
};

export default ModernHero;
