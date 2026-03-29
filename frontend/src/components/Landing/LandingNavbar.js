import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, Globe, ChevronDown } from 'lucide-react';

const LandingNavbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (location.pathname !== '/') {
      navigate('/', { state: { searchQuery: query } });
    } else {
      if (onSearch) onSearch(query);
      setTimeout(() => {
        const section = document.getElementById('influencers-grid');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (location.pathname === '/' && onSearch) {
      onSearch(query);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'py-6 bg-transparent'} px-4 sm:px-12`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo - Extreme Left */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-extrabold tracking-tight flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-600 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-white text-lg font-black italic">C</span>
            </div>
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent transition-all duration-300">
              collabo
            </span>
          </button>
        </div>

        {/* Floating Center Pill - Metapic Style */}
        <div className="hidden md:flex items-center bg-white/40 backdrop-blur-2xl border border-white/40 rounded-full px-1.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.03)] mx-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2 rounded-full text-[13px] font-bold text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 hover:text-white hover:shadow-md hover:border-transparent"
            >
              Home
            </button>
            
            {/* Highlighted Link Capsule */}
            <div className="relative group">
              <button
                onClick={() => {
                  navigate('/services');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 bg-white px-5 py-2 rounded-full text-[13px] font-bold text-gray-900 shadow-sm border border-gray-100 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 hover:text-white hover:border-transparent hover:shadow-md group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 group-hover:bg-white transition-colors duration-300"></span>
                <span>For Brands</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </button>
            </div>

            <button
              onClick={() => {
                navigate('/creators');
              }}
              className="px-5 py-2 rounded-full text-[13px] font-bold text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 hover:text-white hover:shadow-md hover:border-transparent">
              Creators
            </button>
          </div>
        </div>

        {/* Global/Language & CTA - Extreme Right */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="flex items-center space-x-1.5 text-gray-700 hover:text-black transition-colors">
            <Globe className="w-4 h-4" />
            <span className="text-[13px] font-bold">En</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button
            onClick={() => navigate('/register')}
            className="bg-[#0F172A] hover:bg-black text-white px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Join the Club
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-[80px] left-4 right-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[24px] shadow-2xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[400px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0 border-0'}`}>
        <div className="px-6 space-y-4">
          <button
            onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-3 text-gray-900 font-bold rounded-2xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 hover:text-white hover:shadow-md"
          >
            Home
          </button>
          <button
            onClick={() => { navigate('/services'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-3 text-gray-900 font-bold rounded-2xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 hover:text-white hover:shadow-md flex items-center justify-between group"
          >
            <span>For Brands</span>
            <span className="w-2 h-2 rounded-full bg-accent-500 group-hover:bg-white transition-colors duration-300"></span>
          </button>
          <button
            onClick={() => {
              navigate('/creators');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-gray-900 font-bold rounded-2xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 hover:text-white hover:shadow-md"
          >
            Explore Creators
          </button>
          
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
            <button
               onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
               className="w-full px-4 py-3 text-center text-gray-900 font-bold"
            >
              Sign In
            </button>
            <button
              onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
              className="w-full bg-[#0F172A] text-white px-6 py-4 rounded-full font-bold shadow-lg"
            >
              Join the Club
            </button>
          </div>
        </div>
      </div>
    </nav>

  );
};

export default LandingNavbar;

