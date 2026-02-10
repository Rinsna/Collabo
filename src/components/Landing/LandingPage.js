import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useInView } from 'framer-motion';
import api from '../../services/api';
import { Users, Star, ArrowRight, CheckCircle, Zap, Target, Heart } from 'lucide-react';
import LandingNavbar from './LandingNavbar';
import AboutUs from './AboutUs';
import OurServices from './OurServices';
import Footer from '../Layout/Footer';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🌟' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'tech', name: 'Tech', icon: '💻' },
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌈' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'health', name: 'Health', icon: '🏥' }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAllInfluencers, setShowAllInfluencers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const observerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const isCarouselInView = useInView(carouselRef, { amount: 0.3 });
  const [animationKey, setAnimationKey] = useState(0);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory('all');
  };

  const carouselSlides = [
    {
      id: 1,
      title: 'Connect with Top Influencers',
      titleParts: [
        { text: 'Connect with Top ', color: 'text-white' },
        { text: 'Influencers', color: 'text-accent-400' }
      ],
      subtitle: 'Find the perfect creator for your brand campaign',
      cta: 'Get Started',
      gradient: 'from-primary-600 to-accent-500',
      image: '/images/carousel-influencer.jpg',
      isImageUrl: true
    },
    {
      id: 2,
      title: 'Grow Your Brand Reach',
      titleParts: [
        { text: 'Grow Your ', color: 'text-white' },
        { text: 'Brand', color: 'text-accent-400' },
        { text: ' Reach', color: 'text-white' }
      ],
      subtitle: 'Collaborate with authentic voices in your industry',
      cta: 'Explore Now',
      gradient: 'from-accent-500 to-primary-600',
      image: '📈',
      isImageUrl: false
    },
    {
      id: 3,
      title: 'Seamless Collaboration',
      titleParts: [
        { text: 'Seamless ', color: 'text-white' },
        { text: 'Collaboration', color: 'text-accent-400' }
      ],
      subtitle: 'Manage campaigns and track results in one platform',
      cta: 'Learn More',
      gradient: 'from-primary-700 to-accent-600',
      image: '/images/carousel-collaboration.jpg',
      isImageUrl: true
    }
  ];

  // Auto-play carousel - continuously changes every 3 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 3000); // Changed to 3000ms (3 seconds)
    
    return () => clearInterval(timer);
  }, [isPaused]);

  // Reset animations when carousel comes back into view
  useEffect(() => {
    if (isCarouselInView) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isCarouselInView]);

  const { data: influencersData, isLoading } = useQuery(
    ['landing-influencers', selectedCategory],
    async () => {
      const response = await api.get('/auth/influencers/', {
        params: {
          ordering: '-followers_count',
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        }
      });
      return response.data;
    },
    { retry: false, refetchOnWindowFocus: false }
  );

  const influencers = influencersData?.results || [];
  
  // Filter influencers by search query
  const filteredInfluencers = searchQuery
    ? influencers.filter(inf => 
        inf.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : influencers;
  
  const displayedInfluencers = showAllInfluencers ? filteredInfluencers : filteredInfluencers.slice(0, 12);

  console.log('Influencers Data:', {
    isLoading,
    influencersCount: influencers.length,
    displayedCount: displayedInfluencers.length,
    rawData: influencersData
  });

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const cards = document.querySelectorAll('.scroll-animate');
    cards.forEach((card) => observerRef.current?.observe(card));
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [displayedInfluencers]);

  const handleInfluencerClick = (influencer) => {
    navigate(`/influencer/${influencer.id}`);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowAllInfluencers(false);
    setTimeout(() => {
      document.getElementById('influencers-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleViewAll = () => {
    setShowAllInfluencers(true);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar onSearch={handleSearch} />
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between space-x-2 py-2 max-w-full overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button key={category.id} onClick={() => handleCategoryClick(category.id)}
                className={`flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 flex-1 min-w-fit ${selectedCategory === category.id ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                <span className="text-xs font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section 
        ref={carouselRef}
        className="relative w-full bg-white overflow-hidden">
        <div className="relative h-[450px] sm:h-[520px] md:h-[580px] lg:h-[650px] xl:h-[700px]">
          {carouselSlides.map((slide, index) => (
            <div
              key={`${slide.id}-${animationKey}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}>
              <div className={`w-full h-full bg-gradient-to-r ${slide.gradient} flex items-center justify-center relative overflow-hidden`}>
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center h-full py-8 sm:py-10 md:py-12">
                    {/* Text Content */}
                    <div className="text-white text-center lg:text-left order-2 lg:order-1">
                      <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight transition-all duration-700 ${index === currentSlide ? 'animate-slide-in-left' : 'opacity-0'
                        }`}>
                        {slide.titleParts.map((part, partIndex) => (
                          <span key={partIndex} className={part.color}>
                            {part.text}
                          </span>
                        ))}
                      </h2>
                      <p className={`text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-4 sm:mb-5 md:mb-6 leading-relaxed transition-all duration-700 delay-100 ${index === currentSlide ? 'animate-slide-in-left' : 'opacity-0'
                        }`}>
                        {slide.subtitle}
                      </p>
                      <button
                        onClick={() => navigate('/register')}
                        className={`bg-white text-primary-600 px-5 sm:px-6 md:px-7 lg:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-2xl font-semibold text-sm sm:text-base md:text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 inline-flex items-center space-x-2 ${index === currentSlide ? 'animate-slide-in-left delay-200' : 'opacity-0'
                          }`}>
                        <span>{slide.cta}</span>
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>

                    {/* Image Content */}
                    <div className="flex items-center justify-center order-1 lg:order-2">
                      {slide.isImageUrl ? (
                        <div className={`relative w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[380px] xl:max-w-[440px] aspect-square transition-all duration-1000 ${index === currentSlide ? 'animate-zoom-fade-in' : 'opacity-0 scale-95'
                          }`}>
                          {/* Decorative background circle */}
                          <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-110"></div>

                          {/* Image container with enhanced styling */}
                          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                            <img
                              src={slide.image}
                              alt={slide.title}
                              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                            {/* Subtle overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                          </div>

                          {/* Decorative floating elements */}
                          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/15 rounded-full blur-xl animate-pulse delay-300"></div>
                        </div>
                      ) : (
                        <div className={`w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transition-all duration-1000 ${index === currentSlide ? 'animate-zoom-fade-in' : 'opacity-0 scale-95'
                          }`}>
                          <span className="text-8xl sm:text-9xl lg:text-[10rem]">{slide.image}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 md:p-4 rounded-full hover:bg-white/30 transition-all duration-200 shadow-lg"
            aria-label="Previous slide">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 md:p-4 rounded-full hover:bg-white/30 transition-all duration-200 shadow-lg"
            aria-label="Next slide">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      <section id="influencers-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : selectedCategory === 'all' 
                  ? 'Top Influencers' 
                  : `Top ${CATEGORIES.find(c => c.id === selectedCategory)?.name} Influencers`}
            </h2>
            <p className="text-sm sm:text-base text-gray-900">
              {searchQuery 
                ? `Found ${filteredInfluencers.length} influencer${filteredInfluencers.length !== 1 ? 's' : ''}` 
                : 'Discover creators who match your vision'}
            </p>
          </div>
          {!showAllInfluencers && influencers.length > 12 && (
            <button onClick={handleViewAll} className="hidden sm:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm md:text-base">
              <span>View All</span>
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          )}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200 animate-pulse">
                <div className="w-full aspect-square bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : displayedInfluencers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedInfluencers.map((influencer, index) => (
              <div key={influencer.id} onClick={() => handleInfluencerClick(influencer)}
                className="scroll-animate opacity-0 cursor-pointer group"
                style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
                  <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100">
                    {influencer.profile_image ? (
                      <img src={influencer.profile_image} alt={influencer.username}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                    ) : null}
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white text-5xl font-bold"
                      style={{ display: influencer.profile_image ? 'none' : 'flex' }}>
                      {influencer.username ? influencer.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    {influencer.followers_count > 10000 && (
                      <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
                        <Star className="h-3.5 w-3.5 text-primary-600 fill-current" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="text-base font-bold text-gray-900 mb-1 truncate group-hover:text-primary-600 transition-colors">
                      {influencer.username}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-900 capitalize">
                        {influencer.category || 'Creator'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-gray-900 mb-2">
                      <Users className="h-3.5 w-3.5 text-primary-600" />
                      <span className="text-xs font-semibold">
                        {influencer.followers_count >= 1000000 ? `${(influencer.followers_count / 1000000).toFixed(1)}M`
                          : influencer.followers_count >= 1000 ? `${(influencer.followers_count / 1000).toFixed(1)}K`
                            : influencer.followers_count?.toLocaleString() || 0}
                      </span>
                      <span className="text-xs text-gray-900">followers</span>
                    </div>
                    {influencer.rate_per_post > 0 && (
                      <div className="mt-auto flex items-center space-x-1 text-xs text-primary-600 bg-primary-50 rounded-lg px-2 py-1">
                        <span className="font-semibold">
                          ₹{influencer.rate_per_post >= 1000
                            ? `${(influencer.rate_per_post / 1000).toFixed(1)}K`
                            : influencer.rate_per_post.toLocaleString()}
                        </span>
                        <span className="text-gray-900">per post</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-gray-900" />
            </div>
            <p className="text-gray-900 text-lg font-medium mb-2">No influencers found</p>
            <p className="text-gray-900">Try selecting a different category</p>
          </div>
        )}
        {!showAllInfluencers && influencers.length > 12 && (
          <div className="sm:hidden mt-12 text-center">
            <button onClick={handleViewAll}
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-primary-700 transition-colors">
              <span>View All Influencers</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </section>

      {/* About Us Section */}
      <AboutUs />

      <section className="bg-gradient-to-br from-warm-50 to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 scroll-animate opacity-0">Why Choose Collabo?</h2>
            <p className="text-xl text-gray-900 scroll-animate opacity-0" style={{ animationDelay: '0.1s' }}>The modern platform for influencer marketing</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 scroll-animate opacity-0" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Fast & Easy</h3>
              <p className="text-gray-900 leading-relaxed">Find and connect with influencers in minutes. Our streamlined process makes collaboration effortless.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 scroll-animate opacity-0" style={{ animationDelay: '0.3s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Targeted Reach</h3>
              <p className="text-gray-900 leading-relaxed">Filter by category, followers, and engagement to find the perfect match for your brand.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 scroll-animate opacity-0" style={{ animationDelay: '0.4s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Verified Profiles</h3>
              <p className="text-gray-900 leading-relaxed">All influencers are verified with real-time follower counts and authentic engagement metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <OurServices />

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 scroll-animate opacity-0">What Our Users Say</h2>
            <p className="text-xl text-gray-900 scroll-animate opacity-0" style={{ animationDelay: '0.1s' }}>
              Trusted by brands and influencers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 - Brand */}
            <div className="bg-gradient-to-br from-warm-50 to-primary-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 scroll-animate opacity-0" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  S
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-700">Marketing Director, TechCorp</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-primary-600 fill-current" />
                ))}
              </div>
              <p className="text-gray-900 leading-relaxed italic">
                "Collabo made it incredibly easy to find the perfect influencers for our campaign. The platform is intuitive and the results exceeded our expectations!"
              </p>
            </div>

            {/* Testimonial 2 - Influencer */}
            <div className="bg-gradient-to-br from-warm-50 to-primary-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 scroll-animate opacity-0" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  R
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Rahul Sharma</h4>
                  <p className="text-sm text-gray-700">Fashion Influencer, 500K+ Followers</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-primary-600 fill-current" />
                ))}
              </div>
              <p className="text-gray-900 leading-relaxed italic">
                "As an influencer, Collabo has connected me with amazing brands that align with my values. The collaboration process is seamless and professional."
              </p>
            </div>

            {/* Testimonial 3 - Brand */}
            <div className="bg-gradient-to-br from-warm-50 to-primary-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 scroll-animate opacity-0" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-700 to-accent-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  P
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Priya Patel</h4>
                  <p className="text-sm text-gray-700">CEO, BeautyBrand India</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-primary-600 fill-current" />
                ))}
              </div>
              <p className="text-gray-900 leading-relaxed italic">
                "The ROI from our influencer campaigns has tripled since we started using Collabo. The platform's analytics and targeting features are game-changing!"
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 scroll-animate opacity-0" style={{ animationDelay: '0.5s' }}>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-900 font-medium">Active Influencers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">5K+</div>
              <div className="text-gray-900 font-medium">Brands Trust Us</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-gray-900 font-medium">Campaigns Launched</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-gray-900 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-3xl p-12 sm:p-16 text-center shadow-2xl scroll-animate opacity-0">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to Start Collaborating?</h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">Join thousands of brands and influencers creating amazing content together.</p>
            <button onClick={() => navigate('/register')}
              className="bg-white text-primary-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center space-x-2">
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
