import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Zap, Shield, Smartphone, CreditCard, Loader2, X } from 'lucide-react';

export const Subscription = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>('Monthly Premium');
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const navigate = useNavigate();

  const plans = [
    {
      id: 'mini',
      name: 'Mini Plan',
      price: '₹9.99',
      period: '2 Days',
      features: ['Ad-free music', 'Offline Playback', 'Limited downloads'],
      color: 'from-blue-400 to-blue-600',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10'
    },
    {
      id: 'weekly',
      name: 'Weekly Premium',
      price: '₹19.99',
      period: 'Week',
      features: ['Unlimited downloads', 'Offline Playback', 'High Quality Audio', 'Ad-free'],
      color: 'from-purple-400 to-purple-600',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10'
    },
    {
      id: 'monthly',
      name: 'Monthly Premium',
      price: '₹29.99',
      period: 'Month',
      features: ['Everything in Weekly', 'Best Value', 'Cancel anytime', 'Priority Support'],
      color: 'from-zen-400 to-zen-600',
      border: 'border-zen-500/50',
      bg: 'bg-zen-500/10',
      isRecommended: true
    }
  ];

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
    setShowCheckout(true);
  };

  const confirmPayment = async () => {
    setIsProcessing(true);
    
    // Simulate Payment Processing
    setTimeout(async () => {
      try {
        if (user) {
          await setDoc(doc(db, 'users', user.uid), {
            isSubscribed: true,
            email: user.email,
            updatedAt: new Date().toISOString(),
            plan: selectedPlan
          }, { merge: true });
          
          setIsSubscribed(true);
          setShowCheckout(false);
        }
      } catch (e) {
        console.error("Payment error:", e);
        alert("Payment failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-zen-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-zen-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold mb-6"
          >
            <Crown className="w-4 h-4" />
            Zenify Premium
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Choose Your <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600">Perfect Plan</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unlock ad-free music, high-quality streaming, and unlimited downloads.
          </p>
        </div>

        {isSubscribed ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md mx-auto glass p-12 rounded-3xl text-center border border-zen-500/30"
          >
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Premium Active</h2>
            <p className="text-gray-400 mb-8">
              You are currently subscribed to the <span className="text-white font-bold">{selectedPlan}</span>. 
              Enjoy your music without limits!
            </p>
            <button 
              onClick={() => navigate('/sync-live')}
              className="w-full py-4 bg-zen-600 hover:bg-zen-700 text-white rounded-xl font-bold transition-colors"
            >
              Go to Web Player
            </button>
            
            <button 
              onClick={async () => {
                if (user && confirm('Reset subscription for testing?')) {
                  await setDoc(doc(db, 'users', user.uid), { 
                    isSubscribed: false,
                    plan: null 
                  }, { merge: true });
                  setIsSubscribed(false);
                  setSelectedPlan('Monthly Premium');
                }
              }}
              className="mt-4 text-sm text-red-400 hover:text-red-300 underline decoration-dashed"
            >
              Reset Subscription (Test Mode)
            </button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedPlan(plan.name)}
                className={`relative p-8 rounded-3xl glass border transition-all duration-300 cursor-pointer group hover:-translate-y-2 ${
                  selectedPlan === plan.name 
                    ? `ring-2 ring-offset-2 ring-offset-dark-bg ${plan.border} bg-white/5` 
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                {plan.isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-zen-500 to-zen-600 text-white text-xs font-bold rounded-full shadow-lg shadow-zen-500/20">
                    MOST POPULAR
                  </div>
                )}

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <Crown className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <Check className={`w-5 h-5 shrink-0 ${selectedPlan === plan.name ? 'text-white' : 'text-gray-500'}`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    selectedPlan === plan.name
                      ? `bg-gradient-to-r ${plan.color} text-white shadow-lg`
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {selectedPlan === plan.name ? 'Selected' : 'Choose Plan'}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {!isSubscribed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <button
              onClick={handleSubscribe}
              className="px-12 py-4 bg-white text-dark-bg rounded-full font-bold text-lg hover:bg-gray-200 transition-all shadow-xl shadow-white/10 hover:scale-105 active:scale-95"
            >
              Proceed to Payment
            </button>
            <p className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> Secure payment powered by Zenify Pay
            </p>
          </motion.div>
        )}
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowCheckout(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass relative w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl bg-dark-card"
            >
              <button 
                onClick={() => setShowCheckout(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Checkout</h2>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Selected Plan</p>
                    <p className="font-bold text-white">{selectedPlan}</p>
                  </div>
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-sm text-gray-400 mb-3">Payment Method</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">•••• •••• •••• 4242</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-white">
                    {plans.find(p => p.name === selectedPlan)?.price}
                  </p>
                </div>
                <button
                  onClick={confirmPayment}
                  disabled={isProcessing}
                  className="flex-1 bg-zen-500 hover:bg-zen-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Confirm & Pay"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};