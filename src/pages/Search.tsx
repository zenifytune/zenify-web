import { useState, useRef } from 'react';
import { Search as SearchIcon, Play, AlertCircle, Download, MonitorSmartphone } from 'lucide-react';
import ReactPlayer from 'react-player';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { searchSongs, type JioSaavnSong } from '../lib/JioSaavnService';

export const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<JioSaavnSong[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Quick Play State
    const [playingUrl, setPlayingUrl] = useState<string | null>(null);
    const [playingSong, setPlayingSong] = useState<JioSaavnSong | null>(null);
    const playerRef = useRef<any>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setResults([]);

        try {
            const songs = await searchSongs(query);
            setResults(songs);
            if (songs.length === 0) {
                setError("No results found on JioSaavn.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch results from JioSaavn.");
        } finally {
            setIsLoading(false);
        }
    };

    const playSong = async (song: JioSaavnSong) => {
        // Find highest quality download URL (usually 320kbps or last in list)
        // JioSaavn API usually returns [12kbps, 48kbps, 96kbps, 160kbps, 320kbps]
        // We prefer 320kbps, then 160kbps.
        const bestUrlObj = song.downloadUrl.slice().reverse().find(u => u.quality === '320kbps') ||
            song.downloadUrl.slice().reverse().find(u => u.quality === '160kbps') ||
            song.downloadUrl[song.downloadUrl.length - 1];

        if (bestUrlObj) {
            setPlayingUrl(bestUrlObj.link);
            setPlayingSong(song);
        } else {
            setError("No playable URL found for this song.");
        }

        // --- OPTIONAL: Remote Play on Phone ---
        // We can push this song to the 'player/current' doc to make the phone play it?
        // Or just let the web play it for now as requested.
        const user = auth.currentUser;
        if (user) {
            // For now, let's just Log it
            console.log("Playing on Web:", song.name);
        }
    };

    const downloadSong = (song: JioSaavnSong) => {
        const bestUrlObj = song.downloadUrl.slice().reverse().find(u => u.quality === '320kbps') ||
            song.downloadUrl[song.downloadUrl.length - 1];
        if (bestUrlObj) {
            window.open(bestUrlObj.link, '_blank');
        }
    };

    return (
        <div className="p-8 pb-32">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                    <SearchIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    JioSaavn Search
                </h1>

                <form onSubmit={handleSearch} className="mb-12 relative">
                    <input
                        type="text"
                        placeholder="Search Songs (JioSaavn)..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-zinc-800 text-white text-lg px-6 py-4 rounded-full border border-transparent focus:border-green-500 focus:bg-zinc-700 outline-none transition-all pl-14 shadow-xl"
                    />
                    <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-500 text-black px-6 py-2 rounded-full font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isLoading ? '...' : 'Search'}
                    </button>
                </form>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 mb-8">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((item) => (
                        <div
                            key={item.id}
                            className="bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 p-4 rounded-xl flex items-center gap-4 group transition-colors relative"
                        >
                            {/* Image */}
                            <div
                                onClick={() => playSong(item)}
                                className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-zinc-700 cursor-pointer shadow-lg"
                            >
                                <img src={item.image[2]?.link || item.image[0]?.link} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="w-6 h-6 text-white fill-white" />
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-white truncate hover:underline cursor-pointer" onClick={() => playSong(item)}>{item.name}</h3>
                                <p className="text-sm text-gray-400 truncate">{item.primaryArtists}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => downloadSong(item)}
                                    title="Download (320kbps)"
                                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Hidden Audio Player for Immediate Search Playback */}
                {playingUrl && (
                    <div className="fixed bottom-24 right-8 bg-zinc-900 border border-green-500/30 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 animate-in slide-in-from-bottom-10 max-w-sm">

                        <div className="w-10 h-10 rounded overflow-hidden">
                            <img src={playingSong?.image[0]?.link} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                                <span className="text-xs font-bold text-green-400 truncate">Playing from JioSaavn</span>
                            </div>
                            <p className="text-sm font-bold truncate text-white">{playingSong?.name}</p>
                        </div>

                        {/* @ts-ignore */}
                        <ReactPlayer
                            ref={playerRef}
                            {...{
                                url: playingUrl,
                                playing: true,
                                width: "0",
                                height: "0",
                                volume: 0.8,
                                controls: true, // Show native controls? No, hidden.
                                onError: (e: any) => setError("Playback Error: " + e)
                            } as any}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
