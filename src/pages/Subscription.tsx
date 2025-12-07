import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Star, Shield, Smartphone } from 'lucide-react';

export const Subscription = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().isSubscribed) {
            setIsSubscribed(true);
          }
        } catch (e) {
          console.error("Error fetching subscription status", e);
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    // Simulate Payment Processing Delay
    setTimeout(async () => {
      try {
        // Link subscription to the user's account/email
        await setDoc(doc(db, 'users', user.uid), {
          isSubscribed: true,
          email: user.email,
          updatedAt: new Date().toISOString(),
          plan: 'premium_monthly'
        }, { merge: true });

        setIsSubscribed(true);
        setIsProcessing(false);
      } catch (e) {
        console.error("Subscription error:", e);
        setIsProcessing(false);
        alert("An error occurred. Please try again.");
      }
    }, 1500);
  };

  const features = [
    "Ad-free listening experience",
    "High-quality audio streaming",
    "Unlimited offline downloads",
    "Cross-platform sync (Web, Android, iOS)",
    "AI-powered recommendations"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zen-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-zen-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold mb-6"
          >
            <Crown className="w-4 h-4" />
            Zenify Premium
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Unlock the Full <br />
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600">Experience</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Take your music library to the next level with premium features designed for the ultimate listener.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Features List */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-zen-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-zen-400" />
                </div>
                <span className="text-gray-200 font-medium">{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* Pricing Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl blur opacity-30" />
            <div className="relative glass p-8 rounded-3xl border border-amber-500/20">
              
              {isSubscribed ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">You're Premium!</h3>
                  <p className="text-gray-400 mb-8">Your subscription is active and linked to <br/><span className="text-white font-medium">{user?.email}</span></p>
                  <button 
                    onClick={() => navigate('/sync-live')}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/10"
                  >
                    Go to Player
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Monthly Plan</h3>
                      <p className="text-gray-400">Cancel anytime</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">$9.99</div>
                      <div className="text-sm text-gray-500">/month</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Instant activation</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Secure payment via Zenify</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      <span>Access on all devices</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubscribe}
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Star className="w-5 h-5 fill-current" />
                        Subscribe Now
                      </>
                    )}
                  </button>
                  
                  {!user && (
                    <p className="text-center mt-4 text-sm text-gray-500">
                      You'll be asked to log in first.
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
