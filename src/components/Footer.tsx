import { Github, Twitter, Instagram } from 'lucide-react';
import logo from '../assets/ic_launcher.png';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-dark-bg pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} className="w-8 h-8 rounded-lg shadow-lg shadow-zen-500/20" alt="Zenify Logo" />
              <span className="font-bold text-xl text-white">Zenify</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The next generation music player for your local library. Visuals, speed, and style.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-zen-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-zen-400 transition-colors">Download</a></li>
              <li><a href="#" className="hover:text-zen-400 transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-zen-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-zen-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-zen-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-zen-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-zen-400 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Zenify Music. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
