import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Smartphone, RefreshCw, Wifi, Play, Pause, SkipForward, SkipBack, Music, LogOut } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, onSnapshot, Timestamp, setDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface PlaybackState {
  title: string;
  artist: string;
  album: string;
  duration: number; // milliseconds
  position: number; // milliseconds
  isPlaying: boolean;
  updatedAt: Timestamp;
}

export const SyncLiveMusic = () => {

  const [user, setUser] = useState<User | null>(null);

  const [playback, setPlayback] = useState<PlaybackState | null>(null);

  const [localProgress, setLocalProgress] = useState(0);

    const [albumArt, setAlbumArt] = useState<string | null>(null);

    const [audioSrc, setAudioSrc] = useState<string | null>(null);

    const [activeDevice, setActiveDevice] = useState<string>('mobile'); // 'mobile' or 'web'

    const [showPaused, setShowPaused] = useState(false);

  

  const navigate = useNavigate();

  const progressInterval = useRef<number>(0);

  const pauseTimeout = useRef<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null); // New: Audio Ref



  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      setUser(currentUser);

    });

    return () => unsubscribe();

  }, []);



    // Fetch Album Art & Audio Source (Cloud Storage first, then iTunes)



    useEffect(() => {



      if (!user || !playback?.title || !playback?.artist) {



          setAlbumArt(null); // Clear previous art



          setAudioSrc(null); // Clear previous audio



          return;



      }



  



      const fetchSongDetails = async () => {



          setAlbumArt(null); // Clear previous art



          setAudioSrc(null); // Clear previous audio



  



          // 1. Try to find the song in Cloud Storage



          try {



              const cloudSongsRef = collection(db, 'users', user.uid, 'cloud_songs');



              const q = query(



                  cloudSongsRef,



                  where('title', '==', playback.title),



                  where('artist', '==', playback.artist)



              );



              const querySnapshot = await getDocs(q);



  



              if (!querySnapshot.empty) {



                  const cloudSong = querySnapshot.docs[0].data() as CloudSongMetadata;



                  const fileRef = ref(storage, cloudSong.storagePath);



                  const downloadUrl = await getDownloadURL(fileRef);



                  setAudioSrc(downloadUrl); // Found in cloud storage!



  



                  // Optionally, try to fetch album art from iTunes for the cloud song



                  fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(cloudSong.artist)}%20${encodeURIComponent(cloudSong.title)}&media=music&limit=1`)



                      .then(res => res.json())



                      .then(data => {



                          if (data.results && data.results.length > 0) {



                              setAlbumArt(data.results[0].artworkUrl100.replace('100x100', '600x600'));



                          }



                      })



                      .catch(() => {}); // Ignore error, just no art



              } else {



                  // 2. Fallback to iTunes Search API if not in Cloud Storage



                  const itunesQuery = `${playback.artist} ${playback.title}`;



                  const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(itunesQuery)}&media=music&limit=1`);



                  const data = await res.json();



  



                  if (data.results && data.results.length > 0) {



                      const item = data.results[0];



                      setAlbumArt(item.artworkUrl100.replace('100x100', '600x600'));



                      setAudioSrc(item.previewUrl); // Set preview URL (30s)



                  }



              }



          } catch (error) {



              console.error("Error fetching song details for web playback:", error);



              // Even if cloud lookup fails, still try iTunes



              const itunesQuery = `${playback.artist} ${playback.title}`;



              const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(itunesQuery)}&media=music&limit=1`);



              const data = await res.json();



              if (data.results && data.results.length > 0) {



                  const item = data.results[0];



                  setAlbumArt(item.artworkUrl100.replace('100x100', '600x600'));



                  setAudioSrc(item.previewUrl);



              }



          }



      };



  



      fetchSongDetails();



    }, [user, playback?.title, playback?.artist]); // Re-fetch when user or song changes



    // Audio Playback Control



    useEffect(() => {



      const audio = audioRef.current;



      if (!audio || !audioSrc) return; // No audio source means nothing to play



  



      if (activeDevice === 'web' && playback?.isPlaying) {



          audio.play().catch(e => console.warn("Web Autoplay blocked (user interaction needed).", e));



          



          // Sync Time if drifted > 2s



          if (Math.abs(audio.currentTime - (playback.position / 1000)) > 2) {



              audio.currentTime = playback.position / 1000;



          }



      } else {



          audio.pause();



      }



    }, [playback, audioSrc, activeDevice]);



  useEffect(() => {

    if (!user) return;



    const unsubDoc = onSnapshot(

      doc(db, 'users', user.uid, 'sync', 'playback'),

      (docSnap) => {

        if (docSnap.exists()) {

          const data = docSnap.data() as PlaybackState;

          setPlayback(data);

          

          if (data.isPlaying) {

             if (pauseTimeout.current) clearTimeout(pauseTimeout.current);

             setShowPaused(false);

          } else {

             pauseTimeout.current = setTimeout(() => setShowPaused(true), 1500);

          }

        }

      }

    );



    return () => unsubDoc();

  }, [user]);



  // ... (rest of local progress logic remains the same)

  useEffect(() => {

    if (progressInterval.current) clearInterval(progressInterval.current);



    if (playback && playback.isPlaying) {

      const now = Date.now();

      const serverTime = playback.updatedAt?.toMillis() || now;

      const diff = now - serverTime;

      let currentPos = playback.position + diff;



      setLocalProgress(Math.min(currentPos, playback.duration));



      progressInterval.current = setInterval(() => {

        setLocalProgress((prev) => {

          if (prev >= playback.duration) return playback.duration;

          return prev + 1000;

        });

      }, 1000);

    } else if (playback) {

      setLocalProgress(playback.position);

    }



    return () => clearInterval(progressInterval.current);

  }, [playback]);



  // ... (sendCommand remains the same)

  const sendCommand = async (command: string) => {

    if (!user) return;

    

    if (playback) {

        if (command === 'play') {

            setPlayback({ ...playback, isPlaying: true });

            setShowPaused(false);

        } else if (command === 'pause') {

            setPlayback({ ...playback, isPlaying: false });

            setShowPaused(true);

        }

    }



    try {

      await setDoc(doc(db, 'users', user.uid, 'sync', 'commands'), {

        command: command,

        timestamp: Timestamp.now()

      });

    } catch (e) {

      console.error("Failed to send command:", e);

    }

  };



  const formatTime = (ms: number) => {

    if (!ms) return "0:00";

    const seconds = Math.floor((ms / 1000) % 60);

    const minutes = Math.floor((ms / 1000 / 60));

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;

  };



  const progressPercent = playback && playback.duration > 0 

    ? (localProgress / playback.duration) * 100 

    : 0;



  return (

    <div className="min-h-screen bg-dark-bg pt-24 pb-12 px-6 relative overflow-hidden">

        {/* Hidden Audio Element */}

        <audio ref={audioRef} src={audioSrc || ''} />



        {/* Background Elements */}

        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-zen-500/5 rounded-full blur-[120px] pointer-events-none" />



        {/* Ambient Background */}

        {albumArt && (

            <div 

                className="absolute inset-0 bg-cover bg-center opacity-10 blur-3xl pointer-events-none transition-all duration-1000"

                style={{ backgroundImage: `url(${albumArt})` }}

            />

        )}



        <div className="max-w-7xl mx-auto relative z-10">

            <motion.div 

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                className="text-center mb-16"

            >

                <div className="inline-flex items-center justify-center p-3 bg-zen-500/10 rounded-xl mb-6">

                    <RefreshCw className="w-8 h-8 text-zen-400" />

                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">

                    Sync <span className="text-gradient">Live Music</span>

                </h1>

                <p className="text-xl text-gray-400 max-w-2xl mx-auto">

                    {user 

                        ? `Connected as ${user.email}` 

                        : "Seamlessly synchronize your music library, playlists, and playback state across all your devices in real-time."}

                </p>

            </motion.div>



            <AnimatePresence mode='wait'>

            {!user ? (

                // --- LOGGED OUT VIEW ---

                <motion.div

                    key="logged-out"

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    exit={{ opacity: 0 }}

                >

                    <div className="grid md:grid-cols-3 gap-8 mb-20">

                        {[

                            {

                                icon: <Cloud className="w-8 h-8" />,

                                title: "Cloud Library",

                                desc: "Your entire library, available everywhere. Upload once, stream anywhere."

                            },

                            {

                                icon: <Wifi className="w-8 h-8" />,

                                title: "Instant Handoff",

                                desc: "Move from phone to desktop without missing a beat. Playback continues exactly where you left off."

                            },

                            {

                                icon: <Smartphone className="w-8 h-8" />,

                                title: "Offline Sync",

                                desc: "Download playlists on one device, and have them ready to go on others automatically."

                            }

                        ].map((item, i) => (

                            <motion.div

                                key={i}

                                initial={{ opacity: 0, y: 20 }}

                                animate={{ opacity: 1, y: 0 }}

                                transition={{ delay: i * 0.1 + 0.2 }}

                                className="glass p-8 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors"

                            >

                                <div className="w-14 h-14 bg-gradient-to-br from-zen-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-white mb-6">

                                    {item.icon}

                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>

                                <p className="text-gray-400">{item.desc}</p>

                            </motion.div>

                        ))}

                    </div>



                    <div className="flex justify-center gap-4">

                        <button 

                            onClick={() => navigate('/login')}

                            className="px-8 py-3 bg-white text-dark-bg rounded-full font-bold transition-all hover:bg-gray-200 shadow-lg shadow-white/10"

                        >

                            Login to Sync

                        </button>

                        <button 

                            onClick={() => {

                                navigate('/');

                                setTimeout(() => {

                                    const element = document.getElementById('download');

                                    if (element) element.scrollIntoView({ behavior: 'smooth' });

                                }, 100);

                            }}

                            className="px-8 py-3 bg-zen-500 hover:bg-zen-600 text-white rounded-full font-bold transition-all shadow-lg shadow-zen-500/20"

                        >

                            Get the App

                        </button>

                    </div>

                </motion.div>

            ) : (

                // --- LOGGED IN / LIVE PLAYER VIEW ---

                <motion.div

                    key="logged-in"

                    initial={{ opacity: 0, scale: 0.95 }}

                    animate={{ opacity: 1, scale: 1 }}

                    exit={{ opacity: 0 }}

                    className="max-w-4xl mx-auto"

                >

                    <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden shadow-2xl shadow-zen-900/50">

                        

                        <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">

                            {/* Album Art Placeholder / Visualizer */}

                            <div className="relative w-64 h-64 flex-shrink-0">

                                <div className={`absolute inset-0 bg-gradient-to-br from-zen-500 to-purple-600 rounded-2xl blur-2xl opacity-40 ${playback?.isPlaying ? 'animate-pulse' : ''}`} />

                                <div className="relative w-full h-full bg-dark-card rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">

                                    {/* Real Album Art or Visualizer Fallback */}

                                    {albumArt ? (

                                        <motion.img 

                                            key={albumArt}

                                            initial={{ opacity: 0 }}

                                            animate={{ opacity: 1 }}

                                            src={albumArt} 

                                            alt="Album Art" 

                                            className="w-full h-full object-cover"

                                        />

                                    ) : (

                                        <>

                                            {playback?.isPlaying && (

                                                <div className="absolute inset-0 flex items-end justify-center gap-1 p-4 opacity-30">

                                                    {[...Array(12)].map((_, i) => (

                                                        <motion.div

                                                            key={i}

                                                            className="w-3 bg-white rounded-t-full"

                                                            animate={{ height: [20, Math.random() * 100 + 20, 20] }}

                                                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}

                                                        />

                                                    ))}

                                                </div>

                                            )}

                                            <Music className="w-24 h-24 text-white/20" />

                                        </>

                                    )}

                                </div>

                            </div>



                            {/* Controls & Info */}

                            <div className="flex-1 w-full">

                                <div className="flex justify-between items-start mb-2">

                                    <div className="flex gap-2">

                                                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zen-500/10 border border-zen-500/20 text-zen-400 text-xs font-bold tracking-wider uppercase">

                                                                                    <span className={`w-2 h-2 rounded-full ${playback?.isPlaying ? 'bg-zen-500 animate-pulse' : 'bg-gray-500'}`} />

                                                                                    {activeDevice === 'web' ? 'Playing on Web' : 'Playing on Mobile'}

                                                                                </div>

                                    </div>

                                    <button 

                                        onClick={() => signOut(auth)}

                                        className="text-gray-400 hover:text-white transition-colors"

                                        title="Sign Out"

                                    >

                                        <LogOut className="w-5 h-5" />

                                    </button>

                                </div>



                                <h2 className="text-3xl font-bold text-white mb-2 truncate leading-tight">

                                    {playback?.title || "No music playing"}

                                </h2>

                                <p className="text-xl text-gray-400 mb-8 truncate">

                                    {playback?.artist || "Start playing on your device"}

                                </p>



                                {/* Progress Bar */}

                                <div className="space-y-2 mb-8">

                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">

                                        <motion.div 

                                            className="h-full bg-gradient-to-r from-zen-500 to-purple-500"

                                            style={{ width: `${Math.min(progressPercent, 100)}%` }}

                                            transition={{ ease: "linear", duration: 0.1 }} // Smooth updates

                                        />

                                    </div>

                                    <div className="flex justify-between text-sm text-gray-500 font-medium font-mono">

                                        <span>{formatTime(localProgress)}</span>

                                        <span>{formatTime(playback?.duration || 0)}</span>

                                    </div>

                                </div>



                                {/* Controls (Remote) */}

                                <div className="flex justify-center items-center gap-8">

                                    <button 

                                        onClick={() => sendCommand('previous')}

                                        className="text-gray-400 hover:text-white transition-colors hover:scale-110 active:scale-95"

                                    >

                                        <SkipBack className="w-8 h-8" />

                                    </button>

                                    

                                    <button

                                        onClick={() => sendCommand(playback?.isPlaying ? 'pause' : 'play')}

                                        className="w-16 h-16 rounded-full bg-white text-dark-bg flex items-center justify-center shadow-lg shadow-white/10 hover:scale-105 active:scale-95 transition-transform"

                                    >

                                        {playback?.isPlaying ? (

                                            <Pause className="w-8 h-8 fill-current" />

                                        ) : (

                                            <Play className="w-8 h-8 fill-current ml-1" />

                                        )}

                                    </button>

                                    

                                    <button 

                                        onClick={() => sendCommand('next')}

                                        className="text-gray-400 hover:text-white transition-colors hover:scale-110 active:scale-95"

                                    >

                                        <SkipForward className="w-8 h-8" />

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </motion.div>

            )}

            </AnimatePresence>

        </div>

    </div>

  );

};