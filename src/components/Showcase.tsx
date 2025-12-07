import { motion } from 'framer-motion';
import { Play, SkipForward, SkipBack, Repeat, Shuffle } from 'lucide-react';

export const Showcase = () => {
  return (
    <section id="showcase" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          >
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Immersive <br />
                <span className="text-gradient">Audio Visualizer</span>
             </h2>
             <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Don't just listen to your music, see it. Zenify includes a state-of-the-art audio visualizer that reacts to every beat, bass drop, and melody in real-time. 
             </p>
             
             <ul className="space-y-4 mb-8">
                {['Real-time frequency analysis', 'Customizable color themes', 'Low latency rendering', 'GPU accelerated'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-zen-500 rounded-full" />
                        {item}
                    </li>
                ))}
             </ul>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ type: "spring", stiffness: 50, damping: 20 }}
             className="relative"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl shadow-zen-900/50">
                {/* Fake Visualizer Bars */}
                <div className="absolute inset-0 flex items-end justify-center gap-1 p-8 opacity-50">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 bg-gradient-to-t from-zen-500 to-purple-500 rounded-t-sm"
                            animate={{ 
                                height: [20, Math.random() * 150 + 20, 20],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: i * 0.05,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* Player Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-lg animate-pulse" />
                            <div>
                                <div className="w-32 h-4 bg-white/20 rounded mb-2" />
                                <div className="w-20 h-3 bg-white/10 rounded" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <Shuffle className="w-5 h-5 text-gray-400" />
                            <SkipBack className="w-6 h-6" />
                            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                                <Play className="w-5 h-5 ml-1 fill-current" />
                            </div>
                            <SkipForward className="w-6 h-6" />
                            <Repeat className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
