import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BarChart3, Globe, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const TABS = [
  {
    id: 'performance',
    label: 'Performance Excellence',
    icon: BarChart3,
    title: 'Drive results with data-backed creator marketing',
    description: 'Transform your brand reach into measurable conversions with our advanced performance tracking and ROI-focused attribution models.',
    features: ['Real-time conversion tracking', 'Cost-per-action optimization', 'Advanced audience insights'],
    color: '#8915A0',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'transparency',
    label: '100% Transparency',
    icon: Globe,
    title: 'Total clarity in every collaboration',
    description: 'No hidden fees, no black-box metrics. Get full visibility into creator rates, engagement quality, and every fragment of your budget.',
    features: ['Direct-to-creator payments', 'Audited engagement metrics', 'Open communication channels'],
    color: '#DB2777',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'safety',
    label: 'Brand Safety',
    icon: Shield,
    title: 'Protect your reputation with automated vetting',
    description: 'Our AI-driven safety protocols ensure your brand is only associated with creators who match your values and maintain professional standards.',
    features: ['AI content sentiment analysis', 'Automated fraud detection', 'Historical profile auditing'],
    color: '#8915A0',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'scalability',
    label: 'Easy Integration & Scalability',
    icon: Zap,
    title: 'Scale from 1 to 1,000 creators effortlessly',
    description: 'Whether you are launching a local pilot or a global campaign, our infrastructure is built to handle complex logistics at any scale.',
    features: ['Dynamic contract management', 'Bulk campaign operations', 'Universal API connectivity'],
    color: '#DB2777',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800'
  }
];

const BrandChoiceSection = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight"
            >
              Why the world's best <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">brands</span> choose Collabo
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:max-w-xs"
          >
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              Collaborate with creators to boost conversions and drive brand growth through real-world performance.
            </p>
          </motion.div>
        </div>

        {/* Custom Tab Navigation */}
        <div className="flex flex-wrap items-center justify-start gap-8 sm:gap-12 mb-12 border-b border-gray-100 overflow-x-auto pb-4 no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className="relative py-2 flex items-center space-x-3 group whitespace-nowrap"
            >
              <tab.icon className={`w-5 h-5 transition-colors duration-300 ${activeTab.id === tab.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className={`text-sm font-black tracking-wide uppercase transition-colors duration-300 ${activeTab.id === tab.id ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {tab.label}
              </span>
              
              {activeTab.id === tab.id && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-17px] left-0 right-0 h-1 bg-primary-600 rounded-full z-20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="relative min-h-[500px] lg:min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="w-full bg-white/40 backdrop-blur-3xl rounded-[48px] border border-white/60 shadow-2xl overflow-hidden flex flex-col lg:flex-row"
            >
              {/* Left Side: Info */}
              <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-1.5 rounded-full bg-white border border-primary-50 text-primary-600 text-xs font-bold uppercase tracking-widest mb-8 w-fit"
                >
                  Step into the future
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight"
                >
                  {activeTab.title}
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-lg mb-10 leading-relaxed max-w-md"
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
                      className="flex items-center space-x-3 text-gray-700 font-bold"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary-500" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-full font-black text-sm w-fit transition-shadow hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Right Side: Visual Case/Image */}
              <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-0 bg-gray-50 overflow-hidden">
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  src={activeTab.image}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={activeTab.label}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent lg:from-white/0" />
                
                {/* Floating "Stat" Minimalist Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-2xl flex items-center justify-between"
                >
                  <div>
                    <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Impact Result</div>
                    <div className="text-2xl font-black text-gray-900">+124% Growth</div>
                  </div>
                  <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <BarChart3 className="w-6 h-6 text-white" />
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
