import React from 'react';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Github,
  ExternalLink,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const platformLinks = [
    { name: 'Find Creators', href: '/creators' },
    { name: 'Browse Campaigns', href: '/campaigns' },
    { name: 'Create Campaign', href: '/campaigns/create' },
    { name: 'My Collaborations', href: '/collaborations' },
    { name: 'Dashboard', href: '/dashboard' }
  ];

  const aboutLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Careers', href: '/careers' }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Support', href: '/support' },
    { name: 'API Documentation', href: '/docs' },
    { name: 'Community Forum', href: '/community' },
    { name: 'Status Page', href: '/status' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR Compliance', href: '/gdpr' }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/collabo' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/collabo' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/collabo' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/collabo' }
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Logo and Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Collabo</h3>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-md">
              The premier platform connecting forward-thinking brands with authentic creators. 
              Build meaningful partnerships, scale campaigns effortlessly, and monitor ROAS 
              with our state-of-the-art infrastructure.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Mail className="w-4 h-4 text-accent-500" />
                </div>
                <span>hello@collabo.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Phone className="w-4 h-4 text-accent-500" />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <MapPin className="w-4 h-4 text-accent-500" />
                </div>
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">Platform</h4>
            <ul className="space-y-4">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 hover:text-accent-600 transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-accent-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">Company</h4>
            <ul className="space-y-4">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 hover:text-accent-600 transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-accent-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">Resources</h4>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 hover:text-accent-600 transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-accent-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          
          {/* Social Media Links */}
          <div className="flex items-center space-x-6">
            <span className="text-sm text-gray-500 font-medium">Follow us</span>
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-50 border border-gray-100 hover:border-accent-200 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 group shadow-sm"
                    aria-label={social.name}
                  >
                    <SocialIcon className="w-4 h-4 text-gray-500 group-hover:text-accent-600 transition-colors duration-200" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-6">
            {legalLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                <Link
                  to={link.href}
                  className="text-xs text-gray-400 hover:text-gray-900 transition-colors duration-200 uppercase tracking-widest font-semibold"
                >
                  {link.name}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-500">
            © {currentYear} Collabo Inc. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-accent-500 fill-current" />
            <span>for the future of internet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;