import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db, storage } from '../lib/firebase';
import { type User, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Loader2, Music, CheckCircle2, X, Camera, Save } from 'lucide-react';

export const Account = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        likedCount: 0,
        playlistCount: 0,
        downloadCount: 0,
        totalTime: 0,
        mostPlayed: 'N/A'
    });

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

                    // Fetch Stats
                    const statsDoc = await getDoc(doc(db, "users", currentUser.uid, "stats", "summary"));
                    if (statsDoc.exists()) {
                        setStats(statsDoc.data() as any);
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
                                <div className="w-24 h-24 rounded-full bg-zen-500/20 flex items-center justify-center border-4 border-dark-bg shadow-xl overflow-hidden">
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
                                <div
                                    onClick={() => setShowEditProfile(true)}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    <h3 className="font-semibold text-white mb-1">Edit Profile</h3>
                                    <p className="text-sm text-gray-400">Change your display name and photo</p>
                                </div>
                                <div
                                    onClick={() => navigate('/privacy')}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                                >
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
                                    <span className="font-bold text-white">{stats.likedCount}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-gray-300">Playlists</span>
                                    <span className="font-bold text-white">{stats.playlistCount}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-gray-300">Downloads</span>
                                    <span className="font-bold text-white">{stats.downloadCount}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Insights</h4>
                                <div
                                    onClick={() => navigate('/insights')}
                                    className="grid grid-cols-2 gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <p className="text-xs text-gray-400 mb-1">Time</p>
                                        <p className="font-bold text-white text-lg">
                                            {Math.floor(stats.totalTime / 3600) > 0
                                                ? `${Math.floor(stats.totalTime / 3600)}h`
                                                : `${Math.floor(stats.totalTime / 60)}m`}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <p className="text-xs text-gray-400 mb-1">Top Song</p>
                                        <p className="font-bold text-white text-sm truncate">{stats.mostPlayed}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/library')}
                                className="w-full mt-6 py-3 rounded-xl bg-purple-500/20 text-purple-300 font-semibold hover:bg-purple-500/30 transition-colors"
                            >
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

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {showEditProfile && user && (
                    <EditProfileModal
                        user={user}
                        onClose={() => setShowEditProfile(false)}
                        onUpdate={(updatedUser) => {
                            setUser({ ...updatedUser }); // Force re-render
                            setShowEditProfile(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-component for editing profile
const EditProfileModal = ({ user, onClose, onUpdate }: { user: User, onClose: () => void, onUpdate: (u: any) => void }) => {
    const [name, setName] = useState(user.displayName || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(user.photoURL);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let photoURL = user.photoURL;

            // 1. Upload new image if selected
            if (imageFile) {
                const storageRef = ref(storage, `profile_images/${user.uid}/${Date.now()}_${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                photoURL = await getDownloadURL(storageRef);
            }

            // 2. Update Auth Profile
            await updateProfile(user, {
                displayName: name,
                photoURL: photoURL
            });

            // 3. Sync to Firestore (optional but good practice)
            // ... Code to update firestore user doc if you keep user data there

            onUpdate(user); // Notify parent (auth object internal state is updated by updateProfile)
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass relative w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl bg-dark-card"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

                <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zen-500/30">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zen-500/20 flex items-center justify-center">
                                    <UserIcon className="w-12 h-12 text-zen-400" />
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <p className="text-sm text-gray-400 mt-2">Tap to change photo</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zen-500 transition-colors"
                            placeholder="Enter your name"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-zen-500 hover:bg-zen-600 text-white rounded-xl py-3 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Save className="w-5 h-5" /> Save Changes
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
};
