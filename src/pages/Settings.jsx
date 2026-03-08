import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { User, Palette, Moon, Save, Loader2, Sun } from 'lucide-react';

export default function Settings() {
    const { profile, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(profile?.name || '');
    const [dailyGoal, setDailyGoal] = useState(profile?.daily_goal_hrs || 2);
    const [theme, setTheme] = useState(profile?.theme || 'dark');

    const saveSettings = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await supabase.from('profiles').update({ name, daily_goal_hrs: parseFloat(dailyGoal), theme }).eq('id', user.id);
            window.location.reload();
        } catch (err) {
            alert("Failed to save settings");
        } finally { setLoading(false); }
    };

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-white/40 mt-1">Manage your account and preferences</p>
            </div>

            <form onSubmit={saveSettings} className="space-y-6">
                {/* Profile Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-emerald-400" />
                        Profile Details
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Display Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
                            <input type="email" value={user?.email || ''} disabled
                                className="w-full px-4 py-3 bg-white/3 text-white/30 border border-white/5 rounded-xl cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                {/* Preferences Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-emerald-400" />
                        App Preferences
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Daily Study Goal (Hours)</label>
                            <div className="flex items-center gap-4 max-w-sm">
                                <input type="range" min="0.5" max="12" step="0.5" value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} className="flex-1 accent-emerald-500" />
                                <span className="font-bold text-xl text-emerald-400 w-16 bg-emerald-500/10 py-1 rounded-lg text-center border border-emerald-500/20">{dailyGoal}h</span>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-3">Color Theme</label>
                            <div className="flex gap-4">
                                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'light' ? 'border-emerald-500/50 bg-white/10' : 'border-white/10 bg-white/3 hover:border-white/20'}`}>
                                    <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} className="hidden" />
                                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                        <Sun className="w-4 h-4 text-yellow-400" />
                                    </div>
                                    <span className="font-bold text-white">Light</span>
                                </label>

                                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'dark' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/3 hover:border-white/20'}`}>
                                    <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="hidden" />
                                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                                        <Moon className="w-4 h-4 text-blue-300" />
                                    </div>
                                    <span className="font-bold text-white">Dark</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={loading}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 cursor-pointer">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
