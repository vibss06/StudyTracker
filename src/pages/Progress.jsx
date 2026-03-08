import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';

export default function Progress() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [barData, setBarData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [heatmapData, setHeatmapData] = useState({});

    useEffect(() => {
        if (!user) return;
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const { data: allSessions } = await supabase
                    .from('sessions')
                    .select('date, duration_mins, subject_id, subjects(name, color)')
                    .eq('user_id', user.id);

                if (!allSessions) return;

                const ONE_WEEK_AGO = new Date();
                ONE_WEEK_AGO.setDate(ONE_WEEK_AGO.getDate() - 7);
                const recentSessions = allSessions.filter(s => new Date(s.date) >= ONE_WEEK_AGO);
                const subjectHours = {};
                const subjectColors = {};
                recentSessions.forEach(s => {
                    const name = s.subjects?.name || 'Unknown';
                    subjectHours[name] = (subjectHours[name] || 0) + (s.duration_mins || 0);
                    subjectColors[name] = s.subjects?.color || '#ccc';
                });
                setBarData(Object.entries(subjectHours).map(([name, mins]) => ({ name, hours: +(mins / 60).toFixed(1), fill: subjectColors[name] })));

                const dailyMap = {};
                for (let i = 0; i < 14; i++) { const d = new Date(); d.setDate(d.getDate() - i); dailyMap[d.toISOString().split('T')[0]] = 0; }
                allSessions.forEach(s => { if (dailyMap[s.date] !== undefined) dailyMap[s.date] += (s.duration_mins || 0); });
                setLineData(Object.entries(dailyMap).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([date, mins]) => ({ date: date.substring(5), hours: +(mins / 60).toFixed(1) })));

                const heatMap = {};
                for (let i = 0; i < 30; i++) { const d = new Date(); d.setDate(d.getDate() - i); heatMap[d.toISOString().split('T')[0]] = 0; }
                allSessions.forEach(s => { if (heatMap[s.date] !== undefined) heatMap[s.date] += (s.duration_mins || 0); });
                setHeatmapData(heatMap);
            } catch (err) {
                console.error('Error:', err);
            } finally { setLoading(false); }
        };
        fetchAnalytics();
    }, [user]);

    if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" /></div>;

    const sortedHeatmapDates = Object.keys(heatmapData).sort((a, b) => new Date(a) - new Date(b));
    const tooltipStyle = { backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Progress</h1>
                <p className="text-white/40 mt-1">Visualize your study habits and analytics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20"><BarChart3 className="w-5 h-5" /></div>
                        <h2 className="text-xl font-bold text-white">Study Hours by Subject</h2>
                        <span className="ml-auto text-sm text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">Past 7 days</span>
                    </div>
                    <div className="h-[300px] w-full mt-4">
                        {barData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={tooltipStyle} />
                                    <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-white/30">Not enough data. Start studying!</div>
                        )}
                    </div>
                </div>

                {/* Line Chart */}
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20"><TrendingUp className="w-5 h-5" /></div>
                        <h2 className="text-xl font-bold text-white">Daily Study Trend</h2>
                        <span className="ml-auto text-sm text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">Past 14 days</span>
                    </div>
                    <div className="h-[300px] w-full mt-4">
                        {lineData.some(d => d.hours > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                                    <RechartsTooltip contentStyle={tooltipStyle} />
                                    <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#0a0a0a' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-white/30">Not enough data. Start studying!</div>
                        )}
                    </div>
                </div>

                {/* Heatmap */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20"><Activity className="w-5 h-5" /></div>
                        <h2 className="text-xl font-bold text-white">Activity Grid</h2>
                        <span className="ml-auto text-sm text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">Past 30 days</span>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3 p-4 bg-white/3 rounded-2xl justify-center items-center">
                        {sortedHeatmapDates.map((dateStr) => {
                            const mins = heatmapData[dateStr];
                            let colorClass = 'bg-white/5';
                            if (mins > 0 && mins <= 30) colorClass = 'bg-emerald-900/60';
                            else if (mins > 30 && mins <= 90) colorClass = 'bg-emerald-600/60';
                            else if (mins > 90) colorClass = 'bg-emerald-400/80';
                            return (
                                <div key={dateStr} title={`${dateStr}: ${Math.round(mins / 60)}h ${mins % 60}m`}
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${colorClass} hover:ring-2 ring-emerald-400/50 transition-all cursor-crosshair border border-white/5`} />
                            );
                        })}
                    </div>
                    <div className="flex justify-center items-center gap-2 mt-4 text-xs font-semibold text-white/40">
                        <span>Less</span>
                        <div className="w-4 h-4 rounded bg-white/5 border border-white/5" />
                        <div className="w-4 h-4 rounded bg-emerald-900/60" />
                        <div className="w-4 h-4 rounded bg-emerald-600/60" />
                        <div className="w-4 h-4 rounded bg-emerald-400/80" />
                        <span>More</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
