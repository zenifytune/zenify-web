import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, Music, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Insights = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            const user = auth.currentUser;
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const docRef = doc(db, 'users', user.uid, 'stats', 'summary');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setStats(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [navigate]);

    if (loading) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Loading insights...</div>;

    const data = [
        { name: 'Mon', hours: 2.1 },
        { name: 'Tue', hours: 4.5 },
        { name: 'Wed', hours: 3.2 },
        { name: 'Thu', hours: 5.8 },
        { name: 'Fri', hours: 6.2 },
        { name: 'Sat', hours: 8.5 },
        { name: 'Sun', hours: 7.0 },
    ]; // Mock weekly data for now, as real daily history isn't fully synced yet

    return (
        <div className="min-h-screen bg-dark-bg pt-24 px-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                        Listening Insights
                    </h1>
                    <p className="text-gray-400">Discover your musical habits and trends.</p>
                </motion.div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatsCard
                        icon={Clock}
                        label="Total Listening Time"
                        value={`${Math.floor((stats?.totalTime || 0) / 3600)}h ${Math.floor(((stats?.totalTime || 0) % 3600) / 60)}m`}
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                    />
                    <StatsCard
                        icon={Music}
                        label="Most Played Song"
                        value={stats?.mostPlayed || 'N/A'}
                        color="text-purple-400"
                        bg="bg-purple-500/10"
                    />
                    <StatsCard
                        icon={Calendar}
                        label="Monthly Activity"
                        value={`${Math.floor((stats?.monthlyTime || 0) / 3600)}h`}
                        subValue="This Month"
                        color="text-pink-400"
                        bg="bg-pink-500/10"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
                    >
                        <h3 className="text-xl font-semibold mb-6">Weekly Activity</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 5 ? '#ec4899' : '#8b5cf6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 flex flex-col justify-center items-center text-center"
                    >
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-xl shadow-purple-500/20">
                            <span className="text-3xl font-bold">Top 1%</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Super Fan</h3>
                        <p className="text-gray-400">You're in the top 1% of listeners this month!</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ icon: Icon, label, value, subValue, color, bg }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 ${bg} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`} />

        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-white max-w-full truncate" title={value}>{value}</h3>
            {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        </div>
    </motion.div>
);
