import { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot, getDoc, collection, setDoc, serverTimestamp } from 'firebase/firestore'; // Added setDoc

import {
    Home, Search, Library, PlusSquare, Heart, Globe,
    MonitorSmartphone, Music2, Clock, Play, Pause,
    SkipBack, SkipForward, Volume2, Maximize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Player = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [playerState, setPlayerState] = useState<any>(null);
    const [likedStats, setLikedStats] = useState({ count: 0 });
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [recentHistory, setRecentHistory] = useState<any[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [volume, setVolume] = useState(0.8);
    const [webAudioEnabled, setWebAudioEnabled] = useState(false);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Command Dispatcher
    const sendCommand = async (cmd: string) => {
        if (!user) return;
        try {
            // Write to the specific 'commands' document the App listens to
            await setDoc(doc(db, 'users', user.uid, 'sync', 'commands'), {
                command: cmd,
                timestamp: serverTimestamp()
            });
        } catch (e) {
            console.error("Cmd error", e);
        }
    };

    // Construct Audio Source (Using Piped/YouTube)
    const audioUrl = playerState?.song?.id ? `https://www.youtube.com/watch?v=${playerState.song.id}` : null;

    useEffect(() => {
        let unsubPlayer: any = null;
        let unsubHistory: any = null;

        // Auth State Listener
        const unsubAuth = auth.onAuthStateChanged(async (currentUser) => {
            if (!currentUser) {
                navigate('/login');
                return;
            }
            setUser(currentUser);

            // 1. Listen to Player State (Real-time)
            unsubPlayer = onSnapshot(doc(db, 'users', currentUser.uid, 'player', 'current'), (doc) => {
                if (doc.exists()) {
                    setPlayerState(doc.data());
                }
            });

            // 2. Fetch Library Stats
            const statsDoc = await getDoc(doc(db, "users", currentUser.uid, "stats", "summary"));
            if (statsDoc.exists()) {
                setLikedStats({ count: statsDoc.data().likedCount || 0 });
            }

            // 3. Fetch Playlists
            const playlistsDoc = await getDoc(doc(db, "users", currentUser.uid, "library", "playlists"));
            if (playlistsDoc.exists()) {
                setPlaylists(playlistsDoc.data().items || []);
            }

            // 4. Listen to History
            unsubHistory = onSnapshot(doc(db, 'users', currentUser.uid, 'stats', 'listening_history'), (doc) => {
                if (doc.exists()) {
                    const sessions = doc.data().sessions || [];
                    setRecentHistory(sessions.slice(-4));
                }
            });
        });

        // Cleanup
        return () => {
            unsubAuth();
            if (unsubPlayer) unsubPlayer();
            if (unsubHistory) unsubHistory();
        };
    }, [navigate]);

    return (
        <div className="h-screen bg-black text-white flex overflow-hidden">
            {/* --- SIDEBAR (Hidden on Mobile) --- */}
            <div className="hidden md:flex w-64 bg-black flex-col border-r border-white/10">
                <div className="p-6 flex items-center gap-2">
                    <Music2 className="w-8 h-8 text-white" />
                    <span className="font-bold text-xl">Zenify</span>
                </div>

                <div className="px-3 py-2">
                    <NavItem icon={Home} label="Home" active />
                    <NavItem icon={Search} label="Search" />
                    <NavItem icon={Library} label="Your Library" onClick={() => navigate('/library')} />
                </div>

                <div className="mt-6 px-3">
                    <div className="flex items-center justify-between px-3 mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Playlists</span>
                        <PlusSquare className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                    </div>
                    <NavItem icon={Heart} label="Liked Songs" subLabel={`${likedStats.count} songs`} onClick={() => navigate('/library')} />
                    <NavItem icon={Globe} label="Shared with You" />

                    {/* Real Playlists */}
                    <div className="mt-4 space-y-3 px-3 overflow-y-auto max-h-[300px] scrollbar-hide">
                        {playlists.map((p: any) => (
                            <div key={p.name} className="group cursor-pointer">
                                <p className="text-sm text-gray-400 group-hover:text-white transition-colors truncate font-medium">{p.name}</p>
                                <p className="text-xs text-gray-600 truncate">{p.songCount} songs</p>
                            </div>
                        ))}
                        {playlists.length === 0 && <p className="text-xs text-gray-600 italic px-1">Sync from app to see playlists</p>}
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 bg-gradient-to-b from-purple-900/20 to-black relative overflow-y-auto">
                {/* Header */}
                <header className="sticky top-0 z-20 bg-black/40 backdrop-blur-xl px-4 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex gap-2">
                        {/* Navigation Arrows (Mock) */}
                        <div className="hidden md:flex w-8 h-8 rounded-full bg-black/50 items-center justify-center cursor-not-allowed opacity-50"><SkipBack className="w-4 h-4 rotate-180" /></div>
                        <div className="hidden md:flex w-8 h-8 rounded-full bg-black/50 items-center justify-center cursor-not-allowed opacity-50"><SkipForward className="w-4 h-4" /></div>

                        {/* Mobile: Logo */}
                        <div className="md:hidden flex items-center gap-2">
                            <Music2 className="w-6 h-6 text-white" />
                            <span className="font-bold text-lg">Zenify</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 bg-black/60 rounded-full p-1 pr-3">
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold">{user?.displayName?.split(' ')[0] || 'User'}</span>
                        </div>
                    </div>
                </header>

                <div className="px-8 pb-32">
                    {/* Welcome Section */}
                    <div className="mt-6 mb-10">
                        <h1 className="text-3xl font-bold mb-1">
                            {currentTime.getHours() < 12 ? 'Good Morning' : currentTime.getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
                        </h1>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                            <MonitorSmartphone className="w-4 h-4" />
                            Synced with {playerState?.device || 'Mobile App'}
                        </p>
                    </div>

                    {/* Recently Played Grid (Real Data Only) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                        <PlaylistCard title="Liked Songs" desc={`${likedStats.count} songs`} bg="bg-gradient-to-br from-purple-700 to-blue-800" onClick={() => navigate('/library')} />

                        {recentHistory.map((session, idx) => (
                            <PlaylistCard
                                key={idx}
                                title={session.songTitle || 'Unknown'}
                                desc={session.artistName || 'Artist'}
                                bg="bg-gradient-to-br from-zinc-800 to-black border border-white/10"
                            />
                        ))}

                        {recentHistory.length === 0 && (
                            <div className="col-span-full text-center py-8 border border-dashed border-white/10 rounded-xl">
                                <p className="text-gray-400">Play songs on your phone to see history here</p>
                            </div>
                        )}
                    </div>

                    {/* Now Playing Giant Hero (If Active) */}
                    {playerState?.isActive && playerState?.isPlaying ? (
                        <div className="bg-gradient-to-r from-purple-900/40 to-black border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-10 text-center md:text-left">
                            <div className="relative w-40 h-40 md:w-48 md:h-48 shadow-2xl shadow-purple-900/50 rounded-xl overflow-hidden shrink-0">
                                {/* Use a placeholder if artUri is empty/local */}
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                    <Music2 className="w-16 h-16 text-zinc-600" />
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-bold tracking-wider text-purple-400 uppercase mb-2 block">Now Playing on {playerState.device}</span>
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 line-clamp-2">{playerState.song?.title}</h2>
                                <p className="text-xl md:text-2xl text-gray-300">{playerState.song?.artist}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center mb-10">
                            <MonitorSmartphone className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Connect a Device</h3>
                            <p className="text-gray-400 max-w-md mx-auto">Open Zenify on your phone to start listening. This dashboard will update in real-time.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- PLAYER BAR (Footer) --- */}
            <div className="h-24 bg-zinc-900 border-t border-white/10 fixed bottom-0 w-full z-50 px-4 flex items-center justify-between">

                {/* Debug Overlay */}
                <div className="fixed top-0 left-0 bg-black/80 text-green-400 p-2 text-xs font-mono pointer-events-none z-50 max-w-sm truncate opacity-50 hover:opacity-100">
                    <div>Sync Status</div>
                    <div>Song: {playerState?.song?.title || 'None'}</div>
                    <div>Active: {playerState?.isActive ? 'Yes' : 'No'} | Playing: {playerState?.isPlaying ? 'Yes' : 'No'}</div>
                    <div>Last Update: {playerState?.lastUpdated?.toDate().toLocaleTimeString()}</div>
                    <div>Device: {playerState?.device}</div>
                    <div className="text-blue-400">ID: {playerState?.song?.id}</div>
                    <div className="text-yellow-400 max-w-xs truncate">URL: {audioUrl}</div>
                </div>

                {/* HIDDEN REAL PLAYER */}
                {audioUrl && webAudioEnabled && (
                    <div className="hidden">
                        <ReactPlayer
                            ref={playerRef}
                            {...{
                                url: audioUrl,
                                playing: playerState?.isPlaying,
                                volume: volume,
                                width: "0",
                                height: "0",
                                onEnded: () => sendCommand('next')
                            } as any}
                        />
                    </div>
                )}

                {/* Left: Track Info */}
                <div className="flex items-center gap-3 w-[60%] md:w-[30%]">
                    {playerState?.song && (
                        <>
                            <div className="w-14 h-14 bg-zinc-800 rounded flex items-center justify-center shrink-0">
                                <Music2 className="w-6 h-6 text-zinc-600" />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-semibold text-sm text-white truncate hover:underline cursor-pointer">{playerState.song.title}</h4>
                                <p className="text-xs text-gray-400 hover:underline cursor-pointer">{playerState.song.artist}</p>
                            </div>
                            <Heart className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer ml-2" />
                        </>
                    )}
                </div>

                {/* Center: Controls */}
                <div className="flex flex-col items-center justify-center w-[40%] md:w-[40%] absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
                    <div className="flex items-center gap-6 mb-2">
                        <SkipBack onClick={() => sendCommand('previous')} className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer active:scale-90 transition-transform" />
                        <button
                            onClick={() => sendCommand(playerState?.isPlaying ? 'pause' : 'play')}
                            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                        >
                            {playerState?.isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current pl-0.5" />}
                        </button>
                        <SkipForward onClick={() => sendCommand('next')} className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer active:scale-90 transition-transform" />
                    </div>
                    <div className="hidden md:flex w-full max-w-md items-center gap-2 text-xs text-gray-400 font-mono">
                        <span>-:--</span>
                        <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-white rounded-full relative group">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full hidden group-hover:block shadow-lg" />
                            </div>
                        </div>
                        <span>-:--</span>
                    </div>
                </div>

                {/* Right: Volume & Options */}
                <div className="hidden md:flex items-center justify-end gap-3 w-[30%]">
                    {/* Web Audio Toggle */}
                    <button
                        onClick={() => setWebAudioEnabled(!webAudioEnabled)}
                        className={`text-xs px-2 py-1 rounded border ${webAudioEnabled ? 'bg-green-500 border-green-500 text-black' : 'border-gray-600 text-gray-400'}`}
                    >
                        {webAudioEnabled ? 'Web Audio ON' : 'Play Here'}
                    </button>

                    <Clock className="w-5 h-5 text-gray-400 cursor-pointer" />
                    <Volume2 className="w-5 h-5 text-gray-400" />
                    <input
                        type="range"
                        min="0" max="1" step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-24 h-1 bg-gray-600 rounded-full accent-white"
                    />
                    <Maximize2 className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" />
                </div>
            </div>
        </div>
    );
};

// Sub-components
const NavItem = ({ icon: Icon, label, subLabel, active, onClick }: any) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-4 px-3 py-2 rounded-md cursor-pointer transition-colors group ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
    >
        <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
        <div className="flex flex-col">
            <span className="font-bold text-sm">{label}</span>
            {subLabel && <span className="text-xs font-normal text-gray-500 group-hover:text-gray-400">{subLabel}</span>}
        </div>
    </div>
);

const PlaylistCard = ({ title, desc, bg, onClick }: any) => (
    <div onClick={onClick} className={`aspect-square ${bg} rounded-md p-4 flex flex-col justify-end group cursor-pointer relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-white/10 transition-colors" />
        <h3 className="text-xl font-bold relative z-10">{title}</h3>
        <p className="text-sm text-white/70 relative z-10">{desc}</p>

        <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-green-500 shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all flex items-center justify-center">
            <Play className="w-6 h-6 text-black fill-current ml-1" />
        </div>
    </div>
);
