import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const socialIcons = useMemo(() => [Facebook, Twitter, Linkedin, Instagram], []);
  const socialLinks = useMemo(() => [
    '#', // Facebook
    'https://x.com/mirtariq2006', // Twitter
    '#', // LinkedIn
    'https://www.instagram.com/whos.tariqq/' // Instagram
  ], []);
  const resourcesLinks = useMemo(() => [
    { name: 'Practice Tests', href: '/login' },
    { name: 'Study Materials', href: '/login' },
    { name: 'AI Assistant', href: '/login' },
    { name: 'Performance Analytics', href: '/login' }
  ], []);
  const supportLinks = useMemo(() => [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' }
  ], []);

  return (
    <footer className="bg-cream pt-20 sm:pt-24 md:pt-28 lg:pt-36 pb-6 sm:pb-8 border-t-0 overflow-x-hidden relative -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-28">
      <div className="container mx-auto px-5 sm:px-6 md:px-12 max-w-6xl">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 lg:gap-10 mb-8 md:mb-12">
          
          {/* Brand Section - Full width on mobile, 4 cols on desktop */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-pastel-lilac rounded-lg flex items-center justify-center border-2 border-black text-sm font-bold shadow-sm">A</div>
              <span className="font-heading font-bold text-xl">AspireExamine</span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-[280px] mb-5">
              Your complete AI-powered platform for competitive exam preparation.
            </p>
            <div className="flex gap-2.5">
              {socialIcons.map((Icon, i) => (
                <a 
                  key={i} 
                  href={socialLinks[i]} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-pastel-purple hover:text-white hover:border-pastel-purple transition-all duration-200 shadow-sm" 
                  aria-label={`Social media link ${i + 1}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section - 2x2 grid on mobile, 8 cols split into 3 on desktop */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Resources */}
            <div>
              <h3 className="font-heading font-bold text-pastel-dark mb-3 sm:mb-4 text-sm">Resources</h3>
              <ul className="space-y-2 sm:space-y-2.5">
                {resourcesLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-gray-600 hover:text-pastel-purple transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-heading font-bold text-pastel-dark mb-3 sm:mb-4 text-sm">Support</h3>
              <ul className="space-y-2 sm:space-y-2.5">
                {supportLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-gray-600 hover:text-pastel-purple transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exam Streams */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-heading font-bold text-pastel-dark mb-3 sm:mb-4 text-sm">Exam Streams</h3>
              <ul className="space-y-2 sm:space-y-2.5">
                <li className="text-sm text-gray-600">NEET</li>
                <li className="text-sm text-gray-600">JEE Main</li>
                <li className="text-sm text-gray-600">JEE Advanced</li>
                <li className="text-sm text-gray-600">Other Exams</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-gray-200 pt-5 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} AspireExamine. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link to="/terms" className="hover:text-pastel-purple transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-pastel-purple transition-colors">Privacy</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Disclaimer: Site Contents designed, developed, maintained and updated by{' '}
            <a 
              href="https://epplicon.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-pastel-purple transition-colors font-medium"
            >
              Epplicon Technologies
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
