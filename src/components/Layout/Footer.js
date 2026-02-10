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

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const platformLinks = [
    { name: 'Find Influencers', href: '/search' },
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
    <footer className="glass-card border-t border-dark-100/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl brand-text text-gradient-primary">Collabo</h3>
            </div>
            
            <p className="text-dark-200 text-sm font-body leading-relaxed mb-6 max-w-md">
              The premier platform connecting brands with authentic influencers. 
              Build meaningful partnerships, create engaging campaigns, and grow your reach 
              with our innovative collaboration tools.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-dark-200">
                <Mail className="w-4 h-4 text-accent-500" />
                <span>hello@collabo.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-dark-200">
                <Phone className="w-4 h-4 text-accent-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-dark-200">
                <MapPin className="w-4 h-4 text-accent-500" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg heading-small text-dark-100 mb-6">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-dark-200 hover:text-accent-500 transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-lg heading-small text-dark-100 mb-6">About</h4>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-dark-200 hover:text-accent-500 transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-lg heading-small text-dark-100 mb-6">Help & Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-dark-200 hover:text-accent-500 transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-100/10 my-8 sm:my-12"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          {/* Social Media Links */}
          <div className="flex items-center space-x-6">
            <span className="text-sm text-dark-200 font-caption">Follow us:</span>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-dark-700/50 hover:bg-accent-600/20 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                    aria-label={social.name}
                  >
                    <SocialIcon className="w-5 h-5 text-dark-200 group-hover:text-accent-500 transition-colors duration-200" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-6">
            {legalLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                <a
                  href={link.href}
                  className="text-xs text-dark-300 hover:text-dark-200 transition-colors duration-200"
                >
                  {link.name}
                </a>
                {index < legalLinks.length - 1 && (
                  <span className="text-dark-400">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-dark-100/10 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <p className="text-xs text-dark-300">
              © {currentYear} Collabo. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-2 text-xs text-dark-300">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-400 fill-current" />
              <span>for creators and brands</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;