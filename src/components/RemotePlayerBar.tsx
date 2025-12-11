import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Music2, Smartphone, Disc } from 'lucide-react';

export const RemotePlayerBar = () => {
    const [playerState, setPlayerState] = useState<any>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const unsub = onSnapshot(doc(db, 'users', user.uid, 'player', 'current'), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                // Check if active and relatively recent (e.g. within last 5 minutes)
                // For now, just trust 'isActive' flag we set in Flutter
                if (data.isActive && data.isPlaying) {
                    setPlayerState(data);
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            } else {
                setVisible(false);
            }
        });

        return () => unsub();
    }, []);

    if (!visible || !playerState) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
                >
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 pr-6 shadow-2xl shadow-purple-500/20 flex items-center gap-4">
                        {/* Spinning Disc Art */}
                        <div className="relative w-12 h-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10"
                            >
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                    <Disc className="w-6 h-6 text-zinc-600" />
                                </div>
                            </motion.div>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border border-black">
                                <Smartphone className="w-3 h-3 text-black" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">
                                {playerState.song?.title || 'Unknown Title'}
                            </p>
                            <p className="text-zinc-400 text-xs truncate">
                                {playerState.song?.artist || 'Unknown Artist'} • Playing on {playerState.device}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [8, 16, 8] }}
                                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-1 bg-purple-500 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
