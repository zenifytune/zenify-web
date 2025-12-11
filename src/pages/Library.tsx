import { useState, useEffect } from 'react';
import { Library as LibIcon, Heart, Music2, Play } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const Library = () => {
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [likedSongs, setLikedSongs] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'playlists' | 'liked'>('playlists');

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // 1. Listen to Playlists
        const unsubPlaylists = onSnapshot(doc(db, 'users', user.uid, 'library', 'playlists'), (doc) => {
            if (doc.exists()) {
                setPlaylists(doc.data().items || []);
            }
        });

        // 2. Listen to Liked Songs
        const unsubLiked = onSnapshot(doc(db, 'users', user.uid, 'library', 'liked_songs'), (doc) => {
            if (doc.exists()) {
                setLikedSongs(doc.data().songs || []);
            }
        });

        return () => {
            unsubPlaylists();
            unsubLiked();
        };
    }, []);

    return (
        <div className="p-8 pb-32 pt-24 min-h-screen relative">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                    <LibIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    Your Library
                </h1>

                {/* Tabs */}
                <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setActiveTab('playlists')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'playlists' ? 'bg-white text-black' : 'bg-transparent text-gray-400 hover:text-white'}`}
                    >
                        Playlists
                    </button>
                    <button
                        onClick={() => setActiveTab('liked')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'liked' ? 'bg-white text-black' : 'bg-transparent text-gray-400 hover:text-white'}`}
                    >
                        Liked Songs
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'playlists' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {playlists.map((playlist) => (
                            <div key={playlist.name} className="bg-zinc-900/40 p-5 rounded-lg hover:bg-zinc-800 transition-colors group cursor-pointer border border-white/5">
                                <div className="aspect-square bg-gradient-to-br from-purple-800 to-indigo-900 rounded-md mb-4 flex items-center justify-center relative shadow-lg overflow-hidden">
                                    <Music2 className="w-12 h-12 text-white/50" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute right-3 bottom-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-white truncate mb-1">{playlist.name}</h3>
                                <p className="text-sm text-gray-400 truncate">By You</p>
                                <p className="text-xs text-gray-500 mt-1">{playlist.songCount} songs</p>
                            </div>
                        ))}
                        {playlists.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-500 italic">No playlists synced yet. Use the app to create one.</div>
                        )}
                    </div>
                )}

                {activeTab === 'liked' && (
                    <div className="bg-zinc-900/30 rounded-xl overflow-hidden border border-white/5">
                        {/* Header Row */}
                        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-4 border-b border-white/5 text-sm font-bold text-gray-400 uppercase tracking-wider">
                            <div className="w-8">#</div>
                            <div>Title</div>
                            <div className="hidden md:block">Artist</div>
                            <div className="w-12 text-center"><Heart className="w-4 h-4 mx-auto" /></div>
                        </div>

                        {/* List */}
                        {likedSongs.map((song, i) => (
                            <div key={song.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-3 items-center hover:bg-white/5 transition-colors group text-sm cursor-pointer border-b border-white/5 last:border-0">
                                <div className="w-8 text-gray-500 font-mono text-center group-hover:hidden">{i + 1}</div>
                                <div className="w-8 hidden group-hover:flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white fill-current" />
                                </div>

                                <div className="flex items-center gap-3">
                                    {song.artUri ? (
                                        <img src={song.artUri} alt="" className="w-10 h-10 rounded object-cover shadow-sm" />
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-600">
                                            <Music2 className="w-5 h-5" />
                                        </div>
                                    )}
                                    <span className={`font-medium ${song.id ? 'text-white' : 'text-gray-400'} truncate`}>{song.title}</span>
                                </div>

                                <div className="hidden md:block text-gray-400 group-hover:text-white transition-colors truncate">{song.artist}</div>

                                <div className="w-12 text-center">
                                    <Heart className="w-4 h-4 text-green-500 fill-current mx-auto" />
                                </div>
                            </div>
                        ))}
                        {likedSongs.length === 0 && (
                            <div className="py-12 text-center text-gray-500 italic">No liked songs synced yet. Go to the app and like some songs!</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
