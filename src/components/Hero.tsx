import { motion } from 'framer-motion';
import { Play, Download, Music } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-zen-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 50, damping: 20 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zen-400 text-sm mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zen-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zen-500"></span>
            </span>
            v2.0 Now Available
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Experience Music <br />
            <span className="text-gradient">Like Never Before</span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
            Zenify brings your local library to life with stunning visualizations, 
            smart organization, and a seamless cross-platform experience.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-zen-500 hover:bg-zen-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-zen-500/25"
            >
              <Download className="w-5 h-5" />
              Download Now
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-8 py-4 rounded-full font-bold transition-all backdrop-blur-sm"
            >
              <Play className="w-5 h-5 fill-current" />
              Watch Demo
            </motion.button>
          </div>

          <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-bg bg-gray-700" />
              ))}
            </div>
            <p>Join 10,000+ music lovers today</p>
          </div>
        </motion.div>

        {/* Visual/Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotate: 10 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ type: "spring", stiffness: 40, damping: 20, delay: 0.4 }}
          className="relative hidden lg:block"
        >
          <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
            <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
            <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-dark-bg relative">
                {/* Mock UI Content */}
                <div className="p-6 pt-12 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div className="w-8 h-8 rounded-full bg-white/10"></div>
                        <div className="text-white font-bold">Now Playing</div>
                        <div className="w-8 h-8 rounded-full bg-white/10"></div>
                    </div>
                    <div className="w-full aspect-square bg-gradient-to-tr from-zen-500 to-purple-600 rounded-2xl mb-8 shadow-2xl shadow-zen-500/20 animate-pulse"></div>
                    <div className="space-y-2 mb-8">
                        <div className="h-6 w-3/4 bg-white/20 rounded"></div>
                        <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                    </div>
                    <div className="flex justify-between items-center mt-auto mb-8">
                         <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                         <div className="w-16 h-16 bg-zen-500 rounded-full flex items-center justify-center shadow-lg shadow-zen-500/40">
                            <Play className="fill-white text-white ml-1" />
                         </div>
                         <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                    </div>
                </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-20 -right-10 p-4 glass rounded-2xl shadow-xl z-30"
          >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Music className="w-5 h-5 text-green-400" />
                </div>
                <div>
                    <p className="text-xs text-gray-400">Now Playing</p>
                    <p className="text-sm font-bold text-white">Midnight City</p>
                </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
