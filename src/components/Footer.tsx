import { Github, Twitter, Mail, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerSections = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '/#features' },
      { name: 'Download', href: '/#download' },
      { name: 'Updates', href: '#' },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: 'mailto:support@zenify.app' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ]
  }
];

export const Footer = () => {
  // Helper to determine if link is internal (route) or external
  const renderLink = (link: { name: string; href: string }) => {
    if (link.href.startsWith('/')) {
      return (
        <Link to={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
          {link.name}
        </Link>
      );
    }
    return (
      <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
        {link.name}
      </a>
    );
  };

  return (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Music2 className="w-8 h-8 text-purple-500" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Zenify
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience music like never before.
              Immersive 3D visuals, high-quality audio,
              and seamless listening.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Zenify. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="mailto:contact@zenify.app" className="text-gray-400 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
