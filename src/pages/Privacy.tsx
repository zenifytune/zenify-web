import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Server, AlertCircle } from 'lucide-react';

export const Privacy = () => {
    return (
        <div className="min-h-screen pt-24 px-6 pb-12 bg-dark-bg relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-zen-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-zen-500/10 rounded-full mb-6 ring-1 ring-zen-500/30">
                        <Shield className="w-8 h-8 text-zen-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy & Security</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Your privacy is our priority. We are committed to protecting your personal data and ensuring a secure experience.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    <Section
                        icon={Eye}
                        title="Information We Collect"
                        content={
                            <ul className="list-disc pl-5 space-y-2 text-gray-300">
                                <li><strong>Personal Data:</strong> Name, email address, and profile picture from Google Sign-In.</li>
                                <li><strong>Usage Data:</strong> Listening history, playlists, liked songs, and downloaded content to personalize your experience.</li>
                                <li><strong>Device Info:</strong> Model, OS version, and unique identifiers for analytics and troubleshooting.</li>
                                <li><strong>Local Files:</strong> We scan your device locally to build your library. We do NOT upload your local music files to our servers.</li>
                            </ul>
                        }
                    />

                    <Section
                        icon={FileText}
                        title="How We Use Your Data"
                        content={
                            <p className="text-gray-300">
                                We use your data to create and manage your account, sync your playlists across devices, personalize recommendations based on your listening habits, and notify you of important updates. We prevent fraudulent activity to keep the platform safe.
                            </p>
                        }
                    />

                    <Section
                        icon={Lock}
                        title="Data Security"
                        content={
                            <p className="text-gray-300">
                                We employ administrative, technical, and physical security measures to protect your personal information. While we strive to use commercially acceptable means to protect your data, no method of transmission over the internet is 100% secure.
                            </p>
                        }
                    />

                    <Section
                        icon={Server}
                        title="Third-Party Services"
                        content={
                            <p className="text-gray-300">
                                The app may contain links to third-party websites or services (e.g., YouTube, Spotify APIs) that are not affiliated with us. Once you use these links, any information you provide to third parties is not covered by this policy.
                            </p>
                        }
                    />

                    <Section
                        icon={AlertCircle}
                        title="Your Rights"
                        content={
                            <p className="text-gray-300">
                                You can review or change your account information at any time in the app settings. You may also request account deletion by contacting support. Upon deletion, we will remove your active data, though some information may be retained for legal compliance.
                            </p>
                        }
                    />
                </div>

                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>Last updated: November 15, 2025</p>
                    <p>Contact: privacy@zenify.app</p>
                </div>
            </div>
        </div>
    );
};

const Section = ({ icon: Icon, title, content }: { icon: any, title: string, content: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-white/5"
    >
        <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/5">
                <Icon className="w-6 h-6 text-zen-400" />
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <div className="text-gray-300 leading-relaxed">
                    {content}
                </div>
            </div>
        </div>
    </motion.div>
);
