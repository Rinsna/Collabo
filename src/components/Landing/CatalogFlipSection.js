import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import api from '../../services/api';

const CatalogFlipSection = () => {
  const [index, setIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const timerRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2) / 30;
    const y = (clientY - innerHeight / 2) / 30;
    setMousePos({ x, y });
  };

  const { data: landingContent } = useQuery(
    'landing-content',
    async () => {
      const response = await api.get('/landing/content/');
      return response.data;
    },
    { retry: false, refetchOnWindowFocus: false }
  );

  const catalogImages = landingContent?.catalog_images || [];
  
  // Ultra-High-Power Pulse Cycle: 0.6-second Frequency
  // Extremely rapid snapping for maximum kinetic energy
  useEffect(() => {
    if (catalogImages.length === 0) return;

    const cycle = () => {
      setIndex((prev) => (prev + 1) % catalogImages.length);
    };

    const timeoutId = setInterval(cycle, 600); 
    return () => clearInterval(timeoutId);
  }, [catalogImages.length]);

  const [isHovered, setIsHovered] = useState(null);

  // Absolute Instantaneous Transition
  // Infinite-Stiffness Spring (1500) for literal zero-latency snapping
  const smoothTransition = {
    type: "spring",
    stiffness: 1500,    // Extreme explosive snap
    damping: 80,        // High damping to instantly lock positions
    mass: 0.1,          // Reduced mass for zero-latency response
    restDelta: 0.001,
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full bg-white py-12 overflow-hidden flex flex-col items-center justify-center min-h-[50vh]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Premium White & Purple Background: Floating Blobs & Glassmorphism */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent-100/30 rounded-full blur-[140px]" 
        />
        
        {/* Glassmorphic Overlay Layer */}
        <div className="absolute inset-0 backdrop-blur-[100px] bg-white/60 z-10" />
        
        {/* Subtle Noise Texture - Embedded SVG to fix 403 error */}
        <div 
          className="absolute inset-0 opacity-[0.03] contrast-150 mix-blend-overlay z-20 pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      {/* Main Container for the Interactive Stack */}
      <div className="relative w-full h-[50vh] flex items-center justify-center perspective-[3500px]">
        
        {/* Interactive Card Deck */}
        <div className="absolute inset-0 flex items-center justify-center">
           {catalogImages.map((card, i) => {
             let offset = i - index;
             const total = catalogImages.length;
             
             if (offset > total / 2) offset -= total;
             if (offset < -total / 2) offset += total;
             
             const absOffset = Math.abs(offset);
             
             // Dynamic Visibility: Show more cards to fill the width
             if (absOffset > 7) return null; 

             const isCenter = absOffset < 0.5;
             const zIndex = 200 - Math.round(absOffset * 10);
             const hoverActive = isHovered === i;
             
             return (
               <motion.div 
                 key={card.id || i}
                 drag="x"
                 dragConstraints={{ left: 0, right: 0 }}
                 onDragEnd={(_, info) => {
                   if (info.offset.x > 100) setIndex((prev) => (prev - 1 + total) % total);
                   else if (info.offset.x < -100) setIndex((prev) => (prev + 1) % total);
                 }}
                 initial={{ opacity: 0, x: 400, scale: 0.8 }}
                 animate={{ 
                   // Horizontal: Immediate right-to-center and center-to-left
                   x: (offset * 110) + (mousePos.x * (1 - absOffset * 0.1)), 
                   // PULSE: Lift center item up (-40) and push others down
                   y: (hoverActive ? -60 : (isCenter ? -40 : 20 + absOffset * 15)) + (mousePos.y * (1 - absOffset * 0.1)), 
                   // POP: Increase center scale to 1.15, scale others down to 0.95 and below
                   scale: (isCenter ? 1.15 : 0.95 - (absOffset * 0.05)),
                   // Solid Style: NO TRANSPARENCY
                   rotateY: 0, 
                   rotateX: (mousePos.y * -0.5),
                   rotateZ: 0, 
                   opacity: 1, 
                   z: isCenter ? 300 : -absOffset * 120,
                 }}
                 whileTap={{ scale: 1.1, cursor: 'grabbing' }}
                 onHoverStart={() => setIsHovered(i)}
                 onHoverEnd={() => setIsHovered(null)}
                 transition={smoothTransition}
                 style={{ zIndex, cursor: 'grab' }}
                 className="absolute w-[150px] sm:w-[260px] aspect-[9/16] transform-gpu will-change-transform"
                 onClick={() => setIndex(i)}
               >
                 {/* Internal Floating Layer for Idle Motion */}
                 <motion.div
                   className="w-full h-full"
                   animate={{ 
                     y: [0, -1, 0] // Minimized idle motion for high-speed feel
                   }}
                   transition={{
                     duration: 1.0,
                     repeat: Infinity,
                     ease: "easeInOut",
                     delay: i * 0.05 
                   }}
                 >
                    {/* Glassmorphic Card Container - NO BORDERS */}
                    <div className={`relative w-full h-full rounded-[2.5rem] overflow-hidden transition-all duration-700 
                      ${isCenter 
                        ? 'shadow-[0_80px_150px_-40px_rgba(137,21,160,0.25)] bg-white/90 backdrop-blur-xl' 
                        : 'shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] bg-white/40 backdrop-blur-md'
                      } 
                      ${hoverActive ? 'shadow-primary-300' : ''}`}
                    >
                      <div className="w-full h-full rounded-[2.2rem] overflow-hidden m-0">
                       <img 
                         src={card?.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop'} 
                         alt=""
                         className="w-full h-full object-cover select-none"
                         onError={(e) => {
                           e.target.src = 'https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?w=800&q=80';
                         }}
                       />
                       
                       {/* Pure minimalism */}
                       <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/20 pointer-events-none" />
                      </div>
                    </div>
                 </motion.div>
               </motion.div>
             );
           })}
        </div>
      </div>
    </div>
  );
};

export default CatalogFlipSection;
