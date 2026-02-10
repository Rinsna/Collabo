import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';

const LandingNavbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If we're not on the landing page, navigate there first
      if (location.pathname !== '/') {
        navigate('/', { state: { searchQuery: searchQuery.trim() } });
      } else {
        // If we're on landing page, trigger search
        if (onSearch) {
          onSearch(searchQuery.trim());
        }
        // Scroll to influencers section
        setTimeout(() => {
          const influencersSection = document.getElementById('influencers-grid');
          if (influencersSection) {
            influencersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo/Branding */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-xl sm:text-2xl text-gradient-primary font-bold"
            >
              Collabo
            </button>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-900" />
                <input
                  type="text"
                  placeholder="Search influencers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 w-64 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => {
                const aboutSection = document.getElementById('about-section');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="text-gray-900 hover:text-primary-600 font-medium text-sm transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => {
                const servicesSection = document.getElementById('services-section');
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="text-gray-900 hover:text-primary-600 font-medium text-sm transition-colors"
            >
              Our Service
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-primary-600 to-accent-500 text-white px-4 py-2 rounded-xl hover:from-primary-700 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-900 hover:text-primary-600 hover:bg-warm-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4 space-y-3">
            {/* Search Bar - Mobile */}
            <form onSubmit={handleSearch} className="px-4 mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-900" />
                <input
                  type="text"
                  placeholder="Search influencers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
            </form>
            
            <button
              onClick={() => {
                const aboutSection = document.getElementById('about-section');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-gray-900 hover:text-primary-600 px-6 py-3 rounded-xl hover:bg-warm-50 transition-all duration-200 font-medium text-center"
            >
              About Us
            </button>
            
            <button
              onClick={() => {
                const servicesSection = document.getElementById('services-section');
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-gray-900 hover:text-primary-600 px-6 py-3 rounded-xl hover:bg-warm-50 transition-all duration-200 font-medium text-center"
            >
              Our Service
            </button>
            
            <button
              onClick={() => {
                navigate('/login');
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-primary-600 to-accent-500 text-white px-6 py-3 rounded-xl hover:from-primary-700 hover:to-accent-600 transition-all duration-200 shadow-lg font-medium text-center"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;
