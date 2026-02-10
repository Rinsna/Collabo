import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Users, Target, Award } from 'lucide-react';

const AboutUs = () => {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const stats = [
    { icon: Users, value: '10K+', label: 'Influencers' },
    { icon: Target, value: '5K+', label: 'Campaigns' },
    { icon: Award, value: '98%', label: 'Success Rate' },
  ];

  return (
    <section id="about-section" className="relative py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
      {/* Large Background Typography Watermark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.02 } : {}}
          transition={{ duration: 1.5 }}
          className="text-[15rem] sm:text-[20rem] lg:text-[25rem] font-black text-gray-900 select-none whitespace-nowrap"
          style={{ lineHeight: 1 }}
        >
          ABOUT
        </motion.div>
      </div>

      {/* Decorative Top Divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side - Text Content */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-6"
          >
            {/* Section Label */}
            <motion.div variants={itemVariants}>
              <span className="text-xs font-bold text-primary-600 uppercase tracking-[0.2em]">
                ABOUT US
              </span>
              {/* Thin Divider Line */}
              <div className="w-16 h-px bg-gray-900 mt-3"></div>
            </motion.div>

            {/* Large Bold Heading */}
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                Connecting Brands with{' '}
                <span className="text-primary-600">Authentic Voices</span>
              </h2>
            </motion.div>

            {/* Descriptive Paragraphs */}
            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-base text-gray-600 leading-relaxed">
                We are a leading influencer marketing platform that bridges the gap between innovative brands and creative content creators. Our mission is to make influencer collaborations seamless, transparent, and impactful.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                With cutting-edge technology and a passion for authentic storytelling, we empower businesses to reach their target audiences through trusted influencer partnerships.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-4">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start mb-2">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                        <StatIcon className="w-4 h-4 text-gray-900" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <button className="group relative inline-flex items-center space-x-2 text-gray-900 font-semibold text-base">
                <span className="relative">
                  Learn More About Us
                  {/* Animated Underline */}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transform origin-left transition-transform duration-300 group-hover:scale-x-110"></span>
                </span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative"
          >
            {/* Decorative Background Shape */}
            <div className="absolute -inset-3 bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl opacity-20 blur-2xl"></div>

            {/* Main Image Container */}
            <div className="relative group">
              {/* Image Wrapper */}
              <div className="relative overflow-hidden rounded-xl shadow-xl">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative aspect-[4/5] max-w-md mx-auto"
                >
                  {/* About Us Image */}
                  <img
                    src="/images/about-collabo.jpg"
                    alt="Collabo Platform - Influencer Marketing Dashboard"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute -bottom-3 -right-3 w-20 h-20 border-4 border-gray-900 rounded-xl -z-10"></div>
              
              {/* Decorative Dot Pattern */}
              <div className="absolute -top-3 -left-3 w-16 h-16 grid grid-cols-4 gap-1.5 -z-10">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-xl p-2.5 border border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="text-base font-black text-gray-900">5+ Years</div>
                  <div className="text-xs text-gray-600">Experience</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Decorative Divider */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </section>
  );
};

export default AboutUs;
