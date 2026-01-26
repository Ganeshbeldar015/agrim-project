import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Shield, Eye, Globe, Save, HelpCircle, HardDrive, ArrowLeft } from 'lucide-react';

const AdminSettings = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(true);
    const [maintenance, setMaintenance] = useState(false);

    const settingSections = [
        {
            title: 'Platform Overview',
            icon: Globe,
            items: [
                { label: 'Marketplace Name', value: 'Agrim Farm-to-Table' },
                { label: 'System Version', value: '1.0.4 - Release Candidate' },
                { label: 'Primary Region', value: 'Maharashtra, India' }
            ]
        },
        {
            title: 'Security & Access',
            icon: Shield,
            items: [
                { label: 'Multi-Factor Auth', value: 'Enabled' },
                { label: 'Session Timeout', value: '24 Hours' },
                { label: 'IP Whitelisting', value: 'Inactive' }
            ]
        }
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-2 text-sm font-medium group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
                <p className="text-sm text-gray-500">Configure global platform parameters and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Toggleable Settings */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary-600" /> Notifications & Alerts
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">System Wide Broadcast</p>
                                    <p className="text-xs text-gray-500">Notify all users about platform updates.</p>
                                </div>
                                <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Seller Verification Alerts</p>
                                    <p className="text-xs text-gray-500">Instant ping for new shop applications.</p>
                                </div>
                                <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <HardDrive className="w-5 h-5 text-primary-600" /> Database Management
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="flex flex-col items-start p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <span className="font-bold text-gray-800 text-sm uppercase">Export Inventory</span>
                                <span className="text-[10px] text-gray-400">Generate JSON backup</span>
                            </button>
                            <button className="flex flex-col items-start p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <span className="font-bold text-gray-800 text-sm uppercase">Purge Logs</span>
                                <span className="text-[10px] text-gray-400">Clear temporary system history</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Information Panels */}
                <div className="space-y-6">
                    {settingSections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                <section.icon className="w-4 h-4 text-emerald-600" /> {section.title}
                            </h4>
                            <div className="space-y-3">
                                {section.items.map((item, i) => (
                                    <div key={i} className="flex flex-col border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                        <span className="text-[10px] uppercase font-bold text-gray-400">{item.label}</span>
                                        <span className="text-sm text-gray-700 font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="bg-emerald-900 rounded-xl p-6 text-white shadow-lg shadow-emerald-100">
                        <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                            <HelpCircle className="w-4 h-4" /> Support Status
                        </div>
                        <p className="text-xs text-emerald-100 mb-4 opacity-80 leading-relaxed">Your cloud server is running optimally. 0 reported issues in last 24h.</p>
                        <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-xs font-bold transition-all">
                            View Server Logs
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
                <button className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">Discard Changes</button>
                <button className="px-8 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 flex items-center gap-2 shadow-lg shadow-primary-50">
                    <Save className="w-4 h-4" /> Save Configuration
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;
