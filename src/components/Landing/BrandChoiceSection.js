import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BarChart3, Globe, Zap, ArrowRight, CheckCircle2, LayoutGrid, Database, Lock } from 'lucide-react';

const IntegrationVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-[#FDFCFE] overflow-hidden p-12">
    <div className="relative z-10 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl w-full max-w-sm">
      <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Connect with</div>
      <div className="grid grid-cols-3 gap-6">
        {[
          { name: 'TikTok', color: '#000' },
          { name: 'Google', color: '#4285F4' },
          { name: 'Insta', color: '#E4405F' },
          { name: 'Shopify', color: '#7AB55C' },
          { name: 'Meta', color: '#0668E1' },
          { name: 'Snap', color: '#FFFC00' }
        ].map((brand, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full opacity-20" style={{ backgroundColor: brand.color }} />
          </motion.div>
        ))}
      </div>
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -right-4 -top-4 w-12 h-12 bg-primary-100 rounded-full blur-xl"
      />
    </div>
    {/* Floating background nodes */}
    <div className="absolute inset-0 opacity-20">
      <svg className="w-full h-full">
        <motion.path 
          d="M 100 100 Q 200 150 300 100" 
          stroke="url(#grad)" 
          strokeWidth="2" 
          fill="transparent"
          animate={{ strokeDashoffset: [0, 100] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          strokeDasharray="5,5"
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#8915A0', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#DB2777', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
);

const TransparencyVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-50 p-12 overflow-hidden">
    <div className="space-y-4 w-full max-w-xs">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 * i }}
          className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg bg-primary-${i*100} flex items-center justify-center`}>
              <BarChart3 className="w-4 h-4 text-primary-600" />
            </div>
            <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${30 * i}%` }}
                transition={{ duration: 1, delay: 0.5 * i }}
                className="h-full bg-primary-500"
              />
            </div>
          </div>
          <div className="text-xs font-black text-gray-900">100%</div>
        </motion.div>
      ))}
    </div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-100 rounded-full blur-3xl opacity-30" />
  </div>
);

const TABS = [
  {
    id: 'performance',
    label: 'European Excellence',
    icon: Globe,
    title: 'The leading platform for creator excellence',
    description: 'Born in Europe, scaling globally. Our infrastructure complies with the highest standards of data sovereignty and regional performance.',
    features: ['GDPR Compliant operations', 'Local market experts', 'Pan-European reach'],
    color: '#8915A0',
    visual: () => (
      <div className="relative w-full h-full bg-gray-50 flex items-center justify-center overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="w-64 h-64 bg-white/40 border border-white rounded-[40px] shadow-2xl relative flex items-center justify-center"
        >
          <Globe className="w-32 h-32 text-primary-100 stroke-[1]" />
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-primary-600/5 rounded-[40px]"
          />
        </motion.div>
      </div>
    )
  },
  {
    id: 'transparency',
    label: '100% Transparency',
    icon: BarChart3,
    title: 'Total clarity in every collaboration',
    description: 'No black-box metrics. Get full visibility into creator rates, engagement quality, and every fragment of your campaign budget.',
    features: ['Direct payment verification', 'Audited engagement data', 'Budget breakdown reports'],
    color: '#DB2777',
    visual: TransparencyVisual
  },
  {
    id: 'safety',
    label: 'Brand Safety',
    icon: Shield,
    title: 'Protect your reputation with AI vetting',
    description: 'Our advanced safety protocols ensure your brand is associated only with creators who match your values and professional standards.',
    features: ['AI content sentiment analysis', 'Automated fraud detection', 'Historical profile auditing'],
    color: '#8915A0',
    visual: () => (
      <div className="relative w-full h-full bg-[#0F172A] flex items-center justify-center p-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-full max-w-[240px] aspect-square bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[48px] flex flex-col items-center justify-center p-8 text-center"
        >
          <Lock className="w-16 h-16 text-primary-400 mb-4" />
          <div className="text-white font-black text-xl mb-2">Verified</div>
          <div className="text-primary-300/60 text-[10px] tracking-widest uppercase">Safe & Secure</div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-transparent" />
      </div>
    )
  },
  {
    id: 'scalability',
    label: 'Easy integration & Scalability',
    icon: Zap,
    title: 'Scale from 1 to 1,000 creators effortlessly',
    description: 'Launch local pilots or global movements. Our infrastructure handles complex logistics so you can focus on creative impact.',
    features: ['Dynamic contract management', 'Universal API connectivity', 'Bulk campaign operations'],
    color: '#DB2777',
    visual: IntegrationVisual
  }
];

const BrandChoiceSection = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Row - Aligned precisely with Dribbble reference */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-16 gap-8">
          <div className="max-w-3xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-[1] tracking-tight"
            >
              Why the world's best <br className="hidden md:block" /> brands choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Collabo</span>
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:max-w-[400px] lg:pt-4"
          >
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Collaborate with creators to boost conversions and drive brand growth through real-world performance.
            </p>
          </motion.div>
        </div>

        {/* Custom Tab Navigation */}
        <div className="flex flex-wrap items-center justify-start gap-8 sm:gap-16 mb-12 border-b border-gray-100 overflow-x-auto pb-4 no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className="relative py-2 flex items-center space-x-2 group whitespace-nowrap"
            >
              <span className={`text-[13px] font-black tracking-wide transition-colors duration-300 ${activeTab.id === tab.id ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {tab.id === 'scalability' ? `• ${tab.label}` : tab.label}
              </span>
              
              {activeTab.id === tab.id && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-gray-900 z-20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Card - 3D Content Layout */}
        <div className="relative min-h-[500px] lg:min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="w-full bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col lg:flex-row"
            >
              {/* Left Side: Info */}
              <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-10 w-fit"
                >
                  Step into the future
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl font-black text-gray-900 mb-8 leading-[1.1]"
                >
                  {activeTab.title}
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 text-lg mb-10 leading-relaxed max-w-md font-medium"
                >
                  {activeTab.description}
                </motion.p>

                <div className="space-y-4 mb-10">
                  {activeTab.features.map((feature, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-center space-x-3 text-gray-600 font-bold"
                    >
                      <CheckCircle2 className="w-5 h-5 text-gray-900" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Side: High Fidelity Visuals */}
              <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-0 bg-transparent flex items-center justify-center p-8 sm:p-12">
                <div className="relative w-full h-full rounded-[32px] overflow-hidden border border-gray-100 shadow-sm bg-white">
                   <activeTab.visual />
                </div>

                {/* Micro Stat Overlay */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-16 -left-8 bg-white/90 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl hidden sm:flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Growth Index</div>
                    <div className="text-xl font-black text-gray-900">+124%</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default BrandChoiceSection;
