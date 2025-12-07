import { motion } from 'framer-motion';
import { Smartphone, Monitor } from 'lucide-react';

export const Download = () => {
  return (
    <section id="download" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="glass rounded-3xl p-12 border border-white/10 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zen-400 via-purple-500 to-zen-400" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to start listening?
            </h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto">
                Download Zenify for your favorite device and take control of your music library today.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
                <button className="flex items-center gap-3 bg-white text-dark-bg px-6 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors min-w-[200px] justify-center">
                    <Smartphone className="w-6 h-6" />
                    <div className="text-left">
                        <div className="text-xs font-medium opacity-70">Download on</div>
                        <div className="text-base">Google Play</div>
                    </div>
                </button>
                
                <button className="flex items-center gap-3 bg-zen-900/50 border border-zen-500/30 text-white px-6 py-4 rounded-xl font-bold hover:bg-zen-900/80 transition-colors min-w-[200px] justify-center">
                    <Monitor className="w-6 h-6" />
                    <div className="text-left">
                        <div className="text-xs font-medium opacity-70">Get it from</div>
                        <div className="text-base">Microsoft Store</div>
                    </div>
                </button>
            </div>
        </motion.div>
      </div>
    </section>
  );
};
