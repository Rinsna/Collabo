import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const OurServices = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const services = [
    {
      number: "01",
      title: "Influencer Campaigns",
      description: "We connect brands with the right influencers to create authentic, high-impact campaigns that resonate with real audiences."
    },
    {
      number: "02",
      title: "Brand Collaborations",
      description: "Strategic partnerships between companies and creators, built to grow reach, trust, and long-term value."
    },
    {
      number: "03",
      title: "Performance Insights",
      description: "Clear and meaningful analytics that help you understand engagement, growth, and campaign success."
    },
    {
      number: "04",
      title: "Secure Payments",
      description: "Safe and secure payment processing for all transactions with transparent pricing and no hidden fees."
    }
  ];

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  // Card animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section id="services-section" className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            OUR SERVICES
          </motion.span>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            What We Offer
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Comprehensive solutions for influencer marketing success
          </motion.p>
        </motion.div>

        {/* Services Grid - 4 columns on desktop */}
        <motion.div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer overflow-hidden hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Hover Background Overlay - Behind content */}
              <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]" />

              {/* Large Background Number - Behind overlay */}
              <div className="absolute top-4 right-4 text-7xl font-bold text-gray-900 opacity-[0.03] select-none pointer-events-none leading-none group-hover:text-white group-hover:opacity-[0.1] transition-all duration-300 z-0">
                {service.number}
              </div>

              {/* Content - Above overlay */}
              <div className="relative z-10">
                {/* Service Number */}
                <div className="text-sm font-semibold text-primary-600 mb-4 group-hover:text-white transition-colors duration-300">
                  {service.number}
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-white transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Divider Line */}
                <div className="h-px w-12 bg-gray-300 mb-4 group-hover:bg-white group-hover:w-16 transition-all duration-300" />

                {/* Service Description */}
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-white transition-colors duration-300">
                  {service.description}
                </p>
              </div>

              {/* Hover Shadow Effect */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl -z-10" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurServices;
