import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../../services/api';
import { Sparkles, ArrowRight } from 'lucide-react';

// Default placeholder cards shown when no image loads or no cards exist
const PLACEHOLDER_CARDS = [
  { label: 'FASHION', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop', card_size: 'large', background_color: '#FDF2F8' },
  { label: 'LIFESTYLE', image_url: 'https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?w=600&h=800&fit=crop', card_size: 'medium', background_color: '#F5F3FF' },
  { label: 'CREATIVITY', image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop', card_size: 'small', background_color: '#F0F9FF' },
  { label: 'GROWTH', image_url: 'https://images.unsplash.com/photo-1529139513055-07f9f27e555e?w=600&h=800&fit=crop', card_size: 'large', background_color: '#ECFDF5' },
  { label: 'BEAUTY', image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop', card_size: 'medium', background_color: '#FFF7ED' },
  { label: 'TECH', image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=800&fit=crop', card_size: 'small', background_color: '#F8FAFC' },
];

// Gradient placeholder backgrounds for when images fail to load
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #8915A0 0%, #DB2777 100%)',
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
];

// A single marquee card with image-error handling
const MarqueeCard = ({ card, index, baseIndex, cardSize, offset }) => {
  const [imgError, setImgError] = useState(false);
  const gradient = PLACEHOLDER_GRADIENTS[baseIndex % PLACEHOLDER_GRADIENTS.length];

  const getBgStyle = (color) => color?.startsWith('#') ? { backgroundColor: color } : {};
  const getTextStyle = (color) => color?.startsWith('#') ? { color: color } : {};
  const bgClass = !card.background_color?.startsWith('#') ? card.background_color : '';
  const textClass = !card.text_color?.startsWith('#') ? card.text_color : '';

  return (
    <div
      className={`relative flex-shrink-0 ${cardSize} ${offset} group cursor-pointer transition-all duration-500 hover:z-40`}
    >
      <div
        style={getBgStyle(card.background_color)}
        className={`w-full h-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-white/60 relative transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl ${bgClass || 'bg-white'}`}
      >
        {!card.image_url || imgError ? (
          // Placeholder: gradient background + label
          <div
            className="w-full h-full flex flex-col items-end justify-end p-4"
            style={{ background: gradient }}
          >
            <span className="font-black text-[10px] sm:text-[11px] uppercase tracking-tighter leading-tight text-white/90 text-right">
              {card.label}
            </span>
          </div>
        ) : (
          <div className="w-full h-full relative bg-gray-50">
            <img
              src={card.image_url}
              alt={card.label}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2rem] sm:rounded-[2.5rem]" />
    </div>
  );
};

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

  // Use admin-configured cards or fall back to placeholders
  const cards = (landingContent?.cards?.length > 0) ? landingContent.cards : PLACEHOLDER_CARDS;

  // Duplicate 4x for seamless infinite loop (no visible jump)
  const marqueeCards = [...cards, ...cards, ...cards, ...cards];

  const sizeMap = {
    small: "w-28 h-28 sm:w-32 sm:h-32",
    medium: "w-36 h-36 sm:w-40 sm:h-40",
    large: "w-40 h-40 sm:w-44 sm:h-44",
  };

  const offsets = ["mb-4", "mb-12", "mb-0", "mb-16", "mb-6", "mb-20", "mb-2"];

  return (
    <section className="relative bg-transparent overflow-hidden pt-28 pb-0 flex flex-col items-center">

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[85%] h-[85%] bg-[#8915A0]/15 rounded-full blur-[100px] z-0"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.08, 0.15, 0.08], scale: [1, 1.3, 1], x: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] -right-[15%] w-[80%] h-[80%] bg-[#EC4899]/12 rounded-full blur-[120px] z-0"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.12, 0.05], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] bg-[#8915A0]/10 rounded-full blur-[90px] z-0"
        />
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10 pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      {/* Hero text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center mb-0">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-4 text-black max-w-4xl"
        >
          {hero.title.split('\n').map((line, i) => {
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

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-xl mx-auto text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 leading-relaxed font-medium"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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

      {/* Seamless marquee banner */}
      <div className="w-full -mt-28 relative h-[400px] overflow-hidden flex flex-col justify-end pb-4">
        {/* Fade masks on left and right edges */}
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.9), transparent)' }} />
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.9), transparent)' }} />

        <div className="flex overflow-hidden mb-0">
          <div
            className="flex gap-6 sm:gap-10 items-end animate-marquee-smooth"
            style={{ willChange: 'transform' }}
          >
            {marqueeCards.map((card, index) => {
              const baseIndex = index % (cards.length || 1);
              const cardSize = sizeMap[card.card_size] || sizeMap.medium;
              const offset = offsets[baseIndex % offsets.length];

              return (
                <MarqueeCard
                  key={index}
                  card={card}
                  index={index}
                  baseIndex={baseIndex}
                  cardSize={cardSize}
                  offset={offset}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-smooth {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-smooth {
          animation: marquee-smooth 50s linear infinite;
          display: flex;
          width: max-content;
          /* GPU compositing for zero jank */
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        .animate-marquee-smooth:hover {
          animation-play-state: paused;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 10s ease infinite;
        }
      `}} />
    </section>
  );
};

export default ModernHero;
