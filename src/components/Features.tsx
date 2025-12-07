import { motion } from 'framer-motion';
import { Zap, Globe, BarChart3, Layers, Smartphone, Wifi } from 'lucide-react';

const features = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Audio Visualizer",
    description: "Watch your music come to life with real-time, customizable audio visualizations."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Built for speed. Zenify scans your library in seconds, handling thousands of tracks effortlessly."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Cross Platform",
    description: "Seamlessly sync your experience across Windows, Android, and iOS devices."
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Smart Playlists",
    description: "Automatically organized playlists based on your listening habits and preferences."
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    title: "Offline Mode",
    description: "Take your music anywhere. Full offline support for your local library."
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Modern UI",
    description: "A beautiful, dark-mode first interface designed for clarity and ease of use."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      type: "spring",
      stiffness: 50,
      damping: 20
    } as const
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 } as const
  }
};

export const Features = () => {
  return (
    <section id="features" className="py-24 relative bg-dark-bg/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Power Packed <span className="text-gradient">Features</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to elevate your listening experience, wrapped in a stunning package.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl glass hover:bg-white/10 transition-colors group"
            >
              <div className="w-12 h-12 bg-zen-500/10 rounded-lg flex items-center justify-center text-zen-400 group-hover:text-zen-300 group-hover:bg-zen-500/20 transition-all mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
