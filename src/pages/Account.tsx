import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { type User, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Loader2, Music, CheckCircle2 } from 'lucide-react';

export const Account = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Fetch subscription status
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        setIsSubscribed(userDoc.data().isSubscribed || false);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                navigate('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-dark-bg">
                <Loader2 className="w-10 h-10 animate-spin text-zen-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 bg-dark-bg relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-zen-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">My Account</h1>
                    <p className="text-gray-400">Manage your profile and subscription</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <div className="glass p-8 rounded-3xl border border-white/10">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 rounded-full bg-zen-500/20 flex items-center justify-center border-4 border-dark-bg shadow-xl">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-10 h-10 text-zen-400" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{user?.displayName || 'Zenify User'}</h2>
                                    <p className="text-gray-400">{user?.email}</p>
                                    {isSubscribed && (
                                        <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-zen-500/20 text-zen-400 text-xs font-medium border border-zen-500/20">
                                            <CheckCircle2 className="w-3 h-3" /> Premium Active
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <h3 className="font-semibold text-white mb-1">Edit Profile</h3>
                                    <p className="text-sm text-gray-400">Change your display name and photo</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <h3 className="font-semibold text-white mb-1">Privacy & Security</h3>
                                    <p className="text-sm text-gray-400">Manage your account security settings</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-3xl border border-white/10 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white text-lg">Sign Out</h3>
                                <p className="text-gray-400 text-sm">Log out of your account on this device</p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-3 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats / Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="glass p-6 rounded-3xl border border-white/10">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <Music className="w-5 h-5 text-purple-400" />
                                Your Library
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-gray-300">Liked Songs</span>
                                    <span className="font-bold text-white">124</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-gray-300">Playlists</span>
                                    <span className="font-bold text-white">8</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-gray-300">Downloads</span>
                                    <span className="font-bold text-white">42</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-3 rounded-xl bg-purple-500/20 text-purple-300 font-semibold hover:bg-purple-500/30 transition-colors">
                                View Full Library
                            </button>
                        </div>

                        {!isSubscribed && (
                            <div className="p-6 rounded-3xl bg-gradient-to-br from-zen-600 to-emerald-800 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="font-bold text-xl mb-2">Go Premium</h3>
                                    <p className="text-zen-100 text-sm mb-4">Unlock high quality audio and unlimited downloads.</p>
                                    <button onClick={() => navigate('/subscription')} className="px-6 py-2 bg-white text-zen-900 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                                        Upgrade Now
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
