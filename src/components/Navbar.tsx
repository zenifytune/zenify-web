import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, RefreshCw, LogIn, Crown } from 'lucide-react'; // Removed Music
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import logo from '../assets/ic_launcher.png'; // Updated import

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'Showcase', href: '/#showcase' },
    { name: 'Download', href: '/#download' },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href.substring(1));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <motion.nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-dark-bg/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} className="w-8 h-8 rounded-lg shadow-lg shadow-zen-500/20" alt="Zenify Logo" />
            <span className="font-bold text-xl tracking-tight text-white">Zenify</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-gray-300 hover:text-zen-400 transition-colors relative group bg-transparent border-none cursor-pointer"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-zen-400 transition-all group-hover:w-full" />
                </button>
              ))}
              
              <Link to="/subscription">
                <button className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-bold transition-colors px-3 py-2 rounded-lg hover:bg-amber-500/10">
                  <Crown className="w-4 h-4" />
                  Premium
                </button>
              </Link>

              <Link to="/sync-live">
                <button className="flex items-center gap-2 bg-white text-dark-bg px-4 py-2 rounded-full text-sm font-bold hover:bg-zen-50 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Sync Live
                </button>
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{user.email?.split('@')[0]}</span>
                    <button 
                        onClick={handleLogout}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors"
                    >
                        Logout
                    </button>
                </div>
              ) : (
                <Link to="/login">
                    <button className="bg-white text-dark-bg px-4 py-2 rounded-full text-sm font-bold hover:bg-zen-50 transition-colors flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Login
                    </button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-dark-card border-b border-white/5"
        >
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
              >
                {link.name}
              </button>
            ))}
             <Link to="/subscription" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full mt-2 flex items-center justify-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-lg text-sm font-bold">
                    <Crown className="w-4 h-4" />
                    Go Premium
                </button>
             </Link>

             <Link to="/sync-live" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full mt-2 flex items-center justify-center gap-2 bg-white text-dark-bg px-4 py-2 rounded-lg text-sm font-bold">
                    <RefreshCw className="w-4 h-4" />
                    Sync Live Music
                </button>
             </Link>

             {user ? (
                <button 
                    onClick={handleLogout}
                    className="w-full mt-4 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                >
                    Logout ({user.email?.split('@')[0]})
                </button>
             ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full mt-4 bg-zen-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Login
                    </button>
                </Link>
             )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};