import { motion } from 'framer-motion';
import { FileCheck, Users, Ban, Gavel, HelpCircle } from 'lucide-react';

export const Terms = () => {
    return (
        <div className="min-h-screen pt-24 px-6 pb-12 bg-dark-bg relative overflow-hidden">
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-full mb-6 ring-1 ring-purple-500/30">
                        <FileCheck className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Please read these terms carefully before using our service. By using Zenify, you agree to be bound by these terms.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    <Section
                        icon={Users}
                        title="1. Account Terms"
                        content={
                            <p>
                                To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
                            </p>
                        }
                    />

                    <Section
                        icon={Ban}
                        title="2. Prohibited Conduct"
                        content={
                            <ul className="list-disc pl-5 space-y-2">
                                <li>You may not use the Service for any illegal purpose or in violation of any local, state, national, or international law.</li>
                                <li>You may not infringe upon the intellectual property rights of others.</li>
                                <li>You may not attempt to decipher, decompile, disassemble, or reverse engineer any of the software used to provide the Service.</li>
                                <li>You may not interfere with or damage the operation of the Service or any user's enjoyment of it, by any means, including uploading or otherwise disseminating viruses, adware, spyware, worms, or other malicious code.</li>
                            </ul>
                        }
                    />

                    <Section
                        icon={Gavel}
                        title="3. Intellectual Property"
                        content={
                            <p>
                                The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Zenify and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                            </p>
                        }
                    />

                    <Section
                        icon={HelpCircle}
                        title="4. Termination"
                        content={
                            <p>
                                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                            </p>
                        }
                    />
                </div>

                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>Last updated: November 15, 2025</p>
                    <p>Contact: legal@zenify.app</p>
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
                <Icon className="w-6 h-6 text-purple-400" />
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
